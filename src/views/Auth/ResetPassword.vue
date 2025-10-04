<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import DialogConfirm from '@/components/DialogConfirm.vue'
import { useAuthAdminStore } from '@/stores/auth-admin-store'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'

const route = useRoute()

const $q = useQuasar()
const showDialogConfirm = ref(false)
const loading = ref(false)
const dialogConfirm = ref(false)
const authStore = useAuthAdminStore()

const formReset = ref({
  token: '',
  newPassword: '',
})

const confirmPassword = ref('')

const errors = ref({
  newPassword: '',
  token: '',
  confirmPassword: '',
})

const isPwd = ref(false)
const isConfirmPwd = ref(false)

const handleResetPassword = async () => {
  // Validasi form sebelum submit
  if (!validateForm()) {
    return
  }
  loading.value = true
  const response = await authStore.resetPasswordApi(formReset.value)
  // setTimeout(() => {
  loading.value = false
  console.log(response, 'cek response')
  if (response) {
    $q.dialog({
      title: 'Reset Password Berhasil',
      message: 'Silakan login dengan password baru',
      ok: {
        push: true,
        color: 'primary',
      },
      persistent: true,
    }).onOk(() => {
      if (response.data?.isPengguna) {
        window.location.href = '/login'
      } else {
        window.location.href = '/dashboard/auth/login'
      }
    })
  }
}

const getTokenFromParams = async () => {
  const urlParams = route.query
  const token = urlParams.token

  if (!token) {
    $q.dialog({
      title: 'Verifikasi Gagal',
      message: 'Token tidak valid atau telah kadaluarsa',
      ok: {
        push: true,
        color: 'primary',
      },
      persistent: true,
    }).onOk(() => {
      // Redirect to login page when OK is clicked
      window.location.href = '/dashboard/auth/login'
    })
    return
  }

  formReset.value.token = token

  // Verify the token
  const response = await authStore.verifyResetTokenApi(token)

  if (!response) {
    $q.dialog({
      title: 'Verifikasi Gagal',
      message: 'Token tidak valid atau telah kadaluarsa',
      ok: {
        push: true,
        color: 'primary',
      },
      persistent: true,
    }).onOk(() => {
      // Redirect to login page when OK is clicked
      window.location.href = '/dashboard/auth/login'
    })
  } else {
    toast.success('Verifikasi email berhasil, silahkan isi form reset password', {
      position: 'top-center',
    })
  }
}

const validateForm = () => {
  errors.value = { newPassword: '', token: '' }
  let isValid = true

  // Validasi email
  if (!formReset.value.newPassword) {
    errors.value.newPassword = 'Password baru harus diisi'
    isValid = false
  }

  // Validasi password
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Konfirmasi password harus diisi'
    isValid = false
  }

  // Validasi konfirmasi password
  if (confirmPassword.value !== formReset.value.newPassword) {
    errors.value.confirmPassword = 'Konfirmasi password tidak sesuai'
    isValid = false
  }

  return isValid
}

const clearPasswordError = () => {
  if (errors.value.newPassword) {
    errors.value.newPassword = ''
  }
}

onMounted(async () => {
  await getTokenFromParams()
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
          <h1 class="!text-base md:!text-lg !font-bold !mb-3 text-twBlack">Reset Password</h1>
          <p class="text-sm md:text-base !font-light !text-twSecondary">
            Silakan membuat password baru. Password harus terdiri dari minimal 8 karakter kombinasi
            alfabet, angka dan simbol
          </p>
        </div>

        <div class="flex flex-col gap-4 w-full">
          <div class="text-twBlack">
            <label for="">Password</label>
            <q-input
              dense
              outlined
              v-model="formReset.newPassword"
              @keyup.enter="handleResetPassword"
              @update:model-value="clearPasswordError"
              placeholder="Masukkan Password anda"
              :type="isPwd ? 'password' : 'text'"
              :error="!!errors.newPassword"
              :error-message="errors.newPassword"
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
          </div>
          <div class="text-twBlack">
            <label for="">Konfirmasi Password</label>
            <q-input
              dense
              outlined
              v-model="confirmPassword"
              @keyup.enter="handleResetPassword"
              placeholder="Masukkan Konfirmasi Password anda"
              :type="isConfirmPwd ? 'password' : 'text'"
              :error="!!errors.confirmPassword"
              :error-message="errors.confirmPassword"
            >
              <template v-slot:append>
                <q-icon
                  size="xs"
                  :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer text-twPrimary"
                  @click="isConfirmPwd = !isConfirmPwd"
                />
              </template>
            </q-input>
          </div>
          <div class="flex justify-between py-4 items-center text-[14px] text-twPrimary">
            <RouterLink to="/dashboard/auth/login" class="font-semibold">Kembali</RouterLink>
            <q-btn
              no-caps
              padding="sm xl"
              :loading="loading"
              @click="handleResetPassword"
              class="btn-login"
              >Kirim</q-btn
            >
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

    <!-- <DialogConfirm
      v-model="showDialogConfirm"
      ref="dialogConfirm"
      title="Konfirmasi Pembuatan Wahana Baru"
      description="Anda yakin ingin membuat wahana baru?"
      position="right"
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
          onClick: submitWahanaBaru,
          loading: loading,
          closePopup: false,
        },
      ]"
    >
    </DialogConfirm> -->
  </q-page>
</template>
