<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { moment } from '@/utils/mixing'
import { formatDate } from '@/utils/formatDate'
import MapLeafet from '@/components/MapLeafet.vue'
import JenisPerangkat from './components/JenisPerangkat.vue'
import LogPerawatanPerangkat from './components/LogPerawatanPerangkat.vue'
import { useDashboardStore } from '@/stores/dashbaord-store'

const dsbStore = useDashboardStore()
// const $q = useQuasar()

// State
const selectedDate = ref({
  from: moment().startOf('month').format('YYYY-MM-DD'),
  to: moment().endOf('month').format('YYYY-MM-DD'),
})
const selectedMonth = ref(moment().month() + 1)
const monthsOptions = [
  { label: 'Januari', value: 1 },
  { label: 'Februari', value: 2 },
  { label: 'Maret', value: 3 },
  { label: 'April', value: 4 },
  { label: 'Mei', value: 5 },
  { label: 'Juni', value: 6 },
  { label: 'Juli', value: 7 },
  { label: 'Agustus', value: 8 },
  { label: 'September', value: 9 },
  { label: 'Oktober', value: 10 },
  { label: 'November', value: 11 },
  { label: 'Desember', value: 12 },
]

const isSummaryPercentage = ref(false)
const summaryData = ref(null)
const loading = ref(false)
const loadingSummary = ref(false)
const loadingLokasiPerangkat = ref(false)
const search = ref('')
const searchLokasi = ref('')
const statusLokasi = ref('')
const selectedLokasi = ref(null)
const mapRef = ref(null) // Ref untuk MapLeaflet component
const listLokasiPerangkat = ref([
  {
    id: 1,
    nama: 'Cafe A',
    kota_nama: 'Jakarta Pusat',
    is_active: 'Aktif',
    latitude: -6.2088,
    longitude: 106.8456,
    alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
    npwpd: 'NPWPD-001',
  },
  {
    id: 2,
    nama: 'Restoran B',
    kota_nama: 'Jakarta Selatan',
    is_active: 'Aktif',
    latitude: -6.2297,
    longitude: 106.6894,
    alamat: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
    npwpd: 'NPWPD-002',
  },
  {
    id: 3,
    nama: 'Hotel C',
    kota_nama: 'Jakarta Barat',
    is_active: 'Tidak Aktif',
    latitude: -6.1352,
    longitude: 106.8133,
    alamat: 'Jl. Gajah Mada No. 789, Jakarta Barat',
    npwpd: 'NPWPD-003',
  },
])

const handleSelectLokasi = (item) => {
  console.log(item, 'item')
  selectedLokasi.value = item

  // Move camera map ke lokasi yang dipilih jika ada koordinat
  if (mapRef.value && item.latitude && item.longitude) {
    try {
      const lat = parseFloat(item.latitude)
      const lng = parseFloat(item.longitude)

      if (!isNaN(lat) && !isNaN(lng)) {
        // Pindahkan kamera ke lokasi yang dipilih dengan zoom yang lebih dekat
        mapRef.value.moveToLocation(lat, lng, 18)
        console.log(`Moving map to: ${lat}, ${lng}`)
      } else {
        console.warn('Invalid coordinates:', item.latitude, item.longitude)
      }
    } catch (error) {
      console.error('Error moving map:', error)
    }
  } else {
    console.warn('No coordinates available for this location')
  }
}

const handleMonthChange = (value) => {
  console.log(value, 'value')
  // handle filter by value bulan yaitu 1,2,3 dan seterusnya sampai 12
  const month = value
  const from = moment()
    .month(month - 1)
    .startOf('month')
    .format('YYYY-MM-DD')
  const to = moment()
    .month(month - 1)
    .endOf('month')
    .format('YYYY-MM-DD')
  console.log(from, to, 'from to')
  selectedDate.value.from = from
  selectedDate.value.to = to

  // Update data immediately
  updateData()
}

const payloadDashboard = () => {
  const payload = {
    from: selectedDate.value.from,
    to: selectedDate.value.to,
  }
  return payload
}

const getPerangkatDashboardStatus = () => {
  loadingSummary.value = true
  const payload = payloadDashboard()
  dsbStore.getPerangkatDashboardStatusApi(payload.from, payload.to).then((res) => {
    console.log(res, 'data perangkat dashboard status')
    if (res.success) {
      summaryData.value = res.data || null
    }
    loadingSummary.value = false
  })
}
const getLokasiPerangkat = () => {
  loadingLokasiPerangkat.value = true
  const payload = payloadDashboard()
  dsbStore
    .getLokasiPerangkatApi(searchLokasi.value, statusLokasi.value, payload.from, payload.to)
    .then((res) => {
      console.log(res, 'data perangkat dashboard lokasi')
      if (res.success) {
        listLokasiPerangkat.value = res.data || []
      }
      loadingLokasiPerangkat.value = false
    })
}

