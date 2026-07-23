# Cartographer App

The Cartographer App is used to provide placement information of zones of interest
in (historical) documents. The first and foremost use case is the identification
of bounding boxes of measures in music documents. It is a successor of the
*Vertaktoid*, but other than that uses web technology and is thus platform
independent. It optionally uses the *Measure Detector* for automatic recognition
of measure positions, but allows manual correction of these results.


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
docker run --rm -p 8080:80 -e APP_PUBLIC_PATH=/demo cartographer
```

To enable GitHub authentication, additionally pass your OAuth App credentials:
```
docker run --rm -p 8080:80 \
  -e APP_PUBLIC_PATH=/demo \
  -e GH_APP_CLIENT_ID=<your-github-client-id> \
  -e GH_APP_CLIENT_SECRET=<your-github-client-secret> \
  -e GH_APP_CALL_BACK=http://localhost:8080/myAppPlaceholder/callback \
  cartographer
```

The `/myAppPlaceholder/` part of the callback URL is rewritten automatically to
the configured subpath. See the README for the full environment variable
reference and GitHub OAuth App setup.