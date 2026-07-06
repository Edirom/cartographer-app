<template>
  <div class="chat-assistant">
    <!-- Floating toggle button -->
    <button
      class="btn btn-primary btn-action chat-fab"
      :class="{ active: showChatAssistant }"
      :title="showChatAssistant ? 'Hide assistant' : 'Chat assistant'"
      @click="togglePanel"
    >
      <span aria-hidden="true">{{ showChatAssistant ? '×' : '🗨' }}</span>
    </button>

    <!-- Chat panel -->
    <div v-if="showChatAssistant" class="chat-panel">
      <div class="chat-header">
        <span class="chat-title">Assistant</span>
        <div class="chat-header-actions">
          <button class="btn btn-sm btn-link" title="Settings" @click="showSettings = !showSettings">⚙</button>
          <button class="btn btn-sm btn-link" title="Clear conversation" @click="clearChat">Clear</button>
        </div>
      </div>

      <!-- Model picker (always visible) -->
      <div class="chat-modelbar">
        <label class="chat-modelbar-label" for="hf-model">Model</label>
        <select
          id="hf-model"
          class="form-select select-sm"
          :value="selectedModel"
          @change="onModelChange"
        >
          <option v-for="m in models" :key="m.id" :value="m.id">{{ m.label }}</option>
        </select>
      </div>

      <!-- Settings (token) -->
      <div v-if="showSettings || !hfApiKey" class="chat-settings">
        <label class="form-label" for="hf-key">Hugging Face access token</label>
        <input
          id="hf-key"
          class="form-input input-sm"
          type="password"
          placeholder="hf_..."
          :value="hfApiKey"
          @input="onApiKeyInput"
        >
        <p class="chat-hint">
          The token is kept in memory for this session only. Try: "delete the selected zone".
        </p>
      </div>

      <!-- Messages -->
      <div ref="messageList" class="chat-messages">
        <div v-if="chatMessages.length === 0" class="chat-empty">
          Ask me to delete a zone, e.g. "delete measure 3" or "remove the selected zone".
        </div>
        <div
          v-for="(msg, i) in chatMessages"
          :key="i"
          class="chat-bubble"
          :class="msg.role"
        >
          {{ msg.content }}
        </div>
        <div v-if="chatPending" class="chat-bubble assistant pending">…</div>
        <div v-if="chatError" class="chat-bubble error">{{ chatError }}</div>
      </div>

      <!-- Input -->
      <form class="chat-input" @submit.prevent="submit">
        <input
          v-model="draft"
          class="form-input input-sm"
          type="text"
          placeholder="Type a message…"
          :disabled="chatPending"
        >
        <button class="btn btn-primary btn-sm" type="submit" :disabled="chatPending || !draft.trim()">
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DEFAULT_HF_MODEL, HF_MODELS } from '@/tools/llmChat.js'

export default {
  name: 'ChatAssistant',
  data () {
    return {
      draft: '',
      showSettings: false,
      defaultModel: DEFAULT_HF_MODEL
    }
  },
  computed: {
    ...mapGetters([
      'showChatAssistant',
      'chatMessages',
      'chatPending',
      'chatError',
      'hfApiKey',
      'hfModel'
    ]),
    selectedModel () {
      return this.hfModel || DEFAULT_HF_MODEL
    },
    models () {
      // Include any custom model (e.g. from .env) that isn't in the curated list.
      const list = [...HF_MODELS]
      if (this.hfModel && !list.some(m => m.id === this.hfModel)) {
        list.unshift({ id: this.hfModel, label: this.hfModel + ' (custom)' })
      }
      return list
    }
  },
  watch: {
    chatMessages () {
      this.$nextTick(this.scrollToBottom)
    },
    chatPending () {
      this.$nextTick(this.scrollToBottom)
    }
  },
  methods: {
    togglePanel () {
      this.$store.dispatch('toggleChatAssistant')
    },
    clearChat () {
      this.$store.dispatch('clearChat')
    },
    onApiKeyInput (e) {
      this.$store.dispatch('setChatConfig', { apiKey: e.target.value })
    },
    onModelChange (e) {
      this.$store.dispatch('setChatConfig', { model: e.target.value })
    },
    submit () {
      const text = this.draft.trim()
      if (!text || this.chatPending) return
      this.draft = ''
      this.$store.dispatch('sendChatMessage', text)
    },
    scrollToBottom () {
      const el = this.$refs.messageList
      if (el) el.scrollTop = el.scrollHeight
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.chat-fab {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 1000;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  font-size: 1.1rem;
  line-height: 1;
}

.chat-panel {
  position: fixed;
  right: 1.5rem;
  bottom: 4.6rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 22rem;
  max-width: calc(100vw - 3rem);
  height: 28rem;
  max-height: calc(100vh - 7rem);
  background: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 0.4rem;
  box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid #eee;
}

.chat-title {
  font-weight: 600;
}

.chat-header-actions .btn {
  margin-left: 0.2rem;
}

.chat-settings {
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.chat-modelbar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border-bottom: 1px solid #eee;
}

.chat-modelbar-label {
  font-size: 0.7rem;
  color: #666;
  flex: 0 0 auto;
}

.chat-modelbar .form-select {
  flex: 1;
}

.chat-hint {
  margin: 0.3rem 0 0;
  font-size: 0.6rem;
  color: #888;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.chat-empty {
  color: #aaa;
  font-size: 0.7rem;
  margin: auto 0;
}

.chat-bubble {
  max-width: 85%;
  padding: 0.35rem 0.55rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.3;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
}

.chat-bubble.user {
  align-self: flex-end;
  background: #5755d9;
  color: #fff;
}

.chat-bubble.assistant {
  align-self: flex-start;
  background: #f1f1f4;
  color: #2a2a2a;
}

.chat-bubble.pending {
  opacity: 0.6;
}

.chat-bubble.error {
  align-self: stretch;
  background: #fce4e4;
  color: #b00020;
}

.chat-input {
  display: flex;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  border-top: 1px solid #eee;
}

.chat-input .form-input {
  flex: 1;
}
</style>
