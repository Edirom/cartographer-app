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

### Biuld your image 
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

