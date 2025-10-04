// composables/useGuestAccess.js (Versi Revisi)
import { ref, computed, onMounted, onUnmounted, watch } from 'vue' // Tambahkan `watch`
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/auth-user-store'
import {
  ensureGuestAccess,
  clearGuestAccess,
  getGuestTokenInfo,
  refreshGuestTokenIfNeeded,
  isGuestTokenValid,
} from '@/utils/guest-token'
import userApi from '@/utils/axios-user' // Impor userApi untuk sinkronisasi header

/**
 * Vue Composable for Guest Access Management
 * Provides reactive state and methods for handling guest authentication
 *
 * @param {object} options - Configuration options
 * @param {boolean} options.autoSetup - Automatically setup guest access on mount (default: true)
 * @param {boolean} options.autoRefresh - Automatically refresh token when needed (default: true)
 * @param {number} options.refreshInterval - Auto refresh check interval in minutes (default: 30)
 * @param {string} options.redirectOnError - Route to redirect on auth error (default: '/login')
 * @returns {object} - Composable return object
 */
export function useGuestAccess(options = {}) {
  const {
    autoSetup = true,
    autoRefresh = true,
    refreshInterval = 30, // minutes
    redirectOnError = '/login',
  } = options

  const $q = useQuasar()
  const router = useRouter()
  const authUserStore = useAuthUserStore()

  // Reactive state
  const isSettingUp = ref(false)
  const hasGuestAccess = ref(false)
  const guestTokenInfo = ref(null)
  const lastError = ref(null)

  // Auto refresh timer
  let refreshTimer = null

  // Computed properties
  const isUserLoggedIn = computed(() => authUserStore.isAuthenticated)

  const accessMode = computed(() => {
    if (isUserLoggedIn.value) return 'authenticated'
    if (hasGuestAccess.value) return 'guest'
    return 'none'
  })

  // Ini adalah properti yang paling penting untuk ditunggu oleh komponen
  const canAccessProtectedContent = computed(() => {
    return isUserLoggedIn.value || hasGuestAccess.value
  })

  const tokenExpiryInfo = computed(() => {
    // Logika yang sama
    if (!guestTokenInfo.value) return null
    const expiresAt = guestTokenInfo.value.expiresAt || guestTokenInfo.value.expiresAtFromToken
    if (!expiresAt) return null
    const now = Date.now()
    const timeUntilExpiry = expiresAt.getTime() - now
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000)
    const hoursUntilExpiry = Math.floor(minutesUntilExpiry / 60)
    return {
      expiresAt,
      timeUntilExpiry,
      minutesUntilExpiry,
      hoursUntilExpiry,
      isExpiringSoon: minutesUntilExpiry <= 60,
      isExpired: timeUntilExpiry <= 0,
    }
  })

  // Methods
  const showError = (message, error = null) => {
    console.error('❌ Guest Access Error:', message, error)
    lastError.value = { message, error, timestamp: Date.now() }
    $q.notify({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 5000,
    })
  }

  const updateTokenInfo = () => {
    try {
      const tokenInfo = getGuestTokenInfo()
      guestTokenInfo.value = tokenInfo
      hasGuestAccess.value = !!tokenInfo // Perbarui hasGuestAccess
      // Sinkronisasi header token ke axios di sini untuk memastikan token selalu terpasang
      if (tokenInfo) {
        userApi.defaults.headers.common['Authorization'] =
          `Bearer ${sessionStorage.getItem('guest_access_token')}`
      } else {
        delete userApi.defaults.headers.common['Authorization']
      }
      console.log('📊 Updated guest token info:', tokenInfo)
    } catch (error) {
      console.error('❌ Error updating token info:', error)
      guestTokenInfo.value = null
      hasGuestAccess.value = false
    }
  }

  const setupGuestAccess = async (force = false) => {
    if (isUserLoggedIn.value) {
      console.log('👤 User is authenticated, skipping guest access setup')
      hasGuestAccess.value = false
      return true
    }

    if (isSettingUp.value) {
      console.log('⏳ Guest access setup already in progress')
      return false
    }

    try {
      isSettingUp.value = true
      lastError.value = null

      console.log('🎭 Setting up guest access...', { force })

      // Panggil ensureGuestAccess, yang akan mengurus pembuatan/refresh token
      const success = await ensureGuestAccess({
        force,
        onError: (error) => {
          showError('Gagal mengatur akses tamu', error)
        },
      })

      if (success) {
        updateTokenInfo()
        console.log('✅ Guest access setup successful')
        return true
      } else {
        hasGuestAccess.value = false
        showError('Tidak dapat mengatur akses tamu')
        return false
      }
    } catch (error) {
      console.error('❌ Error setting up guest access:', error)
      hasGuestAccess.value = false
      showError('Terjadi kesalahan saat mengatur akses tamu', error)
      return false
    } finally {
      isSettingUp.value = false
    }
  }

  // Tambahkan fungsi untuk validasi header dan token secara reaktif
  const validateAccess = () => {
    if (isUserLoggedIn.value) {
      return true
    }
    const token = sessionStorage.getItem('guest_access_token')
    if (!token) {
      console.warn('⚠️ No guest token found, access is not available.')
      return false
    }
    if (!isGuestTokenValid()) {
      console.warn('⚠️ Guest token is invalid or expired, attempting to refresh...')
      // Jangan langsung memanggil setup, cukup kembalikan false dan biarkan watcher yang memicu
      return false
    }
    // Pastikan header terpasang
    if (!userApi.defaults.headers.common['Authorization']) {
      console.warn('⚠️ Authorization header is missing, refreshing token to set it.')
      return false
    }
    return true
  }

  const handleAuthError = async (error) => {
    console.error('🚨 Authentication error:', error)
    if (error.response?.status === 401) {
      if (isUserLoggedIn.value) {
        // User session expired
        authUserStore.clearAuthData()
        showError('Sesi Anda telah berakhir, silakan login kembali')
        if (redirectOnError) {
          router.push(redirectOnError)
        }
      } else {
        // Guest token expired or invalid
        console.log('🔄 Guest token invalid, attempting to setup new access...')
        // Panggil setupGuestAccess dengan force=true
        const refreshSuccess = await setupGuestAccess(true)
        if (!refreshSuccess) {
          showError('Akses tamu tidak tersedia, silakan login')
          if (redirectOnError) {
            router.push(redirectOnError)
          }
        }
      }
    } else {
      showError('Terjadi kesalahan autentikasi')
    }
  }

  const clearGuestData = () => {
    // Logika yang sama
    clearGuestAccess()
    hasGuestAccess.value = false
    guestTokenInfo.value = null
    lastError.value = null
  }

  const startAutoRefresh = () => {
    // Logika yang sama
    if (!autoRefresh) return
    if (refreshTimer) clearInterval(refreshTimer)
    refreshTimer = setInterval(
      () => {
        if (hasGuestAccess.value && !isUserLoggedIn.value && isGuestTokenValid()) {
          console.log('⏰ Auto refresh check...')
          // Panggil setupGuestAccess tanpa force, karena logic refresh ada di dalamnya
          setupGuestAccess()
        }
      },
      refreshInterval * 60 * 1000,
    )
    console.log(`⏰ Auto refresh started (every ${refreshInterval} minutes)`)
  }

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
      console.log('⏹️ Auto refresh stopped')
    }
  }

  // Lifecycle hooks
  onMounted(async () => {
    console.log('🚀 useGuestAccess mounted')
    // Jangan langsung setup, biarkan watcher yang memantau status login
    // Cukup update info token saat pertama kali dimount
    updateTokenInfo()
    if (autoRefresh) {
      startAutoRefresh()
    }
  })

  onUnmounted(() => {
    console.log('🔚 useGuestAccess unmounted')
    stopAutoRefresh()
  })

  // Watcher untuk memantau perubahan otentikasi
  const unwatchAuth = authUserStore.$subscribe((mutation, state) => {
    if (state.isAuthenticated && hasGuestAccess.value) {
      console.log('👤 User logged in, clearing guest access')
      clearGuestData()
      stopAutoRefresh()
    } else if (!state.isAuthenticated && autoSetup && !hasGuestAccess.value) {
      console.log('👤 User logged out, setting up guest access')
      setupGuestAccess()
      if (autoRefresh) {
        startAutoRefresh()
      }
    }
  })

  // Watcher baru untuk memantau hasGuestAccess
  watch(hasGuestAccess, (newValue, oldValue) => {
    if (newValue && !oldValue) {
      console.log('✨ Guest access now available, syncing header')
      // Sinkronisasi header di sini juga untuk memastikan
      userApi.defaults.headers.common['Authorization'] =
        `Bearer ${sessionStorage.getItem('guest_access_token')}`
    }
  })

  // Return composable interface
  return {
    isSettingUp,
    hasGuestAccess,
    guestTokenInfo,
    lastError,
    isUserLoggedIn,
    accessMode,
    canAccessProtectedContent,
    tokenExpiryInfo,
    setupGuestAccess,
    validateAccess,
    handleAuthError,
    clearGuestData,
    startAutoRefresh,
    stopAutoRefresh,
    cleanup: () => {
      unwatchAuth()
      stopAutoRefresh()
    },
  }
}

export default useGuestAccess
