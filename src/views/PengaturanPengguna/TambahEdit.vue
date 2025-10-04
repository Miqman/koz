<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DialogConfirm from '@/components/DialogConfirm.vue'
import DialogForm from '@/components/DialogForm.vue'
import { useQuasar, SessionStorage } from 'quasar'
import { useAuthAdminStore } from '@/stores/auth-admin-store'
import { useMasterStore } from '@/stores/master-store'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthAdminStore()
const masterStore = useMasterStore()

const loading = ref(false)
const loadingDetail = ref(false)
const loadingPassword = ref(false)
const showDialogConfirm = ref(false)
const showPasswordDialog = ref(false)
const isPwd = ref(true)
const isPwdConfirm = ref(true)

const form = ref({
  id_pengguna: 'US0001',
  username: '',
  nama_lengkap: '',
  email: '',
  jabatan: '',
  status: true,
  password: '',
})

const passwordForm = ref({
  password: '',
  confirm_password: '',
})

const status_options = [
  { label: 'Aktif', value: 1 },
  { label: 'Tidak Aktif', value: 0 },
]

const jabatan_options = computed(() => {
  if (user.value.role === 1) {
    return [
      { label: 'Administrator', value: 2 },
      { label: 'User', value: 3 },
    ]
  } else if (user.value.role === 2) {
    return [{ label: 'User', value: 3 }]
  }
  // else {
  //   return [
  //     { label: 'Super Admin', value: 1 },
  //     { label: 'Administrator', value: 2 },
  //     { label: 'User', value: 3 },
  //   ]
  // }
})

//computed
const user = computed(() => authStore.user)
const isEdit = computed(() => route.name === 'editPengaturanPengguna' && !!route.params.id)
const penggunaId = computed(() => route.params.id)

