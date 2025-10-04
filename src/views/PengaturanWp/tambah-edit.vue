<script setup>
import { ref, onMounted, computed } from 'vue'
import DialogConfirm from '@/components/DialogConfirm.vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthAdminStore } from '@/stores/auth-admin-store'

const router = useRouter()
const route = useRoute()
const authStore = useAuthAdminStore()

const showDialogConfirm = ref(false)
const dialogConfirm = ref(null)
const loading = ref(false)
const tab = ref('informasi_akun')

const formInformasiAkun = ref({
  id_wp: '',
  nama_wp: 'Hotel Mawar',
  email : 'support@hotelmawar.com',
  nopd: '02343434343',
  npwpd: '23324324324',
  alamat: 'Jl. Kecubung No 1',
  provinsi: 'Jawa Barat',
  kota_kabupaten: 'Kabupaten Bandung',
  status: 'Aktif',
})

const formPassword = ref({
  old_password: '',
  new_password: '',
  new_password_confirmation: '',
})

// Data untuk dropdown
const provinsiOptions = ref([
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'DKI Jakarta',
  'Banten',
  'Yogyakarta'
])

const kotaKabupatenOptions = ref([
  'Kabupaten Bandung',
  'Kota Bandung',
  'Kabupaten Bogor',
  'Kota Bogor',
  'Kabupaten Cianjur',
  'Kota Cirebon'
])

const statusOptions = ref([
  'Aktif',
  'Tidak Aktif'
])

//computed
const user = computed(() => authStore.user)
const isEdit = computed(() => route.name === 'editPengaturanWp' && !!route.params.id)
const wpId = computed(() => route.params.id)

//methods
const submitEditTambahWp = () => {
  console.log('submitEditTambahWp')
}

const getInfoWp = () => {
  if(wpId.value){
    // dummy data
    formInformasiAkun.value.id_wp = "1234567890"
    formInformasiAkun.value.nama_wp = "John Doe"
    formInformasiAkun.value.email = "john.doe@example.com"
    formInformasiAkun.value.nopd = "1234567890"
    formInformasiAkun.value.npwpd = "1234567890"
    formInformasiAkun.value.alamat = "Jl. Raya No. 123"
    formInformasiAkun.value.provinsi = "Jakarta"
    formInformasiAkun.value.kota_kabupaten = "Jakarta"
    formInformasiAkun.value.status = true
    formPassword.value.old_password = "1234567890"
    formPassword.value.new_password = "1234567890"
    formPassword.value.new_password_confirmation = "1234567890"
  }else{
    console.log('getInfoWp')
  }

}

// onmounted
onMounted(() => {
  getInfoWp()
})
</script>

