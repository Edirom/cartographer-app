import comp from "/app/docs/.vuepress/.temp/pages/en/index.html.vue"
const data = JSON.parse("{\"path\":\"/en/\",\"title\":\"Cartographer-app Dokumentation\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"title\":\"Cartographer-app Dokumentation\",\"heroText\":\"Cartographer-app\",\"tagline\":\"Dokumentation für die Cartographer App\",\"actions\":[{\"text\":\"Loslegen\",\"link\":\"/de/user/\",\"type\":\"primary\"},{\"text\":\"Technische Doku\",\"link\":\"/de/technical/README.html\",\"type\":\"secondary\"}],\"features\":[{\"title\":\"Benutzerhandbuch\",\"details\":\"So benutzt du die App.\"},{\"title\":\"Entwickler-Doku\",\"details\":\"Komponenten, Store, Tools.\"}]},\"git\":{},\"filePathRelative\":\"en/README.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
