
module.exports = {
  publicPath: '/myAppPlaceholder',
  devServer: {
    proxy: {
      // Forward OAuth token exchange calls to the node-ghcred proxy server
      '/authenticate': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      },
    },
  },
}
