import { defineStore } from 'pinia'
import { Cookies, LocalStorage } from 'quasar'
import api from '@/utils/axios'
import CryptoJS from 'crypto-js'

const COOKIE_NAME = 'SID'
const STORAGE_KEY = 'koz'
const COOKIE_CONFIG = {
  expires: 1, // 1 hari
  secure: true, // pastikan true untuk production (https)
  sameSite: 'Lax',
  path: '/',
}

const secretKey = 'y4nkH@E%D0s@'
function safeDecrypt() {
  const encrypted = LocalStorage.getItem(STORAGE_KEY)
  if (!encrypted) return null

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted ? JSON.parse(decrypted) : null
  } catch (e) {
    console.warn('Data corrupt:', e)
    // window.location.href = '/dashboard/auth/login'
    return null
  }
}

export const useAuthAdminStore = defineStore('auth-royal', {
  state: () => ({
    token: null,
    user: null,
    isInitialized: false,
  }),

  getters: {
    isAuthenticated: (state) => {
      const cookieToken = Cookies.get(COOKIE_NAME)
      return !!(cookieToken && cookieToken.trim() !== '' && state.isInitialized)
    },
    currentToken: (state) => state.token || Cookies.get(COOKIE_NAME),
    currentUser: (state) => state.user,
  },

  actions: {
    /** ✅ Initialize auth state dari cookie & localStorage */
    async initialize() {
      if (this.isInitialized) return
      const token = Cookies.get(COOKIE_NAME)
      const user = safeDecrypt()
      // console.log(user, 'cek user')

      if (!user) {
        await this.logout()
        return
      }

      if (token) {
        this.token = token
        this.user = user
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      this.isInitialized = true
    },

    /** ✅ Login admin */
    async adminLogin(payload) {
      try {
        // const res = await api.post('/api/v1/auth/login', payload, {
        //   headers: { 'x-platform-type': 'WEB' },
        // })

        const { token, user } = payload //dummy
        // const { token, user } = res.data.data
        // if (!token) throw new Error('Login gagal: Token tidak ditemukan')

        // const userInfo = await this.getProfile(accessToken)
        this.setAuthData(token, user)
        return payload
      } catch (err) {
        console.error('Admin login failed:', err)
        throw err
      }
    },

    /** ✅ Logout admin */
    async logout() {
      // try {
      //   if (this.currentToken) {
      //     await api.post(
      //       '/api/v1/auth/logout',
      //       {},
      //       {
      //         headers: { 'x-platform-type': 'WEB' },
      //       },
      //     )
      //   }
      // } catch (err) {
      //   console.warn('Logout gagal, lanjut hapus local data:', err)
      // } finally {
      //   this.clearAuthData()
      // }
      this.clearAuthData()
    },

    /** ✅ Set auth data (cookie + localStorage + state) */
    setAuthData(token, user) {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(user), secretKey).toString()
      Cookies.set(COOKIE_NAME, token, COOKIE_CONFIG)
      LocalStorage.set(STORAGE_KEY, encrypted)

      this.token = token
      this.user = user

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    /** ✅ Clear auth data */
    clearAuthData() {
      Cookies.remove(COOKIE_NAME)
      Cookies.remove(COOKIE_NAME, { path: '/' })
      Cookies.remove(COOKIE_NAME, { path: '/', domain: window.location.hostname })
      Cookies.remove(COOKIE_NAME, COOKIE_CONFIG)
      LocalStorage.remove(STORAGE_KEY)

      this.token = null
      this.user = null
      delete api.defaults.headers.common['Authorization']
    },

    /** ✅ Check auth (bisa panggil di middleware) */
    async checkAuth() {
      const token = Cookies.get(COOKIE_NAME)
      if (!token) {
        this.clearAuthData()
        return false
      }

      if (this.token !== token) {
        this.token = token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      return true
    },

    /** ✅ Refresh token otomatis */
    async refreshToken() {
      try {
        const res = await api.post(
          '/refresh-token',
          {},
          {
            headers: { 'x-platform-type': 'WEB' },
          },
        )
        const { accessToken } = res.data.data || {}
        if (accessToken) {
          this.setAuthData(accessToken, this.user)
          return true
        }
        return false
      } catch (err) {
        console.error('Admin refresh token gagal:', err)
        this.clearAuthData()
        return false
      }
    },

    /** ✅ Ambil profil user login */
    async getProfile(token) {
      const res = await api.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data
    },

    // Forgot password (dapat digunakan untuk admin atau user)
    async forgotPasswordApi(payloadEmail) {
      try {
        const endpoint = '/forgot-password'
        const response = await api.post(endpoint, payloadEmail)
        const result = response.data
        return result
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // Verify reset token
    async verifyResetTokenApi(token) {
      try {
        const endpoint = `/check-token?token=${token}`
        const response = await api.get(endpoint)

        const result = response.data
        return result
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // verify email
    async verifyEmailApi(token) {
      try {
        const response = await api.get('/verify-email?token=' + token)
        const result = response.data
        return result // Mengembalikan data pengguna dari respons API
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // Reset password
    async resetPasswordApi(payloadPass) {
      try {
        const endpoint = '/reset-password'
        const response = await api.post(endpoint, payloadPass)
        const result = response.data
        return result
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async getAppCodeApi() {
      try {
        const response = await api.get('/clients?page=1&limit=10000')
        const result = response.data
        return result
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
  },
})
