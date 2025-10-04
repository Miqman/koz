// src/composables/useDarkMode.js
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export function useDarkMode() {
  const $q = useQuasar()
  const isDark = ref(false)

  // Apply dark mode to document and Quasar
  const applyDarkMode = (dark) => {
    // Toggle Tailwind dark mode
    if (dark) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('body--dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('body--dark')
    }

    // Toggle Quasar dark mode
    $q.dark.set(dark)

    // Save to localStorage
    localStorage.setItem('darkMode', dark.toString())
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
  }

  // Set dark mode explicitly
  const setDarkMode = (value) => {
    isDark.value = value
  }

  // Get system preference
  const getSystemPreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Initialize dark mode - FIXED VERSION
  const initializeDarkMode = () => {
    // Check localStorage for saved preference
    const savedDarkMode = localStorage.getItem('darkMode')

    if (savedDarkMode !== null) {
      isDark.value = savedDarkMode === 'true'
    } else {
      // CHANGED: Force light theme as default instead of system preference
      isDark.value = false // Always default to light theme
      // Save the default preference
      localStorage.setItem('darkMode', 'false')
    }

    applyDarkMode(isDark.value)
  }

  // Watch for dark mode changes
  watch(isDark, (newValue) => {
    applyDarkMode(newValue)
  })

  // Setup on mount
  onMounted(() => {
    initializeDarkMode()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (localStorage.getItem('darkMode') === null) {
        // CHANGED: Force light theme even on system changes
        isDark.value = false // Always stay light
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  })

  return {
    isDark,
    toggleDarkMode,
    setDarkMode,
    getSystemPreference,
  }
}