const submitPengguna = () => {
  const payload = {
    username: form.value.username,
    email: form.value.email,
    full_name: form.value.nama_lengkap,
    role: form.value.jabatan,
    status: form.value.status,
  }

  loading.value = true
  if (!isEdit.value) {
    console.log('Creating new pengguna:', payload)
    payload.password = form.value.password

    masterStore
      .createUsersApi(payload)
      .then((res) => {
        console.log(res, 'data pengguna')
        if (res.success) {
          showDialogConfirm.value = false
          router.push('/pengaturan-pengguna').then(() => {
            $q.notify({
              type: 'positive',
              message: 'Pengguna berhasil ditambahkan',
              position: 'top',
            })
          })
        }
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    console.log('Updating pengguna:', payload)
    masterStore
      .updateUsersApi(penggunaId.value, payload)
      .then((res) => {
        console.log(res, 'data pengguna')
        if (res.success) {
          showDialogConfirm.value = false
          router.push('/pengaturan-pengguna').then(() => {
            $q.notify({
              type: 'positive',
              message: 'Pengguna berhasil diperbarui',
              position: 'top',
            })
          })
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const btnSubmitPengguna = () => {
  // TODO: Add validation here
  showDialogConfirm.value = true
}

const openEditPassword = () => {
  passwordForm.value.password = ''
  passwordForm.value.confirm_password = ''
  showPasswordDialog.value = true
}

const submitPassword = () => {
  // Validasi password
  if (!passwordForm.value.password) {
    $q.notify({
      type: 'negative',
      message: 'Password tidak boleh kosong',
      position: 'top',
    })
    return
  }

  if (passwordForm.value.password.length < 6) {
    $q.notify({
      type: 'negative',
      message: 'Password minimal 6 karakter',
      position: 'top',
    })
    return
  }

  if (passwordForm.value.password !== passwordForm.value.confirm_password) {
    $q.notify({
      type: 'negative',
      message: 'Konfirmasi password tidak sesuai',
      position: 'top',
    })
    return
  }

  loadingPassword.value = true
  const payload = {
    newPassword: passwordForm.value.password,
  }

  masterStore
    .updateUserPasswordApi(penggunaId.value, payload)
    .then((res) => {
      console.log(res, 'update password response')
      if (res.success) {
        showPasswordDialog.value = false
        $q.notify({
          type: 'positive',
          message: 'Password berhasil diperbarui',
          position: 'top',
        })
        // Reset form
        passwordForm.value.password = ''
        passwordForm.value.confirm_password = ''
      } else {
        $q.notify({
          type: 'negative',
          message: res.message || 'Gagal memperbarui password',
          position: 'top',
        })
      }
    })
    .catch((error) => {
      console.error('Error updating password:', error)
      $q.notify({
        type: 'negative',
        message: 'Terjadi kesalahan saat memperbarui password',
        position: 'top',
      })
    })
    .finally(() => {
      loadingPassword.value = false
    })
}

const getPenggunaById = () => {
  loadingDetail.value = true
  $q.loading.show({
    message: 'Memuat data pengguna...',
  })
  masterStore.getUsersByIdApi(penggunaId.value).then((res) => {
    console.log(res, 'data pengguna')
    if (res.success) {
      form.value.id_pengguna = res.data.id
      form.value.username = res.data.username
      form.value.nama_lengkap = res.data.full_name
      form.value.email = res.data.email
      form.value.jabatan = res.data.role
      form.value.status = res.data.status
    } else {
      $q.notify({
        type: 'negative',
        message: 'Data pengguna tidak ditemukan',
        position: 'top',
      })
    }
    loadingDetail.value = false
    $q.loading.hide()
  })
}

onMounted(() => {
  console.log('mounted')
  if (isEdit.value) {
    getPenggunaById()
  }
})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Pengaturan Pengguna</p>
      <q-space></q-space>
      <!-- <q-select v-model="selectedMonth" dense class="bg-white" :options="monthsOptions" outlined /> -->
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <!-- Section1 -->
      <div class="card p-4 space-y-4">
        <div class="mb-2">
          <p class="text-base font-semibold">
            {{ isEdit ? 'Formulir Edit Pengguna' : 'Formulir Pengguna Baru' }}
          </p>
          <p class="text-xs text-twSecondary">
            Silakan isi formulir di bawah ini dengan data yang benar dan dapat dipertanggungjawabkan
          </p>
        </div>

        <!-- Formulir -->
        <div class="space-y-4 mt-6">
          <!-- ID Wajib Pajak dan NPWPD -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="isEdit">
              <label for="">ID Pengguna</label>
              <q-input
                v-model="form.id_pengguna"
                dense
                class="bg-white"
                placeholder="ID Pengguna"
                outlined
                readonly
              />
              <p class="text-xs text-gray-500 mt-1">Terisi otomatis oleh sistem</p>
            </div>
            <div>
              <label for="" class="starlabel">Username</label>
              <q-input
                v-model="form.username"
                dense
                class="bg-white"
                placeholder="Masukkan Username"
                outlined
                autocomplete="new-username"
              />
            </div>

            <div v-if="!isEdit">
              <label for="" class="starlabel">Password</label>
              <q-input
                autocomplete="new-password"
                v-model="form.password"
                dense
                class="bg-white"
                placeholder="Masukkan Password"
                outlined
                :type="isPwd ? 'password' : 'text'"
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
            <div v-if="isEdit">
              <label for=""
                >Password
                <span
                  ><q-icon
                    name="edit"
                    size="xs"
                    class="cursor-pointer text-twPrimary"
                    @click="openEditPassword"
                  ></q-icon></span
              ></label>
              <q-input
                dense
                class="bg-white"
                placeholder="Klik icon edit untuk mengubah password"
                outlined
                readonly
              >
                <template v-slot:append>
                  <q-icon size="xs" name="lock" class="text-gray-400" />
                </template>
              </q-input>
            </div>

            <!-- nama lengkap dan email -->
            <div>
              <label for="" class="starlabel">Nama Lengkap</label>
              <q-input
                v-model="form.nama_lengkap"
                dense
                class="bg-white"
                placeholder="Masukkan Nama Lengkap"
                outlined
              />
            </div>
            <div>
              <label for="" class="starlabel">Email</label>
              <q-input
                v-model="form.email"
                dense
                class="bg-white"
                placeholder="Masukkan Email"
                outlined
              />
            </div>

            <!-- jabatan dan Status -->
            <div>
              <label for="" class="starlabel">Jabatan</label>
              <q-select
                v-model="form.jabatan"
                dense
                class="bg-white"
                :options="jabatan_options"
                placeholder="Pilih Jabatan"
                outlined
                emit-value
                map-options
              />
            </div>
            <div>
              <label for="" class="starlabel">Status</label>
              <div class="flex items-center space-x-4">
                <q-toggle v-model="form.status" label="Aktif" />
              </div>
            </div>
          </div>
        </div>

        <!-- button batal dan simpan -->
        <div class="flex justify-end gap-2">
          <q-btn
            label="Batal"
            no-caps
            class="!rounded-lg"
            unelevated
            outline
            color="secondary"
            @click="router.back()"
          />
          <q-btn
            label="Simpan"
            no-caps
            class="!rounded-lg"
            unelevated
            color="secondary"
            @click="btnSubmitPengguna"
          />
        </div>
      </div>
    </div>

    <DialogConfirm
      v-model="showDialogConfirm"
      ref="dialogConfirm"
      :title="isEdit ? 'Konfirmasi Perbaruan Pengguna' : 'Konfirmasi Pembuatan Pengguna Baru'"
      :description="
        isEdit ? 'Anda yakin ingin mengupdate pengguna?' : 'Anda yakin ingin membuat pengguna baru?'
      "
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
          onClick: submitPengguna,
          loading: loading,
          closePopup: false,
        },
      ]"
    >
    </DialogConfirm>

    <DialogForm
      v-model="showPasswordDialog"
      title="Ubah Password Pengguna"
      description="Silakan masukkan password baru untuk pengguna ini"
      :buttons="[
        {
          label: 'Batal',
          outline: true,
          dense: true,
          color: 'secondary',
        },
        {
          label: 'Simpan',
          dense: true,
          color: 'secondary',
          onClick: submitPassword,
          loading: loadingPassword,
          closePopup: false,
        },
      ]"
    >
      <div class="space-y-4">
        <div>
          <label for="" class="starlabel">Password Baru</label>
          <q-input
            autocomplete="new-password"
            v-model="passwordForm.password"
            dense
            class="bg-white"
            placeholder="Masukkan Password Baru"
            outlined
            :type="isPwdConfirm ? 'password' : 'text'"
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
        <div>
          <label for="" class="starlabel">Konfirmasi Password</label>
          <q-input
            autocomplete="new-password"
            v-model="passwordForm.confirm_password"
            dense
            class="bg-white"
            placeholder="Masukkan Konfirmasi Password"
            outlined
            :type="isPwdConfirm ? 'password' : 'text'"
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
      </div>
    </DialogForm>
  </q-page>
</template>

<style scoped>
:deep(.q-tab-panel) {
  padding: 0 16px 16px 16px;
}

.starlabel::after {
  content: ' *';
  color: red;
}
</style>
