import comp from "/app/docs/.vuepress/.temp/pages/user/index.html.vue"
const data = JSON.parse("{\"path\":\"/user/\",\"title\":\"Cartographer App User Documentation\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"user/README.md\"}")
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
