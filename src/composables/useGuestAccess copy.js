// composables/useGuestAccess.js
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
  const isGuestAccessReady = ref(false)
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

  const canAccessProtectedContent = computed(() => {
    return isUserLoggedIn.value || hasGuestAccess.value
  })

  const tokenExpiryInfo = computed(() => {
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

  const showSuccess = (message) => {
    console.log('✅ Guest Access Success:', message)

    $q.notify({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 3000,
    })
  }

  const updateTokenInfo = () => {
    try {
      const tokenInfo = getGuestTokenInfo()
      guestTokenInfo.value = tokenInfo
      console.log('📊 Updated guest token info:', tokenInfo)
    } catch (error) {
      console.error('❌ Error updating token info:', error)
      guestTokenInfo.value = null
    }
  }

  const setupGuestAccess = async (force = false) => {
    if (isUserLoggedIn.value) {
      console.log('👤 User is authenticated, skipping guest access setup')
      isGuestAccessReady.value = true
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

      const success = await ensureGuestAccess({
        force,
        onError: (error) => {
          showError('Gagal mengatur akses tamu', error)
        },
      })

      if (success) {
        hasGuestAccess.value = true
        isGuestAccessReady.value = true
        updateTokenInfo()

        console.log('✅ Guest access setup successful')
        return true
      } else {
        hasGuestAccess.value = false
        isGuestAccessReady.value = false
        showError('Tidak dapat mengatur akses tamu')
        return false
      }
    } catch (error) {
      console.error('❌ Error setting up guest access:', error)
      hasGuestAccess.value = false
      isGuestAccessReady.value = false
      showError('Terjadi kesalahan saat mengatur akses tamu', error)
      return false
    } finally {
      isSettingUp.value = false
    }
  }

  const refreshToken = async () => {
    try {
      console.log('🔄 Refreshing guest token...')

      const success = refreshGuestTokenIfNeeded(60) // Refresh if expires within 60 minutes

      if (success) {
        updateTokenInfo()
        console.log('✅ Guest token refreshed successfully')
        return true
      } else {
        console.warn('⚠️ Guest token refresh failed')
        return false
      }
    } catch (error) {
      console.error('❌ Error refreshing guest token:', error)
      return false
    }
  }

  const validateAccess = () => {
    if (isUserLoggedIn.value) {
      return true
    }

    if (!hasGuestAccess.value) {
      showError('Akses tidak tersedia. Silakan login atau coba lagi.')
      return false
    }

    if (!isGuestTokenValid()) {
      console.warn('⚠️ Guest token is invalid, attempting to refresh...')
      setupGuestAccess(true)
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
        console.log('🔄 Guest token invalid, attempting to refresh...')
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
    try {
      console.log('🧹 Clearing guest access data...')

      clearGuestAccess()
      hasGuestAccess.value = false
      isGuestAccessReady.value = false
      guestTokenInfo.value = null
      lastError.value = null

      console.log('✅ Guest access data cleared')
    } catch (error) {
      console.error('❌ Error clearing guest data:', error)
    }
  }

  const startAutoRefresh = () => {
    if (!autoRefresh) return

    // Clear existing timer
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }

    // Set up new timer
    refreshTimer = setInterval(
      async () => {
        if (hasGuestAccess.value && !isUserLoggedIn.value) {
          console.log('⏰ Auto refresh check...')
          await refreshToken()
        }
      },
      refreshInterval * 60 * 1000,
    ) // Convert minutes to milliseconds

    console.log(`⏰ Auto refresh started (every ${refreshInterval} minutes)`)
  }

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
      console.log('⏹️ Auto refresh stopped')
    }
  }

  const getAccessSummary = () => {
    return {
      mode: accessMode.value,
      isReady: isGuestAccessReady.value,
      canAccess: canAccessProtectedContent.value,
      tokenInfo: guestTokenInfo.value,
      expiryInfo: tokenExpiryInfo.value,
      lastError: lastError.value,
    }
  }

  // Lifecycle hooks
  onMounted(async () => {
    console.log('🚀 useGuestAccess mounted')

    if (autoSetup) {
      await setupGuestAccess()
    }

    if (autoRefresh) {
      startAutoRefresh()
    }

    // Update token info initially
    updateTokenInfo()
  })

  onUnmounted(() => {
    console.log('🔚 useGuestAccess unmounted')
    stopAutoRefresh()
  })

  // Watch for auth changes
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

  // Return composable interface
  return {
    // Reactive state
    isGuestAccessReady,
    isSettingUp,
    hasGuestAccess,
    guestTokenInfo,
    lastError,

    // Computed properties
    isUserLoggedIn,
    accessMode,
    canAccessProtectedContent,
    tokenExpiryInfo,

    // Methods
    setupGuestAccess,
    refreshToken,
    validateAccess,
    handleAuthError,
    clearGuestData,
    getAccessSummary,
    updateTokenInfo,

    // Auto refresh controls
    startAutoRefresh,
    stopAutoRefresh,

    // Cleanup
    cleanup: () => {
      unwatchAuth()
      stopAutoRefresh()
    },
  }
}

// Default export
export default useGuestAccess
