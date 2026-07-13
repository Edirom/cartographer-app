// When building/serving inside Tauri, the app is served from the origin root,
// so assets must resolve from "/". Tauri sets TAURI_ENV_PLATFORM during the
// beforeBuildCommand / beforeDevCommand hooks. For the web deployment we keep
// the "/myAppPlaceholder" subpath.

// Expose the package version to the app (used e.g. on the About page).
process.env.VUE_APP_VERSION = process.env.npm_package_version || require('./package.json').version

module.exports = {
    publicPath: process.env.TAURI_ENV_PLATFORM ? "/" : "/myAppPlaceholder",
    devServer: {
      host: "0.0.0.0",
      port: 8080,
      allowedHosts: "all"
    }
  }
