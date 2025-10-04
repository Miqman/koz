<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MapLeafet from '@/components/MapLeafet.vue'
import DialogConfirm from '@/components/DialogConfirm.vue'
import { useQuasar, SessionStorage } from 'quasar'
import { useWpStore } from '@/stores/wp-store'
import { useMasterStore } from '@/stores/master-store'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const wpStore = useWpStore()
const masterStore = useMasterStore()

const loading = ref(false)
const showDialogConfirm = ref(false)

const form = ref({
  id_wp: '',
  npwpd: '',
  nama_wp: '',
  tipe: '',
  wilayah: '',
  alamat_lengkap: '',
  latitude: '',
  longitude: '',
  jumlah_kursi: '',
  luas_area: '',
  perangkat_terinstal: '',
  status: true,
})
const status_options = [
  { label: 'Aktif', value: 1 },
  { label: 'Tidak Aktif', value: 0 },
]

const tipe_options = ref([
  { label: 'Restoran', value: 1 },
  { label: 'Hotel', value: 2 },
  { label: 'Toko', value: 3 },
  { label: 'Lainnya', value: 4 },
])

const wilayah_options = ref([
  { label: 'Jakarta Pusat', value: 1 },
  { label: 'Jakarta Utara', value: 2 },
  { label: 'Jakarta Barat', value: 3 },
  { label: 'Jakarta Selatan', value: 4 },
  { label: 'Jakarta Timur', value: 5 },
])

const perangkat_options = [
  { label: 'Printer Thermal', value: 'printer_thermal' },
  { label: 'Scanner', value: 'scanner' },
  { label: 'Barcode Reader', value: 'barcode_reader' },
  { label: 'Lainnya', value: 'lainnya' },
]

//computed
const isEdit = computed(() => route.name === 'editWajibPajak' && !!route.params.id)
const wpId = computed(() => route.params.id)

const submitWajibPajak = () => {
  const formData = {
    profile_id: form.value.id_wp,
    npwpd: form.value.npwpd,
    nama_wp: form.value.nama_wp,
    tipe: form.value.tipe,
    wilayah: form.value.wilayah,
    alamat_lengkap: form.value.alamat_lengkap,
    latitude: form.value.latitude,
    longitude: form.value.longitude,
    jumlah_kursi: form.value.jumlah_kursi,
    luas_area: form.value.luas_area,
    perangkat_terinstal: form.value.perangkat_terinstal,
    status: form.value.status,
  }

  loading.value = true
  if (!isEdit.value) {
    // TODO: Implement createWajibPajak API
    console.log('Creating new wajib pajak:', formData)
    wpStore.createWpApi(formData).then((res) => {
      console.log(res, 'data wp')
      if (res.success) {
        showDialogConfirm.value = false
        router.push('/dashboard/wajib-pajak').then(() => {
          $q.notify({
            type: 'positive',
            message: 'Wajib Pajak berhasil ditambahkan',
            position: 'top',
          })
        })
        loading.value = false
      }
    })
  } else {
    // TODO: Implement updateWajibPajak API
    console.log('Updating wajib pajak:', formData)
    wpStore.updateWpApi(wpId.value, formData).then((res) => {
      console.log(res, 'data wp')
      if (res.success) {
        showDialogConfirm.value = false
        router.push('/dashboard/wajib-pajak').then(() => {
          $q.notify({
            type: 'positive',
            message: 'Wajib Pajak berhasil diperbarui',
            position: 'top',
          })
        })
        loading.value = false
      }
    })
  }
}

const btnSubmitWajibPajak = () => {
  // TODO: Add validation here
  showDialogConfirm.value = true
}

const getWpById = () => {
  wpStore.getWPByidApi(wpId.value).then((res) => {
    console.log(res, 'data wp')
    if (res.success) {
      form.value.id_wp = res.data.id
      form.value.npwpd = res.data.npwpd
      form.value.nama_wp = res.data.nama
      form.value.tipe = res.data.tipe_venue
      form.value.wilayah = res.data.kota_kabupaten_id
      form.value.alamat_lengkap = res.data.alamat

      form.value.latitude = res.data.latitude || ''
      form.value.longitude = res.data.longitude || ''
      form.value.jumlah_kursi = res.data.jumlah_kursi
      form.value.luas_area = res.data.luas_area || ''
      form.value.perangkat_terinstal = res.data.perangkat_terinstal || ''
      form.value.status = res.data.is_active || ''
    }
  })
}

const getKotaKabupaten = () => {
  masterStore.getKotaKabupatenApi().then((res) => {
    console.log(res, 'data kota kabupaten')
    if (res.success) {
      wilayah_options.value = res.data.map((item) => ({
        label: item.nama,
        value: item.id,
      }))
    }
  })
}

