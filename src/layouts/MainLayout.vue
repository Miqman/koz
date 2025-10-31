<!-- MainLayout -->
<template>
  <q-layout view="lHh LpR lff">
    <!-- <q-header unelevated class="border-b border-b-twBorder">
      <q-toolbar class="!py-2 !px-4">
        <q-btn dense flat icon="menu" class="" @click="toggleDrawer" />

        <q-toolbar-title> </q-toolbar-title>

        <q-btn flat no-caps>
          <q-avatar size="42px">
            <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
          </q-avatar>
          <p class="text-xs !ml-2">{{ adminInfo?.username || '' }}</p>
          <q-menu auto-close>
            <q-list style="min-width: 100px" class="space-y-2 text-twSecondary">
              <q-item clickable @click="dialogLogout = true" class="hover:bg-gray-100 rounded-sm">
                <q-item-section avatar>
                  <q-icon name="logout" size="xs" />
                </q-item-section>
                <q-item-section>Keluar</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header> -->

    <q-drawer
      :show-if-above="!isMobileScreen"
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="300"
      :mini="!isMobileScreen && miniState"
      :mini-width="65"
      class="bg-white"
    >
      <div class="p-4">
        <div class="flex justify-between" v-if="!miniState">
            <div class="font-['Russo_One'] text-[32px] text-twPrimary">KOZ</div>
            <q-btn flat dense icon="o_view_sidebar" @click="toggleDrawer" class="self-start" color="primary">
              <q-tooltip>
                <span>Tutup Menu</span>
              </q-tooltip>
            </q-btn>
        </div>
        <div class="flex items-center justify-center py-2" v-else>
          <div class="w-full flex justify-center relative group">
            <div 
              class="font-['Russo_One'] text-[20px] text-twPrimary transition-all duration-200 group-hover:opacity-0"
            >
              KOZ
            </div>
            <q-btn 
              flat 
              dense 
              icon="o_view_sidebar" 
              @click="toggleDrawer" 
              class="absolute opacity-0 group-hover:opacity-100 transition-all duration-200" 
              color="primary"
              size="md"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                <span>Buka Menu</span>
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="p-4 border-y border-gray-100 mb-3">
        <!-- User Profile Section -->
        <div class="" v-if="!miniState">
          <div class="flex items-center justify-between bg-white rounded-lg">
            <!-- User Avatar -->
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <q-icon name="person" size="20px" color="primary" />
              </div>
              <span class="text-twBlack font-medium text-sm">{{ adminInfo?.username || 'Administrator' }}</span>
            </div>
            
            <!-- Logout Button -->
            <q-btn 
              flat 
              dense 
              icon="logout" 
              @click="dialogLogout = true"
              color="primary"
              size="sm"
            >
              <q-tooltip>
                <span>Keluar</span>
              </q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Mini State User Profile -->
        <div class="flex justify-center" v-else>
          <q-btn 
            flat 
            dense 
            color="primary"
            icon="person" 
            @click="dialogLogout = true"
            size="md"
          >
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]">
              <span>{{ adminInfo?.username || 'Administrator' }}</span>
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="px-3">
        <q-list class="text-[#9F9FA9]">
          <template v-for="(menuGroup, groupIndex) in groupedMenu" :key="groupIndex">
            <!-- <q-separator v-if="groupIndex > 0" class="my-4" /> -->

            <template
              v-for="(menu, menuIndex) in menuGroup.items"
              :key="menu.no_menu || menu.label"
            >
              <!-- Menu tanpa submenu (menu utama langsung) -->
              <q-item
                v-if="!menu.submenu && menu.path"
                :to="menu.path"
                clickable
                v-ripple
                manual-focus
                :active="isRouteActive(menu.path)"
                active-class="activeClass"
                :class="[
                  'hover:bg-twPrimary/20 hover:rounded-sm hover:!text-twPrimary font-normal mb-3',
                  { 'flex justify-center p-0': miniState },
                ]"
              >
                <q-item-section avatar :class="{ 'min-w-0 p-0': miniState }">
                  <q-icon :name="menu.icon" size="xs" />
                </q-item-section>
                <q-item-section v-if="!miniState" class="">{{ menu.name }}</q-item-section>
                <q-tooltip
                  v-if="miniState"
                  anchor="center right"
                  self="center left"
                  :offset="[10, 0]"
                  class="bg-gray-700 text-white text-xs"
                >
                  {{ menu.name }}
                </q-tooltip>
              </q-item>

              <q-expansion-item
                v-if="menu.submenu && !miniState"
                dense-toggle
                hide-expand-icon
                :icon="menu.icon"
                :label="menu.label"
                :header-class="[
                  isSubmenuActive(menu.submenu)
                    ? 'text-xs font-bold !px-2 !text-twPrimary'
                    : 'text-xs font-bold !px-2',
                ]"
                default-opened
              >
                <q-list class="q-pl-sm q-pr-sm">
                  <q-item
                    v-for="(submenu, index) in menu.submenu"
                    :key="submenu.path"
                    :to="submenu.path"
                    clickable
                    v-ripple
                    manual-focus
                    :active="isRouteActive(submenu.path)"
                    active-class="activeClass"
                    :class="['hover:bg-twPrimary/20 hover:rounded-sm font-normal mb-3']"
                  >
                    <q-item-section avatar>
                      <q-icon :name="submenu.icon" size="xs" />
                    </q-item-section>
                    <q-item-section class="text-sm font-medium">{{ submenu.name }}</q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>

              <template v-if="miniState && menu.submenu">
                <q-item
                  v-for="(submenu, subIndex) in menu.submenu"
                  :key="`mini-${submenu.path}`"
                  :to="submenu.path"
                  clickable
                  v-ripple
                  manual-focus
                  :active="isRouteActive(submenu.path)"
                  active-class="activeClass"
                  :class="[
                    'hover:bg-twPrimary/20 hover:rounded-sm font-normal flex justify-center p-0 my-2',
                  ]"
                >
                  <q-item-section avatar class="min-w-0 p-0">
                    <q-icon :name="submenu.icon" size="xs" />
                  </q-item-section>

                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[10, 0]"
                    class="bg-gray-700 text-white text-xs"
                  >
                    {{ submenu.name }}
                  </q-tooltip>
                </q-item>
              </template>
            </template>
          </template>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container class="bg-background text-twBlack">
      <router-view />
    </q-page-container>

    <q-footer unelevated class="!text-twSecondary !bg-transparent">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-xs">Copyright RoyalTune {{ moment().year() }}</div>
        </q-toolbar-title>

        <div class="text-xs">Versi 1.0.0</div>
      </q-toolbar>
    </q-footer>

    <DialogConfirm
      v-model="dialogLogout"
      ref="dialogConfirm"
      title="Keluar"
      description="Anda ingin keluar dari aplikasi. Apakah Anda yakin?"
      :buttons="[
        {
          label: 'Batal',
          outline: true,
          dense: true,
          color: 'primary',
        },
        {
          label: 'Yakin',
          dense: true,
          color: 'primary',
          onClick: logout,
          loading: loadingLogout,
          closePopup: false,
        },
      ]"
    >
    </DialogConfirm>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import DialogConfirm from '@/components/DialogConfirm.vue'
