import comp from "/app/docs/.vuepress/.temp/pages/technical/ContentPreviewPane.html.vue"
const data = JSON.parse("{\"path\":\"/technical/ContentPreviewPane.html\",\"title\":\"Content Preview Pane\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"technical/ContentPreviewPane.md\"}")
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
