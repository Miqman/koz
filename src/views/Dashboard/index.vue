<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { moment } from '@/utils/mixing'
import { formatDate } from '@/utils/formatDate'
import DialogConfirm from '@/components/DialogConfirm.vue'

// const $q = useQuasar()

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
]

// State
const loading = ref(false)
const reqWp = ref([])
const search = ref('')
const rowsPerPage = ref(10)
const pagination = ref({
  page: 1,
  rowsPerPage: 10
})
const isTolak = ref(false)
const dialogPersetujuan = ref(false)
const loadingPersetujuan = ref(false)

//computed
const headerTable = computed(() => {
  return [
    { name: 'no', label: 'No', align: 'left', field: 'no', sortable: true },
    { name: 'nama_wp', label: 'Nama WP', align: 'left', field: 'nama_wp', sortable: true },
    { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
    { name: 'nopd', label: 'NOPD', align: 'left', field: 'nopd', sortable: true },
    { name: 'npwpd', label: 'NPWPD', align: 'left', field: 'npwpd', sortable: true },
    { name: 'alamat', label: 'Alamat', align: 'left', field: 'alamat', sortable: true },
    { name: 'provinsi', label: 'Provinsi', align: 'left', field: 'provinsi', sortable: true },
    { name: 'kota', label: 'Kota/Kabupaten', align: 'left', field: 'kota', sortable: true },
    { name: 'nilai_pajak', label: 'Nilai Pajak (Rp)', align: 'left', field: 'nilai_pajak', sortable: true },
    { name: 'aksi', label: 'Aksi', align: 'center', field: 'aksi', sortable: false },
  ]
})


const getReqWp = async () => {
  loading.value = true
  // dsbStore.getReqWpApi().then((res) => {
  //   if (res.success) {
  //     reqWp.value = res.data || []
  //   }
  //   loading.value = false
  // })

  reqWp.value = [
    { 
      no: 1, 
      nama_wp: 'Hotel Mawar', 
      email: 'support@hotelmawar.com', 
      nopd: '02343434343', 
      npwpd: '23324324324', 
      alamat: 'Jl. Kecubung No 1', 
      provinsi: 'Jawa Barat', 
      kota: 'Kab Bandung', 
      nilai_pajak: 1000000
    },
  ]
  loading.value = false
}


// Format functions untuk waktu
const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = formatDate(dateString, 'hour-minutes')
  return date
}


const updateData = () => {
  getReqWp()
}
  
// Functions untuk handle table
const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filter = props.filter

  // Update pagination
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  // Update data berdasarkan filter dan pagination
  updateData()
}

const handleTerima = (row) => {
  console.log('Terima:', row)
  isTolak.value = false
  dialogPersetujuan.value = true
  // Implementasi logic untuk menerima permintaan
}

const handleTolak = (row) => {
  console.log('Tolak:', row)
  isTolak.value = true
  dialogPersetujuan.value = true
  // Implementasi logic untuk menolak permintaan
}

const submitTerima = () => {
  console.log('Terima:', 'Terima')
}

const submitTolak = () => {
  console.log('Tolak:', 'Tolak')
}
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

// Computed untuk filtered data
const filteredData = computed(() => {
  if (!search.value) return reqWp.value
  
  const searchTerm = search.value.toLowerCase()
  return reqWp.value.filter(row => 
    row.nama_wp?.toLowerCase().includes(searchTerm) ||
    row.email?.toLowerCase().includes(searchTerm) ||
    row.nopd?.toLowerCase().includes(searchTerm) ||
    row.npwpd?.toLowerCase().includes(searchTerm) ||
    row.alamat?.toLowerCase().includes(searchTerm) ||
    row.provinsi?.toLowerCase().includes(searchTerm) ||
    row.kota?.toLowerCase().includes(searchTerm)
  )
})


onMounted(() => {
  // updateData()
  getReqWp()
})

