import { createSSRApp } from 'vue'
import App from './App.vue'
import './utils/http'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { createPinia } from 'pinia'

export function createApp() {
  const app = createSSRApp(App)

  app.use(createPinia().use(piniaPluginPersistedstate))

  return {
    app,
  }
}
