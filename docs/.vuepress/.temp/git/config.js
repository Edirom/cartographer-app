import { GitContributors } from "/Users/hizkielalemayehu/Documents/GitHub/Edirom/cartographer-app/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "/Users/hizkielalemayehu/Documents/GitHub/Edirom/cartographer-app/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
