
// Dev-only OAuth token-exchange credentials. These are read here in the Node
// dev-server process and never inlined into the client bundle (CLIENT_SECRET is
// intentionally NOT prefixed with VUE_APP_, so Vue CLI does not expose it).
const GH_CLIENT_ID = process.env.VUE_APP_CLIENT_ID
const GH_CLIENT_SECRET = process.env.CLIENT_SECRET

module.exports = {
  publicPath: '/myAppPlaceholder',
  devServer: {
    // Pin the dev server port so it matches the registered GitHub OAuth
    // callback URL (VUE_APP_CALL_BACK) exactly.
    port: 8080,
    // The app is served under the publicPath subpath, so history-mode deep
    // links (e.g. the OAuth /callback route) must fall back to the app's
    // index.html at that subpath rather than the default '/index.html'.
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/myAppPlaceholder/index.html' },
      ],
    },
    // Dev stand-in for the nginx `location = /auth` token exchange: proxy
    // /auth to GitHub's token endpoint, injecting client_id + client_secret
    // server-side (GitHub requires the secret, and its token endpoint has no
    // CORS). The secret stays in this Node process.
    proxy: {
      '/auth': {
        target: 'https://github.com',
        changeOrigin: true,
        onProxyReq (proxyReq) {
          const query = (proxyReq.path.split('?')[1]) || ''
          const params = new URLSearchParams(query)
          params.set('client_id', GH_CLIENT_ID)
          params.set('client_secret', GH_CLIENT_SECRET)
          proxyReq.path = `/login/oauth/access_token?${params.toString()}`
          proxyReq.setHeader('accept', 'application/json')
        },
      },
    },
  },
}
