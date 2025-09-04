import comp from "/Users/hizkielalemayehu/Documents/GitHub/Edirom/cartographer-app/docs/.vuepress/.temp/pages/user/workflow.html.vue"
const data = JSON.parse("{\"path\":\"/user/workflow.html\",\"title\":\"Workflow\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{\"updatedTime\":1756281088000,\"contributors\":[{\"name\":\"Hizkiel\",\"username\":\"Hizkiel\",\"email\":\"hizclick@gmail.com\",\"commits\":1,\"url\":\"https://github.com/Hizkiel\"}],\"changelog\":[{\"hash\":\"55e94568e1d1bbbd7ef2f19b2073c47d9d521acb\",\"time\":1756281088000,\"email\":\"hizclick@gmail.com\",\"author\":\"Hizkiel\",\"message\":\"Adding a new content\"}]},\"filePathRelative\":\"user/workflow.md\"}")
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
