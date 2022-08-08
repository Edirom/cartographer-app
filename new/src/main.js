import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import 'spectre.css/dist/spectre-exp.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre.css'

createApp(App).use(store).mount('#app')
