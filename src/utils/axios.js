import axios from 'axios'
import { Cookies } from 'quasar'
import { toast } from 'vue3-toastify'
import { handleValidationErrors } from '@/composables/useErrorHandle'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 900000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - selalu ambil token dari cookie admin
api.interceptors.request.use((config) => {
  const token = Cookies.get('SID') // khusus ADMIN
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle semua error responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { response } = error

    // Handle error berdasarkan status code
    if (response) {
      switch (response.status) {
        case 400:
        case 422:
          return handleValidationError(response)

        case 401:
          return handleUnauthorizedError(response, originalRequest)

        case 403:
          return handleForbiddenError(originalRequest)

        case 413:
          return handleFileSizeError()

        case 500:
          return handleServerError(response)

        default:
          return handleGenericError(response, error)
      }
    }

    // Handle network errors atau error tanpa response
    return handleNetworkError(error)
  },
)

// Helper functions untuk handle specific error types
function handleValidationError(response) {
  const responseData = response.data

  if (responseData?.errorCode === 'VALIDATION_FAILED' && responseData?.errors) {
    handleValidationErrors(responseData.errors)
  } else {
    showToast('error', responseData?.message || 'Data tidak valid')
  }

  return Promise.reject(response)
}

function handleUnauthorizedError(response, originalRequest) {
  const message = response.data?.message

  if (message === 'Token tidak valid') {
    showToast('error', 'Sesi telah berakhir, silahkan login kembali')
    logoutAndRedirect()
  } else {
    showToast('error', message || 'Unauthorized access')
  }

  return Promise.reject(response)
}

function handleForbiddenError(originalRequest) {
  if (!originalRequest._retry) {
    originalRequest._retry = true
    logoutAndRedirect()
  }
  return Promise.reject(new Error('Access forbidden'))
}

function handleFileSizeError() {
  showToast('error', 'Ukuran file terlalu besar')
  return Promise.reject(new Error('File size too large'))
}

function handleServerError(response) {
  // Check if error response is not a file blob before showing toast
  if (!(response.data instanceof Blob)) {
    showToast('error', 'Terjadi kesalahan!<br>Silahkan hubungi admin', true)
  }
  return Promise.reject(response)
}

function handleGenericError(response, error) {
  const message = response?.data?.message || error.message || 'Terjadi kesalahan'
  showToast('error', message)
  return Promise.reject(error)
}

function handleNetworkError(error) {
  let message = 'Terjadi kesalahan jaringan'

  if (error.code === 'ECONNABORTED') {
    message = 'Request timeout, silahkan coba lagi'
  } else if (error.message.includes('Network Error')) {
    message = 'Tidak dapat terhubung ke server'
  }

  showToast('error', message)
  return Promise.reject(error)
}

// Utility functions
function showToast(type, message, isHTML = false) {
  const options = {
    position: 'top-center',
    ...(isHTML && { dangerouslyHTMLString: true }),
  }

  if (type === 'error') {
    toast.error(message, options)
  } else if (type === 'success') {
    toast.success(message, options)
  } else if (type === 'warning') {
    toast.warning(message, options)
  } else {
    toast.info(message, options)
  }
}

function logoutAndRedirect() {
  // Lazy import store untuk menghindari circular dependency
  try {
    // Hapus cookie SID
    Cookies.remove('SID')

    // Redirect ke login page
    setTimeout(() => {
      window.location.href = '/login'
    }, 1200)
  } catch (error) {
    console.error('Error during logout:', error)
    // Fallback redirect
    window.location.href = '/login'
  }
}

export default api
