<!-- landingLayout -->
<template>
  <q-layout view="lHh LpR lff">
    <q-header unelevated class="border-b border-gray-200">
      <q-toolbar class="!py-4 !px-4 container mx-auto">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" v-if="isMobileScreen" />

        <!-- Logo dan Menu Desktop -->
        <div class="flex items-center gap-8" v-if="!isMobileScreen">
          <!-- Logo -->
          <div class="flex items-center">
            <img src="../assets/images/logoDrawerLanding.png" alt="logo" />
          </div>

          <!-- Menu Navigation -->
          <div class="flex items-center gap-8">
            <router-link
              v-for="menu in baseMenu[0].items"
              :key="menu.no_menu"
              :to="menu.path"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              :class="{ 'text-primary': isRouteActive(menu.path) }"
            >
              {{ menu.name }}
            </router-link>
          </div>
        </div>

        <!-- Mobile Logo -->
        <q-toolbar-title v-if="isMobileScreen">
          <div class="flex items-center gap-2 justify-center">
            <div class="">
              <img src="../assets/images/logoDrawerLanding.png" alt="logo" />
            </div>
          </div>
        </q-toolbar-title>

        <!-- Spacer untuk mendorong button ke kanan -->
        <div class="flex-1" v-if="!isMobileScreen"></div>

        <!-- User Info atau Login Button -->
        <div class="flex items-center gap-4" v-if="!isMobileScreen">
          <!-- User Info Button (jika sudah login) -->
          <q-btn
            v-if="isUserLoggedIn"
            flat
            unelevated
            padding="xs sm"
            class="shadow-btn"
            no-caps
            :class="'rounded-sm'"
          >
            <q-avatar rounded size="35px" text-color="white" class="bg-twPrimary">
              <q-icon name="o_person" size="xs"></q-icon>
            </q-avatar>
            <div class="text-left ml-2" v-if="!loadingUser">
              <div class="font-bold">{{ userInfo.name }}</div>
            </div>
            <div class="text-left ml-2" v-else>
              <q-spinner size="16px" />
            </div>
            <q-menu auto-close>
              <q-list style="min-width: 150px" class="space-y-2 text-twSecondary">
                <q-item
                  clickable
                  @click="$router.push('/profile')"
                  class="hover:bg-gray-100 rounded-sm"
                >
                  <q-item-section avatar>
                    <q-icon name="person" size="xs" />
                  </q-item-section>
                  <q-item-section>Profil Saya</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="$router.push('/profile/orders')"
                  class="hover:bg-gray-100 rounded-sm"
                >
                  <q-item-section avatar>
                    <q-icon name="receipt" size="xs" />
                  </q-item-section>
                  <q-item-section>Pesanan Saya</q-item-section>
                </q-item>
                <!-- <q-item clickable @click="handleLogout" class="hover:bg-gray-100 rounded-sm">
                  <q-item-section avatar>
                    <q-icon name="logout" size="xs" />
                  </q-item-section>
                  <q-item-section>Keluar</q-item-section>
                </q-item> -->
              </q-list>
            </q-menu>
          </q-btn>

          <!-- Login Button (jika belum login) -->
          <q-btn v-else unelevated class="" color="primary" no-caps to="/login">
            <q-icon name="o_person" size="xs" class="text-white"></q-icon>
            <p class="!ml-2">Masuk</p>
          </q-btn>

          <!-- Language Dropdown -->
          <!-- <q-btn-dropdown flat dense no-caps class="language-dropdown" dropdown-icon="expand_more">
            <template v-slot:label>
              <div class="flex items-center gap-2">
                <img
                  :src="selectedLanguage.flag"
                  :alt="selectedLanguage.name"
                  class="w-6 h-4 rounded-sm"
                />
              </div>
            </template>

            <q-list class="min-w-[180px]">
              <q-item
                v-for="language in languages"
                :key="language.code"
                clickable
                v-close-popup
                @click="changeLanguage(language)"
                class="hover:bg-gray-100"
              >
                <q-item-section avatar>
                  <img :src="language.flag" :alt="language.name" class="w-6 h-4 rounded-sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ language.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown> -->
        </div>

        <!-- Mobile Login Button dan Language Dropdown -->
        <div class="flex items-center gap-2" v-if="isMobileScreen">
          <!-- User Info atau Login Button untuk Mobile -->
          <q-btn
            v-if="isUserLoggedIn"
            flat
            unelevated
            padding="xs sm"
            class="shadow-btn"
            no-caps
            size="sm"
            :class="'rounded-sm'"
          >
            <q-avatar rounded size="30px" text-color="white" class="bg-twPrimary">
              <q-icon name="o_person" size="xs"></q-icon>
            </q-avatar>
            <q-menu auto-close>
              <q-list style="min-width: 150px" class="space-y-2 text-twSecondary">
                <q-item
                  clickable
                  @click="$router.push('/profile')"
                  class="hover:bg-gray-100 rounded-sm"
                >
                  <q-item-section avatar>
                    <q-icon name="person" size="xs" />
                  </q-item-section>
                  <q-item-section>Profil Saya</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="$router.push('/profile/orders')"
                  class="hover:bg-gray-100 rounded-sm"
                >
                  <q-item-section avatar>
                    <q-icon name="receipt" size="xs" />
                  </q-item-section>
                  <q-item-section>Pesanan Saya</q-item-section>
                </q-item>
                <!-- <q-item clickable @click="handleLogout" class="hover:bg-gray-100 rounded-sm">
                  <q-item-section avatar>
                    <q-icon name="logout" size="xs" />
                  </q-item-section>
                  <q-item-section>Keluar</q-item-section>
                </q-item> -->
              </q-list>
            </q-menu>
          </q-btn>

          <!-- Login Button untuk Mobile -->
          <q-btn v-else unelevated class="" color="primary" no-caps size="sm" to="/login">
            <q-icon name="o_person" size="xs" class="text-white"></q-icon>
            <span class="!ml-2">Masuk</span>
          </q-btn>

          <!-- Language Dropdown -->
          <q-btn-dropdown flat dense no-caps class="language-dropdown" dropdown-icon="expand_more">
            <template v-slot:label>
              <div class="flex items-center gap-2">
                <img
                  :src="selectedLanguage.flag"
                  :alt="selectedLanguage.name"
                  class="w-6 h-4 rounded-sm"
                />
              </div>
            </template>

            <q-list class="min-w-[180px]">
              <q-item
                v-for="language in languages"
                :key="language.code"
                clickable
                v-close-popup
                @click="changeLanguage(language)"
                class="hover:bg-gray-100"
              >
                <q-item-section avatar>
                  <img :src="language.flag" :alt="language.name" class="w-6 h-4 rounded-sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ language.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class=""
      v-if="isMobileScreen"
    >
      <!-- drawer content -->
      <div class="p-4">
        <div class="flex items-center justify-center h-[200px]">
          <div class="">
            <img src="../assets/images/logoDrawer.png" alt="logo" class="w-[120px] h-[68px]" />
          </div>
        </div>
      </div>

      <div class="px-2">
        <q-list class="font-medium text-textDrawer">
          <!-- Loop semua menu -->
          <template v-for="(menuGroup, index) in groupedMenu" :key="index">
            <!-- Menu tanpa submenu -->
            <template v-for="menu in menuGroup.items" :key="menu.no_menu || menu.label">
              <q-item
                v-if="!menu.submenu"
                :to="menu.path"
                clickable
                v-ripple
                :active="isRouteActive(menu.path)"
                active-class="activeClass"
                class="hover:!bg-hoverDrawer hover:!text-bgPrimary hover:rounded-sm my-3 font-normal"
              >
                <q-item-section avatar>
                  <q-icon :name="menu.icon" size="xs" />
                </q-item-section>
                <q-item-section>{{ menu.name }}</q-item-section>
              </q-item>

              <!-- Menu dengan submenu -->
              <q-expansion-item
                v-else
                expand-separator
                dense-toggle
                :icon="menu.icon"
                :label="menu.name"
                :caption="menu.caption"
                :header-class="
                  isSubmenuActive(menu.submenu)
                    ? 'bg-hoverDrawer text-bgPrimary rounded-sm'
                    : 'hover:!bg-bg-hoverDrawer hover:rounded-sm my-1'
                "
              >
                <q-list class="q-pl-lg">
                  <q-item
                    v-for="submenu in menu.submenu"
                    :key="submenu.path"
                    :to="submenu.path"
                    clickable
                    v-ripple
                    :active="isRouteActive(submenu.path)"
                    active-class="activeClass"
                    class="hover:!bg-bg-hoverDrawer hover:rounded-sm my-1"
                  >
                    <q-item-section avatar>
                      <q-icon :name="submenu.icon" size="xs" />
                    </q-item-section>
                    <q-item-section>{{ submenu.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </template>
          </template>
        </q-list>

        <!-- Mobile Login Button -->
        <div class="p-4 mt-4" v-if="!isUserLoggedIn">
          <q-btn unelevated class="w-full" color="primary" no-caps to="/login">
            <q-icon name="o_person" size="xs" class="text-white"></q-icon>
            <p class="!ml-2">Masuk</p>
          </q-btn>
        </div>

        <!-- Mobile User Info -->
        <div class="p-4 mt-4" v-else>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-center gap-3 mb-3">
              <q-avatar size="40px" class="bg-twPrimary text-white">
                <q-icon name="person" size="sm" />
              </q-avatar>
              <div v-if="!loadingUser">
                <div class="font-bold text-sm">{{ userInfo.name }}</div>
                <div class="text-xs text-gray-600">{{ userInfo.email }}</div>
              </div>
              <q-spinner v-else size="20px" />
            </div>
            <div class="space-y-1">
              <q-btn
                flat
                no-caps
                class="w-full text-left justify-start"
                @click="$router.push('/profile')"
              >
                <q-icon name="person" size="xs" class="mr-2" />
                Profil Saya
              </q-btn>
              <!-- <q-btn flat no-caps class="w-full text-left justify-start" @click="handleLogout">
                <q-icon name="logout" size="xs" class="mr-2" />
                Keluar
              </q-btn> -->
            </div>
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>

    <q-footer unelevated class="!text-twSecondary bg-white">
      <div class="container mx-auto px-4">
        <!-- Support Section -->
        <div
          class="bg-twPrimary rounded-2xl flex flex-col md:flex-row items-center justify-between py-4 md:p-8"
          data-aos="slide-up"
          data-aos-delay="100"
        >
          <div class="text-white text-lg font-bold mb-4 md:mb-0">
            Pusat Bantuan<br />
            <p class="text-xl md:text-4xl">Ada yang bisa kami bantu?</p>
          </div>
          <div class="col-auto">
            <q-avatar :size="isMobileScreen ? '90px' : '148px'" class="bg-white">
              <img src="/images/cs.png" alt="Help" class="object-contain" />
            </q-avatar>
          </div>
        </div>

        <!-- Footer Content -->
        <div class="max-w-4xl mt-12 mb-9">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Logo & Company Info -->
            <div class="md:col-span-1">
              <div class="flex items-center justify-center gap-3 mb-4">
                <img src="../assets/images/logoDrawer.png" alt="logo" class="w-[120px] h-[68px]" />
              </div>
            </div>

            <!-- Wahana Column -->
            <div class="md:col-span-1 text-center md:!text-left">
              <p class="font-bold text-twBlack mb-6">Wahana</p>
              <ul class="space-y-2">
                <li>
                  <a href="#" class="hover:text-twPrimary transition-colors">Jembatan Kaca</a>
                </li>
                <li>
                  <a href="#" class="hover:text-twPrimary transition-colors">Kereta kelinci</a>
                </li>
                <li>
                  <a href="#" class="hover:text-twPrimary transition-colors">Ontang-anting</a>
                </li>
                <li>
                  <a href="#" class="hover:text-twPrimary transition-colors">Animal Fedding</a>
                </li>
              </ul>
            </div>

            <!-- Promo Column -->
            <div class="md:col-span-1 text-center md:!text-left">
              <p class="font-bold text-twBlack mb-6">Promo</p>
              <ul class="space-y-2">
                <li>
                  <a href="#" class="hover:text-twPrimary transition-colors">Promo Pelajar</a>
                </li>
                <li>
                  <a href="#" class="hover:text-twPrimary transition-colors">Promo Akhir Pekan</a>
                </li>
              </ul>
            </div>

            <!-- Temukan Kami Column -->
            <div class="md:col-span-1 text-center md:!text-left">
              <p class="font-bold text-gray-800 !mb-6">Temukan Kami</p>
              <div class="flex space-x-4 justify-center md:!justify-start">
                <!-- Facebook -->
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 transition-colors group"
                >
                  <svg
                    class="w-5 h-5 text-gray-600 group-hover:text-twPrimary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </a>

                <!-- Instagram -->
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 transition-colors group"
                >
                  <svg
                    class="w-5 h-5 text-gray-600 group-hover:text-twPrimary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    />
                  </svg>
                </a>

                <!-- YouTube -->
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 transition-colors group"
                >
                  <svg
                    class="w-5 h-5 text-gray-600 group-hover:text-twPrimary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-200 my-8">
          <div class="text-center text-[10px] my-[10px]">Copyright 2025</div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useQuasar, Cookies } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import api from '@/utils/axios-user'
import { useAuthUserStore } from '@/stores/auth-user-store'

const authUserStore = useAuthUserStore()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

// User state
const userInfo = ref({
  name: '',
  email: '',
})
const loadingUser = ref(false)
const isUserLoggedIn = ref(false)

// Language configuration
const languages = ref([
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    flag: 'https://flagcdn.com/w20/id.png', // Bendera Indonesia
  },
  {
    code: 'en',
    name: 'Bahasa Inggris',
    flag: 'https://flagcdn.com/w20/gb.png', // Bendera Inggris
  },
])

