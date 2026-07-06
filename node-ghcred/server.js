'use strict'

// Load .env.local from the project root (one level up) for local development
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') })

const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())

// In production the Vue nginx container proxies /authenticate directly, so
// CORS is only needed for local development (vue-cli devServer proxy handles
// it in dev, but allow it here too for flexibility).
// Set ALLOWED_ORIGIN in production to restrict to your deployment's origin.
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:8081',
  methods: ['POST'],
}))

const CLIENT_ID = process.env.VUE_APP_CLIENT_ID
const CLIENT_SECRET = process.env.VUE_APP_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('[node-ghcred] VUE_APP_CLIENT_ID and VUE_APP_CLIENT_SECRET must be set')
  process.exit(1)
}

/**
 * POST /authenticate
 * Body: { code: string }
 *
 * Exchanges a GitHub OAuth authorization code for an access token.
 * The client secret never leaves this server.
 */
app.post('/authenticate', async (req, res) => {
  const { code } = req.body

  if (!code || typeof code !== 'string' || code.trim() === '') {
    return res.status(400).json({ error: 'code is required' })
  }

  try {
    const ghRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code.trim(),
      }),
    })

    if (!ghRes.ok) {
      return res.status(502).json({ error: 'GitHub token endpoint returned an error' })
    }

    const data = await ghRes.json()

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error })
    }

    // Only forward what the client needs — never echo client_secret
    res.json({
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
    })
  } catch (err) {
    console.error('[node-ghcred] Token exchange error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 9999
app.listen(PORT, () => {
  console.log(`[node-ghcred] Listening on port ${PORT}`)
})
