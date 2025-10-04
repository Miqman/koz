import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthAdminStore } from '@/stores/auth-admin-store'

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})

// Title
Router.beforeEach((to, from, next) => {
  document.title = ` - ${to.meta.title || ''}`
  next()
})

// // Initialize auth
// Router.beforeEach((to, from, next) => {
//   const adminStore = useAuthAdminStore()
//   // const userStore = useAuthUserStore()

//   if (!adminStore.isInitialized) adminStore.initialize()
//   // if (!userStore.isInitialized) userStore.initialize()
//   next()
// })

// // Redirect login
// Router.beforeEach((to, from, next) => {
//   const adminStore = useAuthAdminStore()

//   if (to.name === 'admin-login' && adminStore.isAuthenticated) {
//     next({ name: 'dashboard' })
//   } else {
//     next()
//   }
// })

export default Router
