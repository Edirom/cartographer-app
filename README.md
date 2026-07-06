
[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8B-orange)](https://fair-software.eu) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Edirom/cartographer-app)
# Cartographer App

The Cartographer App is used to provide placement information of zones of interest
in (historical) documents. The first and foremost use case is the identification
of bounding boxes of measures in music documents. It is a successor of the
*Vertaktoid*, but other than that uses web technology and is thus platform
independent. It optionally uses the *Measure Detector* for automatic recognition
of measure positions, but allows manual correction of these results.

## Documentation

Comprehensive user and developer documentation for the Cartographer App is
available at:

https://cartographer-app.zenmem.de/docs/
## Important Tools and their Documentation

* Vectre, which is a VueJS version of Spectre CSS. See https://vectrejs.github.io/docs/#/pages/getting-started
* OpenSeadragon. See http://openseadragon.github.io/
* Annotorious OpenSeadragon Plugin. See https://recogito.github.io/annotorious/getting-started/osd-plugin/


## Project setup
```
npm install
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

### Other approaach to linting which automatically fixes code and gives a nicer rendition of errors using snazzy
```
npm run test:lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Docker Deployment

All configuration is injected at **runtime** via environment variables — the same image works for any subpath, host, or GitHub OAuth App.

#### 1. Build the images

```sh
docker build -t cartographer-app .
docker build -t node-ghcred ./node-ghcred
```

#### 2. Create a Docker network

```sh
docker network create app1-net
```

#### 3. Start the OAuth sidecar

The sidecar holds the `client_secret` server-side so it is never exposed in the browser.

```sh
docker run -d \
  --name node-ghcred \
  --network app1-net \
  -e VUE_APP_CLIENT_ID=<your-github-client-id> \
  -e VUE_APP_CLIENT_SECRET=<your-github-client-secret> \
  node-ghcred
```

#### 4. Start the app

```sh
docker run -d \
  --name app1 \
  --network app1-net \
  -e VUE_APP_PUBLIC_PATH=/demo \
  -e VUE_APP_CLIENT_ID=<your-github-client-id> \
  -e VUE_APP_CALL_BACK=http://localhost:8081/myAppPlaceholder/callback \
  -p 8081:80 \
  cartographer-app
```

Then open http://localhost:8081/demo.

#### Environment variables

| Variable | Container | Description |
|---|---|---|
| `VUE_APP_PUBLIC_PATH` | app | Subpath the app is served under (e.g. `/demo`). Defaults to `/`. |
| `VUE_APP_CLIENT_ID` | app + sidecar | GitHub OAuth App client ID (public). |
| `VUE_APP_CALL_BACK` | app | OAuth callback URL. Use `/myAppPlaceholder/callback` and it will be rewritten to the actual subpath automatically. |
| `VUE_APP_CLIENT_SECRET` | sidecar only | GitHub OAuth App client secret. Never passed to the app container. |

#### GitHub OAuth App setup

In **GitHub → Settings → Developer settings → OAuth Apps**, register one callback URL per deployment. Use multiple lines if needed:

```
http://localhost:8081/callback
http://localhost:8081/demo/callback
https://myapp.example.org/callback
```

The registered URL must match exactly what `VUE_APP_CALL_BACK` resolves to after the `myAppPlaceholder` substitution.

