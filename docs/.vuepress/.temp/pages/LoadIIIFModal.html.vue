<template><div><h1 id="loadiiifmodal-component" tabindex="-1"><a class="header-anchor" href="#loadiiifmodal-component"><span>LoadIIIFModal Component</span></a></h1>
<p>Displays a modal dialog for importing a IIIF manifest URL.</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<p>The <code v-pre>LoadIIIFModal</code> component:</p>
<ul>
<li>Shows a modal dialog for the user to input a IIIF manifest URL.</li>
<li>Allows the user to autofill a test IIIF manifest URL.</li>
<li>On confirmation, triggers an import action and closes the modal.</li>
<li>Uses Vuex store for state management and actions.</li>
</ul>
<hr>
<h2 id="layout" tabindex="-1"><a class="header-anchor" href="#layout"><span>Layout</span></a></h2>
<ul>
<li><strong>Header</strong>: Modal title and close button.</li>
<li><strong>Body</strong>: Input field for the IIIF manifest URL, description, and a button to autofill a test URL.</li>
<li><strong>Footer</strong>: Cancel and Import buttons.</li>
</ul>
<hr>
<h2 id="props" tabindex="-1"><a class="header-anchor" href="#props"><span>Props</span></a></h2>
<p><em>None</em></p>
<hr>
<h2 id="data" tabindex="-1"><a class="header-anchor" href="#data"><span>Data</span></a></h2>
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
<td>testUri</td>
<td>String</td>
<td>Example IIIF manifest URL for autofill</td>
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
<td>useTestUri</td>
<td>Autofills the input with a test IIIF manifest URL</td>
</tr>
<tr>
<td>main</td>
<td>Triggers import action if the input is a valid URL, then closes the modal</td>
</tr>
<tr>
<td>closeModal</td>
<td>Closes the modal dialog</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2>
<div class="language-vue line-numbers-mode" data-highlighter="prismjs" data-ext="vue"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>LoadIIIFModal</span> <span class="token punctuation">/></span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></div></template>


