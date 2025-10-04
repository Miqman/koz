<script setup>
import { ref, computed, onMounted } from 'vue'
import { moment } from '@/utils/mixing'
import { useRouter, useRoute } from 'vue-router'
import MapLeafet from '@/components/MapLeafet.vue'
import { useQuasar } from 'quasar'
import { useWpStore } from '@/stores/wp-store'
import { formatDate } from '@/utils/formatDate'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const wpStore = useWpStore()

// State
const isShowFitur = ref(false)
const loading = ref(true)
const loadingDetail = ref(true)
const selectedMonth = ref('Agustus')
const search = ref('')
const currentSong = ref({
  title: 'Mangu - Fourtwnty',
  time: '12/08/2025 - 12:00:02',
  progress: 65,
})

const deviceInfo = ref({
  id: 'DV0001',
  installationDate: '01/06/2025',
  lastMaintenance: '01/08/2025',
})

const songList = ref([
  { lagu: 'Pupus', album: 'Aquarius Musikindo', play: 50 },
  { lagu: 'Semua Tak Sama', album: 'Sony Music Indonesia', play: 45 },
  { lagu: 'Seberapa Pantas', album: 'Sony Music Indonesia', play: 44 },
  { lagu: 'Mangu', album: 'Fourtwnty', play: 35 },
  { lagu: 'Ada Apa Denganmu', album: 'Musica Studio', play: 88 },
  { lagu: 'Semua Tentang Kita', album: 'Musica Studio', play: 80 },
  { lagu: 'Taman Langit', album: 'Musica Studio', play: 69 },
  { lagu: 'Kukatakan dengan Indah', album: 'Musica Studio', play: 66 },
  { lagu: 'Mungkin Nanti', album: 'Musica Studio', play: 66 },
])

// Table data untuk riwayat pemutaran
const tableRows = ref([
  {
    id: 1,
    judul_lagu: 'Pupus',
    judul_album: 'Aquarius Musikindo',
    nama_penyanyi: 'Peterpan',
    tanggal_pemutaran_lagu: '12/08/2025 - 10:30:15',
  },
  {
    id: 2,
    judul_lagu: 'Semua Tak Sama',
    judul_album: 'Sony Music Indonesia',
    nama_penyanyi: 'Peterpan',
    tanggal_pemutaran_lagu: '12/08/2025 - 11:15:22',
  },
  {
    id: 3,
    judul_lagu: 'Seberapa Pantas',
    judul_album: 'Sony Music Indonesia',
    nama_penyanyi: 'Peterpan',
    tanggal_pemutaran_lagu: '12/08/2025 - 11:45:08',
  },
  {
    id: 4,
    judul_lagu: 'Mangu',
    judul_album: 'Fourtwnty',
    nama_penyanyi: 'Fourtwnty',
    tanggal_pemutaran_lagu: '12/08/2025 - 12:00:02',
  },
  {
    id: 5,
    judul_lagu: 'Ada Apa Denganmu',
    judul_album: 'Musica Studio',
    nama_penyanyi: 'Peterpan',
    tanggal_pemutaran_lagu: '12/08/2025 - 12:30:45',
  },
  {
    id: 6,
    judul_lagu: 'Semua Tentang Kita',
    judul_album: 'Musica Studio',
    nama_penyanyi: 'Peterpan',
    tanggal_pemutaran_lagu: '12/08/2025 - 13:15:30',
  },
  {
    id: 7,
    judul_lagu: 'Taman Langit',
    judul_album: 'Musica Studio',
    nama_penyanyi: 'Peterpan',
    tanggal_pemutaran_lagu: '12/08/2025 - 13:45:12',
  },
  {
    id: 8,
    judul_lagu: 'Kukatakan dengan Indah',
    judul_album: 'Musica Studio',
    nama_penyanyi: 'Peterpan',
    tanggal_pemutaran_lagu: '12/08/2025 - 14:20:33',
  },
  {
    id: 9,
    judul_lagu: 'Mungkin Nanti',
    judul_album: 'Musica Studio',
    nama_penyanyi: 'Peterpan',
    tanggal_pemutaran_lagu: '12/08/2025 - 14:55:18',
  },
])

const tableColumns = ref([
  {
    name: 'judul_lagu',
    required: true,
    label: 'Lagu',
    align: 'left',
    field: 'judul_lagu',
    sortable: true,
  },
  {
    name: 'judul_album',
    required: true,
    label: 'Album',
    align: 'left',
    field: 'judul_album',
    sortable: true,
  },
  {
    name: 'tanggal_pemutaran_lagu',
    required: true,
    label: 'Tgl Pemutaran',
    align: 'left',
    field: 'tanggal_pemutaran_lagu',
    format: (val) => formatDate(val, 'datetime'),
    sortable: true,
  },
])

