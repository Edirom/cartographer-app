<template><div><h1 id="vuex-store-src-store-index-js" tabindex="-1"><a class="header-anchor" href="#vuex-store-src-store-index-js"><span>Vuex Store (<code v-pre>src/store/index.js</code>)</span></a></h1>
<p>Centralized state management for the <strong>Cartographer App</strong>.<br>
This store wires together MEI editing, IIIF ingestion, page/zone management, and UI state.</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<ul>
<li><strong>Framework:</strong> Vuex (<code v-pre>createStore</code>)</li>
<li><strong>External helpers:</strong>
<ul>
<li>From <code v-pre>@/tools/iiif.js</code>: <code v-pre>iiifManifest2mei</code>, <code v-pre>checkIiifManifest</code>, <code v-pre>getPageArray</code></li>
<li>From <code v-pre>@/tools/meiMappings.js</code>:<br>
<code v-pre>meiZone2annotorious</code>, <code v-pre>annotorious2meiZone</code>, <code v-pre>measureDetector2meiZone</code>,<br>
<code v-pre>generateMeasure</code>, <code v-pre>insertMeasure</code>, <code v-pre>addZoneToLastMeasure</code>, <code v-pre>deleteZone</code>,<br>
<code v-pre>setMultiRest</code>, <code v-pre>createNewMdiv</code>, <code v-pre>moveContentToMdiv</code>, <code v-pre>toggleAdditionalZone</code>,<br>
<code v-pre>addImportedPage</code></li>
<li>From <code v-pre>@/store/constants.js</code>: <code v-pre>mode as allowedModes</code></li>
</ul>
</li>
<li><strong>Parsers:</strong> <code v-pre>DOMParser</code> (for XML → DOM), <code v-pre>XMLSerializer</code> (DOM → string)</li>
</ul>
<hr>
<h2 id="state" tabindex="-1"><a class="header-anchor" href="#state"><span>State</span></a></h2>
<table>
<thead>
<tr>
<th>Key</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>allmdivs</code></td>
<td><code v-pre>Array</code></td>
<td>Collected mdiv references (e.g., for overview lists).</td>
</tr>
<tr>
<td><code v-pre>xmlDoc</code></td>
<td><code v-pre>Document | null</code></td>
<td>Loaded MEI XML document (DOM).</td>
</tr>
<tr>
<td><code v-pre>pages</code></td>
<td><code v-pre>Array&lt;{ uri, width, height, n?, label? }&gt;</code></td>
<td>Pages derived from MEI or IIIF.</td>
</tr>
<tr>
<td><code v-pre>currentPage</code></td>
<td><code v-pre>number</code></td>
<td>Zero-based index of the selected page (<code v-pre>-1</code> when unset).</td>
</tr>
<tr>
<td><code v-pre>showLoadXMLModal</code></td>
<td><code v-pre>boolean</code></td>
<td>Toggle XML import modal.</td>
</tr>
<tr>
<td><code v-pre>showLoadIIIFModal</code></td>
<td><code v-pre>boolean</code></td>
<td>Toggle IIIF import modal.</td>
</tr>
<tr>
<td><code v-pre>showLoadGitModal</code></td>
<td><code v-pre>boolean</code></td>
<td>Toggle Git import modal.</td>
</tr>
<tr>
<td><code v-pre>showMeasureModal</code></td>
<td><code v-pre>boolean</code></td>
<td>Toggle measure label/number modal.</td>
</tr>
<tr>
<td><code v-pre>showMdivModal</code></td>
<td><code v-pre>boolean</code></td>
<td>Toggle movement (mdiv) modal.</td>
</tr>
<tr>
<td><code v-pre>showPagesModal</code></td>
<td><code v-pre>boolean</code></td>
<td>Toggle pages management modal.</td>
</tr>
<tr>
<td><code v-pre>showPageImportModal</code></td>
<td><code v-pre>boolean</code></td>
<td>Toggle page import modal.</td>
</tr>
<tr>
<td><code v-pre>showMeasureList</code></td>
<td><code v-pre>boolean</code></td>
<td>Toggle measure list side panel.</td>
</tr>
<tr>
<td><code v-pre>loading</code></td>
<td><code v-pre>boolean</code></td>
<td>Global loading flag (network/IO).</td>
</tr>
<tr>
<td><code v-pre>processing</code></td>
<td><code v-pre>boolean</code></td>
<td>Background processing flag (transforms).</td>
</tr>
<tr>
<td><code v-pre>pageDimension</code></td>
<td><code v-pre>Array&lt;[width, height]&gt;</code></td>
<td>Dimensions collected from IIIF <code v-pre>info.json</code>.</td>
</tr>
<tr>
<td><code v-pre>mode</code></td>
<td><code v-pre>allowedModes[key]</code></td>
<td>Current editor mode (<code v-pre>selection</code>, <code v-pre>manualRect</code>, <code v-pre>additionalZone</code>, <code v-pre>deletion</code>, …).</td>
</tr>
<tr>
<td><code v-pre>existingMusicMode</code></td>
<td><code v-pre>boolean</code></td>
<td>If true, work against existing measures instead of creating new ones.</td>
</tr>
<tr>
<td><code v-pre>selectedZoneId</code></td>
<td><code v-pre>string | null</code></td>
<td>Currently selected zone <code v-pre>xml:id</code>.</td>
</tr>
<tr>
<td><code v-pre>hoveredZoneId</code></td>
<td><code v-pre>string | null</code></td>
<td>Currently hovered zone <code v-pre>xml:id</code>.</td>
</tr>
<tr>
<td><code v-pre>currentMdivId</code></td>
<td><code v-pre>string | null</code></td>
<td>Selected mdiv <code v-pre>xml:id</code>.</td>
</tr>
<tr>
<td><code v-pre>totalZones</code></td>
<td><code v-pre>number</code></td>
<td>Running total of zones in the document.</td>
</tr>
<tr>
<td><code v-pre>resultingArray</code></td>
<td><code v-pre>Array</code></td>
<td>Scratch area for miscellaneous results.</td>
</tr>
<tr>
<td><code v-pre>deleteZoneId</code></td>
<td><code v-pre>string | null</code></td>
<td>Zone to delete (used by deletion flow).</td>
</tr>
<tr>
<td><code v-pre>anno</code></td>
<td><code v-pre>Object | null</code></td>
<td>Last Annotorious annotation payload.</td>
</tr>
<tr>
<td><code v-pre>canvases</code></td>
<td><code v-pre>Array</code></td>
<td>IIIF canvases (if needed by UI).</td>
</tr>
<tr>
<td><code v-pre>importingImages</code></td>
<td><code v-pre>Array&lt;{index,url,width?,height?,status}&gt;</code></td>
<td>Pending IIIF pages for import.</td>
</tr>
<tr>
<td><code v-pre>currentMeasureId</code></td>
<td><code v-pre>string | null</code></td>
<td>Selected measure <code v-pre>xml:id</code>.</td>
</tr>
<tr>
<td><code v-pre>infoJson</code></td>
<td><code v-pre>Array&lt;string&gt;</code></td>
<td>Collected IIIF <code v-pre>info.json</code> service IDs.</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="mutations" tabindex="-1"><a class="header-anchor" href="#mutations"><span>Mutations</span></a></h2>
<blockquote>
<p>Mutations are <strong>synchronous</strong> state updates. Below are the key ones grouped by domain.</p>
</blockquote>
<h3 id="ui-modals" tabindex="-1"><a class="header-anchor" href="#ui-modals"><span>UI / Modals</span></a></h3>
<ul>
<li><code v-pre>TOGGLE_LOADXML_MODAL</code>, <code v-pre>TOGGLE_LOADIIIF_MODAL</code>, <code v-pre>TOGGLE_LOADGIT_MODAL</code></li>
<li><code v-pre>TOGGLE_MEASURE_MODAL</code>, <code v-pre>TOGGLE_MDIV_MODAL</code></li>
<li><code v-pre>TOGGLE_PAGES_MODAL</code>, <code v-pre>TOGGLE_PAGE_IMPORT_MODAL</code></li>
<li><code v-pre>HIDE_MODALS</code> — closes measure &amp; mdiv modals.</li>
<li><code v-pre>TOGGLE_MEASURE_LIST</code> — show/hide the measure list panel.</li>
<li><code v-pre>SET_LOADING(bool)</code>, <code v-pre>SET_PROCESSING(bool)</code></li>
</ul>
<h3 id="core-mei-pages" tabindex="-1"><a class="header-anchor" href="#core-mei-pages"><span>Core MEI &amp; Pages</span></a></h3>
<ul>
<li><code v-pre>SET_XML_DOC(xmlDoc)</code> — sets MEI DOM and resets <code v-pre>currentPage</code> to <code v-pre>0</code>.</li>
<li><code v-pre>SET_PAGES(pageArray)</code> — replaces <code v-pre>pages</code> with computed array.</li>
<li><code v-pre>SET_CURRENT_PAGE(i)</code> — bounds-checked page selection.</li>
<li><code v-pre>SET_TOTAL_ZONES_COUNT(j)</code> — increments <code v-pre>totalZones</code> by <code v-pre>j</code>.</li>
</ul>
<h3 id="zones-measures" tabindex="-1"><a class="header-anchor" href="#zones-measures"><span>Zones &amp; Measures</span></a></h3>
<ul>
<li><code v-pre>SET_ANNO(anno)</code> — cache last annotation payload.</li>
<li><code v-pre>SELECT_ZONE(id)</code>, <code v-pre>HOVER_ZONE(id)</code></li>
<li><code v-pre>CREATE_ZONE_FROM_ANNOTORIOUS(annot)</code><br>
Builds an MEI <code v-pre>&lt;zone&gt;</code> from an Annotorious annotation and:
<ul>
<li><strong>existingMusicMode = false</strong>
<ul>
<li><code v-pre>mode === manualRect</code> → creates a <strong>new</strong> <code v-pre>&lt;measure&gt;</code> and links zone via <code v-pre>facs</code>.</li>
<li><code v-pre>mode === additionalZone</code> (no selected zone) → appends zone to the <strong>last existing</strong> measure via <code v-pre>addZoneToLastMeasure</code>.</li>
</ul>
</li>
<li><strong>existingMusicMode = true</strong>
<ul>
<li><code v-pre>manualRect</code> → links zone to the <strong>first measure without</strong> a <code v-pre>facs</code>.</li>
<li><code v-pre>additionalZone</code> → appends zone to the <strong>last measure with</strong> a <code v-pre>facs</code>.</li>
</ul>
</li>
</ul>
</li>
<li><code v-pre>CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE({ rects, pageIndex })</code><br>
Converts detector rectangles → zones; either creates measures (non-existing mode) or assigns to first measure without facs (existing mode).</li>
<li><code v-pre>UPDATE_ZONE_FROM_ANNOTORIOUS(annot)</code> — updates coordinates of an existing zone.</li>
<li><code v-pre>SET_MODE(mode)</code> — only accepts values present in <code v-pre>allowedModes</code>.</li>
</ul>
<h3 id="measures-mdivs" tabindex="-1"><a class="header-anchor" href="#measures-mdivs"><span>Measures &amp; Mdivs</span></a></h3>
<ul>
<li><code v-pre>SET_CURRENT_MEASURE_ID(id)</code> — resolves id by direct match or by <code v-pre>facs ~=&quot;#zoneId&quot;</code>.</li>
<li><code v-pre>SET_CURRENT_MEASURE_LABEL(val)</code> — set/remove <code v-pre>@label</code> on the selected measure.</li>
<li><code v-pre>SET_CURRENT_MEASURE_MULTI_REST(val)</code> — uses <code v-pre>setMultiRest</code> helper on selected measure.</li>
<li><code v-pre>SET_PAGE_LABEL({ index, val })</code> — sets <code v-pre>@label</code> on <code v-pre>&lt;surface&gt;</code> (page).</li>
<li><code v-pre>SET_CURRENT_MDIV_LABEL(val)</code> — set <code v-pre>@label</code> on current mdiv.</li>
<li><code v-pre>CREATE_NEW_MDIV</code> — creates an <code v-pre>&lt;mdiv&gt;</code> and moves content via <code v-pre>moveContentToMdiv</code>.</li>
<li><code v-pre>SELECT_MDIV(id)</code>, <code v-pre>SET_CURRENT_MDIV(id)</code></li>
</ul>
<h3 id="image-import-iiif-pages" tabindex="-1"><a class="header-anchor" href="#image-import-iiif-pages"><span>Image Import (IIIF pages)</span></a></h3>
<ul>
<li><code v-pre>REGISTER_IMAGE_IMPORT({ url, index })</code> — queue a page for import.</li>
<li><code v-pre>RECEIVE_IMAGE_IMPORT({ url, index, json })</code> — store width/height from <code v-pre>info.json</code>.</li>
<li><code v-pre>FAILED_IMAGE_IMPORT({ url, index })</code> — mark failed.</li>
<li><code v-pre>ACCEPT_IMAGE_IMPORTS</code> — calls <code v-pre>addImportedPage</code> for successes, recomputes <code v-pre>pages</code> via <code v-pre>getPageArray</code>, clears queue, closes import modal.</li>
<li><code v-pre>CANCEL_IMAGE_IMPORTS</code> — clears queue and closes modal.</li>
</ul>
<hr>
<h2 id="actions" tabindex="-1"><a class="header-anchor" href="#actions"><span>Actions</span></a></h2>
<blockquote>
<p>Actions can be async and may dispatch multiple mutations.</p>
</blockquote>
<h3 id="ui-toggles" tabindex="-1"><a class="header-anchor" href="#ui-toggles"><span>UI Toggles</span></a></h3>
<p><code v-pre>toggleLoadXMLModal</code>, <code v-pre>toggleLoadIIIFModal</code>, <code v-pre>toggleLoadGitModal</code>,<br>
<code v-pre>toggleMeasureModal</code>, <code v-pre>toggleMdivModal</code>, <code v-pre>togglePagesModal</code>, <code v-pre>togglePageImportModal</code>,<br>
<code v-pre>toggleMeasureList</code></p>
<h3 id="navigation-counters" tabindex="-1"><a class="header-anchor" href="#navigation-counters"><span>Navigation &amp; Counters</span></a></h3>
<ul>
<li><code v-pre>setCurrentPage(i)</code> — selects page.</li>
<li><code v-pre>setAllMdivs(i)</code> — push to <code v-pre>allmdivs</code>.</li>
<li><code v-pre>setCurrentPageZone(j)</code> — increment total zones.</li>
</ul>
<h3 id="iiif-import" tabindex="-1"><a class="header-anchor" href="#iiif-import"><span>IIIF Import</span></a></h3>
<blockquote>
<p><strong>Note:</strong> <code v-pre>importIIIF</code> is defined <strong>twice</strong> in code. The <strong>second</strong> (concurrent) version overrides the first (sequential). The concurrent one is what actually runs.</p>
</blockquote>
<ul>
<li><code v-pre>importIIIF(url)</code> (concurrent)
<ol>
<li><code v-pre>SET_LOADING(true)</code>, fetch manifest.</li>
<li>Validate with <code v-pre>checkIiifManifest(json)</code>.</li>
<li>Map canvases → <code v-pre>info.json</code> URLs; fetch <strong>concurrently</strong> via <code v-pre>Promise.allSettled</code>.</li>
<li>Store <code v-pre>infoJson[]</code> and <code v-pre>pageDimension[]</code>.</li>
<li>Convert to MEI via <code v-pre>iiifManifest2mei(json, url, parser, state)</code>.</li>
<li><code v-pre>dispatch('setData', mei)</code>; finally <code v-pre>SET_PROCESSING(false)</code>.</li>
</ol>
</li>
</ul>
<h3 id="xml-import" tabindex="-1"><a class="header-anchor" href="#xml-import"><span>XML Import</span></a></h3>
<ul>
<li><code v-pre>importXML(meiUrl)</code> — fetches XML, parses with <code v-pre>DOMParser</code>, then <code v-pre>dispatch('setData', meiDOM)</code>.</li>
</ul>
<h3 id="auto-detection-of-measures-external-service" tabindex="-1"><a class="header-anchor" href="#auto-detection-of-measures-external-service"><span>Auto-Detection of Measures (External Service)</span></a></h3>
<ul>
<li>
<p><code v-pre>autoDetectZonesOnCurrentPage()</code></p>
<ul>
<li>Builds a full image URL (IIIF), fetches blob, POSTs to <code v-pre>https://measure-detector.edirom.de/upload</code>.</li>
<li>On success, calls <code v-pre>CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE</code> with returned rectangles.</li>
</ul>
</li>
<li>
<p><code v-pre>autoDetectZonesOnAllPage()</code></p>
<ul>
<li>Iterates pages, uploads each image, appends zones/measures as above.</li>
</ul>
</li>
</ul>
<h3 id="data-setup" tabindex="-1"><a class="header-anchor" href="#data-setup"><span>Data Setup</span></a></h3>
<ul>
<li><code v-pre>setData(meiDOM)</code>
<ul>
<li>Recompute pages via <code v-pre>getPageArray(meiDOM)</code>.</li>
<li><code v-pre>SET_PAGES</code>, <code v-pre>SET_XML_DOC</code>, <code v-pre>SET_CURRENT_PAGE(0)</code>, <code v-pre>SET_PROCESSING(false)</code>, <code v-pre>HIDE_MODALS</code>.</li>
</ul>
</li>
</ul>
<h3 id="zone-measure-interaction" tabindex="-1"><a class="header-anchor" href="#zone-measure-interaction"><span>Zone &amp; Measure Interaction</span></a></h3>
<ul>
<li><code v-pre>selectZone(id)</code> — sets selection.</li>
<li><code v-pre>clickZone(id)</code> — if <code v-pre>mode === deletion</code>, removes zone via <code v-pre>deleteZone</code>; if <code v-pre>mode === additionalZone</code>, toggles with <code v-pre>toggleAdditionalZone</code>.</li>
<li><code v-pre>clickMeasureLabel(id)</code> — select measure and open modal; <code v-pre>closeMeasureNumberModal()</code> reverses.</li>
<li><code v-pre>hoverZone(id)</code>, <code v-pre>unhoverZone(id)</code> — manage hover state.</li>
<li><code v-pre>createZone(annot)</code> — store annot and call <code v-pre>CREATE_ZONE_FROM_ANNOTORIOUS</code>.</li>
<li><code v-pre>deleteZone(id)</code> — (calls a mutation named <code v-pre>DELETE_ZONE</code> which is <strong>not present</strong>; deletion currently handled inside <code v-pre>clickZone</code> path.)</li>
<li><code v-pre>updateZone(annot)</code> — proxy to update mutation.</li>
</ul>
<h3 id="modes-labels-mdivs" tabindex="-1"><a class="header-anchor" href="#modes-labels-mdivs"><span>Modes, Labels, Mdivs</span></a></h3>
<ul>
<li><code v-pre>setMode(mode)</code>, <code v-pre>toggleExistingMusicMode()</code></li>
<li><code v-pre>setCurrentMeasureLabel(val)</code>, <code v-pre>setCurrentMeasureMultiRest(val)</code></li>
<li><code v-pre>setPageLabel({ index, val })</code></li>
<li><code v-pre>setCurrentMdiv(id)</code>, <code v-pre>setCurrentMdivLabel(val)</code></li>
<li><code v-pre>createNewMdiv()</code>, <code v-pre>selectMdiv(id)</code></li>
</ul>
<h3 id="image-import-workflow" tabindex="-1"><a class="header-anchor" href="#image-import-workflow"><span>Image Import Workflow</span></a></h3>
<ul>
<li><code v-pre>registerImageImports(urlsString)</code> — space-separated <code v-pre>info.json</code> URLs; queues, fetches, and stores dimensions.</li>
<li><code v-pre>acceptImageImports()</code> — add all success pages to MEI and refresh <code v-pre>pages</code>.</li>
<li><code v-pre>cancelImageImports()</code> — clear queue.</li>
</ul>
<hr>
<h2 id="getters" tabindex="-1"><a class="header-anchor" href="#getters"><span>Getters</span></a></h2>
<table>
<thead>
<tr>
<th>Getter</th>
<th>Returns</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>isReady</code></td>
<td><code v-pre>true</code> iff <code v-pre>xmlDoc</code> is loaded.</td>
</tr>
<tr>
<td><code v-pre>totalZones</code></td>
<td><code v-pre>number</code> total zones.</td>
</tr>
<tr>
<td><code v-pre>meiFileForDownload</code></td>
<td>Serialized MEI XML string or <code v-pre>null</code>.</td>
</tr>
<tr>
<td><code v-pre>currentPageIndexOneBased</code></td>
<td><code v-pre>currentPage + 1</code>.</td>
</tr>
<tr>
<td><code v-pre>currentPageIndexZeroBased</code></td>
<td><code v-pre>currentPage</code>.</td>
</tr>
<tr>
<td><code v-pre>maxPageNumber</code></td>
<td><code v-pre>pages.length</code>.</td>
</tr>
<tr>
<td><code v-pre>pages</code></td>
<td>Array of <code v-pre>{ tileSource, width, x:0, y:0 }</code> for OpenSeadragon.</td>
</tr>
<tr>
<td><code v-pre>pagesDetailed</code></td>
<td>Array of <code v-pre>{ tileSource, dim: 'WxH', n, label }</code>.</td>
</tr>
<tr>
<td><code v-pre>currentPageObject</code></td>
<td><code v-pre>pages[currentPage]</code>.</td>
</tr>
<tr>
<td><code v-pre>zonesOnCurrentPage</code></td>
<td>All zone annotations (except the selected one) converted via <code v-pre>meiZone2annotorious</code>.</td>
</tr>
<tr>
<td><code v-pre>measures</code></td>
<td>Array of all <code v-pre>&lt;measure&gt;</code> elements (DOM nodes).</td>
</tr>
<tr>
<td><code v-pre>mdivs</code></td>
<td><code v-pre>{ id, label, index }[]</code> for all <code v-pre>&lt;mdiv&gt;</code>.</td>
</tr>
<tr>
<td><code v-pre>measuresByMdivId(id)</code></td>
<td>Measures with <code v-pre>{ id, n, label, multiRest, zones[], index }</code>.</td>
</tr>
<tr>
<td><code v-pre>currentMdiv</code></td>
<td><code v-pre>{ id, label, index } | null</code> for <code v-pre>currentMdivId</code>.</td>
</tr>
<tr>
<td><code v-pre>currentMeasure</code></td>
<td><code v-pre>{ id, n, label, multiRest, mdiv } | null</code> for <code v-pre>currentMeasureId</code>.</td>
</tr>
<tr>
<td><code v-pre>mode</code></td>
<td>Current editor mode value.</td>
</tr>
<tr>
<td><code v-pre>selectedZone</code></td>
<td>Selected zone as an annotation object (via <code v-pre>meiZone2annotorious</code>).</td>
</tr>
<tr>
<td><code v-pre>showLoadIIIFModal</code> … <code v-pre>showMeasureList</code></td>
<td>Booleans for UI.</td>
</tr>
<tr>
<td><code v-pre>importingImages</code></td>
<td>Pending import items.</td>
</tr>
<tr>
<td><code v-pre>readyForImageImport</code></td>
<td><code v-pre>true</code> if all importing items have <code v-pre>status === 'success'</code> and the queue is non-empty.</td>
</tr>
<tr>
<td><code v-pre>existingMusicMode</code></td>
<td>Boolean flag.</td>
</tr>
<tr>
<td><code v-pre>firstMeasureWithoutZone</code></td>
<td><code v-pre>xml:id</code> of first <code v-pre>&lt;measure&gt;</code> without <code v-pre>@facs</code>, or <code v-pre>null</code>.</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="data-shapes" tabindex="-1"><a class="header-anchor" href="#data-shapes"><span>Data Shapes</span></a></h2>
<h3 id="page-internal" tabindex="-1"><a class="header-anchor" href="#page-internal"><span>Page (internal)</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code><span class="line"><span class="token keyword">type</span> <span class="token class-name">Page</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  uri<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>       <span class="token comment">// IIIF info.json URL</span></span>
<span class="line">  width<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span></span>
<span class="line">  height<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span></span>
<span class="line">  n<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">number</span><span class="token punctuation">;</span></span>
<span class="line">  label<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="importing-image" tabindex="-1"><a class="header-anchor" href="#importing-image"><span>Importing Image</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code><span class="line"><span class="token keyword">type</span> <span class="token class-name">ImportingImage</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  index<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span></span>
<span class="line">  url<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>       <span class="token comment">// info.json</span></span>
<span class="line">  width<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">  height<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">  status<span class="token operator">:</span> <span class="token string">'loading'</span> <span class="token operator">|</span> <span class="token string">'success'</span> <span class="token operator">|</span> <span class="token string">'failed'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="example-usage" tabindex="-1"><a class="header-anchor" href="#example-usage"><span>Example Usage</span></a></h2>
<h3 id="in-a-vue-component-composition-or-options-api" tabindex="-1"><a class="header-anchor" href="#in-a-vue-component-composition-or-options-api"><span>In a Vue component (composition or options API)</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token literal-property property">computed</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function">pages</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span>getters<span class="token punctuation">.</span>pages <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token function">currentPage</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span>state<span class="token punctuation">.</span>currentPage <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token function">isReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span>getters<span class="token punctuation">.</span>isReady <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token function">currentMeasure</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span>getters<span class="token punctuation">.</span>currentMeasure <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function">openIiif</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'toggleLoadIIIFModal'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token function">goTo</span><span class="token punctuation">(</span><span class="token parameter">pageIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'setCurrentPage'</span><span class="token punctuation">,</span> pageIndex<span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token function">setLabel</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'setCurrentMeasureLabel'</span><span class="token punctuation">,</span> val<span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="trigger-iiif-import" tabindex="-1"><a class="header-anchor" href="#trigger-iiif-import"><span>Trigger IIIF import</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'importIIIF'</span><span class="token punctuation">,</span> <span class="token string">'https://server/iiif/manifest.json'</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="create-an-extra-zone-on-the-last-measure" tabindex="-1"><a class="header-anchor" href="#create-an-extra-zone-on-the-last-measure"><span>Create an extra zone on the last measure</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'setMode'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span>state<span class="token punctuation">.</span>allowedModes<span class="token punctuation">.</span>additionalZone<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">this</span><span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'createZone'</span><span class="token punctuation">,</span> annotFromAnnotorious<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="typical-flows" tabindex="-1"><a class="header-anchor" href="#typical-flows"><span>Typical Flows</span></a></h2>
<h3 id="import-iiif-→-build-mei-→-show-pages" tabindex="-1"><a class="header-anchor" href="#import-iiif-→-build-mei-→-show-pages"><span>Import IIIF → Build MEI → Show Pages</span></a></h3>
<ol>
<li><code v-pre>dispatch('importIIIF', manifestUrl)</code></li>
<li>Fetch manifest → validate → fetch all <code v-pre>info.json</code> → compute dimensions</li>
<li>Convert to MEI (<code v-pre>iiifManifest2mei</code>) → <code v-pre>dispatch('setData', meiDOM)</code></li>
<li>UI now shows pages; <code v-pre>currentPage</code> set to 0.</li>
</ol>
<hr>
<h3 id="draw-a-rectangle-→-create-zone-measure" tabindex="-1"><a class="header-anchor" href="#draw-a-rectangle-→-create-zone-measure"><span>Draw a Rectangle → Create Zone (+ Measure)</span></a></h3>
<ol>
<li>
<p>Set mode to manual rectangle:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'setMode'</span><span class="token punctuation">,</span> allowedModes<span class="token punctuation">.</span>manualRect<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>User draws rectangle (Annotorious):</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'createZone'</span><span class="token punctuation">,</span> annot<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Store creates MEI <code v-pre>&lt;zone&gt;</code>, and either:</p>
<ul>
<li>Creates a new <code v-pre>&lt;measure&gt;</code> linked by <code v-pre>@facs</code> (standard), or</li>
<li>Assigns to an existing measure (<strong>existingMusicMode</strong>).</li>
</ul>
</li>
</ol>
<h3 id="auto-detect-measures-on-current-page" tabindex="-1"><a class="header-anchor" href="#auto-detect-measures-on-current-page"><span>Auto-detect Measures on Current Page</span></a></h3>
<ol>
<li>
<p>Run detection:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token string">'autoDetectZonesOnCurrentPage'</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Upload image to detector → receive rectangles</p>
</li>
<li>
<p><code v-pre>CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE</code> adds zones and measures</p>
</li>
</ol>
</div></template>


