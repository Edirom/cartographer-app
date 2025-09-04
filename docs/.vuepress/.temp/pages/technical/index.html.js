import comp from "/Users/hizkielalemayehu/Documents/GitHub/Edirom/cartographer-app/docs/.vuepress/.temp/pages/technical/index.html.vue"
const data = JSON.parse("{\"path\":\"/technical/\",\"title\":\"Cartographer App Technical Documentation\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{\"updatedTime\":1756980918000,\"contributors\":[{\"name\":\"Hizkiel\",\"username\":\"Hizkiel\",\"email\":\"hizclick@gmail.com\",\"commits\":2,\"url\":\"https://github.com/Hizkiel\"}],\"changelog\":[{\"hash\":\"bfb39cde0d06ccf03c4689daee888ed129826907\",\"time\":1756980918000,\"email\":\"hizclick@gmail.com\",\"author\":\"Hizkiel\",\"message\":\"resolving based on change requests\"},{\"hash\":\"f154f171982bcbf31ca935ebf59603fd9f7ba544\",\"time\":1756211745000,\"email\":\"hizclick@gmail.com\",\"author\":\"Hizkiel\",\"message\":\"Remove user documentation directory\"}]},\"filePathRelative\":\"technical/README.md\"}")
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
