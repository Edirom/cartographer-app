import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import 'spectre.css/dist/spectre-exp.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faAngleLeft, faAngleRight, faCropSimple, faPen, faScissors, faEraser, faArrowPointer, faWandSparkles, faGuitar, faLayerGroup, faStop, faSquarePlus as faSquarePlusSolid, faDownload, faFileImport, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons'
import { faClone, faSquare, faSquarePlus } from '@fortawesome/free-regular-svg-icons'
/* add icons to the library */
library.add(faAngleLeft, faAngleRight, faClone, faCropSimple, faPen, faScissors, faEraser, faArrowPointer, faSquare, faWandSparkles, faGuitar, faLayerGroup, faStop, faSquarePlus, faSquarePlusSolid, faDownload, faFileImport, faCloudArrowDown)

createApp(App)
  .use(store)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('font-awesome-layers', FontAwesomeLayers)
  .mount('#app')
