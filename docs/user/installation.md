#  Setup Guide

---

## Important Tools and Their Documentation

- **Vectre**: a VueJS version of Spectre CSS  
  👉 [Vectre Documentation](https://vectrejs.github.io/docs/#/pages/getting-started)

- **OpenSeadragon**  
  👉 [OpenSeadragon Site](http://openseadragon.github.io/)

- **Annotorious OpenSeadragon Plugin**  
  👉 [Annotorious OSD Plugin](https://recogito.github.io/annotorious/getting-started/osd-plugin/)

---

## Project Setup

Install dependencies:

```bash
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


### Deploying to a subdirectory
In compile stage 
```
docker build \
dockercontainer
```

### Run 
```
 docker run \
-e CLIENT_ID="your client id" \
-e CLIENT_SECRET= "your client secret"\
-e CALL_BACK= "your call back" \
-e VUE_APP_CALL_BACK=$CALL_BACK \
-e VUE_APP_PUBLIC_PATH="your subpath"
dockercontainer
```