const selectedLanguage = ref(languages.value[0]) // Default ke Bahasa Indonesia

const baseMenu = [
  {
    category: 'MENU',
    items: [
      {
        no_menu: 1,
        name: 'Beranda',
        icon: 'settings_remote',
        path: '/',
        menuName: 'Beranda',
      },
      {
        no_menu: 2,
        name: 'Promo',
        icon: 'insights',
        path: '/promo',
        menuName: 'Promo',
      },
      {
        no_menu: 3,
        name: 'Event',
        icon: 'insights',
        path: '/event',
        menuName: 'Event',
      },
      {
        no_menu: 4,
        name: 'Tiket',
        icon: 'insights',
        path: '/tiket',
        menuName: 'OV2-Tiket',
      },
      {
        no_menu: 5,
        name: 'Berita',
        icon: 'insights',
        path: '/berita',
        menuName: 'OV2-Berita',
      },
      {
        no_menu: 6,
        name: 'FAQ',
        icon: 'insights',
        path: '/faq',
        menuName: 'OV2-FAQ',
      },
    ],
  },
]

// Fetch user data
const fetchUserData = async () => {
  try {
    const cekAuth = await authUserStore.checkAuth()
    if (!cekAuth) {
      console.log('User not logged in', cekAuth)
      isUserLoggedIn.value = false
      return
    }

    loadingUser.value = true

    // const response = await api.get('/user')

    if (authUserStore.user) {
      const userData = authUserStore.user

      userInfo.value = {
        name: userData.name || '',
        email: userData.email || '',
      }

      isUserLoggedIn.value = true
      // window.location.reload()
    }
  } catch (error) {
    console.error('Error fetching user data:', error)

    isUserLoggedIn.value = false
  } finally {
    loadingUser.value = false
  }
}

