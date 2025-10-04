<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthAdminStore } from '@/stores/auth-admin-store'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const authStore = useAuthAdminStore()

const loading = ref(true)
const activationStatus = ref({
  success: false,
  message: '',
})

const urlLogin = ref('/dashboard/auth/login')

const activateUser = async () => {
  try {
    loading.value = true

    // Get token from URL query parameter
    const urlParams = route.query
    const token = urlParams.token

    if (!token) {
      activationStatus.value = {
        success: false,
        message: 'Link aktivasi tidak valid. Parameter token tidak ditemukan.',
      }
      return
    }

    // Call activation API with userId
    const response = await authStore.verifyEmailApi(token)
    console.log(response, 'RESPONSE')

    if (response.success) {
      activationStatus.value = {
        success: true,
        message: 'Akun berhasil diaktivasi. Silahkan login untuk melanjutkan.',
      }
      toast.success('Aktivasi berhasil!', {
        position: 'top-center',
        autoClose: 3000,
      })

      if (response.data?.isPengguna) {
        urlLogin.value = '/login'
      }
    } else {
      activationStatus.value = {
        success: false,
        message:
          response?.message ||
          'Gagal mengaktivasi akun. Silahkan coba lagi atau hubungi administrator.',
      }
      toast.error('Aktivasi gagal', {
        position: 'top-center',
        autoClose: 3000,
      })
    }
  } catch (error) {
    console.error('Activation error:', error)
    activationStatus.value = {
      success: false,
      message: 'Terjadi kesalahan saat mengaktivasi akun. Silahkan coba lagi nanti.',
    }
    // toast.error('Terjadi kesalahan', {
    //   position: 'top-center',
    //   autoClose: 3000,
    // })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  activateUser()
})
</script>

<template>
  <q-page class="bg-background">
    <div class="flex-1 flex justify-center items-center px-4 py-8 min-h-[calc(100vh-120px)]">
      <div class="card-login mb-4">
        <div class="text-center">
          <img
            src="../../assets/images/logoLogin.png"
            alt="icon_login"
            class="w-[245px] h-[40px]"
          />
        </div>
        <div class="text-center">
          <h1 class="!text-base md:!text-lg !font-bold !mb-3 text-twBlack">Aktivasi Akun</h1>

          <!-- Loading state -->
          <div v-if="loading" class="py-8 flex flex-col items-center">
            <q-spinner-dots color="primary" size="3em" />
            <p class="!mt-4 text-gray-600">Sedang memproses aktivasi akun...</p>
          </div>

          <!-- Success state -->
          <div v-else-if="activationStatus.success" class="py-8">
            <div class="flex justify-center mb-4">
              <q-icon name="check_circle" color="positive" size="4em" />
            </div>
            <h2 class="!text-xl !font-semibold text-green-600 !mb-2">Aktivasi Berhasil!</h2>
            <p class="text-gray-600 !mb-6">{{ activationStatus.message }}</p>
            <q-btn
              label="Login"
              color="primary"
              class="w-full"
              no-caps
              @click="router.push(urlLogin)"
            />
          </div>

          <!-- Error state -->
          <div v-else class="py-8">
            <div class="flex justify-center mb-4">
              <q-icon name="error" color="negative" size="4em" />
            </div>
            <h2 class="!text-xl !font-semibold text-red-600 !mb-2">Aktivasi Gagal</h2>
            <p class="text-gray-600 !my-6">{{ activationStatus.message }}</p>
            <div class="flex items-center gap-3 justify-center">
              <q-btn
                label="Kembali ke Login"
                color="primary"
                class="w-full"
                no-caps
                @click="router.push(urlLogin)"
              />
              <q-btn
                label="Hubungi Support"
                outline
                color="primary"
                class="w-full"
                no-caps
                @click="router.push(urlLogin)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="flex-shrink-0 p-4 md:p-6 mt-auto">
      <div class="text-center max-w-sm mx-auto">
        <div class="p-3">
          <p class="text-xs md:text-sm text-gray-500 mb-1 font-medium tracking-wide">Powered by</p>
          <p
            class="text-sm md:text-base text-gray-800 font-semibold tracking-wide hover:text-gray-900 transition-colors duration-200"
          >
            Cartenz Teknologi Indonesia
          </p>
        </div>
      </div>
    </footer>
  </q-page>
</template>
