<template><div><h1 id="content-preview-pane" tabindex="-1"><a class="header-anchor" href="#content-preview-pane"><span>Content Preview Pane</span></a></h1>
<p>Displays a pane with previews of all musical divisions (mdivs), each rendered using the <code v-pre>ContentPreviewMdiv</code> component.</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<p>The <code v-pre>ContentPreviewPane</code> component:</p>
<ul>
<li>Shows a scrollable pane on the right side of the app</li>
<li>Renders a <code v-pre>ContentPreviewMdiv</code> component for each mdiv (musical division)</li>
<li>Is only visible when the measure list is enabled (<code v-pre>showMeasureList</code> is true in the store)</li>
</ul>
<hr>
<h2 id="layout" tabindex="-1"><a class="header-anchor" href="#layout"><span>Layout</span></a></h2>
<ul>
<li><strong>Pane</strong>: Fixed width, scrollable, right-aligned</li>
<li><strong>Content</strong>: One <code v-pre>ContentPreviewMdiv</code> per mdiv</li>
</ul>
<hr>
<h2 id="props" tabindex="-1"><a class="header-anchor" href="#props"><span>Props</span></a></h2>
<p><em>None</em></p>
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
<td>mdivs</td>
<td>Returns all mdivs (musical divisions) from the store</td>
</tr>
<tr>
<td>visible</td>
<td>Determines if the pane should be visible</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="methods" tabindex="-1"><a class="header-anchor" href="#methods"><span>Methods</span></a></h2>
<p><em>None</em></p>
<hr>
<h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2>
<div class="language-vue line-numbers-mode" data-highlighter="prismjs" data-ext="vue"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ContentPreviewPane</span> <span class="token punctuation">/></span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></div></template>


