export const themeData = JSON.parse("{\"sidebar\":[{\"text\":\"Components\",\"collapsible\":true,\"link\":\"/README.md\",\"children\":[\"/AppFooterComponent.md\",\"/AppHeaderComponent.md\",\"/AppSidebarComponent.md\",\"/ContentPreviewMdiv.md\",\"/ContentPreviewMeasure.md\",\"/ContentPreviewPane.md\",\"/ImageSelectionModal.md\",\"/LoadGitModal.md\",\"/LoadIIIFModal.md\",\"/LoadXMLModal.md\",\"/MainMenu.md\",\"/MeasureModal.md\",\"/MdivModal.md\",\"/OsdComponent.md\",\"/PageImportModal.md\",\"/PagesListEntry.md\",\"/PagesModal.md\"]},{\"text\":\"Store\",\"collapsible\":true,\"link\":\"/store.md\",\"children\":[\"/storeIndex.md\"]},{\"text\":\"Tools\",\"collapsible\":true,\"link\":\"/tools.md\",\"children\":[\"/iiif.md\",\"/meimapping.md\"]}],\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"navbar\":[],\"logo\":null,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
