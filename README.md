[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8B-orange)](https://fair-software.eu) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Edirom/cartographer-app)
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
   VUE_APP_CLIENT_ID=<your-client-id>
   VUE_APP_CALL_BACK=http://localhost:8080/myAppPlaceholder/callback
   CLIENT_SECRET=<your-client-secret>
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
  -e VUE_APP_PUBLIC_PATH=/demo \
  -e VUE_APP_CLIENT_ID=<your-github-client-id> \
  -e CLIENT_SECRET=<your-github-client-secret> \
  -e VUE_APP_CALL_BACK=http://localhost:8081/myAppPlaceholder/callback \
  -p 8081:80 \
  cartographer-app
```

Then open http://localhost:8081/demo.

#### Environment variables

| Variable | Description |
|---|---|
| `VUE_APP_PUBLIC_PATH` | Subpath the app is served under (e.g. `/demo`). Defaults to `/`. |
| `VUE_APP_CLIENT_ID` | GitHub OAuth App client ID (public; safe in the browser). |
| `VUE_APP_CALL_BACK` | OAuth callback URL. Use `/myAppPlaceholder/callback` and it will be rewritten to the actual subpath automatically. |
| `CLIENT_SECRET` | GitHub OAuth App client secret. Consumed only by nginx for the token exchange — never bundled into the SPA. Do **not** prefix it with `VUE_APP_`. |

#### GitHub OAuth App setup

In **GitHub → Settings → Developer settings → OAuth Apps**, register one callback URL per deployment. Use multiple lines if needed:

```
http://localhost:8081/callback
http://localhost:8081/demo/callback
https://myapp.example.org/callback
```

## Native Applications (Tauri)

The repository includes a Tauri setup (`src-tauri`) that wraps the web
application into native applications for Windows, macOS, Linux, and Android.

To run the desktop app in development mode:

```bash
npx tauri dev
```

To build a distributable desktop application:

```bash
npx tauri build
```

To run and build the Android app:

```bash
npx tauri android dev
npx tauri android build
```

See the [Tauri documentation](https://tauri.app/) for platform-specific
prerequisites (e.g., Rust toolchain, system dependencies, and for Android
the Android SDK/NDK).
