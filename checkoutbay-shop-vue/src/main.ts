import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import naive from 'naive-ui';
import App from './App.vue'

const pinia = createPinia()

createApp(App)
  .use(naive)
  .use(pinia)
  .use(router)
  .mount('#app')