onUnmounted(() => {

})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Persetujuan Akun Wajib Pajak</p>
      <q-space></q-space>
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <!-- Data State -->
      <div class="space-y-4">
        <div class="card rounded-lg">
          <!-- Header dengan background biru -->
          <div class="bg-blue-50 py-3 px-4 rounded-t-lg">
            <p class="text-base font-semibold text-blue-600">Daftar Permintaan Akun Wajib Pajak</p>
          </div>

          <!-- Controls -->
          <div class="p-4 flex justify-between items-center border-b border-gray-200">
            <div class="flex items-center gap-2">
              <q-select
                v-model="rowsPerPage"
                :options="[5, 10, 25, 50, 100]"
                dense
                outlined
                style="min-width: 80px"
                @update:model-value="(val) => { pagination.rowsPerPage = val; onRequest({ pagination }) }"
              />
              <p class="text-sm text-gray-600">entries per page</p>
            </div>

            <div class="flex items-center gap-2">
              <p class="text-sm text-gray-600">Search: </p>
              <q-input 
                v-model="search" 
                placeholder="Search" 
                dense
                outlined
                style="min-width: 200px"
                clearable
              />
            </div>
          </div>  

          <!-- Table -->
          <div class="">
            <q-table
              :rows="filteredData"
              :columns="headerTable"
              :loading="loading"
              v-model:pagination="pagination"
              @request="onRequest"
              row-key="nopd"
              flat
              hide-pagination
              :rows-per-page-options="[5, 10, 25, 50, 100]"
            >

              <template v-slot:body-cell-aksi="props">
                <q-td :props="props" class="text-center">
                  <div class="flex gap-2 justify-center">
                    <q-btn
                      no-caps
                      color="primary"
                      size="sm"
                      label="Terima"
                      @click="handleTerima(props.row)"
                      dense
                    />
                    <q-btn
                      no-caps
                      color="negative"
                      size="sm"
                      label="Tolak"
                      @click="handleTolak(props.row)"
                      dense
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-nilai_pajak="props">
                <q-td :props="props">
                  {{ formatCurrency(props.value) }}
                </q-td>
              </template>
            </q-table>

            <!-- Custom Pagination -->
            <div class="flex justify-between items-center p-4 border-t border-gray-200">
              <div class="text-sm text-gray-600">
                Showing {{ ((pagination.page - 1) * pagination.rowsPerPage) + 1 }} to {{ Math.min(pagination.page * pagination.rowsPerPage, filteredData.length) }} of {{ filteredData.length }} entries
              </div>
              <div class="flex items-center gap-1">
                <q-btn
                  flat
                  dense
                  icon="first_page"
                  @click="pagination.page = 1; onRequest({ pagination })"
                  :disable="pagination.page === 1"
                  size="sm"
                />
                <q-btn
                  flat
                  dense
                  icon="chevron_left"
                  @click="pagination.page--; onRequest({ pagination })"
                  :disable="pagination.page === 1"
                  size="sm"
                />
                <span class="px-2 text-sm">{{ pagination.page }}</span>
                <q-btn
                  flat
                  dense
                  icon="chevron_right"
                  @click="pagination.page++; onRequest({ pagination })"
                  :disable="pagination.page >= Math.ceil(filteredData.length / pagination.rowsPerPage)"
                  size="sm"
                />
                <q-btn
                  flat
                  dense
                  icon="last_page"
                  @click="pagination.page = Math.ceil(filteredData.length / pagination.rowsPerPage); onRequest({ pagination })"
                  :disable="pagination.page >= Math.ceil(filteredData.length / pagination.rowsPerPage)"
                  size="sm"
                />
              </div>
            </div>
          

          </div>

        </div>
       
      </div>
    </div>


    <DialogConfirm
      v-model="dialogPersetujuan"
      ref="dialogConfirm"
      :title="isTolak ? 'Tolak Persetujuan' : 'Terima Persetujuan'"
      :description="isTolak ? 'Anda akan menolak persetujuan akun Wajib Pajak?' : 'Anda akan menerima persetujuan akun Wajib Pajak?'"
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
          onClick: isTolak ? submitTolak : submitTerima,
          loading: loadingPersetujuan,
          closePopup: false,
        },
      ]"
    >
    </DialogConfirm>
  </q-page>
</template>

<style scoped>

</style>
