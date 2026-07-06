/**
 * Lightweight chat client for open LLMs hosted on Hugging Face.
 *
 * Hugging Face exposes an OpenAI-compatible "router" endpoint, so the same
 * request/response shape works for many open models (Llama, Qwen, Mistral, ...).
 * The user supplies their own HF access token at runtime; nothing is hardcoded.
 *
 * Docs: https://huggingface.co/docs/inference-providers
 */

export const HF_CHAT_ENDPOINT = 'https://router.huggingface.co/v1/chat/completions'

// A small, instruction-tuned open model that works well for tool intents.
export const DEFAULT_HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct'

/**
 * Curated list of open, instruction-tuned models available through the Hugging
 * Face router. Shown in the assistant's model picker. The user can also point
 * VUE_APP_HF_MODEL at any other model id; it will be added to the list at runtime.
 */
export const HF_MODELS = [
  { id: 'meta-llama/Llama-3.1-8B-Instruct', label: 'Llama 3.1 8B Instruct (fast)' },
  { id: 'meta-llama/Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B Instruct (strong)' },
  { id: 'Qwen/Qwen2.5-7B-Instruct', label: 'Qwen2.5 7B Instruct' },
  { id: 'Qwen/Qwen2.5-72B-Instruct', label: 'Qwen2.5 72B Instruct' },
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', label: 'Mistral 7B Instruct v0.3' },
  { id: 'google/gemma-2-9b-it', label: 'Gemma 2 9B Instruct' }
]

/**
 * System prompt that turns the model into the Cartographer assistant.
 * The model must always answer with a single JSON object so the app can both
 * show a chat reply and (optionally) execute a supported action.
 */
export function buildSystemPrompt() {
  return [
    'You are the assistant for "Cartographer", a web tool for annotating music',
    'score facsimiles with MEI. Zones are the rectangular bounding boxes that',
    'mark measures on the current page.',
    '',
    'IMPORTANT: a "measure" and a "zone" are the SAME thing here. Treat the words',
    '"zone", "measure", "bar", and "box" as interchangeable. Deleting a measure',
    'means deleting its zone. So "delete measure 3", "remove zone X", and',
    '"delete the third bar" all map to the same deleteZone action.',
    '',
    'You can chat with the user and perform exactly ONE supported action:',
    'deleting a zone/measure on the current page.',
    '',
    'Always respond with a SINGLE JSON object and nothing else, in this shape:',
    '{"reply": "<short message for the user>", "action": null | {"type": "deleteZone", "zoneId": "<id>"}}',
    '',
    'Rules:',
    '- Set "action" only when the user clearly asks to delete or remove a',
    '  zone/measure; otherwise use null and just answer in "reply".',
    '- "zoneId" MUST be one of the ids listed in the CONTEXT message, or the',
    '  literal string "selected" when the user refers to the currently selected',
    '  zone/measure. Match measure numbers/labels from CONTEXT to their zone id.',
    '- If the user wants to delete but it is unclear which zone/measure, set',
    '  "action" to null and ask which one in "reply".',
    '- Never invent zone ids that are not in the CONTEXT.',
    '- Keep "reply" short and friendly.'
  ].join('\n')
}

/**
 * Builds the CONTEXT message describing the zones currently on the page so the
 * model can resolve references like "the third measure" or "the selected zone".
 *
 * @param {Array<{id: string, n: ?string, label: ?string}>} zones
 * @param {?string} selectedZoneId
 * @returns {string}
 */
export function buildContextMessage(zones, selectedZoneId) {
  if (!zones || zones.length === 0) {
    return 'CONTEXT: There are no zones on the current page.'
  }
  const lines = zones.map((z, i) => {
    const parts = [`#${i + 1}`, `id=${z.id}`]
    if (z.n) parts.push(`measure=${z.n}`)
    if (z.label) parts.push(`label="${z.label}"`)
    if (z.id === selectedZoneId) parts.push('(selected)')
    return '- ' + parts.join(' ')
  })
  return 'CONTEXT: Zones on the current page (in order):\n' + lines.join('\n')
}

/**
 * Leniently extract the JSON object from a model reply. Some models wrap JSON in
 * prose or code fences; we try a strict parse first, then fall back to the first
 * balanced-looking {...} block.
 *
 * @param {string} content
 * @returns {{reply: string, action: ?object}}
 */
export function parseAssistantResponse(content) {
  const fallback = { reply: (content || '').trim(), action: null }
  if (!content) return fallback

  const tryParse = (text) => {
    try {
      const obj = JSON.parse(text)
      if (obj && typeof obj === 'object') {
        return {
          reply: typeof obj.reply === 'string' ? obj.reply : '',
          action: obj.action && typeof obj.action === 'object' ? obj.action : null
        }
      }
    } catch (e) {
      /* ignore and try next strategy */
    }
    return null
  }

  const direct = tryParse(content.trim())
  if (direct) return direct

  const match = content.match(/\{[\s\S]*\}/)
  if (match) {
    const parsed = tryParse(match[0])
    if (parsed) return parsed
  }

  return fallback
}

/**
 * Call the Hugging Face OpenAI-compatible chat completions endpoint.
 *
 * @param {object} opts
 * @param {string} opts.apiKey  Hugging Face access token (hf_...).
 * @param {string} [opts.model] Model id on the HF router.
 * @param {Array<{role: string, content: string}>} opts.messages
 * @param {string} [opts.endpoint]
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<string>} The assistant message content.
 */
export async function chatCompletion({ apiKey, model = DEFAULT_HF_MODEL, messages, endpoint = HF_CHAT_ENDPOINT, signal }) {
  if (!apiKey) {
    throw new Error('Missing Hugging Face API key.')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 512
    }),
    signal
  })

  if (!response.ok) {
    let detail = ''
    try {
      detail = await response.text()
    } catch (e) {
      /* ignore */
    }
    throw new Error(`Hugging Face request failed (${response.status}): ${detail || response.statusText}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error('Unexpected response from Hugging Face (no message content).')
  }
  return content
}