const updateData = () => {
  getPerangkatDashboardStatus()
  getLokasiPerangkat()

  // for (let i = 0; i < 15; i++) {
  //   listLokasiPerangkat.value.push({
  //     id: i + 1,
  //     nama: 'Cafe A',
  //     kota_nama: 'Jakarta Pusat',
  //     is_active: 'Aktif',
  //   })
  // }
}

onMounted(() => {
  updateData()
})
</script>

<template>
  <q-page class="">
    <!-- Header -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Dashboard Perangkat</p>
      <q-space></q-space>
      <q-select
        v-model="selectedMonth"
        dense
        class="bg-white"
        :options="monthsOptions"
        outlined
        emit-value
        map-options
        @update:model-value="handleMonthChange"
      />
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <!-- Skeleton untuk Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="card relative">
            <div class="flex justify-between items-start shrink-0 p-4">
              <div class="flex flex-col items-start gap-2 self-stretch">
                <q-skeleton type="text" class="font-medium" />
                <q-skeleton type="text" class="text-xl" />
              </div>
              <q-skeleton type="QAvatar" size="50px" />
            </div>
            <div class="absolute top-5">
              <q-skeleton type="rect" class="w-1 h-[47px]" />
            </div>
          </div>
          <div class="card relative">
            <div class="flex justify-between items-start shrink-0 p-4">
              <div class="flex flex-col items-start gap-2 self-stretch">
                <q-skeleton type="text" class="font-medium" />
                <q-skeleton type="text" class="text-xl" />
              </div>
              <q-skeleton type="QAvatar" size="50px" />
            </div>
            <div class="absolute top-5">
              <q-skeleton type="rect" class="w-1 h-[47px]" />
            </div>
          </div>
          <div class="card relative">
            <div class="flex justify-between items-start shrink-0 p-4">
              <div class="flex flex-col items-start gap-2 self-stretch">
                <q-skeleton type="text" class="font-medium" />
                <q-skeleton type="text" class="text-xl" />
              </div>
              <q-skeleton type="QAvatar" size="50px" />
            </div>
            <div class="absolute top-5">
              <q-skeleton type="rect" class="w-1 h-[47px]" />
            </div>
          </div>
        </div>

        <!-- Skeleton untuk Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Skeleton untuk Chart -->
          <div class="card p-4">
            <div class="mb-4">
              <q-skeleton type="text" class="text-base" />
              <q-skeleton type="text" class="text-xs" />
            </div>
            <q-skeleton type="rect" class="w-full h-[322px]" />
          </div>

          <!-- Skeleton untuk Top 5 -->
          <div class="card p-4 space-y-4">
            <div>
              <q-skeleton type="text" class="text-base" />
              <q-skeleton type="text" class="text-xs" />
            </div>
            <div class="space-y-4">
              <div v-for="i in 5" :key="i" class="flex items-center">
                <div class="flex flex-col justify-center items-start gap-1 flex-[1_0_0]">
                  <q-skeleton type="text" class="font-semibold" />
                  <q-skeleton type="text" class="text-xs" />
                </div>
                <q-space></q-space>
                <q-skeleton type="QChip" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <!-- tambah kondisi ini jika sudah ada data dari api -->
      <!-- v-else-if="
          !loading &&
          (!summaryData ||
            (!summaryData.total_venues_with_music &&
              !summaryData.total_music_activities &&
              !summaryData.total_unique_artists)) -->
      <div class="flex items-center justify-center h-96" v-if="loading">
        <div class="text-center">
          <q-icon name="analytics" size="64px" color="grey-4" class="mb-4" />
          <p class="text-lg font-medium text-gray-600 mb-2">Tidak Ada Data Dashboard</p>
          <p class="text-sm text-gray-500 mb-4">
            Belum ada data pemutaran lagu untuk periode yang dipilih
          </p>
          <q-btn
            label="Coba Bulan Lain"
            no-caps
            class="!rounded-lg"
            unelevated
            color="secondary"
            @click="handleMonthChange(selectedMonth === 12 ? 1 : selectedMonth + 1)"
          />
        </div>
      </div>

      <!-- Data State -->
      <!-- tambah kondisi ini jika sudah ada data dari api -->
      <!-- v-else-if="!loading && summaryData" -->
      <div class="space-y-4">
        <!-- summary card data -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="card relative">
            <div class="flex justify-between items-start shrink-0 p-4">
              <div class="flex flex-col items-start gap-2 self-stretch">
                <p class="font-medium">Perangkat Aktif</p>
                <p class="text-xl font-semibold">
                  {{ summaryData?.active_devices.active_count }}/{{
                    summaryData?.active_devices.total_count
                  }}
                </p>
                <div class="flex items-center gap-2 text-xs">
                  <div class="flex items-center gap-2 rounded bg-twPrimary/20 p-1">
                    <q-icon
                      :name="
                        summaryData?.active_devices.direction == 'up'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                      "
                      size="12px"
                      color="primary"
                    />
                    <p class="text-twPrimary text-[10px]">
                      {{ summaryData?.active_devices.percentage_change }}%
                    </p>
                  </div>
                  <p class="">dari bulan kemarin</p>
                </div>
              </div>
              <div
                class="w-[50px] h-[50px] bg-twPrimary/20 rounded-lg flex items-center justify-center"
              >
                <q-icon name="o_storefront" size="32px" color="primary" />
              </div>
            </div>
            <div class="absolute top-5">
              <div class="w-1 h-[47px] bg-twPrimary"></div>
            </div>
          </div>
          <div class="card relative">
            <div class="flex justify-between items-start shrink-0 p-4">
              <div class="flex flex-col items-start gap-2 self-stretch">
                <p class="font-medium">Total Perawatan</p>
                <p class="text-xl font-semibold">{{ summaryData?.maintenance.total_count }}</p>
                <div class="flex items-center gap-2 text-xs">
                  <div class="flex items-center gap-2 rounded bg-twSecondary/20 p-1">
                    <q-icon
                      :name="
                        summaryData?.maintenance.direction == 'up'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                      "
                      size="12px"
                      class="!text-twGrayBlack"
                    />
                    <p class="text-twSecondary text-[10px]">
                      {{ summaryData?.maintenance.percentage_change }}%
                    </p>
                  </div>
                  <p class="">dari bulan kemarin</p>
                </div>
              </div>
              <div
                class="w-[50px] h-[50px] bg-twGrayBlack/20 rounded-lg flex items-center justify-center"
              >
                <q-icon name="o_audiotrack" size="32px" class="!text-twGrayBlack" />
              </div>
            </div>
            <div class="absolute top-5">
              <div class="w-1 h-[47px] bg-twGrayBlack"></div>
            </div>
          </div>
        </div>

        <!-- Lokasi Perangkat  -->
        <div class="card p-4">
          <div>
            <p class="text-base font-semibold">Lokasi Perangkat</p>
            <p class="text-xs text-twSecondary">Total 50 Perangkat</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <q-input
                v-model="searchLokasi"
                dense
                class="bg-white"
                placeholder="Pencarian.."
                outlined
              >
                <template v-slot:append>
                  <q-icon name="o_search" size="12px" />
                </template>
              </q-input>
              <q-scroll-area class="h-72 md:h-80 mt-2">
                <div class="space-y-1">
                  <template v-for="item in listLokasiPerangkat" :key="item.id">
                    <div
                      class="flex items-center justify-between hover:bg-twGrayBlack/10 cursor-pointer p-2 rounded-lg"
                      @click="handleSelectLokasi(item)"
                    >
                      <div class="flex items-center gap-2">
                        <div
                          class="w-[30px] h-[30px] bg-twGrayBlack/20 text-twGrayBlack rounded-full flex items-center justify-center"
                        >
                          {{ item.nama.slice(0, 2).toUpperCase() }}
                        </div>
                        <div>
                          <p class="font-medium md:truncate md:max-w-[200px]">
                            {{ item.nama }}
                          </p>
                          <p class="text-xs text-twSecondary">{{ item.kota_nama }}</p>
                        </div>
                      </div>
                      <div
                        class="text-xs"
                        :class="[
                          { 'badge-green': item.is_active },
                          { 'badge-red': !item.is_active },
                        ]"
                      >
                        {{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}
                      </div>
                    </div>
                  </template>
                </div>
              </q-scroll-area>
            </div>

            <!-- map dan sedikit detail -->
            <div class="col-span-2 space-y-2">
              <MapLeafet
                ref="mapRef"
                :locations="listLokasiPerangkat"
                :height="selectedLokasi ? '200px' : '400px'"
                :zoom="15"
                mode="multiple"
              />
              <div
                v-if="selectedLokasi"
                class="flex h-[173px] flex-col justify-between self-stretch"
              >
                <div class="space-y-2">
                  <p class="text-base font-semibold">{{ selectedLokasi?.nama }}</p>
                  <div class="badge-green text-xs w-fit">
                    {{ selectedLokasi?.is_active ? 'Aktif' : 'Tidak Aktif' }}
                  </div>
                  <p class="text-twSecondary">NPWPD : {{ selectedLokasi?.npwpd }}</p>
                  <p class="">Alamat : {{ selectedLokasi?.alamat }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <q-btn label="Detail" no-caps unelevated color="secondary" class="!rounded-lg" />
                  <q-btn no-caps unelevated color="primary" class="!rounded-lg">
                    <q-icon name="o_location_on" size="12px" />
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Jenis Perangkat -->
        <JenisPerangkat :selectedDate="selectedDate" />

        <!-- Log Perawatan Perangkat -->
        <LogPerawatanPerangkat :selectedDate="selectedDate" />
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    margin-bottom: 1rem;
  }
}
</style>
