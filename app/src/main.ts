import './assets/main.css'

import * as Vue from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue';

import App from './App.vue'
import router from './router'

import '@arco-design/web-vue/dist/arco.css';

declare global {
  interface Window {
	Vue3: typeof Vue;
  }
}

window.Vue3 = Vue
const app = Vue.createApp(App)

app.use(createPinia())
app.use(router)
app.use(ArcoVue);


app.mount('#app')
