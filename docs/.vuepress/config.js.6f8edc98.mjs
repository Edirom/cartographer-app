// .vuepress/config.js
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";

const EN_SIDEBAR = [
  {
    text: "User Documentation",
    collapsible: true,
    link: "/user/",
    children: [
      "/user/introduction.md",
      "/user/installation.md",
      "/user/UserInterface.md",
      "/user/actions.md",
      "/user/workflow.md"
    ]
  },
  {
    text: "Technical Documentation",
    collapsible: true,
    link: "/technical/README.md",
    children: [
      {
        text: "Components",
        collapsible: true,
        children: [
          "/technical/AppFooterComponent.md",
          "/technical/AppHeaderComponent.md",
          "/technical/AppSidebarComponent.md",
          "/technical/ContentPreviewMdiv.md",
          "/technical/ContentPreviewMeasure.md",
          "/technical/ContentPreviewPane.md",
          "/technical/ImageSelectionModal.md",
          "/technical/LoadGitModal.md",
          "/technical/LoadIIIFModal.md",
          "/technical/LoadXMLModal.md",
          "/technical/MainMenu.md",
          "/technical/MeasureModal.md",
          "/technical/MdivModal.md",
          "/technical/OsdComponent.md",
          "/technical/PageImportModal.md",
          "/technical/PagesListEntry.md",
          "/technical/PagesModal.md"
        ]
      },
      {
        text: "Store",
        collapsible: true,
        link: "/technical/store.md",
        children: ["/technical/storeIndex.md"]
      },
      {
        text: "Tools",
        collapsible: true,
        link: "/technical/tools.md",
        children: [
          "/technical/iiif.md",
          "/technical/meimapping.md"
        ]
      }
    ]
  }
];

export default defineUserConfig({
  bundler: viteBundler(),
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
    },
  }),
});
