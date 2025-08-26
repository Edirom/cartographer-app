<template><div><h1 id="imageselection-modal" tabindex="-1"><a class="header-anchor" href="#imageselection-modal"><span>ImageSelection Modal</span></a></h1>
<p>Displays a modal dialog for selecting or entering an image manifest URL.</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<p>The <code v-pre>ImageSelectionModal</code> component:</p>
<ul>
<li>Shows a modal dialog (currently a placeholder) for the user to input or select a manifest URL.</li>
<li>Uses the Vuex store to control modal visibility and manage the manifest URL.</li>
<li>On confirmation, triggers actions to load the manifest.</li>
</ul>
<hr>
<h2 id="layout" tabindex="-1"><a class="header-anchor" href="#layout"><span>Layout</span></a></h2>
<ul>
<li><strong>Modal</strong>: (Currently a placeholder <code v-pre>&lt;div v-if=&quot;visible&quot;&gt;Hello&lt;/div&gt;</code>)</li>
<li><strong>(Commented)</strong>: Modal with header, body, input for URL, and confirmation button.</li>
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
<td>visible</td>
<td>Modal visibility, synced with Vuex store</td>
</tr>
<tr>
<td>url</td>
<td>Manifest URL, synced with Vuex store</td>
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
<td>openManifest</td>
<td>Hides the modal and dispatches actions to load the manifest</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2>
<div class="language-vue line-numbers-mode" data-highlighter="prismjs" data-ext="vue"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ImageSelectionModal</span> <span class="token punctuation">/></span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></div></template>


