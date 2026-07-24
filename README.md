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
* **Local Images**: Import images directly from your local file system
* **IIIF**: Load images from IIIF servers for standardized access to cultural heritage materials
* **Git Repositories**: Load MEI files with associated images from Git repositories

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

## Docker Deployment

All deployment-specific configuration (subpath, imprint) is injected at
**runtime** via environment variables — the same image works for any host,
subpath, and institution.

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

### Configuring the imprint

The About dialog shows an imprint. By default this is the ZenMEM / Paderborn
University imprint. Institutions hosting their own instance can (and should)
replace it with their own details at runtime — no rebuild required:

```
docker run --rm -p 8080:80 \
  -e VUE_APP_PUBLIC_PATH=/demo \
  -e APP_IMPRINT_INSTITUTION='' \
  -e APP_IMPRINT_STREET='' \
  -e APP_IMPRINT_ZIP='' \
  -e APP_IMPRINT_CITY='' \
  -e APP_IMPRINT_COUNTRY='' \
  -e APP_IMPRINT_CONTACT_PERSON='' \
  -e APP_IMPRINT_EMAIL='' \
  -e APP_IMPRINT_PHONE='' \
  -e APP_IMPRINT_LINK='' \
  cartographer
```

All imprint variables are optional and independent: set only the ones you need
(fields left unset are simply not displayed). If **none** of them is set, the
built-in default imprint is shown. `APP_IMPRINT_LINK` can also be used on its
own to point to an institution's existing imprint page.

### Environment variables

| Variable | Description |
|---|---|
| `VUE_APP_PUBLIC_PATH` | Subpath the app is served under (e.g. `/demo`). Defaults to `/`. |
| `APP_IMPRINT_INSTITUTION` | Institution name shown in the imprint. |
| `APP_IMPRINT_STREET` | Street and number. |
| `APP_IMPRINT_ZIP` | Postal code. |
| `APP_IMPRINT_CITY` | City. |
| `APP_IMPRINT_COUNTRY` | Country. |
| `APP_IMPRINT_CONTACT_PERSON` | Contact person's name. |
| `APP_IMPRINT_EMAIL` | Contact e-mail address (rendered as a mailto link). |
| `APP_IMPRINT_PHONE` | Phone number (rendered as a tel link). |
| `APP_IMPRINT_LINK` | URL of a full imprint page (rendered as "Full imprint" link). |