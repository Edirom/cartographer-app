<template><div><h1 id="setup-guide" tabindex="-1"><a class="header-anchor" href="#setup-guide"><span>Setup Guide</span></a></h1>
<hr>
<h2 id="important-tools-and-their-documentation" tabindex="-1"><a class="header-anchor" href="#important-tools-and-their-documentation"><span>Important Tools and Their Documentation</span></a></h2>
<ul>
<li>
<p><strong>Vectre</strong>: a VueJS version of Spectre CSS<br>
👉 <a href="https://vectrejs.github.io/docs/#/pages/getting-started" target="_blank" rel="noopener noreferrer">Vectre Documentation</a></p>
</li>
<li>
<p><strong>OpenSeadragon</strong><br>
👉 <a href="http://openseadragon.github.io/" target="_blank" rel="noopener noreferrer">OpenSeadragon Site</a></p>
</li>
<li>
<p><strong>Annotorious OpenSeadragon Plugin</strong><br>
👉 <a href="https://recogito.github.io/annotorious/getting-started/osd-plugin/" target="_blank" rel="noopener noreferrer">Annotorious OSD Plugin</a></p>
</li>
</ul>
<hr>
<h2 id="project-setup" tabindex="-1"><a class="header-anchor" href="#project-setup"><span>Project Setup</span></a></h2>
<p>Install dependencies:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">npm</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="compiles-and-hot-reloads-for-development" tabindex="-1"><a class="header-anchor" href="#compiles-and-hot-reloads-for-development"><span>Compiles and hot-reloads for development</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm run serve</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="compiles-and-minifies-for-production" tabindex="-1"><a class="header-anchor" href="#compiles-and-minifies-for-production"><span>Compiles and minifies for production</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm run build</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="run-your-unit-tests" tabindex="-1"><a class="header-anchor" href="#run-your-unit-tests"><span>Run your unit tests</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm run test:unit</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="lints-and-fixes-files" tabindex="-1"><a class="header-anchor" href="#lints-and-fixes-files"><span>Lints and fixes files</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm run lint</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="other-approaach-to-linting-which-automatically-fixes-code-and-gives-a-nicer-rendition-of-errors-using-snazzy" tabindex="-1"><a class="header-anchor" href="#other-approaach-to-linting-which-automatically-fixes-code-and-gives-a-nicer-rendition-of-errors-using-snazzy"><span>Other approaach to linting which automatically fixes code and gives a nicer rendition of errors using snazzy</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm run test:lint</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="customize-configuration" tabindex="-1"><a class="header-anchor" href="#customize-configuration"><span>Customize configuration</span></a></h3>
<p>See <a href="https://cli.vuejs.org/config/" target="_blank" rel="noopener noreferrer">Configuration Reference</a>.</p>
<h3 id="deploying-to-a-subdirectory" tabindex="-1"><a class="header-anchor" href="#deploying-to-a-subdirectory"><span>Deploying to a subdirectory</span></a></h3>
<p>In compile stage</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">docker build \</span>
<span class="line">dockercontainer</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="run" tabindex="-1"><a class="header-anchor" href="#run"><span>Run</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"> docker run \</span>
<span class="line">-e CLIENT_ID="your client id" \</span>
<span class="line">-e CLIENT_SECRET= "your client secret"\</span>
<span class="line">-e CALL_BACK= "your call back" \</span>
<span class="line">-e VUE_APP_CALL_BACK=$CALL_BACK \</span>
<span class="line">-e VUE_APP_PUBLIC_PATH="your subpath"</span>
<span class="line">dockercontainer</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


