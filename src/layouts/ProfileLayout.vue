<!-- ProfileLayout -->
<template>
  <div class="bg-white">
    <div class="container mx-auto py-8 px-4">
      <div class="row q-gutter-lg">
        <!-- Sidebar -->
        <div class="col-12 col-md-3">
          <q-card class="sidebar-card" style="border-radius: 12px">
            <!-- User Info -->
            <q-card-section class="text-center q-pb-none">
              <!-- Loading state -->
              <div v-if="fetchingData" class="text-center">
                <q-spinner size="32px" color="primary" />
                <p class="text-caption text-grey-6 mt-2">Memuat data...</p>
              </div>

              <!-- User info -->
              <div v-else>
                <q-avatar size="64px" class="bg-primary text-white q-mb-sm">
                  <q-icon name="person" size="32px" />
                </q-avatar>
                <div class="text-h6 text-weight-bold text-grey-9">{{ userInfo.name }}</div>
                <div class="text-body2 text-grey-6">{{ userInfo.email }}</div>
              </div>
            </q-card-section>

            <!-- Navigation Menu -->
            <q-card-section class="q-pt-md">
              <q-list class="menu-list">
                <q-item
                  v-for="menu in menuItems"
                  :key="menu.path"
                  :to="menu.action === 'logout' ? null : menu.path"
                  clickable
                  v-ripple
                  :active="isActiveRoute(menu.path)"
                  active-class="active-menu-item"
                  class="menu-item"
                  @click="handleMenuClick(menu)"
                >
                  <q-item-section avatar>
                    <q-icon :name="menu.icon" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ menu.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Main Content -->
        <div class="col-12 col-md-8">
          <q-card class="content-card" style="border-radius: 12px; min-height: 500px">
            <router-view />
          </q-card>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Dialog -->
    <q-dialog v-model="showLogoutDialog" persistent>
      <q-card style="min-width: 350px; border-radius: 12px">
        <q-card-section class="text-center q-pb-none">
          <div class="text-h6 text-weight-bold text-grey-9 q-mb-sm">Keluar</div>
          <div class="text-body2 text-grey-7">
            Anda ingin keluar dari aplikasi. Apakah Anda yakin?
          </div>
        </q-card-section>

        <q-card-actions class="row q-gutter-sm q-pa-lg justify-center">
          <q-btn
            flat
            no-caps
            class="text-grey-7"
            style="border-radius: 6px; padding: 8px 24px"
            @click="showLogoutDialog = false"
          >
            Batal
          </q-btn>
          <q-btn
            unelevated
            no-caps
            color="primary"
            class="text-weight-medium"
            style="border-radius: 6px; padding: 8px 24px"
            @click="handleLogout"
          >
            Yakin
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useQuasar, Cookies } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useAuthUserStore } from '@/stores/auth-user-store'

const authUserStore = useAuthUserStore()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()

// State management
const loading = ref(false)
const fetchingData = ref(false)

// User info
const userInfo = ref({
  name: '',
  email: '',
})

// Dialog states
const showLogoutDialog = ref(false)
const showUserDropdown = ref(false)

// Menu items for sidebar
const menuItems = ref([
  {
    label: 'Profil Saya',
    icon: 'person',
    path: '/profile/edit',
    action: 'navigate',
  },
  {
    label: 'Pesanan Saya',
    icon: 'receipt',
    path: '/profile/orders',
    action: 'navigate',
  },
  {
    label: 'Ubah Password',
    icon: 'lock',
    path: '/profile/change-password',
    action: 'navigate',
  },
  {
    label: 'Keluar',
    icon: 'logout',
    path: '/logout',
    action: 'logout',
  },
])

