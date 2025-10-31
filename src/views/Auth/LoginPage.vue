<!-- LoginPage -->
<script>
import { mapActions, mapState } from 'pinia'
// import { useAuthStore } from '@/stores/auth-store'
import { useAuthAdminStore } from '@/stores/auth-admin-store'
import { toast } from 'vue3-toastify'

export default {
  name: 'LoginPage',
  data() {
    return {
      isPwd: true,
      loading: false,
      login: {
        email: '',
        password: '',
      },
      errors: {
        email: '',
        password: '',
      },
      isShowFitur: true,
    }
  },
  computed: {
    ...mapState(useAuthAdminStore, ['user']),
  },
  methods: {
    ...mapActions(useAuthAdminStore, ['adminLogin', 'logout']),

    // Fungsi validasi
    validateForm() {
      this.errors = { email: '', password: '' }
      let isValid = true

      // Validasi email
      if (!this.login.email) {
        this.errors.email = 'Email harus diisi'
        isValid = false
      } else if (!this.isValidEmail(this.login.email)) {
        this.errors.email = 'Format email tidak valid'
        isValid = false
      }

      // Validasi password
      if (!this.login.password) {
        this.errors.password = 'Password harus diisi'
        isValid = false
      } else if (this.login.password.length < 6) {
        this.errors.password = 'Password minimal 6 karakter'
        isValid = false
      }

      return isValid
    },

    // Fungsi untuk validasi format email
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    // Clear error saat user mulai mengetik
    clearEmailError() {
      if (this.errors.email) {
        this.errors.email = ''
      }
    },

    clearPasswordError() {
      if (this.errors.password) {
        this.errors.password = ''
      }
    },
    async loginBtn() {
      try {
        // Validasi form sebelum submit
        if (!this.validateForm()) {
          return
        }

        this.loading = true
        const payload = {
          email: this.login.email,
          password: this.login.password,
          token: '1234567890',
          user: {
            id: 1,
            name: 'Admin',
            email: this.login.email,
          },
        }
        await this.adminLogin(payload)
        // await this.adminLogin({
        //   email: this.login.email,
        //   password: this.login.password,
        // })
        this.$router.push('/').then(() => {
          toast.success('Berhasil login!', {
            position: 'top-right',
          })
          this.loading = false
        })
        this.loading = false
      } catch (error) {
        console.error('Error during login:', error)
        // Tambahkan error handling untuk response dari server
        if (error.response && error.response.data && error.response.data.message) {
          if (error.response.data.message.includes('email')) {
            this.errors.email = 'Email tidak ditemukan'
          } else if (error.response.data.message.includes('password')) {
            this.errors.password = 'Password salah'
          } else {
            toast.error('Login gagal: ' + error.response.data.message, {
              position: 'top-center',
            })
          }
        } else {
          toast.error('Terjadi kesalahan saat login', {
            position: 'top-center',
          })
        }
        this.loading = false
      }
    },
  },
  mounted() {},
}
</script>

<template>
  <q-page class="">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <!-- left -->
      <div class="md:!block hidden">
        <div class="bg-[url('/images/bg_login.png')] bg-cover bg-center h-screen">
          <div class="h-screen flex flex-col justify-center items-center relative">
            <!-- Container untuk gambar yang di-center -->
            <div class="relative flex justify-center items-center mb-8">
              <img src="/images/shadow_picking_logo.png" alt="shadowLogo" class="absolute w-[526px] h-[526px]" />
              <img src="/images/picking_user_window.png" alt="logo" class="relative z-10" />
            </div>
            <div class="flex flex-col text-white text-center w-[331px]">
              <p class="font-bold text-3xl">Admin Panel</p>
              <span class="!font-light text-lg">
                Pengaturan Akun Wajib Pajak
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- right -->
      <div class="px-4 py-8 flex flex-col">
        <div class="text-center md:mt-[105px] mb-2">
          <div class="font-['Russo_One'] text-[64px] text-twPrimary">KOZ</div>
        </div>

        <div class="flex justify-center items-center">
          <div class="md:w-[498px] w-full md:pt-6 md:px-12 px-4">
            <div class="mb-3">
              <h1 class="!text-2xl md:!text-[32px] !font-bold !mb-3 !leading-[40px]">Selamat Datang, <br>Silakan Melakukan Login.</br> </h1>
              <p class="text-base md:text-base !font-light !text-twBlackSecondary leading-6">
                Masukkan usernama dan password Anda
              </p>
            </div>
  
            <div class="flex flex-col gap-4 w-full">
              <div class="text-twBlack">
                <label for="">Username</label>
                <q-input
                  dense
                  outlined
                  v-model="login.email"
                  @keyup.enter="loginBtn"
                  @update:model-value="clearEmailError"
                  placeholder="Masukkan email anda"
                  :error="!!errors.email"
                  :error-message="errors.email"
                >
                </q-input>
              </div>
              <div class="text-twBlack">
                <label for="">Password</label>
                <q-input
                  dense
                  outlined
                  v-model="login.password"
                  @keyup.enter="loginBtn"
                  @update:model-value="clearPasswordError"
                  placeholder="Masukkan Password anda"
                  :type="isPwd ? 'password' : 'text'"
                  :error="!!errors.password"
                  :error-message="errors.password"
                >
                  <template v-slot:append>
                    <q-icon
                      size="xs"
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer text-twPrimary"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <!-- <div v-if="errors.password" class="text-red-500 text-sm mt-1">
                  {{ errors.password }}
                </div> -->
              </div>
  
              <div v-if="isShowFitur" class="flex justify-center text-[14px] text-twPrimary">
                <RouterLink to="/forgot-password" class="font-medium">Lupa Password</RouterLink>
              </div>
              <q-btn
                no-caps
                unelevated
                color="primary"
                padding="sm xl"
                :loading="loading"
                @click="loginBtn"
                class="!rounded-lg"
                >Masuk</q-btn
              >
            </div>

          </div>
        </div>

        <footer class="flex-shrink-0 p-4 md:p-6 mt-auto ">
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
      </div>
    </div>
  </q-page>
</template>
