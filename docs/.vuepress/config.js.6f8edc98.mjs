// .vuepress/config.js
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
var EN_SIDEBAR = [
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
var prefixDe = (items) => JSON.parse(JSON.stringify(items).replaceAll('"/', '"/de/'));
var config_default = defineUserConfig({
  bundler: viteBundler(),
  // 1) Site locales: controls lang, title (shown in header), description
  locales: {
    "/": {
      lang: "en-US",
      title: "Cartographer-app Documentation",
      description: "Documentation for the Cartographer App"
    },
    "/de/": {
      lang: "de-DE",
      title: "Cartographer-app Dokumentation",
      description: "Dokumentation f\xFCr die Cartographer App"
    }
  },
  // 2) Theme locales: controls navbar/sidebar per locale
  theme: defaultTheme({
    locales: {
      "/": {
        navbar: [
          { text: "Home", link: "/" },
          { text: "User Docs", link: "/user/" },
          { text: "Technical Docs", link: "/technical/README.md" }
        ],
        sidebar: EN_SIDEBAR
      },
      "/de/": {
        navbar: [
          { text: "Startseite", link: "/de/" },
          { text: "Benutzerdoku", link: "/de/user/" },
          { text: "Technische Doku", link: "/de/technical/README.md" }
        ],
        sidebar: prefixDe(EN_SIDEBAR)
      }
    }
  })
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZ1ZXByZXNzL2NvbmZpZy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9oaXpraWVsYWxlbWF5ZWh1L0RvY3VtZW50cy9HaXRIdWIvRWRpcm9tL2NhcnRvZ3JhcGhlci1hcHAvZG9jcy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9oaXpraWVsYWxlbWF5ZWh1L0RvY3VtZW50cy9HaXRIdWIvRWRpcm9tL2NhcnRvZ3JhcGhlci1hcHAvZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9oaXpraWVsYWxlbWF5ZWh1L0RvY3VtZW50cy9HaXRIdWIvRWRpcm9tL2NhcnRvZ3JhcGhlci1hcHAvZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzXCI7Ly8gZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzXG5pbXBvcnQgeyBkZWZpbmVVc2VyQ29uZmlnIH0gZnJvbSAndnVlcHJlc3MnXG5pbXBvcnQgeyB2aXRlQnVuZGxlciB9IGZyb20gJ0B2dWVwcmVzcy9idW5kbGVyLXZpdGUnXG5pbXBvcnQgeyBkZWZhdWx0VGhlbWUgfSBmcm9tICdAdnVlcHJlc3MvdGhlbWUtZGVmYXVsdCdcblxuLy8gUmV1c2FibGUgRW5nbGlzaCBzaWRlYmFyIChhYnNvbHV0ZSBwYXRocyByZWNvbW1lbmRlZClcbmNvbnN0IEVOX1NJREVCQVIgPSBbXG4gIHtcbiAgICB0ZXh0OiAnVXNlciBEb2N1bWVudGF0aW9uJyxcbiAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcbiAgICBsaW5rOiAnL3VzZXIvJyxcbiAgICBjaGlsZHJlbjogW1xuICAgICAgJy91c2VyL2ludHJvZHVjdGlvbi5tZCcsXG4gICAgICAnL3VzZXIvaW5zdGFsbGF0aW9uLm1kJyxcbiAgICAgICcvdXNlci9Vc2VySW50ZXJmYWNlLm1kJyxcbiAgICAgICcvdXNlci9hY3Rpb25zLm1kJyxcbiAgICAgICcvdXNlci93b3JrZmxvdy5tZCcsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHRleHQ6ICdUZWNobmljYWwgRG9jdW1lbnRhdGlvbicsXG4gICAgY29sbGFwc2libGU6IHRydWUsXG4gICAgbGluazogJy90ZWNobmljYWwvUkVBRE1FLm1kJyxcbiAgICBjaGlsZHJlbjogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnQ29tcG9uZW50cycsXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxuICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICcvdGVjaG5pY2FsL0FwcEZvb3RlckNvbXBvbmVudC5tZCcsXG4gICAgICAgICAgJy90ZWNobmljYWwvQXBwSGVhZGVyQ29tcG9uZW50Lm1kJyxcbiAgICAgICAgICAnL3RlY2huaWNhbC9BcHBTaWRlYmFyQ29tcG9uZW50Lm1kJyxcbiAgICAgICAgICAnL3RlY2huaWNhbC9Db250ZW50UHJldmlld01kaXYubWQnLFxuICAgICAgICAgICcvdGVjaG5pY2FsL0NvbnRlbnRQcmV2aWV3TWVhc3VyZS5tZCcsXG4gICAgICAgICAgJy90ZWNobmljYWwvQ29udGVudFByZXZpZXdQYW5lLm1kJyxcbiAgICAgICAgICAnL3RlY2huaWNhbC9JbWFnZVNlbGVjdGlvbk1vZGFsLm1kJyxcbiAgICAgICAgICAnL3RlY2huaWNhbC9Mb2FkR2l0TW9kYWwubWQnLFxuICAgICAgICAgICcvdGVjaG5pY2FsL0xvYWRJSUlGTW9kYWwubWQnLFxuICAgICAgICAgICcvdGVjaG5pY2FsL0xvYWRYTUxNb2RhbC5tZCcsXG4gICAgICAgICAgJy90ZWNobmljYWwvTWFpbk1lbnUubWQnLFxuICAgICAgICAgICcvdGVjaG5pY2FsL01lYXN1cmVNb2RhbC5tZCcsXG4gICAgICAgICAgJy90ZWNobmljYWwvTWRpdk1vZGFsLm1kJyxcbiAgICAgICAgICAnL3RlY2huaWNhbC9Pc2RDb21wb25lbnQubWQnLFxuICAgICAgICAgICcvdGVjaG5pY2FsL1BhZ2VJbXBvcnRNb2RhbC5tZCcsXG4gICAgICAgICAgJy90ZWNobmljYWwvUGFnZXNMaXN0RW50cnkubWQnLFxuICAgICAgICAgICcvdGVjaG5pY2FsL1BhZ2VzTW9kYWwubWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ1N0b3JlJyxcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXG4gICAgICAgIGxpbms6ICcvdGVjaG5pY2FsL3N0b3JlLm1kJyxcbiAgICAgICAgY2hpbGRyZW46IFsnL3RlY2huaWNhbC9zdG9yZUluZGV4Lm1kJ10sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnVG9vbHMnLFxuICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcbiAgICAgICAgbGluazogJy90ZWNobmljYWwvdG9vbHMubWQnLFxuICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICcvdGVjaG5pY2FsL2lpaWYubWQnLFxuICAgICAgICAgICcvdGVjaG5pY2FsL21laW1hcHBpbmcubWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXVxuXG4vLyBIZWxwZXIgdG8gcHJlZml4IHNpZGViYXIgbGlua3Mgd2l0aCAvZGVcbmNvbnN0IHByZWZpeERlID0gKGl0ZW1zKSA9PlxuICBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGl0ZW1zKS5yZXBsYWNlQWxsKCdcIi8nLCAnXCIvZGUvJykpXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZVVzZXJDb25maWcoe1xuICBidW5kbGVyOiB2aXRlQnVuZGxlcigpLFxuXG4gIC8vIDEpIFNpdGUgbG9jYWxlczogY29udHJvbHMgbGFuZywgdGl0bGUgKHNob3duIGluIGhlYWRlciksIGRlc2NyaXB0aW9uXG4gIGxvY2FsZXM6IHtcbiAgICAnLyc6IHtcbiAgICAgIGxhbmc6ICdlbi1VUycsXG4gICAgICB0aXRsZTogJ0NhcnRvZ3JhcGhlci1hcHAgRG9jdW1lbnRhdGlvbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RvY3VtZW50YXRpb24gZm9yIHRoZSBDYXJ0b2dyYXBoZXIgQXBwJyxcbiAgICB9LFxuICAgICcvZGUvJzoge1xuICAgICAgbGFuZzogJ2RlLURFJyxcbiAgICAgIHRpdGxlOiAnQ2FydG9ncmFwaGVyLWFwcCBEb2t1bWVudGF0aW9uJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRG9rdW1lbnRhdGlvbiBmXHUwMEZDciBkaWUgQ2FydG9ncmFwaGVyIEFwcCcsXG4gICAgfSxcbiAgfSxcblxuICAvLyAyKSBUaGVtZSBsb2NhbGVzOiBjb250cm9scyBuYXZiYXIvc2lkZWJhciBwZXIgbG9jYWxlXG4gIHRoZW1lOiBkZWZhdWx0VGhlbWUoe1xuICAgIGxvY2FsZXM6IHtcbiAgICAgICcvJzoge1xuICAgICAgICBuYXZiYXI6IFtcbiAgICAgICAgICB7IHRleHQ6ICdIb21lJywgbGluazogJy8nIH0sXG4gICAgICAgICAgeyB0ZXh0OiAnVXNlciBEb2NzJywgbGluazogJy91c2VyLycgfSxcbiAgICAgICAgICB7IHRleHQ6ICdUZWNobmljYWwgRG9jcycsIGxpbms6ICcvdGVjaG5pY2FsL1JFQURNRS5tZCcgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2lkZWJhcjogRU5fU0lERUJBUixcbiAgICAgIH0sXG4gICAgICAnL2RlLyc6IHtcbiAgICAgICAgbmF2YmFyOiBbXG4gICAgICAgICAgeyB0ZXh0OiAnU3RhcnRzZWl0ZScsIGxpbms6ICcvZGUvJyB9LFxuICAgICAgICAgIHsgdGV4dDogJ0JlbnV0emVyZG9rdScsIGxpbms6ICcvZGUvdXNlci8nIH0sXG4gICAgICAgICAgeyB0ZXh0OiAnVGVjaG5pc2NoZSBEb2t1JywgbGluazogJy9kZS90ZWNobmljYWwvUkVBRE1FLm1kJyB9LFxuICAgICAgICBdLFxuICAgICAgICBzaWRlYmFyOiBwcmVmaXhEZShFTl9TSURFQkFS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
