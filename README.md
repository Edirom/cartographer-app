[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8B-orange)](https://fair-software.eu) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Edirom/cartographer-app)
[![FAIR checklist badge](https://fairsoftwarechecklist.net/badge.svg)](https://fairsoftwarechecklist.net/v0.2?f=31&a=32113&i=31322&r=133)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![GitHub release](https://img.shields.io/github/v/release/Edirom/cartographer-app.svg)](https://github.com/Edirom/cartographer-app/releases)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17396487.svg)](https://doi.org/10.5281/zenodo.17396487)

# Cartographer App

The Cartographer App is used to provide placement information of zones of interest
in (historical) documents. The first and foremost use case is the identification
of bounding boxes of measures in music documents. It is a successor of the
*Vertaktoid*, but other than that is built on web technologies (Vue.js) and is
thus [platform independent](#platform-independence). It optionally uses the
*Measure Detector* for automatic recognition of measure positions, but allows
manual correction of these results.

## Used by

The Cartographer App is used by historical digital edition projects,
including but not limited to:

* [VerDigital](https://verdigital-unipv.github.io/) — a model for an interactive digital critical edition of Italian 19th-century opera (University of Pavia)

## Platform Independence

The Cartographer App is platform independent in the sense that a single,
web-based codebase runs on any operating system — there are no separate,
platform-specific implementations to maintain. From this one codebase, the
app can be delivered through three channels:

* **Browser**: used directly in any modern web browser, with no installation
  required
* **Web service**: deployed as a containerized service (Docker) and hosted
  by an institution for its users
* **Native application**: packaged via the Tauri integration as an
  installable application for Windows, macOS, Linux, and Android — e.g., for
  offline use or for environments where locally installed software is
  preferred

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
* Tauri, used to package the app as a native desktop application. See https://tauri.app/

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

### Local development with GitHub authentication

1. Register a GitHub OAuth App at **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**:
   - **Homepage URL:** `http://localhost:8080`
   - **Authorization callback URL:** `http://localhost:8080/myAppPlaceholder/callback`
   - Click **Generate a new client secret** and copy it.
2. Create your local env file from the tracked example and fill in your credentials:
```sh
   cp .env .env.local
```
```ini
   GH_APP_CLIENT_ID=<your-client-id>
   GH_APP_CALL_BACK=http://localhost:8080/myAppPlaceholder/callback
   GH_APP_CLIENT_SECRET=<your-client-secret>
```
   `.env.local` is gitignored, so your secret never gets committed.
3. Install and run:
```sh
   npm install
   npm run serve
```
   The dev server proxies `/auth` to GitHub's token endpoint with the
   `client_secret` injected server-side — it stays in the Node dev-server
   process and is never bundled into the browser, mirroring what nginx does in
   production.

  
### Docker Deployment

All configuration is injected at **runtime** via environment variables — the same image works for any subpath, host, or GitHub OAuth App.

#### 1. Build the image

```sh
docker build -t cartographer-app .
```

#### 2. Start the app

nginx serves the SPA **and** performs the GitHub OAuth token exchange
server-side (it injects the `client_secret`), so no separate auth container is
needed.

```sh
docker run -d \
  --name app1 \
  -e APP_PUBLIC_PATH=/demo \
  -e GH_APP_CLIENT_ID=<your-github-client-id> \
  -e GH_APP_CLIENT_SECRET=<your-github-client-secret> \
  -e GH_APP_CALL_BACK=http://localhost:8081/myAppPlaceholder/callback \
  -p 8081:80 \
  cartographer-app
```

Then open http://localhost:8081/demo.

#### Environment variables

| Variable | Description |
|---|---|
| `APP_PUBLIC_PATH` | Subpath the app is served under (e.g. `/demo`). Defaults to `/`. |
| `GH_APP_CLIENT_ID` | GitHub OAuth App client ID (public; safe in the browser). |
| `GH_APP_CALL_BACK` | OAuth callback URL. Use `/myAppPlaceholder/callback` and it will be rewritten to the actual subpath automatically. |
| `GH_APP_CLIENT_SECRET` | GitHub OAuth App client secret. Consumed only by nginx for the token exchange — never bundled into the SPA. |

#### GitHub OAuth App setup

In **GitHub → Settings → Developer settings → OAuth Apps**, register one callback URL per deployment. Use multiple lines if needed:

```
http://localhost:8081/callback
http://localhost:8081/demo/callback
https://myapp.example.org/callback
```

### Configuring the imprint and collaborators

The About dialog shows an imprint and a row of collaborator logos. By default
these are the ZenMEM / Paderborn University imprint and the ZenMEM and
NFDI4Culture logos. Institutions hosting their own instance can (and should)
replace them with their own details at runtime — no rebuild required:

```
docker run --rm -p 8080:80 \
  -e VUE_APP_PUBLIC_PATH=/demo \
  -e APP_IMPRINT_INSTITUTION='Some University, Institute for Music' \
  -e APP_IMPRINT_STREET='Musikweg 1' \
  -e APP_IMPRINT_ZIP='12345' \
  -e APP_IMPRINT_CITY='Musikstadt' \
  -e APP_IMPRINT_COUNTRY='Germany' \
  -e APP_IMPRINT_CONTACT_PERSON='Jane Doe' \
  -e APP_IMPRINT_EMAIL='info@example.org' \
  -e APP_IMPRINT_PHONE='+49 123 456789' \
  -e APP_IMPRINT_LINK='https://example.org/imprint' \
  -e APP_COLLABORATORS='[{"name":"Some University","logo":"https://example.org/logo.png","url":"https://example.org"},{"name":"ZenMEM","logo":"/demo/logos/zenmem_logo_de_einfarbig_ultrablau.png","url":"https://zenmem.de"}]' \
  cartographer
```

All imprint variables are optional and independent: set only the ones you need
(fields left unset are simply not displayed). If **none** of them is set, the
built-in default imprint is shown. `APP_IMPRINT_LINK` can also be used on its
own to point to an institution's existing imprint page.

`APP_COLLABORATORS` is a JSON array of objects with `name`, `logo`, and `url`.
Logo values must be URLs the browser can resolve: an absolute URL (e.g. hosted
on the institution's own website), or a path served by this container
**including the configured subpath** — e.g.
`/demo/logos/zenmem_logo_de_einfarbig_ultrablau.png` when running with
`VUE_APP_PUBLIC_PATH=/demo`, or `/logos/...` when running at the root path.
The built-in logos are available under `<subpath>/logos/` with their original
filenames. If `APP_COLLABORATORS` is not set, the default logos are shown; if
it is set but not valid JSON, a warning is logged in the browser console and
the default logos are shown.

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
| `APP_COLLABORATORS` | Collaborator logos as a JSON array of `{"name", "logo", "url"}` objects. Defaults to the ZenMEM and NFDI4Culture logos. |