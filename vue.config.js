
// When building/serving inside Tauri, the app is served from the origin root,
// so assets must resolve from "/". Tauri sets TAURI_ENV_PLATFORM during the
// beforeBuildCommand / beforeDevCommand hooks. For the web deployment we keep
// the "/myAppPlaceholder" subpath.
module.exports = {
    publicPath: process.env.TAURI_ENV_PLATFORM ? "/" : "/myAppPlaceholder"
  }
