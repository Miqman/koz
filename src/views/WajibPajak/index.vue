<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getStatus, moment } from '@/utils/mixing'
import { useRouter } from 'vue-router'
import { useWpStore } from '@/stores/wp-store'
import { roleId } from '@/composables/useAccessControl'

const router = useRouter()
const wpStore = useWpStore()
// const $q = useQuasar()

// State
const selectedDate = ref({
  from: moment().format('YYYY-MM-DD'),
  to: moment().format('YYYY-MM-DD'),
})

const loading = ref(false)
const isShowFitur = ref(false)
const search = ref('')
const pagination = ref({
  rowsPerPage: 1000,
})

const selectedTipe = ref('')
const selectedWilayah = ref('')
const selectedStatus = ref('')

const tipeOptions = ref([
  {
    label: 'Perorangan',
    value: 'perorangan',
  },
])

const wilayahOptions = ref([
  {
    label: 'Jakarta',
    value: 'jakarta',
  },
])

const statusOptions = ref([
  {
    label: 'Aktif',
    value: 'aktif',
  },
])

// Auto refresh variables
const autoRefreshInterval = ref(null)
const isPageVisible = ref(true)

const columns = ref([
  { name: 'nama', label: 'Nama', field: 'nama', align: 'left', sortable: true },
  { name: 'npwpd', align: 'center', label: 'NPWPD', field: 'npwpd', align: 'left', sortable: true },
  { name: 'tipe', label: 'Tipe', field: 'tipe_venue_nama', align: 'left', sortable: true },
  { name: 'wilayah', label: 'Wilayah', field: 'kota_nama', align: 'left', sortable: true },
  {
    name: 'status',
    label: 'Status',
    field: 'is_active',
    format: (val) => `${getStatus(val)}`,
    align: 'left',
    sortable: true,
  },
])

const rows = ref([
  {
    id: 1,
    npwpd: '1234567890',
    nama: 'John Doe',
    tipe: 'Perorangan',
    wilayah: 'Jakarta',
    status: 'Aktif',
    aksi: 'Edit',
  },
])

const editWajibPajak = (row) => {
  router.push(`/wajib-pajak/edit/${row.id}`)
}

const detailWajibPajak = (row) => {
  console.log('Detail row data:', row)
  console.log('Row ID:', row.id)
  router.push(`/dashboard/wajib-pajak/${row.id}`)
}

const getAllWP = () => {
  loading.value = true
  wpStore.getWPApi().then((res) => {
    console.log(res, 'data wp')
    if (res.success) {
      rows.value = res.data || []
    }
    loading.value = false
  })
}

const updateData = () => {
  getAllWP()
}

// Auto refresh functions
const startAutoRefresh = () => {
  // Clear existing interval if any
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
  }

  // Start new interval - refresh every 30 seconds
  autoRefreshInterval.value = setInterval(() => {
    if (isPageVisible.value) {
      console.log('Auto refreshing wajib pajak data...')
      updateData()
    }
  }, 30000) // 30 seconds = 30000ms
}

const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
    autoRefreshInterval.value = null
  }
}

const handleVisibilityChange = () => {
  isPageVisible.value = !document.hidden

  if (isPageVisible.value) {
    // Page became visible, start auto refresh
    startAutoRefresh()
    // Also refresh data immediately when page becomes visible
    updateData()
  } else {
    // Page became hidden, stop auto refresh
    stopAutoRefresh()
  }
}

onMounted(() => {
  if (roleId.value !== 3) {
    columns.value.push({ name: 'aksi', label: 'Aksi', field: 'aksi', align: 'center' })
  }
  updateData()

  // Start auto refresh
  startAutoRefresh()

  // Add visibility change listener
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  // Clean up interval and event listener
  stopAutoRefresh()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Pengaturan Wajib Pajak</p>
      <q-space></q-space>
      <q-btn no-caps unelevated color="primary" class="!rounded-lg" @click="updateData">
        <q-icon name="o_sync" size="12px"></q-icon>
        <span class="!ml-2">Update Data</span>
      </q-btn>
      <!-- <q-select v-model="selectedMonth" dense class="bg-white" :options="monthsOptions" outlined /> -->
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <div class="card p-4 space-y-4">
        <div class="flex items-center">
          <p class="text-base font-semibold">Daftar Wajib Pajak</p>
          <q-space></q-space>
          <q-btn
            v-if="roleId !== 3"
            unelevated
            no-caps
            label="Wajib Pajak"
            color="positive"
            icon="o_add"
            class="!rounded-lg"
            to="/wajib-pajak/tambah"
          />
        </div>
        <div class="flex items-center">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="isShowFitur">
            <!-- select tipe, wilayah, status -->
            <q-select
              v-model="selectedTipe"
              label="Tipe"
              dense
              class="bg-white w-[219px]"
              :options="tipeOptions"
              outlined
            />
            <q-select
              v-model="selectedWilayah"
              label="Wilayah"
              dense
              class="bg-white w-[219px]"
              :options="wilayahOptions"
              outlined
            />
            <q-select
              v-model="selectedStatus"
              label="Status"
              dense
              class="bg-white w-[219px]"
              :options="statusOptions"
              outlined
            />
          </div>
          <q-space></q-space>
          <q-input v-model="search" dense class="bg-white" placeholder="Pencarian.." outlined />
        </div>
        <div>
          <q-table
            class="my-sticky-virtscroll-table"
            flat
            bordered
            :rows="rows"
            :columns="columns"
            row-key="name"
            :separator="'cell'"
            :loading="loading"
            hide-pagination
            virtual-scroll
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell-nama="props">
              <q-td :props="props">
                <router-link
                  :to="`/wajib-pajak/${props.row.id}`"
                  class="text-twPrimary hover:underline cursor-pointer"
                >
                  {{ props.row.nama }}
                </router-link>
              </q-td>
            </template>
            <template v-slot:body-cell-aksi="props">
              <q-td :props="props">
                <div class="flex justify-center items-center gap-2">
                  <q-btn
                    v-if="roleId !== 3"
                    unelevated
                    flat
                    color="secondary"
                    icon="o_edit"
                    size="xs"
                    dense
                    class="!rounded-lg"
                    @click="editWajibPajak(props.row)"
                  />
                  <!-- <q-btn
                    unelevated
                    flat
                    color="secondary"
                    icon="o_visibility"
                    size="xs"
                    dense
                    class="!rounded-lg"
                    @click="detailWajibPajak(props.row)"
                  /> -->
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style></style>
<style scoped></style>
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
