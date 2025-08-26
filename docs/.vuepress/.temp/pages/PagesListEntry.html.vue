<template><div><h1 id="pageslistentry-component" tabindex="-1"><a class="header-anchor" href="#pageslistentry-component"><span>PagesListEntry Component</span></a></h1>
<p>Renders a table row for a single page entry in the pages list.</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<p>The <code v-pre>PagesListEntry</code> component:</p>
<ul>
<li>Displays the page number, editable label, thumbnail image, URI, and dimensions.</li>
<li>Allows editing the page label directly in the table.</li>
<li>Clicking the thumbnail sets the current page and closes the modal.</li>
<li>Uses Vuex store for state management and actions.</li>
</ul>
<hr>
<h2 id="layout" tabindex="-1"><a class="header-anchor" href="#layout"><span>Layout</span></a></h2>
<ul>
<li><strong>Table Row</strong>:
<ul>
<li>Page number (<code v-pre>page.n</code>)</li>
<li>Editable label (<code v-pre>page.label</code>)</li>
<li>Thumbnail image (clickable)</li>
<li>Page URI</li>
<li>Page dimensions</li>
</ul>
</li>
</ul>
<hr>
<h2 id="props" tabindex="-1"><a class="header-anchor" href="#props"><span>Props</span></a></h2>
<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>page</td>
<td>Object</td>
<td>The page object to display</td>
</tr>
<tr>
<td>index</td>
<td>Number</td>
<td>The index of the page in the list</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="computed-properties" tabindex="-1"><a class="header-anchor" href="#computed-properties"><span>Computed Properties</span></a></h2>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>pageLabelValue</td>
<td>Two-way binding for the page label input</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="methods" tabindex="-1"><a class="header-anchor" href="#methods"><span>Methods</span></a></h2>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>showPage</td>
<td>Sets the current page and closes the pages modal</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2>
<div class="language-vue line-numbers-mode" data-highlighter="prismjs" data-ext="vue"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>PagesListEntry</span> <span class="token attr-name">:page</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>page<span class="token punctuation">"</span></span> <span class="token attr-name">:index</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>index<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></div></template>


