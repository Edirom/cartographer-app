[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8B-orange)](https://fair-software.eu) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Edirom/cartographer-app)
[![FAIR checklist badge](https://fairsoftwarechecklist.net/badge.svg)](https://fairsoftwarechecklist.net/v0.2?f=31&a=32113&i=31322&r=133)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![GitHub release](https://img.shields.io/github/v/release/Edirom/cartographer-app.svg)](https://github.com/Edirom/cartographer-app/releases)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17396487.svg)](https://doi.org/10.5281/zenodo.17396487)

# Cartographer App

The Cartographer App is used to provide placement information of zones of interest
in (historical) documents. The first and foremost use case is the identification
of bounding boxes of measures in music documents. It is a successor of the
*Vertaktoid*, but other than that uses web technology and is thus platform
independent. It optionally uses the *Measure Detector* for automatic recognition
of measure positions, but allows manual correction of these results.

## Features

### Image Import
The Cartographer App supports importing images from multiple sources:
* **Local Images**: Import images directly from your local file system. TIFF files
  are supported, including TIFFs that store their pixel data as an embedded JPEG
  (the app reconstructs a complete JPEG by injecting the missing DQT/DHT tables
  from the `JPEGTables` tag).
* **IIIF**: Load images from IIIF servers for standardized access to cultural
  heritage materials.
* **Git Repositories**: Load MEI files with associated images from Git
  repositories (GitHub OAuth login).
* **MEI Files**: Upload an existing MEI file and download the edited result at any
  time.

A loading spinner is shown while images are being processed, and an image
mismatch warning is raised when the images referenced by a loaded MEI file do not
match the images that are actually available.

### Measure Annotation
* **Automatic Measure Detection**: Optionally run the *Measure Detector* to
  automatically place measure zones on the current page, then correct the results
  manually.
* **Manual Editing Modes**: Draw, select, delete and add additional zones to
  measures. See [Editing modes and keyboard shortcuts](#editing-modes-and-keyboard-shortcuts).
* **Undo / Redo**: Every change to the document can be undone and redone (up to 50
  history states) via the sidebar buttons.
* **Page and Measure Overviews**: Toggleable panels list the pages and measures of
  the current document for quick navigation.

## Editing modes and keyboard shortcuts

Editing modes can be activated from the sidebar or with keyboard shortcuts.
Shortcuts are ignored while typing in an input field.

| Key | Action |
| --- | --- |
| `s` | Selection mode – select an existing measure |
| `d` | Draw mode – draw a new measure zone |
| `a` | Additional-zone mode – add another zone to the last measure |
| `x` | Deletion mode – delete a measure |
| `m` | Toggle the measure list |
| `p` | Toggle the pages overview |

## Documentation

Comprehensive user and developer documentation for the Cartographer App is
available at: https://cartographer-app.zenmem.de/docs/

### Important Tools and their Documentation

* Vectre, which is a VueJS version of Spectre CSS. See https://vectrejs.github.io/docs/#/pages/getting-started
* OpenSeadragon. See http://openseadragon.github.io/
* Annotorious OpenSeadragon Plugin. See https://recogito.github.io/annotorious/getting-started/osd-plugin/

## Prerequisites

**Node.js v20.0.0 or higher is required.** This project uses dependencies that mandate Node v20+. Using an older version of Node will result in installation errors.

## Project setup

### Clone the Repository
```bash
git clone https://github.com/Edirom/cartographer-app.git
cd cartographer-app
```

### Install Dependencies
```bash
npm install
```

If you encounter peer dependency errors, use:
```bash
npm install --legacy-peer-deps
```

For a complete fresh install, try:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Other approach to linting which automatically fixes code and gives a nicer rendition of errors using snazzy
```
npm run test:lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Build your image 
Replace **`cartographer`** with your preferred image name.
```
docker build -t cartographer .

```

### Run 

Replace **demo** with your desired subpath.

Replace **cartographer** with the image name you used when building.
```
docker run --rm -p 8080:80 -e VUE_APP_PUBLIC_PATH=/demo cartographer
```

