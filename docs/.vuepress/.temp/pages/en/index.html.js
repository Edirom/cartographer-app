import comp from "/Users/hizkielalemayehu/Documents/GitHub/Edirom/cartographer-app/docs/.vuepress/.temp/pages/en/index.html.vue"
const data = JSON.parse("{\"path\":\"/en/\",\"title\":\"Cartographer-app Dokumentation\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"title\":\"Cartographer-app Dokumentation\",\"heroText\":\"Cartographer-app\",\"tagline\":\"Dokumentation für die Cartographer App\",\"actions\":[{\"text\":\"Loslegen\",\"link\":\"/de/user/\",\"type\":\"primary\"},{\"text\":\"Technische Doku\",\"link\":\"/de/technical/README.html\",\"type\":\"secondary\"}],\"features\":[{\"title\":\"Benutzerhandbuch\",\"details\":\"So benutzt du die App.\"},{\"title\":\"Entwickler-Doku\",\"details\":\"Komponenten, Store, Tools.\"}]},\"git\":{\"updatedTime\":1756397205000,\"contributors\":[{\"name\":\"Hizkiel\",\"username\":\"Hizkiel\",\"email\":\"hizclick@gmail.com\",\"commits\":1,\"url\":\"https://github.com/Hizkiel\"}],\"changelog\":[{\"hash\":\"24219b4be025811923c533500569ee82dc87c15a\",\"time\":1756397205000,\"email\":\"hizclick@gmail.com\",\"author\":\"Hizkiel\",\"message\":\"Cleaning up for deployment\"}]},\"filePathRelative\":\"en/README.md\"}")
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