const pagination = ref({
  //   sortBy: 'tgl_pemutaran',
  //   descending: true,
  //   page: 1,
  rowsPerPage: 10000,
})

const wpData = ref({
  id: 'WP0001',
  npwpd: '2552.65.103',
  nama: 'Cafe A',
  tipe: 'Restoran',
  wilayah: 'Jakarta Pusat',
  alamat:
    'Jl. Kramat Raya, RT.4/RW.2, Kramat, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10450',
  jumlahKursi: 50,
  luasArea: '50m²',
  status: 'Aktif',
  latitude: -6.2088,
  longitude: 106.8456,
})

const monthOptions = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const wpDataId = ref(null)
const wpDetailData = ref(null)

// Computed
const wpId = computed(() => route.params.id)

// Methods
const handleEdit = () => {
  router.push(`/wajib-pajak/edit/${wpId.value}`)
}

const handleMaintenanceHistory = () => {
  // TODO: Implement maintenance history
  $q.notify({
    type: 'info',
    message: 'Fitur riwayat perawatan akan segera hadir',
    position: 'top',
  })
}

const filterTable = (rows, filter, filterValue) => {
  if (!filterValue) return rows
  const searchTerm = search.value.toLowerCase()
  return rows.filter((row) => {
    return (
      row.judul_lagu?.toLowerCase().includes(searchTerm) ||
      row.judul_album?.toLowerCase().includes(searchTerm) ||
      row.nama_penyanyi?.toLowerCase().includes(searchTerm)
    )
  })
}

const getWpById = () => {
  loading.value = true
  wpStore.getWPByidApi(wpId.value).then((res) => {
    console.log(res, 'data wp id')
    if (res.success) {
      wpDataId.value = res.data
    }
    loading.value = false
  })
}
const getWPDetail = () => {
  loadingDetail.value = true
  wpStore.getWPDetailApi(wpId.value).then((res) => {
    console.log(res, 'data wp Detail')
    if (res.success) {
      const rawData = res.data
      songList.value = rawData.reduce((acc, curr) => {
        const existingItem = acc.find(
          (item) => item.lagu === curr.judul_lagu && item.album === curr.judul_album,
        )

        if (existingItem) {
          existingItem.play += 1
        } else {
          acc.push({
            lagu: curr.judul_lagu,
            album: curr.judul_album,
            nama_penyanyi: curr.nama_penyanyi,
            play: 1,
          })
        }

        return acc
      }, [])
      // Gunakan data mock untuk tableRows karena API belum tersedia
      tableRows.value = rawData
    }
    loadingDetail.value = false
  })
}

