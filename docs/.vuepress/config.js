// docs/.vuepress/config.js
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'

// Reusable English sidebar (absolute paths recommended)
const EN_SIDEBAR = [
  {
    text: 'User Documentation',
    collapsible: true,
    link: '/user/',
    children: [
      '/user/introduction.md',
      '/user/installation.md',
      '/user/UserInterface.md',
      '/user/actions.md',
    ],
  },
  {
    text: 'Technical Documentation',
    collapsible: true,
    link: '/technical/README.md',
    children: [
      {
        text: 'Components',
        collapsible: true,
        children: [
          '/technical/AppFooterComponent.md',
          '/technical/AppHeaderComponent.md',
          '/technical/AppSidebarComponent.md',
          '/technical/ContentPreviewMdiv.md',
          '/technical/ContentPreviewMeasure.md',
          '/technical/ContentPreviewPane.md',
          '/technical/ImageSelectionModal.md',
          '/technical/LoadGitModal.md',
          '/technical/LoadIIIFModal.md',
          '/technical/LoadXMLModal.md',
          '/technical/MainMenu.md',
          '/technical/MeasureModal.md',
          '/technical/MdivModal.md',
          '/technical/OsdComponent.md',
          '/technical/PageImportModal.md',
          '/technical/PagesListEntry.md',
          '/technical/PagesModal.md',
        ],
      },
      {
        text: 'Store',
        collapsible: true,
        link: '/technical/store.md',
        children: ['/technical/storeIndex.md'],
      },
      {
        text: 'Tools',
        collapsible: true,
        link: '/technical/tools.md',
        children: [
          '/technical/iiif.md',
          '/technical/meimapping.md',
        ],
      },
    ],
  },
]

// Helper to prefix sidebar links with /de
const prefixDe = (items) =>
  JSON.parse(JSON.stringify(items).replaceAll('"/', '"/de/'))

export default defineUserConfig({
  bundler: viteBundler(),

  // 1) Site locales: controls lang, title (shown in header), description
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Cartographer-app Documentation',
      description: 'Documentation for the Cartographer App',
    },
    '/de/': {
      lang: 'de-DE',
      title: 'Cartographer-app Dokumentation',
      description: 'Dokumentation für die Cartographer App',
    },
  },

  // 2) Theme locales: controls navbar/sidebar per locale
  theme: defaultTheme({
    locales: {
      '/': {
        navbar: [
          { text: 'Home', link: '/' },
          { text: 'User Docs', link: '/user/' },
          { text: 'Technical Docs', link: '/technical/README.md' },
        ],
        sidebar: EN_SIDEBAR,
      },
      '/de/': {
        navbar: [
          { text: 'Startseite', link: '/de/' },
          { text: 'Benutzerdoku', link: '/de/user/' },
          { text: 'Technische Doku', link: '/de/technical/README.md' },
        ],
        sidebar: prefixDe(EN_SIDEBAR),
      },
    },
  }),
})