// Handle logout
const handleLogout = async () => {
  try {
    // Check if user has valid token
    const token = Cookies.get('session_id_lokawisata_pengguna')
    if (token) {
      // Set authorization header for logout request
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Call logout endpoint
      await api.post('/logout')

      console.log('Logout API called successfully')
    }
  } catch (error) {
    console.error('Logout API Error:', error)
    // Continue with logout process even if API fails
  }

  // Clear user data regardless of API response
  Cookies.remove('session_id_lokawisata_pengguna')
  delete api.defaults.headers.common['Authorization']

  // Reset state
  isUserLoggedIn.value = false
  userInfo.value = { name: '', email: '' }

  $q.notify({
    type: 'positive',
    message: 'Berhasil keluar dari aplikasi',
    position: 'top-right',
  })

  // Redirect to home
  router.push('/')
}

// Filter menu berdasarkan permission
const groupedMenu = computed(() => {
  return baseMenu
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const changeLanguage = (language) => {
  selectedLanguage.value = language
  // Tambahkan logika untuk mengubah bahasa aplikasi
  console.log('Bahasa diubah ke:', language.name)

  // Contoh implementasi dengan i18n:
  // $i18n.locale = language.code
}

const isRouteActive = (route) => {
  const currentPath = router.currentRoute.value.path

  // Pastikan cocok hanya dengan path yang benar
  return currentPath === route || currentPath.startsWith(`${route}/`)
}

// Load user data saat component dimount
onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.language-dropdown .q-btn-dropdown__arrow {
  margin-left: 4px;
}

.language-dropdown .q-btn {
  padding: 8px 12px;
}

.shadow-btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive menu styles */
@media (max-width: 768px) {
  .hidden {
    display: none !important;
  }
}
</style>