// User dropdown items (for header usage)
const userDropdownItems = ref([
  {
    label: 'Profil Saya',
    icon: 'person',
    path: '/profile/edit',
  },
  {
    label: 'Pesanan Saya',
    icon: 'receipt',
    path: '/profile/orders',
  },
  {
    label: 'Ganti Password',
    icon: 'lock',
    path: '/profile/change-password',
  },
  {
    label: 'Keluar',
    icon: 'logout',
    path: '/logout',
    action: 'logout',
  },
])

// Fetch user data
const fetchUserData = async () => {
  try {
    const cekAuth = await authUserStore.checkAuth()
    console.log('🔍 ProfileLayout - checkAuth:', cekAuth)

    if (!cekAuth) return

    fetchingData.value = true

    if (authUserStore.user) {
      const userData = authUserStore.user

      userInfo.value = {
        name: userData.name || '',
        email: userData.email || '',
      }
    }
  } catch (error) {
    // console.error('Error fetching user data:', error)

    // if (error.response?.status === 401) {
    //   // Token expired
    //   Cookies.remove('session_id_lokawisata_pengguna')
    //   router.push('/login')
    //   return
    // }

    // Set default values jika error
    userInfo.value = {
      name: 'User',
      email: 'user@example.com',
    }
  } finally {
    fetchingData.value = false
  }
}

// Check if route is active
const isActiveRoute = (path) => {
  if (path === '/logout') return false
  return route.path === path || route.path.startsWith(path + '/')
}

// Handle menu click
const handleMenuClick = (menu) => {
  if (menu.action === 'logout') {
    showLogoutDialog.value = true
  } else {
    router.push(menu.path)
  }
}

// Handle dropdown click
const handleDropdownClick = (menu) => {
  if (menu.action === 'logout') {
    showLogoutDialog.value = true
  } else {
    router.push(menu.path)
  }
}

// Handle logout - ENHANCED VERSION
const handleLogout = async () => {
  showLogoutDialog.value = false
  loading.value = true

  try {
    console.log('🔍 ProfileLayout - Starting logout process')

    // Call user logout
    await authUserStore.logout()

    console.log('🔍 ProfileLayout - Logout completed')

    // Clear any remaining local state
    userInfo.value = { name: null, email: null }

    // // Wait for next tick to ensure state is updated
    // await nextTick()

    // Force redirect to login
    router.push('/')

    $q.notify({
      type: 'positive',
      message: 'Berhasil keluar dari aplikasi',
      position: 'top-right',
    })

    // // Force page reload to ensure clean state
    setTimeout(() => {
      window.location.reload()
    }, 100)
  } catch (error) {
    console.error('🔍 ProfileLayout - Logout error:', error)

    // Force clear everything even if API fails
    authUserStore.clearAuthData()

    $q.notify({
      type: 'positive',
      message: 'Berhasil keluar dari aplikasi',
      position: 'top-right',
    })

    // Force redirect and reload
    await router.push('/login')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  } finally {
    loading.value = false
  }
}

// Load user data saat component dimount
onMounted(() => {
  fetchUserData()
})

// Expose functions for parent components
defineExpose({
  showUserDropdown,
  userDropdownItems,
  handleDropdownClick,
  userInfo,
  loadingUser: fetchingData,
})
</script>

<style scoped>
/* Sidebar styles */
.sidebar-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f5f5f5;
}

.content-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f5f5f5;
}

/* Menu styles */
.menu-list .menu-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.menu-list .menu-item:hover {
  background-color: rgba(156, 39, 176, 0.04);
}

.menu-list .active-menu-item {
  background-color: #8e51ff !important;
  color: white;
}

.menu-list .active-menu-item .q-icon {
  color: white;
}

/* User dropdown styles */
.user-dropdown .dropdown-item:hover {
  background-color: rgba(156, 39, 176, 0.04);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar-card {
    margin-bottom: 1rem;
  }
}

/* Dialog styles */
.q-dialog .q-card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.q-btn.bg-primary {
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
}

.q-btn.bg-primary:hover {
  background: linear-gradient(135deg, #8e24aa 0%, #5e35b1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
}
</style>
