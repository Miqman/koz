<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { moment } from '@/utils/mixing'
import { formatDate } from '@/utils/formatDate'
import DialogConfirm from '@/components/DialogConfirm.vue'
import { useRouter } from 'vue-router'

// const $q = useQuasar()

const router = useRouter()

// State
const loading = ref(false)
const reqWp = ref([])
const search = ref('')
const rowsPerPage = ref(10)
const pagination = ref({
  page: 1,
  rowsPerPage: 10
})
const dialogHapus = ref(false)
const loadingHapus = ref(false)

//computed
const headerTable = computed(() => {
  return [
    { name: 'no', label: 'No', align: 'left', field: 'no', sortable: true },
    { name: 'nama_wp', label: 'Nama WP', align: 'left', field: 'nama_wp', sortable: true },
    { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
    { name: 'nopd', label: 'NOPD', align: 'left', field: 'nopd', sortable: true },
    { name: 'npwpd', label: 'NPWPD', align: 'left', field: 'npwpd', sortable: true },
    { name: 'alamat', label: 'Alamat', align: 'left', field: 'alamat', sortable: true },
    { name: 'status', label: 'Status', align: 'left', field: 'status', sortable: true },
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
      status: 'Aktif'
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

const handleUbah = (row) => {
  console.log('Terima:', row)
  router.push(`/pengaturan-wp/edit/${row.id}`)
  // Implementasi logic untuk menerima permintaan
}

const handleHapus = (row) => {
  console.log('Hapus:', row)
  dialogHapus.value = true
  // Implementasi logic untuk menolak permintaan
}

const submitHapus = () => {
  console.log('Hapus:', 'Hapus')
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
    row.status?.toLowerCase().includes(searchTerm)
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
      <p class="text-3xl font-semibold">Pengaturan Wajib Pajak</p>
      <q-space></q-space>
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <!-- Data State -->
      <div class="space-y-4">
        <div class="card rounded-lg">
          <!-- Header dengan background biru -->
          <div class="bg-blue-50 py-3 px-4 rounded-t-lg">
            <p class="text-base font-semibold text-twPrimary">Daftar Wajib Pajak</p>
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
                      label="Ubah"
                      @click="handleUbah(props.row)"
                      dense
                    />
                    <q-btn
                      no-caps
                      color="negative"
                      size="sm"
                      label="Hapus"
                      @click="handleHapus(props.row)"
                      dense
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  {{ props.value }}
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
      v-model="dialogHapus"
      ref="dialogConfirm"
      title="Hapus Wajib Pajak"
      description="Anda akan menghapus wajib pajak?"
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
          onClick: submitHapus,
          loading: loadingHapus,
          closePopup: false,
        }
      ]"
    >
    </DialogConfirm>
  </q-page>
</template>

<style scoped>

</style>
