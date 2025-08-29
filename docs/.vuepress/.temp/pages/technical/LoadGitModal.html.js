import comp from "/app/docs/.vuepress/.temp/pages/technical/LoadGitModal.html.vue"
const data = JSON.parse("{\"path\":\"/technical/LoadGitModal.html\",\"title\":\"LoadGitModal Component\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"technical/LoadGitModal.md\"}")
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
