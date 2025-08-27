<template><div><h1 id="iiif-tools-src-tools-iiif-js" tabindex="-1"><a class="header-anchor" href="#iiif-tools-src-tools-iiif-js"><span>IIIF Tools (<code v-pre>src/tools/iiif.js</code>)</span></a></h1>
<p>Helper functions for converting <strong>IIIF manifests</strong> into MEI XML documents, validating manifests, and extracting pages.</p>
<hr>
<h2 id="addpage-canvas-canvases-dimension-n-file-meisurfacetemplate-hasitems" tabindex="-1"><a class="header-anchor" href="#addpage-canvas-canvases-dimension-n-file-meisurfacetemplate-hasitems"><span><code v-pre>addPage(canvas, canvases, dimension, n, file, meiSurfaceTemplate, hasItems)</code></span></a></h2>
<p>Adds a page (<code v-pre>&lt;surface&gt;</code>) to the MEI file from a IIIF canvas.</p>
<p><strong>Parameters:</strong></p>
<ul>
<li><code v-pre>canvas {Object}</code> — IIIF canvas object</li>
<li><code v-pre>canvases {Array}</code> — Array of all canvases (for dimension lookup)</li>
<li><code v-pre>dimension {Array}</code> — <code v-pre>[width, height]</code> for the image</li>
<li><code v-pre>n {number}</code> — Page number (1-based)</li>
<li><code v-pre>file {Document}</code> — The MEI XML document to modify</li>
<li><code v-pre>meiSurfaceTemplate {Document}</code> — MEI surface template XML</li>
<li><code v-pre>hasItems {boolean}</code> — <code v-pre>true</code> if IIIF Presentation 3 (items), <code v-pre>false</code> if Presentation 2 (images)</li>
</ul>
<p><strong>Behavior:</strong></p>
<ul>
<li>Extracts the label and dimensions of the canvas.</li>
<li>Determines the <code v-pre>info.json</code> URI based on IIIF version.</li>
<li>Generates unique IDs for <code v-pre>&lt;surface&gt;</code> and <code v-pre>&lt;graphic&gt;</code>.</li>
<li>Clones the surface template, sets attributes, and appends it to the MEI <code v-pre>&lt;facsimile&gt;</code>.</li>
</ul>
<hr>
<h2 id="iiifmanifest2mei-json-url-parser-state" tabindex="-1"><a class="header-anchor" href="#iiifmanifest2mei-json-url-parser-state"><span><code v-pre>iiifManifest2mei(json, url, parser, state)</code></span></a></h2>
<p>Converts a IIIF manifest JSON object into an MEI XML document.</p>
<p><strong>Parameters:</strong></p>
<ul>
<li><code v-pre>json {Object}</code> — IIIF manifest JSON</li>
<li><code v-pre>url {string}</code> — Manifest URL</li>
<li><code v-pre>parser {DOMParser}</code> — XML parser instance</li>
<li><code v-pre>state {Object}</code> — Application state (for page dimensions)</li>
</ul>
<p><strong>Behavior:</strong></p>
<ul>
<li>Loads MEI file and surface templates asynchronously.</li>
<li>Sets up MEI metadata (title, source, date, etc.) from the IIIF manifest.</li>
<li>Attempts to extract <strong>shelfmark</strong> and <strong>composer</strong> from IIIF metadata.</li>
<li>Iterates over canvases (Presentation 2) or items (Presentation 3) and adds each as a surface/page using <code v-pre>addPage</code>.</li>
</ul>
<p><strong>Returns:</strong></p>
<ul>
<li><code v-pre>Promise&lt;Document&gt;</code> — Resolves to the generated MEI XML document.</li>
</ul>
<hr>
<h2 id="checkiiifmanifest-json" tabindex="-1"><a class="header-anchor" href="#checkiiifmanifest-json"><span><code v-pre>checkIiifManifest(json)</code></span></a></h2>
<p>Checks if a given JSON object is a valid IIIF manifest (Presentation 2 or 3).</p>
<p><strong>Parameters:</strong></p>
<ul>
<li><code v-pre>json {Object}</code> — IIIF manifest JSON</li>
</ul>
<p><strong>Returns:</strong></p>
<ul>
<li><code v-pre>{boolean}</code> — <code v-pre>true</code> if the manifest is valid, otherwise <code v-pre>false</code>.</li>
</ul>
<p><strong>Validation logic:</strong></p>
<ul>
<li>Verifies IIIF context (<code v-pre>@context</code>)</li>
<li>Checks manifest type (<code v-pre>sc:Manifest</code>)</li>
<li>Ensures an ID (<code v-pre>@id</code>) is present</li>
<li>Confirms presence of <code v-pre>sequences</code> (IIIF v2) or <code v-pre>items</code> (IIIF v3)</li>
</ul>
<hr>
<h2 id="getpagearray-mei" tabindex="-1"><a class="header-anchor" href="#getpagearray-mei"><span><code v-pre>getPageArray(mei)</code></span></a></h2>
<p>Extracts an array of page objects from an MEI XML document.</p>
<p><strong>Parameters:</strong></p>
<ul>
<li><code v-pre>mei {Document}</code> — MEI XML document</li>
</ul>
<p><strong>Returns:</strong></p>
<ul>
<li><code v-pre>{Array}</code> — Array of page objects with:
<ul>
<li><code v-pre>uri</code> — Image target URI</li>
<li><code v-pre>id</code> — MEI surface ID</li>
<li><code v-pre>n</code> — Page number</li>
<li><code v-pre>width</code>, <code v-pre>height</code> — Dimensions</li>
<li><code v-pre>hasSvg</code> — Whether the surface has an embedded SVG</li>
<li><code v-pre>hasZones</code> — Whether the surface contains zones</li>
</ul>
</li>
</ul>
<hr>
<h2 id="example-usage" tabindex="-1"><a class="header-anchor" href="#example-usage"><span>Example Usage</span></a></h2>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> iiifManifest2mei<span class="token punctuation">,</span> checkIiifManifest<span class="token punctuation">,</span> getPageArray <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@/tools/iiif.js'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Validate a manifest</span></span>
<span class="line"><span class="token keyword">const</span> isValid <span class="token operator">=</span> <span class="token function">checkIiifManifest</span><span class="token punctuation">(</span>manifestJson<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Convert IIIF manifest to MEI</span></span>
<span class="line"><span class="token keyword">const</span> meiDoc <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">iiifManifest2mei</span><span class="token punctuation">(</span>manifestJson<span class="token punctuation">,</span> manifestUrl<span class="token punctuation">,</span> parser<span class="token punctuation">,</span> state<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Extract page data</span></span>
<span class="line"><span class="token keyword">const</span> pages <span class="token operator">=</span> <span class="token function">getPageArray</span><span class="token punctuation">(</span>meiDoc<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


