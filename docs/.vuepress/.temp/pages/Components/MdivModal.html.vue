<template><div><h1 id="mdivmodal-component" tabindex="-1"><a class="header-anchor" href="#mdivmodal-component"><span>MdivModal Component</span></a></h1>
<p>Displays a modal dialog for viewing and editing the current mdiv (musical division).</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<p>The <code v-pre>MdivModal</code> component:</p>
<ul>
<li>Shows a modal dialog with the current mdiv's index and ID.</li>
<li>Allows editing the mdiv label via a text input.</li>
<li>Modal can be closed with the Close button or overlay.</li>
<li>Uses Vuex store for state management and actions.</li>
</ul>
<hr>
<h2 id="layout" tabindex="-1"><a class="header-anchor" href="#layout"><span>Layout</span></a></h2>
<ul>
<li><strong>Header</strong>: Modal title with movement index and close button.</li>
<li><strong>Body</strong>: Shows mdiv ID and editable label input.</li>
<li><strong>Footer</strong>: Close button.</li>
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
<td>currentMdiv</td>
<td>Returns the current mdiv object from the store</td>
</tr>
<tr>
<td>mdivLabel</td>
<td>Two-way binding for the mdiv label</td>
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
<td>closeModal</td>
<td>Closes the modal dialog</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2>
<div class="language-vue line-numbers-mode" data-highlighter="prismjs" data-ext="vue"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MdivModal</span> <span class="token punctuation">/></span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></div></template>


