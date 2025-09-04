<template><div><h1 id="contentpreviewmdiv-component" tabindex="-1"><a class="header-anchor" href="#contentpreviewmdiv-component"><span>ContentPreviewMdiv Component</span></a></h1>
<p>Displays a preview section for a single musical division (mdiv), showing its label and all associated measures.</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<p>The <code v-pre>ContentPreviewMdiv</code> component:</p>
<ul>
<li>Renders a preview for a single mdiv (musical division).</li>
<li>Displays the mdiv label as a heading.</li>
<li>Renders a <code v-pre>ContentPreviewMeasure</code> component for each measure in the mdiv.</li>
</ul>
<hr>
<h2 id="layout" tabindex="-1"><a class="header-anchor" href="#layout"><span>Layout</span></a></h2>
<ul>
<li><strong>Heading</strong>: The mdiv label is shown as a heading.</li>
<li><strong>Measures</strong>: Each measure is rendered using the <code v-pre>ContentPreviewMeasure</code> component.</li>
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
<td>mdiv</td>
<td>Object</td>
<td>The musical division object to preview</td>
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
<td>measures</td>
<td>Returns all measures belonging to the current mdiv</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="methods" tabindex="-1"><a class="header-anchor" href="#methods"><span>Methods</span></a></h2>
<p><em>None</em></p>
<hr>
<h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2>
<div class="language-vue line-numbers-mode" data-highlighter="prismjs" data-ext="vue"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ContentPreviewMdiv</span> <span class="token attr-name">:mdiv</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>mdivObject<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></div></template>


