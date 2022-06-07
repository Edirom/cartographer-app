import Vue from 'vue'
import App from './App.vue'
import store from './store'

import 'spectre.css/dist/spectre-exp.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre.css'
import { VectrePlugin } from '@vectrejs/vectre'

Vue.config.productionTip = false
Vue.use(VectrePlugin)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
