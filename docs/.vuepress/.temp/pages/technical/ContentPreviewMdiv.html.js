import comp from "/app/docs/.vuepress/.temp/pages/technical/ContentPreviewMdiv.html.vue"
const data = JSON.parse("{\"path\":\"/technical/ContentPreviewMdiv.html\",\"title\":\"ContentPreviewMdiv Component\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"technical/ContentPreviewMdiv.md\"}")
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
