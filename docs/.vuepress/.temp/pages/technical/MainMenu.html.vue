<template><div><h1 id="mainmenu-component" tabindex="-1"><a class="header-anchor" href="#mainmenu-component"><span>MainMenu Component</span></a></h1>
<p>Displays a dropdown menu with actions for file import/export and toggling app features.</p>
<hr>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2>
<p>The <code v-pre>MainMenu</code> component provides:</p>
<ul>
<li>A dropdown menu for importing MEI files and IIIF manifests</li>
<li>Downloading the current MEI file</li>
<li>Showing the page overview modal</li>
<li>Toggling the measure list pane</li>
<li>Toggling merge mode for existing music (if available)</li>
<li>Uses Vuex store for state management and dispatching actions</li>
</ul>
<hr>
<h2 id="layout" tabindex="-1"><a class="header-anchor" href="#layout"><span>Layout</span></a></h2>
<ul>
<li><strong>Dropdown Menu</strong>: Triggered by a button with a bars icon</li>
<li><strong>Sections</strong>:
<ul>
<li><strong>Data</strong>: Upload MEI, Import IIIF Manifest, Download MEI File</li>
<li><strong>Actions</strong>: Show Page Overview, Toggle Measure List</li>
<li><strong>Options</strong>: Toggle Merge Mode (if available)</li>
</ul>
</li>
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
<td>accessToken</td>
<td>GitHub access token from the store</td>
</tr>
<tr>
<td>directories</td>
<td>GitHub directories from the store</td>
</tr>
<tr>
<td>selectedDirectory</td>
<td>Selected directory from the store</td>
</tr>
<tr>
<td>manifest</td>
<td>Current manifest from the store</td>
</tr>
<tr>
<td>xmlFilename</td>
<td>Filename for MEI file download</td>
</tr>
<tr>
<td>downloadAvailable</td>
<td>True if MEI file is available for download</td>
</tr>
<tr>
<td>isLoggedin</td>
<td>True if the user is logged in</td>
</tr>
<tr>
<td>firstMeasureWithoutZone</td>
<td>First measure without a zone (for merge mode)</td>
</tr>
<tr>
<td>existingMusicMode</td>
<td>Whether merge mode is active</td>
</tr>
<tr>
<td>getUserName</td>
<td>Current user's name from the store</td>
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
<td>importXML</td>
<td>Opens the modal to upload an MEI file</td>
</tr>
<tr>
<td>importManifest</td>
<td>Opens the modal to import a IIIF manifest</td>
</tr>
<tr>
<td>xmlDataUrl</td>
<td>Returns the data URL for downloading the MEI file</td>
</tr>
<tr>
<td>toggleMeasureList</td>
<td>Toggles the measure list pane</td>
</tr>
<tr>
<td>showPagesModal</td>
<td>Opens the page overview modal</td>
</tr>
<tr>
<td>toggleExistingMusicMode</td>
<td>Toggles merge mode for existing music (if available)</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2>
<div class="language-vue line-numbers-mode" data-highlighter="prismjs" data-ext="vue"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MainMenu</span> <span class="token punctuation">/></span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></div></template>


