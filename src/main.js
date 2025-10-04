import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { setupPinia } from '@/stores'
import quasarPlugin from './quasar.js'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import VueApexCharts from 'vue3-apexcharts'
import { useAuthAdminStore } from '@/stores/auth-admin-store'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(VueApexCharts)
app.use(quasarPlugin)
const pinia = setupPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
app.use(pinia)

app.use(Vue3Toastify, {
  autoClose: 3000,
  theme: 'light',
  pauseOnFocusLoss: false,
  limit: 6,
})

app.use(router)

// Initialize auth store setelah pinia di-mount
const authStore = useAuthAdminStore()
authStore.initialize()

app.mount('#app')
