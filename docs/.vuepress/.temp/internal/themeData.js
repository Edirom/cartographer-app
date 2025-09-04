export const themeData = JSON.parse("{\"locales\":{\"/\":{\"navbar\":[{\"text\":\"Home\",\"link\":\"/\"},{\"text\":\"User Docs\",\"link\":\"/user/\"},{\"text\":\"Technical Docs\",\"link\":\"/technical/README.md\"}],\"sidebar\":[{\"text\":\"User Documentation\",\"collapsible\":true,\"link\":\"/user/\",\"children\":[\"/user/introduction.md\",\"/user/installation.md\",\"/user/UserInterface.md\",\"/user/actions.md\",\"/user/workflow.md\"]},{\"text\":\"Technical Documentation\",\"collapsible\":true,\"link\":\"/technical/README.md\",\"children\":[{\"text\":\"Components\",\"collapsible\":true,\"children\":[\"/technical/AppFooterComponent.md\",\"/technical/AppHeaderComponent.md\",\"/technical/AppSidebarComponent.md\",\"/technical/ContentPreviewMdiv.md\",\"/technical/ContentPreviewMeasure.md\",\"/technical/ContentPreviewPane.md\",\"/technical/ImageSelectionModal.md\",\"/technical/LoadGitModal.md\",\"/technical/LoadIIIFModal.md\",\"/technical/LoadXMLModal.md\",\"/technical/MainMenu.md\",\"/technical/MeasureModal.md\",\"/technical/MdivModal.md\",\"/technical/OsdComponent.md\",\"/technical/PageImportModal.md\",\"/technical/PagesListEntry.md\",\"/technical/PagesModal.md\"]},{\"text\":\"Store\",\"collapsible\":true,\"link\":\"/technical/store.md\",\"children\":[\"/technical/storeIndex.md\"]},{\"text\":\"Tools\",\"collapsible\":true,\"link\":\"/technical/tools.md\",\"children\":[\"/technical/iiif.md\",\"/technical/meimapping.md\"]}]}],\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"navbar\":[],\"logo\":null,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebar\":\"heading\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

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
