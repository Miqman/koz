import adminAuthMiddleware from './authMiddleware.js'

const routes = [
  {
    path: '/',
    redirect: '/persetujuan-wp',
    component: () => import('@/layouts/MainLayout.vue'),
    beforeEnter: adminAuthMiddleware,
    children: [
      {
        path: 'persetujuan-wp',
        name: 'persetujuan_wp',
        meta: { requiresAuth: true, title: 'Persetujuan Akun Wajib Pajak' },
        component: () => import('@/views/PersetujuanWp/index.vue'),
      },
      {
        path: 'pengaturan-wp',
        name: 'pengaturan_wp',
        meta: { requiresAuth: true, title: 'Pengaturan Akun Wajib Pajak' },
        component: () => import('@/views/PengaturanWp/index.vue'),
      },
      {
        path: 'pengaturan-wp/tambah',
        name: 'tambahPengaturanWp',
        meta: { requiresAuth: true, title: 'Tambah Pengaturan Wajib Pajak' },
        component: () => import('@/views/PengaturanWp/tambah-edit.vue'),
      },
      {
        path: 'pengaturan-wp/edit/:id',
        name: 'editPengaturanWp',
        meta: { requiresAuth: true, title: 'Edit Pengaturan Wajib Pajak' },
        component: () => import('@/views/PengaturanWp/tambah-edit.vue'),
      },
    ],
  },

  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    // beforeEnter: adminAuthMiddleware,
    children: [
      {
        path: 'login',
        name: 'admin-login',
        meta: { title: 'Auth Login' },
        component: () => import('@/views/Auth/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'admin-register',
        meta: { title: 'Auth Register' },
        component: () => import('@/views/Auth/RegisterPage.vue'),
      },
      {
        path: 'forgot-password',
        name: 'admin-forgot-password',
        meta: { title: 'Auth Forgot Password' },
        component: () => import('@/views/Auth/ForgotPassword.vue'),
      },
      {
        path: 'reset-password',
        name: 'admin-reset-password',
        meta: { title: 'Auth Reset Password' },
        component: () => import('@/views/Auth/ResetPassword.vue'),
      },
      {
        path: 'verify-email',
        name: 'admin-verify-email',
        component: () => import('@/views/Auth/VerifyEmail.vue'),
      },
    ],
  },

  // 404 Error Page
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('@/views/ErrorNotFound.vue'),
  },
]

export default routes
