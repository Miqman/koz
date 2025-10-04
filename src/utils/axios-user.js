import axios from 'axios'
import { Cookies } from 'quasar'
import { toast } from 'vue3-toastify'

const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 900000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Selalu ambil token dari cookie USER
userApi.interceptors.request.use((config) => {
  const token = Cookies.get('session_id_lokawisata_pengguna') // khusus USER
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 🚨 Interceptor RESPONSE (refresh token otomatis)
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      // User refresh
      const { useAuthUserStore } = await import('@/stores/auth-user-store')
      const userStore = useAuthUserStore()
      const ok = await userStore.refreshToken()
      if (ok) {
        originalRequest.headers.Authorization = `Bearer ${Cookies.get('session_id_lokawisata_pengguna')}`
        return api(originalRequest)
      } else {
        // userStore.logout()
        // window.location.href = '/login'
      }
    }

    // Error lain → tampilkan toast
    if (error.response?.status === 500) {
      toast.error('Terjadi kesalahan!<br>Silahkan hubungi admin', {
        position: 'top-center',
        dangerouslyHTMLString: true,
      })
    } else if (error.message.includes('413')) {
      toast.error('Ukuran file terlalu besar', { position: 'top-center' })
    } else {
      toast.error(error.response?.data?.message || error.message, {
        position: 'top-center',
      })
    }

    return Promise.reject(error)
  },
)

export default userApi
