<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import DialogConfirm from '@/components/DialogConfirm.vue'
import DialogNotif from '@/components/DialogNotif.vue'
import { useAuthAdminStore } from '@/stores/auth-admin-store'

const authStore = useAuthAdminStore()

const $q = useQuasar()
const register = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  birthDate: '2025-01-01',
  gender: null,
  address: '',
  appCode: null,
})
const isPwd = ref(true)
const isPwdConfirm = ref(true)
const loading = ref(false)
const dialogConfirm = ref(false)

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  birthDate: '',
  gender: '',
  address: '',
  appCode: '',
})

//Taman Safari Indonesia = 000001
//Dufan Ancol = 000002
//Trans Studio Bandung = 000003
//Floating Market Lembang = 000004
const appCodeOptions = [
  {
    label: 'Taman Safari Indonesia',
    value: '000001',
  },
  {
    label: 'Dufan Ancol',
    value: '000002',
  },
  {
    label: 'Trans Studio Bandung',
    value: '000003',
  },
  {
    label: 'Floating Market Lembang',
    value: '000004',
  },
]

const registerBtn = async () => {
  try {
    if (!validateForm()) {
      return
    }

    loading.value = true
    await authStore.registerApi(register.value)
    loading.value = false
    $q.dialog({
      component: DialogNotif,

      // props forwarded to your custom component
      componentProps: {
        text: 'Silakan cek email untuk verifikasi email terlebih dahulu',
        title: 'Pendaftaran Berhasil',
        persistent: true,
        btnCancel: false,
        // ...more..props...
      },
    }).onOk(() => {
      console.log('OK')
    })
    this.resetForm()
  } catch (error) {
    // Tambahkan error handling untuk response dari server
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.message.includes('email')) {
        this.errors.email = 'Email tidak ditemukan'
      } else if (error.response.data.message.includes('password')) {
        this.errors.confirmPassword = error.response.data.message
      } else {
        toast.error('Pendaftaran gagal: ' + error.response.data.message, {
          position: 'top-center',
        })
      }
    }
    loading.value = false
  }
}

const resetForm = () => {
  register.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    birthDate: '2025-01-01',
    gender: null,
    address: '',
    appCode: null,
  }
}

const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

// Fungsi validasi
const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    address: '',
    appCode: '',
  }
  let isValid = true

  // Validasi name
  if (!register.value.name) {
    errors.value.name = 'Nama harus diisi'
    isValid = false
  }

  // Validasi email
  if (!register.value.email) {
    errors.value.email = 'Email harus diisi'
    isValid = false
  } else if (!isValidEmail(register.value.email)) {
    errors.value.email = 'Format email tidak valid'
    isValid = false
  }

  // Validasi password
  if (!register.value.password) {
    errors.value.password = 'Password harus diisi'
    isValid = false
  } else if (register.value.password.length < 6) {
    errors.value.password = 'Password minimal 6 karakter'
    isValid = false
  }

  // Validasi confirmPassword
  if (!register.value.confirmPassword) {
    errors.value.confirmPassword = 'Password harus diisi'
    isValid = false
  } else if (register.value.confirmPassword !== register.value.password) {
    errors.value.confirmPassword = 'Password tidak sama'
    isValid = false
  }

  // Validasi phoneNumber
  if (!register.value.phoneNumber) {
    errors.value.phoneNumber = 'Nomor telepon harus diisi'
    isValid = false
  }

  // Validasi birthDate
  if (!register.value.birthDate) {
    errors.value.birthDate = 'Tanggal lahir harus diisi'
    isValid = false
  }

  // Validasi gender
  if (!register.value.gender) {
    errors.value.gender = 'Jenis kelamin harus diisi'
    isValid = false
  }

  // Validasi address
  if (!register.value.address) {
    errors.value.address = 'Alamat harus diisi'
    isValid = false
  }

  // Validasi appCode
  if (!register.value.appCode) {
    errors.value.appCode = 'Pilih aplikasi'
    isValid = false
  }

  return isValid
}

// Fungsi untuk validasi format email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Clear error saat user mulai mengetik
const clearNameError = () => {
  if (errors.value.name) {
    errors.value.name = ''
  }
}

const clearEmailError = () => {
  if (errors.value.email) {
    errors.value.email = ''
  }
}

const clearAddressError = () => {
  if (errors.value.address) {
    errors.value.address = ''
  }
}

const clearPasswordError = () => {
  if (errors.value.password) {
    errors.value.password = ''
  }
}

const clearConfirmPasswordError = () => {
  if (errors.value.confirmPassword) {
    errors.value.confirmPassword = ''
  }
}

const clearPhoneNumberError = () => {
  if (errors.value.phoneNumber) {
    errors.value.phoneNumber = ''
  }
}

const clearBirthDateError = () => {
  if (errors.value.birthDate) {
    errors.value.birthDate = ''
  }
}

const clearGenderError = () => {
  if (errors.value.gender) {
    errors.value.gender = ''
  }
}
const clearAppCodeError = () => {
  if (errors.value.appCode) {
    errors.value.appCode = ''
  }
}
</script>

