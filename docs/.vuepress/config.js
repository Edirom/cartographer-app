import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'

export default defineUserConfig({
  bundler: viteBundler(),

  theme: defaultTheme({
    sidebar: [
      {
        text: 'Components',
        collapsible: true,
        link: '/README.md',
        children: [
          '/AppFooterComponent.md',
          '/AppHeaderComponent.md',
          '/AppSidebarComponent.md',
          '/ContentPreviewMdiv.md',
          '/ContentPreviewMeasure.md',
          '/ContentPreviewPane.md',
          '/ImageSelectionModal.md',
          '/LoadGitModal.md',
          '/LoadIIIFModal.md',
          '/LoadXMLModal.md',
          '/MainMenu.md',
          '/MeasureModal.md',
          '/MdivModal.md',
          '/OsdComponent.md',
          '/PageImportModal.md',
          '/PagesListEntry.md',
          '/PagesModal.md',
        ],
      },
      {
        text: 'Store',
        collapsible: true,
        link: '/store.md',
        children: [
          '/storeIndex.md',
        ],
      },
     {
        text: 'Tools',
        collapsible: true,
        link: '/tools.md',
        children: [
          '/iiif.md',
          '/meimapping.md',
        ],
      },
    ],
  }),
})
