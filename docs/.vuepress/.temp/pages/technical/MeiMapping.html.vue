<template><div><h1 id="mei-mappings-tools-src-tools-meimappings-js" tabindex="-1"><a class="header-anchor" href="#mei-mappings-tools-src-tools-meimappings-js"><span>MEI Mappings Tools (<code v-pre>src/tools/meiMappings.js</code>)</span></a></h1>
<p>Utility functions for mapping between MEI zones/measures and Annotorious annotations, as well as manipulating MEI documents.</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<p>This module provides functions to:</p>
<ul>
<li>Convert MEI zones to Annotorious annotation objects and vice versa</li>
<li>Create, insert, and delete measures and zones in MEI</li>
<li>Move content between mdivs</li>
<li>Add imported pages to MEI</li>
<li>Manage multi-rests and additional zones</li>
</ul>
<hr>
<h2 id="functions" tabindex="-1"><a class="header-anchor" href="#functions"><span>Functions</span></a></h2>
<h3 id="meizone2annotorious-mei-zoneinput-pageuri" tabindex="-1"><a class="header-anchor" href="#meizone2annotorious-mei-zoneinput-pageuri"><span><code v-pre>meiZone2annotorious(mei, zoneInput, pageUri)</code></span></a></h3>
<p>Converts an MEI <code v-pre>&lt;zone&gt;</code> element to an Annotorious annotation object.</p>
<ul>
<li><strong>Parameters:</strong>
<ul>
<li><code v-pre>mei</code>: The MEI XML document</li>
<li><code v-pre>zoneInput</code>: The zone element or its ID</li>
<li><code v-pre>pageUri</code>: The image/page URI</li>
</ul>
</li>
</ul>
<hr>
<h3 id="annotorious2meizone-annot" tabindex="-1"><a class="header-anchor" href="#annotorious2meizone-annot"><span><code v-pre>annotorious2meiZone(annot)</code></span></a></h3>
<p>Converts an Annotorious annotation object to an MEI <code v-pre>&lt;zone&gt;</code> element.</p>
<ul>
<li><strong>Parameters:</strong>
<ul>
<li><code v-pre>annot</code>: The Annotorious annotation object</li>
</ul>
</li>
</ul>
<hr>
<h3 id="measuredetector2meizone-rect" tabindex="-1"><a class="header-anchor" href="#measuredetector2meizone-rect"><span><code v-pre>measureDetector2meiZone(rect)</code></span></a></h3>
<p>Creates a new MEI <code v-pre>&lt;zone&gt;</code> element from a rectangle (e.g., from a detector).</p>
<ul>
<li><strong>Parameters:</strong>
<ul>
<li><code v-pre>rect</code>: Object with <code v-pre>ulx</code>, <code v-pre>uly</code>, <code v-pre>lrx</code>, <code v-pre>lry</code> properties</li>
</ul>
</li>
</ul>
<hr>
<h3 id="generatemeasure" tabindex="-1"><a class="header-anchor" href="#generatemeasure"><span><code v-pre>generateMeasure()</code></span></a></h3>
<p>Creates and returns a new MEI <code v-pre>&lt;measure&gt;</code> element with a unique ID.</p>
<hr>
<h3 id="insertmeasure-xmldoc-measure-state-currentzone-pageindex-targetmdiv" tabindex="-1"><a class="header-anchor" href="#insertmeasure-xmldoc-measure-state-currentzone-pageindex-targetmdiv"><span><code v-pre>insertMeasure(xmlDoc, measure, state, currentZone, pageIndex, targetMdiv)</code></span></a></h3>
<p>Inserts a measure into the MEI file at the correct position, adjusting measure numbers and page breaks as needed.</p>
<ul>
<li><strong>Parameters:</strong>
<ul>
<li><code v-pre>xmlDoc</code>: The MEI XML document</li>
<li><code v-pre>measure</code>: The measure element to insert</li>
<li><code v-pre>state</code>: Vuex state</li>
<li><code v-pre>currentZone</code>: The zone associated with the measure</li>
<li><code v-pre>pageIndex</code>: Index of the page (zero-based)</li>
<li><code v-pre>targetMdiv</code>: The mdiv to insert into</li>
</ul>
</li>
</ul>
<hr>
<h3 id="getfollowingmeasuresbymeasure-measure" tabindex="-1"><a class="header-anchor" href="#getfollowingmeasuresbymeasure-measure"><span><code v-pre>getFollowingMeasuresByMeasure(measure)</code></span></a></h3>
<p>Returns an array of all measures following the given measure.</p>
<hr>
<h3 id="addzonetolastmeasure-xmldoc-zoneid" tabindex="-1"><a class="header-anchor" href="#addzonetolastmeasure-xmldoc-zoneid"><span><code v-pre>addZoneToLastMeasure(xmlDoc, zoneId)</code></span></a></h3>
<p>Adds a zone reference to the last measure in the MEI document.</p>
<hr>
<h3 id="createnewmdiv-xmldoc-aftermdivid" tabindex="-1"><a class="header-anchor" href="#createnewmdiv-xmldoc-aftermdivid"><span><code v-pre>createNewMdiv(xmlDoc, afterMdivId)</code></span></a></h3>
<p>Creates a new <code v-pre>&lt;mdiv&gt;</code> in the MEI document, optionally after a given mdiv.</p>
<ul>
<li><strong>Parameters:</strong>
<ul>
<li><code v-pre>xmlDoc</code>: The MEI XML document</li>
<li><code v-pre>afterMdivId</code>: (Optional) ID of the mdiv after which to insert</li>
</ul>
</li>
</ul>
<hr>
<h3 id="deletezone-xmldoc-id-state" tabindex="-1"><a class="header-anchor" href="#deletezone-xmldoc-id-state"><span><code v-pre>deleteZone(xmlDoc, id, state)</code></span></a></h3>
<p>Deletes a zone and its associated measures from the MEI document.</p>
<ul>
<li><strong>Parameters:</strong>
<ul>
<li><code v-pre>xmlDoc</code>: The MEI XML document</li>
<li><code v-pre>id</code>: The zone ID</li>
<li><code v-pre>state</code>: Vuex state</li>
</ul>
</li>
</ul>
<hr>
<h3 id="toggleadditionalzone-xmldoc-id-state" tabindex="-1"><a class="header-anchor" href="#toggleadditionalzone-xmldoc-id-state"><span><code v-pre>toggleAdditionalZone(xmlDoc, id, state)</code></span></a></h3>
<p>Toggles an additional zone for a measure, updating facsimile references and measure structure.</p>
<hr>
<h3 id="setmultirest-measure-val" tabindex="-1"><a class="header-anchor" href="#setmultirest-measure-val"><span><code v-pre>setMultiRest(measure, val)</code></span></a></h3>
<p>Sets or removes a multi-rest on a measure, updating following measure numbers as needed.</p>
<ul>
<li><strong>Parameters:</strong>
<ul>
<li><code v-pre>measure</code>: The measure element</li>
<li><code v-pre>val</code>: The multi-rest value (number or null)</li>
</ul>
</li>
</ul>
<hr>
<h3 id="movecontenttomdiv-xmldoc-firstmeasureid-targetmdivid-state" tabindex="-1"><a class="header-anchor" href="#movecontenttomdiv-xmldoc-firstmeasureid-targetmdivid-state"><span><code v-pre>moveContentToMdiv(xmlDoc, firstMeasureId, targetMdivId, state)</code></span></a></h3>
<p>Moves a sequence of measures (and related elements) to a different mdiv.</p>
<hr>
<h3 id="addimportedpage-xmldoc-index-url-width-height" tabindex="-1"><a class="header-anchor" href="#addimportedpage-xmldoc-index-url-width-height"><span><code v-pre>addImportedPage(xmlDoc, index, url, width, height)</code></span></a></h3>
<p>Adds a new page (surface and graphic) to the MEI document for an imported image.</p>
<ul>
<li><strong>Parameters:</strong>
<ul>
<li><code v-pre>xmlDoc</code>: The MEI XML document</li>
<li><code v-pre>index</code>: Page index</li>
<li><code v-pre>url</code>: Image URL</li>
<li><code v-pre>width</code>: Image width</li>
<li><code v-pre>height</code>: Image height</li>
</ul>
</li>
</ul>
<hr>
<h2 id="example-usage" tabindex="-1"><a class="header-anchor" href="#example-usage"><span>Example Usage</span></a></h2>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> meiZone2annotorious<span class="token punctuation">,</span> annotorious2meiZone<span class="token punctuation">,</span> insertMeasure<span class="token punctuation">,</span> createNewMdiv <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@/tools/meiMappings.js'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Convert a zone to an annotation</span></span>
<span class="line"><span class="token keyword">const</span> annotation <span class="token operator">=</span> <span class="token function">meiZone2annotorious</span><span class="token punctuation">(</span>meiDoc<span class="token punctuation">,</span> zoneElem<span class="token punctuation">,</span> pageUri<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Convert an annotation to a zone</span></span>
<span class="line"><span class="token keyword">const</span> zone <span class="token operator">=</span> <span class="token function">annotorious2meiZone</span><span class="token punctuation">(</span>annotation<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Insert a new measure</span></span>
<span class="line"><span class="token function">insertMeasure</span><span class="token punctuation">(</span>meiDoc<span class="token punctuation">,</span> newMeasure<span class="token punctuation">,</span> state<span class="token punctuation">,</span> currentZone<span class="token punctuation">,</span> pageIndex<span class="token punctuation">,</span> targetMdiv<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Create a new mdiv</span></span>
<span class="line"><span class="token keyword">const</span> mdivId <span class="token operator">=</span> <span class="token function">createNewMdiv</span><span class="token punctuation">(</span>meiDoc<span class="token punctuation">)</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


