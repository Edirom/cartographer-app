<template><div><h1 id="mei-mapping-tools-src-tools-meimapping-js" tabindex="-1"><a class="header-anchor" href="#mei-mapping-tools-src-tools-meimapping-js"><span>MEI Mapping Tools (<code v-pre>src/tools/meimapping.js</code>)</span></a></h1>
<p>Helper functions to convert between MEI zones, Annotorious annotations, detected rectangles, and to manipulate measures/mdivs.<br>
This includes both <strong>exported functions</strong> (public API) and <strong>internal helpers</strong> (not exported but important for maintainers).</p>
<hr>
<h3 id="meizone2annotorious-mei-zoneinput-pageuri" tabindex="-1"><a class="header-anchor" href="#meizone2annotorious-mei-zoneinput-pageuri"><span><code v-pre>meiZone2annotorious(mei, zoneInput, pageUri)</code></span></a></h3>
<p>Converts an MEI <code v-pre>&lt;zone&gt;</code> into an Annotorious annotation object.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">meiZone2annotorious</span> <span class="token punctuation">(</span><span class="token parameter">mei<span class="token punctuation">,</span> zoneInput<span class="token punctuation">,</span> pageUri</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>mei {Document}</code> – MEI XML document</li>
<li><code v-pre>zoneInput {Element|string}</code> – <code v-pre>&lt;zone&gt;</code> element or its xml:id</li>
<li><code v-pre>pageUri {string}</code> – Page image URI</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Object}</code> – Annotorious-compatible annotation</li>
</ul>
<hr>
<h3 id="annotorious2meizone-annot" tabindex="-1"><a class="header-anchor" href="#annotorious2meizone-annot"><span><code v-pre>annotorious2meiZone(annot)</code></span></a></h3>
<p>Converts an Annotorious annotation into an MEI <code v-pre>&lt;zone&gt;</code>.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">annotorious2meiZone</span> <span class="token punctuation">(</span><span class="token parameter">annot</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>annot {Object}</code> – Annotorious annotation</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Element}</code> – MEI <code v-pre>&lt;zone&gt;</code></li>
</ul>
<hr>
<h3 id="measuredetector2meizone-rect" tabindex="-1"><a class="header-anchor" href="#measuredetector2meizone-rect"><span><code v-pre>measureDetector2meiZone(rect)</code></span></a></h3>
<p>Converts a detected rectangle into an MEI <code v-pre>&lt;zone&gt;</code>.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">measureDetector2meiZone</span> <span class="token punctuation">(</span><span class="token parameter">rect</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>rect {Object}</code> – Rectangle <code v-pre>{ ulx, uly, lrx, lry }</code></li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Element}</code> – MEI <code v-pre>&lt;zone&gt;</code></li>
</ul>
<hr>
<h3 id="generatemeasure" tabindex="-1"><a class="header-anchor" href="#generatemeasure"><span><code v-pre>generateMeasure()</code></span></a></h3>
<p>Creates a new MEI <code v-pre>&lt;measure&gt;</code>.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">generateMeasure</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Element}</code> – <code v-pre>&lt;measure&gt;</code> with unique xml:id</li>
</ul>
<hr>
<h3 id="insertmeasure-xmldoc-measure-state-currentzone-pageindex-targetmdiv" tabindex="-1"><a class="header-anchor" href="#insertmeasure-xmldoc-measure-state-currentzone-pageindex-targetmdiv"><span><code v-pre>insertMeasure(xmlDoc, measure, state, currentZone, pageIndex, targetMdiv)</code></span></a></h3>
<p>Inserts a <code v-pre>&lt;measure&gt;</code> into the MEI.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">insertMeasure</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> measure<span class="token punctuation">,</span> state<span class="token punctuation">,</span> currentZone<span class="token punctuation">,</span> pageIndex<span class="token punctuation">,</span> targetMdiv</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>xmlDoc {Document}</code> – MEI file</li>
<li><code v-pre>measure {Element}</code> – New measure</li>
<li><code v-pre>state {Object}</code> – Vuex state</li>
<li><code v-pre>currentZone {Element}</code> – Zone for this measure</li>
<li><code v-pre>pageIndex {number}</code> – Page index</li>
<li><code v-pre>targetMdiv {Element}</code> – Target movement</li>
</ul>
<hr>
<h3 id="getfollowingmeasuresbymeasure-measure" tabindex="-1"><a class="header-anchor" href="#getfollowingmeasuresbymeasure-measure"><span><code v-pre>getFollowingMeasuresByMeasure(measure)</code></span></a></h3>
<p>Get all measures following a given one.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getFollowingMeasuresByMeasure</span> <span class="token punctuation">(</span><span class="token parameter">measure</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>measure {Element}</code> – Current measure</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Array&lt;Element&gt;}</code> – List of following measures</li>
</ul>
<hr>
<h3 id="addzonetolastmeasure-xmldoc-zoneid" tabindex="-1"><a class="header-anchor" href="#addzonetolastmeasure-xmldoc-zoneid"><span><code v-pre>addZoneToLastMeasure(xmlDoc, zoneId)</code></span></a></h3>
<p>Adds a zone to the last <code v-pre>&lt;measure&gt;</code> in the MEI.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">addZoneToLastMeasure</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> zoneId</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><hr>
<h3 id="createnewmdiv-xmldoc-state-aftermdivid" tabindex="-1"><a class="header-anchor" href="#createnewmdiv-xmldoc-state-aftermdivid"><span><code v-pre>createNewMdiv(xmlDoc, state, afterMdivId)</code></span></a></h3>
<p>Creates a new <code v-pre>&lt;mdiv&gt;</code> (movement).</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createNewMdiv</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> state<span class="token punctuation">,</span> afterMdivId</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>xmlDoc {Document}</code> – MEI document</li>
<li><code v-pre>state {Object}</code> – Vuex state</li>
<li><code v-pre>afterMdivId {string?}</code> – Optional target to insert after</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{string}</code> – New mdiv xml:id</li>
</ul>
<hr>
<h3 id="deletezone-xmldoc-id-state" tabindex="-1"><a class="header-anchor" href="#deletezone-xmldoc-id-state"><span><code v-pre>deleteZone(xmlDoc, id, state)</code></span></a></h3>
<p>Deletes a zone and updates measures accordingly.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">deleteZone</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> id<span class="token punctuation">,</span> state</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><hr>
<h3 id="toggleadditionalzone-xmldoc-id-state" tabindex="-1"><a class="header-anchor" href="#toggleadditionalzone-xmldoc-id-state"><span><code v-pre>toggleAdditionalZone(xmlDoc, id, state)</code></span></a></h3>
<p>Toggle zone between new measure and merged measure.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">toggleAdditionalZone</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> id<span class="token punctuation">,</span> state</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><hr>
<h3 id="setmultirest-measure-val" tabindex="-1"><a class="header-anchor" href="#setmultirest-measure-val"><span><code v-pre>setMultiRest(measure, val)</code></span></a></h3>
<p>Sets, updates, or removes a <code v-pre>&lt;multiRest&gt;</code>.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">setMultiRest</span> <span class="token punctuation">(</span><span class="token parameter">measure<span class="token punctuation">,</span> val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><hr>
<h3 id="movecontenttomdiv-xmldoc-firstmeasureid-targetmdivid-state" tabindex="-1"><a class="header-anchor" href="#movecontenttomdiv-xmldoc-firstmeasureid-targetmdivid-state"><span><code v-pre>moveContentToMdiv(xmlDoc, firstMeasureId, targetMdivId, state)</code></span></a></h3>
<p>Moves a sequence of measures into a target mdiv.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">moveContentToMdiv</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> firstMeasureId<span class="token punctuation">,</span> targetMdivId<span class="token punctuation">,</span> state</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><hr>
<h3 id="addimportedpage-xmldoc-index-url-width-height" tabindex="-1"><a class="header-anchor" href="#addimportedpage-xmldoc-index-url-width-height"><span><code v-pre>addImportedPage(xmlDoc, index, url, width, height)</code></span></a></h3>
<p>Adds a new <code v-pre>&lt;surface&gt;</code> page.</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">addImportedPage</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> index<span class="token punctuation">,</span> url<span class="token punctuation">,</span> width<span class="token punctuation">,</span> height</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><hr>
<h2 id="internal-helpers" tabindex="-1"><a class="header-anchor" href="#internal-helpers"><span>Internal Helpers</span></a></h2>
<h3 id="incrementmeasurenum-num-diff" tabindex="-1"><a class="header-anchor" href="#incrementmeasurenum-num-diff"><span><code v-pre>incrementMeasureNum(num, diff)</code></span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">incrementMeasureNum</span> <span class="token punctuation">(</span><span class="token parameter">num<span class="token punctuation">,</span> diff</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">return</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span> <span class="token operator">+</span> diff</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>num {string|number}</code> – Current measure number</li>
<li><code v-pre>diff {number}</code> – Amount to add</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{number}</code> – New measure number</li>
</ul>
<hr>
<h3 id="getlastmeasure-xmldoc" tabindex="-1"><a class="header-anchor" href="#getlastmeasure-xmldoc"><span><code v-pre>getLastMeasure(xmlDoc)</code></span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">getLastMeasure</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">const</span> measure <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>xmlDoc<span class="token punctuation">.</span><span class="token function">querySelectorAll</span><span class="token punctuation">(</span><span class="token string">'measure'</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token keyword">return</span> measure</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>xmlDoc {Document}</code> – MEI DOM</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Element|undefined}</code> – Last measure or undefined</li>
</ul>
<hr>
<h3 id="getprecedingzone-xmldoc-surface" tabindex="-1"><a class="header-anchor" href="#getprecedingzone-xmldoc-surface"><span><code v-pre>getPrecedingZone(xmlDoc, surface)</code></span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">getPrecedingZone</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> surface</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>xmlDoc {Document}</code> – MEI DOM</li>
<li><code v-pre>surface {Element}</code> – Current page</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Element|null}</code> – Last zone on a previous page</li>
</ul>
<hr>
<h3 id="getprecedingzonenomatterwhere-xmldoc-zone" tabindex="-1"><a class="header-anchor" href="#getprecedingzonenomatterwhere-xmldoc-zone"><span><code v-pre>getPrecedingZoneNoMatterWhere(xmlDoc, zone)</code></span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">getPrecedingZoneNoMatterWhere</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> zone</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>xmlDoc {Document}</code> – MEI DOM</li>
<li><code v-pre>zone {Element}</code> – Reference zone</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Element|null}</code> – Nearest preceding zone</li>
</ul>
<hr>
<h3 id="getmeasuresfromzone-xmldoc-zone" tabindex="-1"><a class="header-anchor" href="#getmeasuresfromzone-xmldoc-zone"><span><code v-pre>getMeasuresFromZone(xmlDoc, zone)</code></span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">getMeasuresFromZone</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> zone</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>xmlDoc {Document}</code> – MEI DOM</li>
<li><code v-pre>zone {Element}</code> – Zone element</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Array&lt;Element&gt;}</code> – Measures referencing the zone</li>
</ul>
<hr>
<h3 id="getzonesfrommeasure-xmldoc-measure" tabindex="-1"><a class="header-anchor" href="#getzonesfrommeasure-xmldoc-measure"><span><code v-pre>getZonesFromMeasure(xmlDoc, measure)</code></span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">function</span> <span class="token function">getZonesFromMeasure</span> <span class="token punctuation">(</span><span class="token parameter">xmlDoc<span class="token punctuation">,</span> measure</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>Parameters</strong></p>
<ul>
<li><code v-pre>xmlDoc {Document}</code> – MEI DOM</li>
<li><code v-pre>measure {Element}</code> – Measure element</li>
</ul>
<p><strong>Returns</strong></p>
<ul>
<li><code v-pre>{Array&lt;Element&gt;}</code> – Zones linked by @facs</li>
</ul>
<hr>
<h2 id="example-usage" tabindex="-1"><a class="header-anchor" href="#example-usage"><span>Example Usage</span></a></h2>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span></span>
<span class="line">  meiZone2annotorious<span class="token punctuation">,</span></span>
<span class="line">  annotorious2meiZone<span class="token punctuation">,</span></span>
<span class="line">  measureDetector2meiZone<span class="token punctuation">,</span></span>
<span class="line">  generateMeasure<span class="token punctuation">,</span></span>
<span class="line">  insertMeasure<span class="token punctuation">,</span></span>
<span class="line">  addZoneToLastMeasure<span class="token punctuation">,</span></span>
<span class="line">  createNewMdiv<span class="token punctuation">,</span></span>
<span class="line">  deleteZone<span class="token punctuation">,</span></span>
<span class="line">  toggleAdditionalZone<span class="token punctuation">,</span></span>
<span class="line">  setMultiRest<span class="token punctuation">,</span></span>
<span class="line">  moveContentToMdiv<span class="token punctuation">,</span></span>
<span class="line">  addImportedPage<span class="token punctuation">,</span></span>
<span class="line">  <span class="token operator">...</span></span>
<span class="line"><span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@/tools/meimapping.js'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Convert zone → annotation</span></span>
<span class="line"><span class="token keyword">const</span> annot <span class="token operator">=</span> <span class="token function">meiZone2annotorious</span><span class="token punctuation">(</span>meiDoc<span class="token punctuation">,</span> <span class="token string">'zone123'</span><span class="token punctuation">,</span> pageUri<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Convert annotation → zone</span></span>
<span class="line"><span class="token keyword">const</span> zone <span class="token operator">=</span> <span class="token function">annotorious2meiZone</span><span class="token punctuation">(</span>annot<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Add zone to last measure</span></span>
<span class="line"><span class="token function">addZoneToLastMeasure</span><span class="token punctuation">(</span>meiDoc<span class="token punctuation">,</span> <span class="token string">'zone123'</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Create new movement</span></span>
<span class="line"><span class="token keyword">const</span> mdivId <span class="token operator">=</span> <span class="token function">createNewMdiv</span><span class="token punctuation">(</span>meiDoc<span class="token punctuation">,</span> state<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Delete a zone</span></span>
<span class="line"><span class="token function">deleteZone</span><span class="token punctuation">(</span>meiDoc<span class="token punctuation">,</span> <span class="token string">'zone456'</span><span class="token punctuation">,</span> state<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


