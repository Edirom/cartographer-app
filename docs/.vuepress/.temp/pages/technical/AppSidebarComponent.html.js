import comp from "/app/docs/.vuepress/.temp/pages/technical/AppSidebarComponent.html.vue"
const data = JSON.parse("{\"path\":\"/technical/AppSidebarComponent.html\",\"title\":\"AppSidebar Component\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"technical/AppSidebarComponent.md\"}")
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