onMounted(() => {
  // TODO: Fetch data berdasarkan wpId
  console.log('Loading detail for WP ID:', wpId.value)
  console.log('Route params:', route.params)
  console.log('Route full path:', route.fullPath)

  // Simulasi loading data dari API
  getWpById()
  getWPDetail()
})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Detail Wajib Pajak</p>
      <q-space></q-space>
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Skeleton untuk Informasi Wajib Pajak -->
        <div class="card p-4 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <q-skeleton type="text" class="text-base" />
              <q-skeleton type="text" class="text-xs" />
            </div>
            <q-skeleton type="QBtn" />
          </div>

          <!-- Skeleton untuk Nama dan Status -->
          <div class="flex items-center gap-3">
            <q-skeleton type="QAvatar" size="40px" />
            <div class="space-y-2">
              <q-skeleton type="text" class="text-base" />
              <q-skeleton type="QChip" />
            </div>
          </div>

          <!-- Skeleton untuk Detail Data -->
          <div class="space-y-3">
            <div v-for="i in 6" :key="i" class="flex justify-between">
              <q-skeleton type="text" class="w-1/3" />
              <q-skeleton type="text" class="w-1/4" />
            </div>
          </div>

          <!-- Skeleton untuk Alamat -->
          <div>
            <q-skeleton type="text" class="mb-2" />
            <q-skeleton type="text" class="w-full" />
            <q-skeleton type="text" class="w-3/4" />
          </div>

          <!-- Skeleton untuk Peta -->
          <div>
            <q-skeleton type="text" class="mb-2" />
            <q-skeleton type="rect" class="w-full h-48" />
          </div>
        </div>

        <!-- Skeleton untuk Deteksi Alat dan Informasi Pemutaran Lagu -->
        <div class="md:col-span-2 space-y-4">
          <!-- Skeleton untuk Deteksi Alat -->
          <div class="card p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <q-skeleton type="text" class="text-base" />
                <q-skeleton type="text" class="text-xs" />
              </div>
              <q-skeleton type="QBtn" />
            </div>

            <!-- Skeleton untuk Status Pemutaran -->
            <div class="bg-gray-50 p-4 rounded-lg space-y-3">
              <q-skeleton type="text" class="text-sm" />
              <q-skeleton type="text" class="text-base" />
              <q-skeleton type="text" class="text-sm" />
              <q-skeleton type="rect" class="w-full h-2" />
            </div>

            <!-- Skeleton untuk Detail Perangkat -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="i in 3" :key="i" class="space-y-2">
                <q-skeleton type="text" class="text-sm" />
                <q-skeleton type="text" class="text-base" />
              </div>
            </div>
          </div>

          <!-- Skeleton untuk Informasi Pemutaran Lagu -->
          <div class="card p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <q-skeleton type="text" class="text-base" />
                <q-skeleton type="text" class="text-xs" />
              </div>
              <q-skeleton type="QInput" class="w-32" />
            </div>

            <!-- Skeleton untuk Daftar Lagu -->
            <div class="space-y-3">
              <div
                v-for="i in 5"
                :key="i"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <q-skeleton type="text" class="flex-1" />
                <q-skeleton type="text" class="w-20" />
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton untuk Tabel -->
        <div class="card p-4">
          <div class="mb-4">
            <q-skeleton type="text" class="text-base" />
            <q-skeleton type="text" class="text-xs" />
          </div>
          <div class="space-y-3">
            <div
              v-for="i in 5"
              :key="i"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <q-skeleton type="text" class="flex-1" />
              <q-skeleton type="text" class="w-1/4" />
              <q-skeleton type="text" class="w-1/3" />
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div
        v-else-if="!loading && (!wpData || !wpData.id)"
        class="flex items-center justify-center h-96"
      >
        <div class="text-center">
          <q-icon name="business" size="64px" color="grey-4" class="mb-4" />
          <p class="text-lg font-medium text-gray-600 mb-2">Data Wajib Pajak Tidak Ditemukan</p>
          <p class="text-sm text-gray-500 mb-4">
            Wajib pajak dengan ID tersebut tidak ditemukan atau telah dihapus
          </p>
          <q-btn
            label="Kembali ke Daftar"
            no-caps
            class="!rounded-lg"
            unelevated
            color="secondary"
            @click="router.back()"
          />
        </div>
      </div>

      <!-- Data State -->
      <div
        v-else-if="!loading && wpData && wpData.id"
        class="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <!-- Informasi Wajib Pajak -->
        <div class="card p-4 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base font-semibold">Informasi Wajib Pajak</p>
              <p class="text-xs text-twSecondary">
                Halaman ini berisi data dan informasi wajib pajak
              </p>
            </div>
            <q-btn
              label="Ubah"
              outline
              no-caps
              class="!rounded-lg"
              unelevated
              color="secondary"
              @click="handleEdit"
            />
          </div>

          <!-- Nama dan Status -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <q-icon name="business" color="orange" size="20px" />
            </div>
            <div>
              <p class="font-semibold">{{ wpDataId.nama }}</p>
              <q-chip
                :label="wpDataId.is_active ? 'Aktif' : 'Tidak Aktif'"
                :color="wpDataId.is_active ? 'green' : 'red'"
                text-color="white"
                size="sm"
                class="!rounded-full"
              />
            </div>
          </div>

          <!-- Detail Data -->
          <div class="space-y-3">
            <!-- <div class="flex justify-between">
              <span class="text-sm text-gray-600">ID Wajib Pajak</span>
              <span class="text-sm font-medium">{{ wpDataId.id }}</span>
            </div> -->
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">NPWPD</span>
              <span class="text-sm font-medium">{{ wpDataId.npwpd }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Tipe</span>
              <span class="text-sm font-medium">{{ wpDataId.tipe_venue_nama }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Wilayah</span>
              <span class="text-sm font-medium">{{ wpDataId.kota_nama }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Jumlah Kursi</span>
              <span class="text-sm font-medium">{{ wpData.jumlahKursi }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Luas Area</span>
              <span class="text-sm font-medium">{{ wpData.luasArea }}</span>
            </div>
          </div>

          <!-- Alamat -->
          <div>
            <p class="text-sm text-gray-600 mb-2">Alamat Lengkap</p>
            <p class="text-sm">{{ wpDataId.alamat }}</p>
          </div>

          <!-- Peta -->
          <div v-if="isShowFitur">
            <p class="text-sm text-gray-600 mb-2">Lokasi</p>
            <MapLeafet
              :latitude="wpData.latitude"
              :longitude="wpData.longitude"
              :height="'200px'"
              :zoom="15"
              mode="single"
            />
          </div>
        </div>

        <!-- Deteksi Alat dan Informasi Pemutaran Lagu -->
        <div class="md:col-span-2 space-y-4">
          <!-- Deteksi Alat -->
          <div class="card p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-base font-semibold">Deteksi Alat</p>
                <p class="text-xs text-twSecondary">
                  Halaman ini berisi pendeteksian lagu yang sedang diputar
                </p>
              </div>
              <q-btn
                v-if="isShowFitur"
                outline
                label="Riwayat Perawatan"
                no-caps
                class="!rounded-lg"
                unelevated
                color="secondary"
                @click="handleMaintenanceHistory"
              />
            </div>

            <!-- Status Pemutaran -->
            <div v-if="isShowFitur" class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-2">Sedang diputar sekarang</p>
              <p class="font-semibold mb-2">{{ currentSong.title }}</p>
              <p class="text-sm text-gray-600 mb-3">{{ currentSong.time }}</p>

              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-orange-500 h-2 rounded-full progress-bar"
                  :style="{ width: currentSong.progress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Detail Perangkat -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-600">ID Perangkat</p>
                <p class="font-medium">{{ deviceInfo.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Tgl Instalasi</p>
                <p class="font-medium">{{ deviceInfo.installationDate }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Perawatan Terakhir</p>
                <p class="font-medium">{{ deviceInfo.lastMaintenance }}</p>
              </div>
            </div>
          </div>

          <!-- Informasi Pemutaran Lagu -->
          <div class="card p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-base font-semibold">Informasi Pemutaran Lagu</p>
                <p class="text-xs text-twSecondary">
                  Halaman ini berisi informasi lagu dan banyaknya lagu diputar
                </p>
              </div>
              <q-select
                v-if="isShowFitur"
                v-model="selectedMonth"
                :options="monthOptions"
                dense
                class="bg-white w-32"
                outlined
              />
            </div>

            <!-- Daftar Lagu -->
            <div v-if="songList.length === 0" class="flex items-center justify-center h-32">
              <div class="text-center">
                <q-icon name="queue_music" size="48px" color="grey-4" class="mb-2" />
                <p class="text-sm text-gray-500">Tidak ada data lagu yang diputar</p>
              </div>
            </div>

            <div v-else class="space-y-3 max-h-[365px] overflow-y-auto">
              <template v-for="(item, index) in songList" :key="index">
                <div class="flex items-center">
                  <div class="flex flex-col justify-center items-start gap-1 flex-[1_0_0]">
                    <p class="font-semibold">{{ item.lagu }}</p>
                    <p class="text-xs text-twSecondary">{{ item.album }} - {{ item.album }}</p>
                  </div>
                  <!-- <q-space></q-space> -->
                  <div class="px-2.5 py-[5px] rounded-lg bg-twSecondary/10 text-twGrayBlack">
                    {{ item.play }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel Riwayat Pemutaran -->
      <div v-if="!loading && wpData && wpData.id" class="card p-4">
        <div class="mb-4">
          <p class="text-base font-semibold">Riwayat Pemutaran Lagu</p>
          <p class="text-xs text-twSecondary">Daftar lengkap riwayat pemutaran lagu</p>
        </div>

        <div class="flex justify-end mb-4">
          <q-input
            v-model="search"
            placeholder="Cari lagu"
            dense
            class="bg-white"
            outlined
            debounce="450"
          >
            <template v-slot:append>
              <q-icon
                v-if="search !== ''"
                name="close"
                @click="search = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Loading untuk tabel -->
        <div v-if="loading" class="space-y-3">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <q-skeleton type="text" class="flex-1" />
            <q-skeleton type="text" class="w-1/4" />
            <q-skeleton type="text" class="w-1/3" />
          </div>
        </div>

        <!-- No data state -->
        <div v-else-if="tableRows.length === 0" class="flex items-center justify-center h-32">
          <div class="text-center">
            <q-icon name="music_note" size="48px" color="grey-4" class="mb-2" />
            <p class="text-sm text-gray-500">Tidak ada data riwayat pemutaran</p>
          </div>
        </div>

        <!-- Data table -->
        <q-table
          v-else
          class="my-sticky-virtscroll-table"
          flat
          bordered
          :rows="tableRows"
          :columns="tableColumns"
          row-key="id"
          :filter="search"
          :filter-method="filterTable"
          :separator="'cell'"
          hide-pagination
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
        >
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
/* Custom styling untuk progress bar */
.progress-bar {
  transition: width 0.3s ease;
}

/* Hover effect untuk daftar lagu */
.song-item:hover {
  background-color: #f3f4f6;
  transition: background-color 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    margin-bottom: 1rem;
  }
}
</style>
<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  max-height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #F1F5F9
    font-size: 14px
    font-weight: 600

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