// import { useAuthStore } from '@/stores/auth-store'
import { useAuthAdminStore } from '@/stores/auth-admin-store'
import { moment } from '@/utils/mixing'

// const authStore = useAuthStore()
const authStore = useAuthAdminStore()

const routeMain = useRoute()
const $q = useQuasar()
const router = useRouter()
const leftDrawerOpen = ref(false)
const aktif = ref(false)
const dialogLogout = ref(false)
const loadingLogout = ref(false)
const miniState = ref(false)

// Auto refresh variables untuk musik latest
const autoRefreshInterval = ref(null)
const isPageVisible = ref(true)
const previousMusikLatest = ref([])

const baseMenu = [
  {
    category: 'MENU UTAMA',
    items: [
      // Menu tanpa submenu (menu utama langsung)
      {
        no_menu: 1,
        name: 'Persetujuan Akun Wajib Pajak',
        icon: 'o_dashboard',
        path: '/persetujuan-wp',
        menuName: 'Persetujuan Akun Wajib Pajak',
      },
      {
        no_menu: 2,
        name: 'Pengaturan Wajib Pajak',
        icon: 'o_camera_outdoor',
        path: '/pengaturan-wp',
        menuName: 'Pengaturan Wajib Pajak',
      },
    ],
  },
  // Menu dengan submenu (dikomentar untuk sementara, mungkin dibutuhkan kedepannya)
  // {
  //   category: 'DASHBOARD',
  //   items: [
  //     {
  //       label: 'DASHBOARD', // Label ini tidak digunakan untuk menu tunggal, tapi untuk expansion-item
  //       submenu: [
  //         {
  //           no_menu: 1,
  //           name: 'Pemutaran Lagu',
  //           icon: 'o_dashboard',
  //           path: '/dashboard',
  //           menuName: 'Dashboard',
  //         },
  //         {
  //           no_menu: 2,
  //           name: 'Perangkat',
  //           icon: 'o_camera_outdoor',
  //           path: '/dashboard-perangkat',
  //           menuName: 'Perangkat',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   category: 'PENGATURAN',
  //   items: [
  //     {
  //       label: 'PENGATURAN',
  //       submenu: [
  //         {
  //           no_menu: 1,
  //           name: 'Wajib Pajak',
  //           icon: 'settings_remote',
  //           path: '/wajib-pajak',
  //           menuName: 'WajibPajak',
  //         },
  //         {
  //           no_menu: 2,
  //           name: 'Perangkat',
  //           icon: 'o_camera',
  //           path: '/pengaturan-perangkat',
  //           menuName: 'Perangkat',
  //         },
  //         {
  //           no_menu: 1,
  //           name: 'Pengguna',
  //           icon: 'o_account_box',
  //           path: '/pengaturan-pengguna',
  //           menuName: 'Pengguna',
  //         },
  //       ],
  //     },
  //   ],
  // },
]

