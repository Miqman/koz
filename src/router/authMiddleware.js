// router/authMiddleware.js (Admin Auth Middleware)
import { useAuthAdminStore } from '@/stores/auth-admin-store'
// import { useAccessControl } from '@/composables/useAccessControl'

export default async function adminAuthMiddleware(to, from, next) {
  const adminStore = useAuthAdminStore()
  if (!adminStore.initialize) adminStore.initialize()

  const ok = await adminStore.checkAuth()
  if (!ok) {
    return next({ name: 'admin-login', query: { redirect: to.fullPath } })
  }

  // const roleId = adminStore.user?.roleId
  // // 🔴 RoleId=2 hanya boleh ke halaman tertentu
  // if (roleId === 2) {
  //   const allowedPaths = ['/dashboard/scan-tiket', '/dashboard/ticket-on-the-spot']
  //   if (!allowedPaths.includes(to.path)) {
  //     return next('/dashboard/scan-tiket') // redirect ke halaman yang diizinkan
  //   }
  // }

  // // role id 3 tidak bisa mengakses menu client, client-tambah, client-edit
  // if (roleId === 3) {
  //   if (to.path.startsWith('/dashboard/client')) {
  //     return next('/dashboard') // redirect ke halaman dashboard
  //   }
  // }

  // // ✅ Cek permission tambahan (integrasi composable)
  // const { can } = useAccessControl()
  // const requiredPermission = to.meta?.permission // diambil dari meta route

  // if (requiredPermission && !can(requiredPermission)) {
  //   return next('/dashboard') // redirect ke halaman 403 jika tidak punya akses
  // }

  next()
}
