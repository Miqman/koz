<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getStatus, moment } from '@/utils/mixing'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/formatDate'
import { useDashboardStore } from '@/stores/dashbaord-store'

const router = useRouter()
const dsbStore = useDashboardStore()
// const wpStore = useWpStore()
// const $q = useQuasar()

// props
const props = defineProps({
  selectedDate: {
    type: Object,
    required: true,
  },
})

// State
const loading = ref(false)
const listJenisPerangkat = ref([])
const isShowFitur = ref(true)
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

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'merk', align: 'center', label: 'Merk', field: 'merk', align: 'left', sortable: true },
  { name: 'tipe', label: 'Tipe', field: 'tipe', align: 'left', sortable: true },
  { name: 'lokasi', label: 'Lokasi', field: 'lokasi', align: 'left', sortable: true },
  {
    name: 'tgl_instalasi',
    label: 'Tgl Instalasi',
    field: 'tgl_instalasi',
    format: (val) => `${formatDate(val, 'datetime')}`,
    align: 'left',
    sortable: true,
  },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
]

const rows = ref([
  {
    id: 1,
    merk: 'HP',
    tipe: 'Printer Thermal',
    lokasi: 'Jakarta',
    tgl_instalasi: '2025-01-01',
    status: 'Aktif',
  },
  {
    id: 2,
    merk: 'Canon',
    tipe: 'Printer Thermal',
    lokasi: 'Jakarta',
    tgl_instalasi: '2025-02-01',
    status: 'Tidak Aktif',
  },
])

const getJenisPerangkat = () => {
  loading.value = true
  const payload = {
    from: props.selectedDate.from,
    to: props.selectedDate.to,
  }
  dsbStore.getJenisPerangkatApi('', '', '', '', 1, 1000, payload.from, payload.to).then((res) => {
    console.log(res, 'data perangkat dashboard jenis')
    if (res.success) {
      listJenisPerangkat.value =
        res.data.map((item) => ({
          id: item.device_id,
          merk: item.brand,
          tipe: item.type,
          lokasi: item.location,
          tgl_instalasi: item.installation_date,
          status: item.status,
        })) || []
    }
    loading.value = false
  })
}

const updateData = () => {
  getJenisPerangkat()
}

onMounted(() => {
  updateData()
})

watch(
  () => ({ ...props.selectedDate }), // spread supaya reaktif di-detect
  updateData,
  { immediate: true },
)
</script>

<template>
  <div class="card p-4 space-y-4">
    <div class="flex items-center">
      <div>
        <p class="text-base font-semibold">Jenis Perangkat</p>
        <p class="text-xs text-twSecondary">Total 50 Perangkat</p>
      </div>
      <q-space></q-space>
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
      <q-input v-model="search" dense class="bg-white" placeholder="Pencarian.." outlined>
        <template v-slot:append>
          <q-icon name="o_search" size="14px" />
        </template>
      </q-input>
    </div>
    <div>
      <q-table
        class="my-sticky-virtscroll-table"
        flat
        bordered
        :rows="listJenisPerangkat"
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
                @click="editWajibPajak(props.row)"
              />
              <q-btn
                unelevated
                flat
                color="secondary"
                icon="o_visibility"
                size="xs"
                dense
                class="!rounded-lg"
                @click="detailWajibPajak(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
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