const getTipeVanue = () => {
  masterStore.getTipeVanueApi().then((res) => {
    console.log(res, 'data tipe vanue')
    if (res.success) {
      tipe_options.value = res.data.map((item) => ({
        label: item.nama,
        value: item.id,
      }))
    }
  })
}

onMounted(() => {
  console.log('mounted')
  if (isEdit.value) {
    getWpById()
  }
  getKotaKabupaten()
  getTipeVanue()
})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Pengaturan Wajib Pajak</p>
      <q-space></q-space>
      <!-- <q-select v-model="selectedMonth" dense class="bg-white" :options="monthsOptions" outlined /> -->
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <!-- Section1 -->
      <div class="card p-4 space-y-4">
        <div class="mb-2">
          <p class="text-base font-semibold">
            {{ isEdit ? 'Formulir Edit Wajib Pajak' : 'Formulir Tambah Wajib Pajak Baru' }}
          </p>
          <p class="text-xs text-twSecondary">
            Silakan isi formulir di bawah ini dengan data yang benar dan dapat dipertanggungjawabkan
          </p>
        </div>

        <!-- Formulir -->
        <div class="space-y-4 mt-6">
          <!-- ID Wajib Pajak dan NPWPD -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="">ID Wajib Pajak</label>
              <q-input
                v-model="form.id_wp"
                dense
                class="bg-white"
                placeholder="ID Wajib Pajak"
                outlined
                :readonly="isEdit"
              />
              <p v-if="isEdit" class="text-xs text-gray-500 mt-1">Terisi otomatis oleh sistem</p>
            </div>
            <div>
              <label for="" class="starlabel">NPWPD</label>
              <q-input
                v-model="form.npwpd"
                dense
                class="bg-white"
                placeholder="Masukkan NPWPD"
                outlined
              />
            </div>
          </div>

          <!-- Nama Wajib Pajak -->
          <div>
            <label for="" class="starlabel">Nama Wajib Pajak</label>
            <q-input
              v-model="form.nama_wp"
              dense
              class="bg-white"
              placeholder="Masukkan Nama Wajib Pajak"
              outlined
            />
          </div>

          <!-- Tipe dan Wilayah -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="" class="starlabel">Tipe</label>
              <q-select
                v-model="form.tipe"
                dense
                class="bg-white"
                :options="tipe_options"
                placeholder="Pilih tipe"
                outlined
                emit-value
                map-options
              />
            </div>
            <div>
              <label for="" class="starlabel">Wilayah</label>
              <q-select
                v-model="form.wilayah"
                dense
                class="bg-white"
                :options="wilayah_options"
                placeholder="Pilih wilayah"
                outlined
                emit-value
                map-options
              />
            </div>
          </div>

          <!-- Alamat Lengkap -->
          <div>
            <label for="">Alamat Lengkap</label>
            <q-input
              v-model="form.alamat_lengkap"
              type="textarea"
              dense
              class="bg-white"
              placeholder="Masukkan alamat lengkap"
              outlined
              rows="3"
            />
          </div>

          <!-- Latitude dan Longitude -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="" class="starlabel">Latitude</label>
              <q-input
                v-model="form.latitude"
                dense
                class="bg-white"
                placeholder="Masukkan latitude"
                outlined
              />
            </div>
            <div>
              <label for="" class="starlabel">Longitude</label>
              <q-input
                v-model="form.longitude"
                dense
                class="bg-white"
                placeholder="Masukkan longitude"
                outlined
              />
            </div>
          </div>

          <!-- Jumlah Kursi dan Luas Area -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="" class="starlabel">Jumlah Kursi</label>
              <q-input
                v-model="form.jumlah_kursi"
                dense
                class="bg-white"
                placeholder="Masukkan jumlah kursi"
                outlined
              />
            </div>
            <div>
              <label for="" class="starlabel">Luas Area (m²)</label>
              <q-input
                v-model="form.luas_area"
                dense
                class="bg-white"
                placeholder="Masukkan luas area"
                outlined
              />
            </div>
          </div>

          <!-- Perangkat Terinstal dan Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="" class="starlabel">Perangkat Terinstal</label>
              <q-select
                v-model="form.perangkat_terinstal"
                dense
                class="bg-white"
                :options="perangkat_options"
                placeholder="Pilih Perangkat"
                outlined
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
            @click="btnSubmitWajibPajak"
          />
        </div>
      </div>
    </div>

    <DialogConfirm
      v-model="showDialogConfirm"
      ref="dialogConfirm"
      :title="isEdit ? 'Konfirmasi Perbaruan Wajib Pajak' : 'Konfirmasi Pembuatan Wajib Pajak Baru'"
      :description="
        isEdit
          ? 'Anda yakin ingin mengupdate wajib pajak?'
          : 'Anda yakin ingin membuat wajib pajak baru?'
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
          onClick: submitWajibPajak,
          loading: loading,
          closePopup: false,
        },
      ]"
    >
    </DialogConfirm>
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