<template>
<q-page class="">
    <div class="flex items-center p-4 gap-2">
        <div>
            <p class="text-3xl font-semibold">Pengaturan Wajib Pajak</p>
            <!-- breadcrumb -->
            <q-breadcrumbs>
                <template v-slot:separator>
                    <q-icon
                    size="1.5em"
                    name="chevron_right"
                    color="primary"
                    />
                </template>
                <q-breadcrumbs-el label="Pengaturan Wajib Pajak" to="/pengaturan-wp" />
                <q-breadcrumbs-el label="Ubah Informasi" />
            </q-breadcrumbs>
        </div>
      <q-space></q-space>
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <!-- Data State -->   
      <div class="space-y-4">
        <div class="card rounded-lg">
          <!-- Header dengan background biru -->
          <div class="bg-twSecondary py-3 px-4 rounded-t-lg">
            <div class="flex gap-2">
              <q-btn 
                @click="tab = 'informasi_akun'"
                :flat="tab !== 'informasi_akun'"
                color="primary"
                no-caps
                label="Informasi Akun"
              />
              <q-btn 
                @click="tab = 'password'"
                :flat="tab !== 'password'"
                color="primary"
                no-caps
                label="Password"
              />
            </div>
          </div>

          <!-- Form Content -->
          <div class="p-6 bg-white">
            <!-- Form Informasi Akun -->
            <div v-if="tab === 'informasi_akun'" class="space-y-6">
              <!-- Row 1: Nama Wajib Pajak dan Email -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <q-input
                    v-model="formInformasiAkun.nama_wp"
                    label="Nama Wajib Pajak"
                    outlined
                    color="primary"
                    placeholder="Masukkan nama wajib pajak"
                  />
                </div>
                <div>
                  <q-input
                    v-model="formInformasiAkun.email"
                    label="Email"
                    type="email"
                    outlined
                    color="primary"
                    placeholder="Masukkan email"
                  />
                </div>
              </div>

              <!-- Row 2: NOPD dan NPWPD -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <q-input
                    v-model="formInformasiAkun.nopd"
                    label="NOPD"
                    outlined
                    color="primary"
                    placeholder="Masukkan NOPD"
                  />
                </div>
                <div>
                  <q-input
                    v-model="formInformasiAkun.npwpd"
                    label="NPWPD"
                    outlined
                    color="primary"
                    placeholder="Masukkan NPWPD"
                  />
                </div>
              </div>

              <!-- Row 3: Alamat -->
              <div>
                <q-input
                  v-model="formInformasiAkun.alamat"
                  label="Alamat"
                  type="textarea"
                  outlined
                  color="primary"
                  rows="3"
                  placeholder="Masukkan alamat"
                />
              </div>

              <!-- Row 4: Dropdowns -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <q-select
                    v-model="formInformasiAkun.provinsi"
                    label="Provinsi"
                    outlined
                    color="primary"
                    :options="provinsiOptions"
                    emit-value
                    map-options
                    clearable
                  />
                </div>
                <div>
                  <q-select
                    v-model="formInformasiAkun.kota_kabupaten"
                    label="Kota/Kabupaten"
                    outlined
                    color="primary"
                    :options="kotaKabupatenOptions"
                    emit-value
                    map-options
                    clearable
                  />
                </div>
                <div>
                  <q-select
                    v-model="formInformasiAkun.status"
                    label="Status"
                    outlined
                    color="primary"
                    :options="statusOptions"
                    emit-value
                    map-options
                    clearable
                  />
                </div>
              </div>
            </div>

            <!-- Form Password -->
            <div v-if="tab === 'password'" class="space-y-6">
              <div>
                <q-input
                  v-model="formPassword.old_password"
                  label="Password Lama"
                  type="password"
                  outlined
                  color="primary"
                  placeholder="Masukkan password lama"
                />
              </div>
              <div>
                <q-input
                  v-model="formPassword.new_password"
                  label="Password Baru"
                  type="password"
                  outlined
                  color="primary"
                  placeholder="Masukkan password baru"
                />
              </div>
              <div>
                <q-input
                  v-model="formPassword.new_password_confirmation"
                  label="Konfirmasi Password Baru"
                  type="password"
                  outlined
                  color="primary"
                  placeholder="Konfirmasi password baru"
                />
              </div>
            </div>

            <!-- Button Batal dan Simpan -->
            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <q-btn
                @click="router.back()"
                outline
                color="primary"
                label="Batal"
                no-caps
              />
              <q-btn
                @click="showDialogConfirm = true"
                color="primary"
                label="Simpan"
                no-caps
              />
            </div>
          </div>
        </div>
       
      </div>
    </div>


    <DialogConfirm
      v-model="showDialogConfirm"
      ref="dialogConfirm"
      title="Ubah Data"
      description="Anda mengubah data Wajib Pajak?"
      :buttons="[
        {
          label: 'Tidak',
          outline: true,
          dense: true,
          color: 'primary',
        },
        {
          label: 'Ya',
          dense: true,
          color: 'primary',
          onClick: submitEditTambahWp,
          loading: loading,
          closePopup: false,
        }
      ]"
    >
    </DialogConfirm>
</q-page>
</template>