<template>
  <q-page class="relative">
    <div class="flex justify-center items-center bg-background px-4 py-6">
      <div class="card-login">
        <div class="text-center">
          <h1 class="!text-3xl !font-bold !tracking-wide text-[#18181b]">JagaCipta</h1>
        </div>
        <div class="text-center">
          <h1 class="!text-base md:!text-lg !font-bold !mb-3 text-twBlack">Register</h1>
          <p class="text-sm md:text-base !font-light !text-twSecondary leading-6">
            Silahkan daftarkan akun anda
          </p>
        </div>

        <div class="flex flex-col gap-4 w-full text-twBlack">
          <div class="">
            <label for="" class="starlabel">Nama Lengkap</label>
            <q-input
              hide-bottom-space
              outlined
              dense
              v-model="register.name"
              @keyup.enter="registerBtn"
              placeholder="Masukkan nama lengkap"
              @update:model-value="clearNameError"
              :error="!!errors.name"
              :error-message="errors.name"
            >
            </q-input>
          </div>
          <div class="">
            <label for="" class="starlabel">Email</label>
            <q-input
              hide-bottom-space
              outlined
              dense
              v-model="register.email"
              @keyup.enter="registerBtn"
              @update:model-value="clearEmailError"
              placeholder="Masukkan email"
              autocomplete="new-email"
              :error="!!errors.email"
              :error-message="errors.email"
            >
            </q-input>
          </div>
          <div class="">
            <label for="" class="starlabel">Alamat</label>
            <q-input
              hide-bottom-space
              outlined
              dense
              v-model="register.address"
              @keyup.enter="registerBtn"
              placeholder="Masukkan alamat"
              @update:model-value="clearAddressError"
              :error="!!errors.address"
              :error-message="errors.address"
            >
            </q-input>
          </div>
          <div class="">
            <label for="" class="starlabel">No Ponsel</label>
            <q-input
              hide-bottom-space
              outlined
              dense
              v-model="register.phoneNumber"
              @keyup.enter="registerBtn"
              placeholder="Masukkan no ponsel"
              @update:model-value="clearPhoneNumberError"
              :error="!!errors.phoneNumber"
              :error-message="errors.phoneNumber"
            >
            </q-input>
          </div>
          <div class="">
            <label for="" class="starlabel">Jenis Kelamin</label>
            <q-select
              hide-bottom-space
              emit-value
              map-options
              outlined
              dense
              :options="[
                { label: 'Pria', value: 1 },
                { label: 'Wanita', value: 2 },
              ]"
              v-model="register.gender"
              @keyup.enter="registerBtn"
              label="Pilih jenis kelamin"
              @update:model-value="clearGenderError"
              :error="!!errors.gender"
              :error-message="errors.gender"
            >
            </q-select>
          </div>
          <div class="">
            <label for="" class="starlabel">Tanggal Lahir</label>
            <q-input
              hide-bottom-space
              outlined
              dense
              v-model="register.birthDate"
              mask="####-##-##"
              @update:model-value="clearBirthDateError"
              :error="!!errors.birthDate"
              :error-message="errors.birthDate"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="register.birthDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="">
            <label for="" class="starlabel">Password</label>
            <q-input
              hide-bottom-space
              outlined
              dense
              v-model="register.password"
              @keyup.enter="registerBtn"
              @update:model-value="clearPasswordError"
              placeholder="Buat password baru"
              :type="isPwd ? 'password' : 'text'"
              :error="!!errors.password"
              :error-message="errors.password"
              autocomplete="new-password"
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
          <div class="">
            <label for="" class="starlabel">Ulangin Password</label>
            <q-input
              hide-bottom-space
              outlined
              dense
              v-model="register.confirmPassword"
              @keyup.enter="registerBtn"
              placeholder="Masukkan kembali password"
              :type="isPwdConfirm ? 'password' : 'text'"
              @update:model-value="clearConfirmPasswordError"
              :error="!!errors.confirmPassword"
              :error-message="errors.confirmPassword"
            >
              <template v-slot:append>
                <q-icon
                  size="xs"
                  :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer text-twPrimary"
                  @click="isPwdConfirm = !isPwdConfirm"
                />
              </template>
            </q-input>
          </div>

          <div class="">
            <label for="" class="starlabel">Aplikasi</label>
            <q-select
              hide-bottom-space
              outlined
              dense
              v-model="register.appCode"
              @keyup.enter="registerBtn"
              @update:model-value="clearAppCodeError"
              label="Pilih aplikasi"
              emit-value
              map-options
              :options="appCodeOptions"
              :error="!!errors.appCode"
              :error-message="errors.appCode"
            >
            </q-select>
          </div>

          <div class="flex justify-between py-4 items-center text-[14px] text-twPrimary">
            <RouterLink to="/dashboard/auth/login" class="font-semibold">Kembali</RouterLink>
            <q-btn no-caps padding="sm xl" :loading="loading" @click="registerBtn" class="btn-login"
              >Daftar</q-btn
            >
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="absolute bottom-4 md:bottom-10 w-full">
      <div class="text-center">
        <p>Powered by</p>
        <p class="font-bold">Cartenz Teknologi Indonesia</p>
      </div>
    </div> -->
  </q-page>
</template>
