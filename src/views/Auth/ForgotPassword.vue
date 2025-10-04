<script>
import { mapActions } from 'pinia'
import { useAuthAdminStore } from '@/stores/auth-admin-store'
import { toast } from 'vue3-toastify'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      loading: false,
      email: '',
      errors: {
        email: '',
      },
    }
  },
  computed: {},
  methods: {
    ...mapActions(useAuthAdminStore, ['forgotPasswordApi']),
    async forgotPasswordBtn() {
      try {
        // Validasi form sebelum submit
        if (!this.validateForm()) {
          return
        }

        this.loading = true
        const payload = {
          email: this.email,
        }
        const response = await this.forgotPasswordApi(payload)
        if (response) {
          toast.success('Silahkan cek email Anda untuk reset password', {
            position: 'top-center',
            timeout: 3000,
          })
          this.loading = false
          // this.email = ''
        }
        this.loading = false
      } catch (error) {
        console.error('Error during reset password:', error)
        // Tambahkan error handling untuk response dari server
        if (error.response && error.response.data && error.response.data.message) {
          if (error.response.data.message.includes('email')) {
            this.errors.email = error.response.data.message
          } else {
            toast.error('Reset password gagal: ' + error.response.data.message, {
              position: 'top-center',
            })
          }
        } else {
          toast.error('Terjadi kesalahan saat reset password', {
            position: 'top-center',
          })
        }
        this.loading = false
      }
    },

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

    validateForm() {
      this.errors = { email: '' }
      let isValid = true

      // Validasi email
      if (!this.email) {
        this.errors.email = 'Email harus diisi'
        isValid = false
      } else if (!this.isValidEmail(this.email)) {
        this.errors.email = 'Format email tidak valid'
        isValid = false
      }

      return isValid
    },
  },
  mounted() {},
}
</script>

<template>
  <q-page class="bg-background">
    <div class="flex justify-center items-center px-4 py-8 min-h-[calc(100vh-50px)]">
      <div class="card-login mb-4">
        <div class="text-center">
          <img src="/images/logo_utama.png" alt="icon_login" class="w-[165px] h-[36px]" />
        </div>
        <div class="text-center">
          <h1 class="!text-base md:!text-lg !font-bold !mb-3 text-twBlack">Lupa Password</h1>
          <p class="text-sm md:text-base !font-light !text-twSecondary">
            Silahkan kirim email Anda untuk melakukan reset password
          </p>
        </div>

        <div class="flex flex-col gap-4 w-full">
          <div class="text-twBlack">
            <label for="" class="starlabel mb-1">Email</label>
            <q-input
              dense
              outlined
              v-model="email"
              @keyup.enter="forgotPasswordBtn"
              placeholder="herupradana@mail.com"
              :error="!!errors.email"
              :error-message="errors.email"
              @update:model-value="clearEmailError"
            >
            </q-input>
          </div>
          <div class="flex justify-between py-4 items-center text-[14px] text-twPrimary">
            <p @click="this.$router.back()" class="font-semibold cursor-pointer">Kembali</p>
            <q-btn
              unelevated
              no-caps
              padding="sm xl"
              :loading="loading"
              @click="forgotPasswordBtn"
              class="btn-login"
              >Kirim</q-btn
            >
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
