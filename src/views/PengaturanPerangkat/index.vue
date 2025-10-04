<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getStatus, moment } from '@/utils/mixing'
import { useRouter } from 'vue-router'
import { usePerangkatStore } from '@/stores/perangkat-store'
import { useAuthAdminStore } from '@/stores/auth-admin-store'

const router = useRouter()
const perangkatStore = usePerangkatStore()
const authStore = useAuthAdminStore()
// const $q = useQuasar()

// State
const selectedDate = ref({
  from: moment().format('YYYY-MM-DD'),
  to: moment().format('YYYY-MM-DD'),
})

const loading = ref(false)
const isShowFilter = ref('')
const search = ref('')
const pagination = ref({
  rowsPerPage: 1000,
})

const selectedTipe = ref('')
const selectedMerk = ref('')
const selectedStatus = ref('')

const tipeOptions = ref([
  {
    label: 'Perorangan',
    value: 'perorangan',
  },
])

const merkOptions = ref([
  {
    label: 'Jakarta',
    value: 'jakarta',
  },
])

const statusOptions = ref([
  { label: 'Aktif', value: 1 },
  { label: 'Tidak Aktif', value: 0 },
])

const columns = [
  {
    name: 'id_perangkat',
    label: 'ID Perangkat',
    field: 'id_perangkat',
    align: 'left',
    sortable: true,
  },
  { name: 'merk', label: 'Merek', field: 'merk', align: 'left', sortable: true },
  { name: 'tipe', label: 'Tipe', field: 'tipe', align: 'left', sortable: true },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
    sortable: true,
    format: (val) => getStatus(val),
  },
  { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'center' },
]

const rows = ref([])

//computed
const userRole = computed(() => {
  return authStore.user?.role
})

const isShowFitur = computed(() => {
  return userRole.value !== 3
})

const editPerangkat = (row) => {
  router.push(`/pengaturan-perangkat/edit/${row.id}`)
}

const detailPerangkat = (row) => {
  console.log('Detail row data:', row)
  console.log('Row ID:', row.id)
  router.push(`/pengaturan-perangkat/${row.id}`)
}

const deletePerangkat = (row) => {
  // TODO: Implement delete confirmation dialog
  console.log('Delete perangkat:', row)
  if (confirm(`Apakah Anda yakin ingin menghapus perangkat ${row.merk}?`)) {
    perangkatStore.deletePerangkatApi(row.id).then((res) => {
      if (res.success) {
        getAllPerangkat()
        // Show success notification
        console.log('Perangkat berhasil dihapus')
      }
    })
  }
}

const getAllPerangkat = () => {
  loading.value = true
  const status = selectedStatus.value || ''
  const searchTerm = search.value || ''

  perangkatStore
    .getPerangkatApi(searchTerm, status, 1, 1000)
    .then((res) => {
      console.log(res, 'data perangkat')
      if (res.success) {
        rows.value =
          res.data.map((item) => ({
            id: item.id,
            id_perangkat: item.device_code || item.id,
            merk: item.brand || item.merk,
            tipe: item.model || item.tipe,
            status: item.status,
          })) || []
      }
    })
    .catch((error) => {
      console.error('Error fetching perangkat:', error)
      rows.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const updateData = () => {
  getAllPerangkat()
}

// Watch untuk filter
watch([selectedTipe, selectedMerk, selectedStatus, search], () => {
  updateData()
})

onMounted(() => {
  updateData()
})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Pengaturan Perangkat</p>
      <q-space></q-space>
      <!-- <q-select v-model="selectedMonth" dense class="bg-white" :options="monthsOptions" outlined /> -->
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <div class="card p-4 space-y-4">
        <div class="flex items-center">
          <p class="text-base font-semibold">Daftar Perangkat</p>
          <q-space></q-space>
          <q-btn
            v-if="isShowFitur"
            unelevated
            no-caps
            label="Perangkat"
            color="positive"
            icon="o_add"
            class="!rounded-lg"
            to="/pengaturan-perangkat/tambah"
          />
        </div>
        <div class="flex items-center">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="isShowFilter">
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
              v-model="selectedMerk"
              label="Merek"
              dense
              class="bg-white w-[219px]"
              :options="merkOptions"
              outlined
            />
            <q-select
              v-model="selectedStatus"
              label="Status"
              dense
              class="bg-white w-[219px]"
              :options="statusOptions"
              outlined
              clearable
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
            :filter="search"
            hide-pagination
            virtual-scroll
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell-aksi="props">
              <q-td :props="props">
                <div class="flex justify-center items-center gap-2">
                  <q-btn
                    unelevated
                    flat
                    color="secondary"
                    icon="o_edit"
                    size="xs"
                    dense
                    class="!rounded-lg"
                    @click="editPerangkat(props.row)"
                  />
                  <q-btn
                    unelevated
                    flat
                    color="negative"
                    icon="o_delete"
                    size="xs"
                    dense
                    class="!rounded-lg"
                    @click="deletePerangkat(props.row)"
                  />
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