const adminInfo = computed(() => authStore.user)

// console.log('ini data dari ')
console.log(adminInfo.value, 'user info')
// console.log('Selesai')

const roleMap = {
  1: 'Customer',
  2: 'Staff',
  3: 'Admin',
  4: 'Super Admin',
}
const getRoleName = (roleId) => {
  return roleMap[roleId] || 'Unknown'
}

// Filter menu berdasarkan permission
// const groupedMenu = computed(() => {
//   return baseMenu
// })
const groupedMenu = computed(() => {
  if (adminInfo.value?.roleId === 2) {
    return [
      {
        category: 'MENU UTAMA',
        items: baseMenu[0].items.filter((menu) =>
          ['/dashboard/scan-tiket', '/dashboard/ticket-on-the-spot'].includes(menu.path),
        ),
      },
    ]
  } // ✅ Role selain 2 (role 3 & 4 semua menu, role 1 auto logout)

  return baseMenu.map((category) => {
    return {
      ...category,
      items: category.items.map((item) => {
        // Jika item memiliki submenu (menu dengan submenu)
        if (item.submenu) {
          return {
            ...item,
            submenu: item.submenu.filter((menu) => {
              // ✅ Filter menu yang mau di-hide di sini
              const hiddenMenus = [
                // '/dashboard-perangkat', // disembunyikan
                // kalau mau hide lainnya, tambahkan di sini
              ]

              // Check if path is client related and user is not super admin
              if (
                (menu.path === '/dashboard/client' ||
                  menu.path === '/dashboard/client/tambah' ||
                  menu.path === '/dashboard/client/edit') &&
                adminInfo.value?.roleId !== 4
              ) {
                return false
              }

              return !hiddenMenus.includes(menu.path)
            }),
          }
        }
        // Jika item tidak memiliki submenu (menu utama langsung)
        else {
          // ✅ Filter menu yang mau di-hide di sini
          const hiddenMenus = [
            // '/dashboard-perangkat', // disembunyikan
            // kalau mau hide lainnya, tambahkan di sini
          ]

          // Check if path is client related and user is not super admin
          if (
            (item.path === '/dashboard/client' ||
              item.path === '/dashboard/client/tambah' ||
              item.path === '/dashboard/client/edit') &&
            adminInfo.value?.roleId !== 4
          ) {
            return null // Return null untuk di-filter out
          }

          return !hiddenMenus.includes(item.path) ? item : null
        }
      }).filter(Boolean), // Filter out null values
    }
  })
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleMiniState = () => {
  miniState.value = !miniState.value
}

const toggleDrawer = () => {
  if (isMobileScreen.value) {
    // Mobile: toggle drawer open/close
    leftDrawerOpen.value = !leftDrawerOpen.value
  } else {
    // Desktop: toggle mini state
    miniState.value = !miniState.value
    // Ensure drawer is open on desktop
    leftDrawerOpen.value = true
  }
}

const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const isRouteActive = (route) => {
  const currentPath = router.currentRoute.value.path

  // Special handling for dashboard route to prevent active state conflicts
  if (route === '/dashboard') {
    return currentPath === '/dashboard'
  }
  // Pastikan cocok hanya dengan path yang benar
  return currentPath === route || currentPath.startsWith(`${route}/`)
}

const isSubmenuActive = (submenu) => {
  return submenu.some((item) => routeMain.path === item.path)
}

const logout = async () => {
  loadingLogout.value = true

  await authStore.logout()
  router.push('/login')
  loadingLogout.value = false
}


onMounted(() => {

})

onUnmounted(() => {
  
})
</script>

<style>
.q-item {
  min-height: 0 !important;
}
.q-item__section--avatar {
  min-width: 0;
}
.q-item__section--side {
  padding-right: 8px;
}

/* Override default active class padding and alignment for mini mode */
.activeClass.flex.justify-center {
  padding-left: 0 !important; /* Override default Quasar padding */
  padding-right: 0 !important; /* Override default Quasar padding */
}
</style>
