<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getStatus, moment } from '@/utils/mixing'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/formatDate'
import { useDashboardStore } from '@/stores/dashbaord-store'

const dsbStore = useDashboardStore()
const router = useRouter()
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
const isShowFitur = ref(true)
const search = ref('')
const listLogPerwatanPerangkat = ref([])
const pagination = ref({
  rowsPerPage: 1000,
})

const selectedPetugas = ref('')

const petugasOptions = ref([
  {
    label: 'Petugas 1',
    value: 'petugas1',
  },
])

const columns = [
  { name: 'lokasi', label: 'Lokasi', field: 'lokasi', align: 'left', sortable: true },
  { name: 'petugas', label: 'Petugas', field: 'petugas', align: 'left', sortable: true },
  { name: 'hasil', label: 'Hasil', field: 'hasil', align: 'left', sortable: true },
  {
    name: 'tgl_perawatan',
    label: 'Tgl Perawatan',
    field: 'tgl_perawatan',
    format: (val) => `${formatDate(val, 'datetime-minutes')}`,
    align: 'left',
    sortable: true,
  },
]

const rows = ref([
  {
    id: 1,
    lokasi: 'Jakarta',
    petugas: 'Petugas 1',
    hasil: 'Baik',
    tgl_perawatan: '2025-01-01',
  },
  {
    id: 2,
    lokasi: 'Jakarta',
    petugas: 'Petugas 1',
    hasil: 'Baik',
    tgl_perawatan: '2025-01-01',
  },
])

const getLogPerwatanPerangkat = () => {
  loading.value = true
  const payload = {
    from: props.selectedDate.from,
    to: props.selectedDate.to,
  }
  dsbStore.getLogPerwatanPerangkatApi('', '', 1, 1000, payload.from, payload.to).then((res) => {
    console.log(res, 'data perangkat dashboard log perwatan')
    if (res.success) {
      listLogPerwatanPerangkat.value =
        res.data.map((item) => ({
          id: item.id,
          lokasi: item.location,
          petugas: item.officer,
          hasil: item.result,
          tgl_perawatan: item.maintenance_date,
        })) || []
    }
    loading.value = false
  })
}

const updateData = () => {
  getLogPerwatanPerangkat()
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
        <p class="text-base font-semibold">Log Perawatan Perangkat</p>
        <p class="text-xs text-twSecondary">Perawatan Berkala</p>
      </div>
      <q-space></q-space>
    </div>
    <div class="flex items-center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="isShowFitur">
        <!-- select tipe, wilayah, status -->
        <q-select
          v-model="selectedPetugas"
          label="Petugas"
          dense
          class="bg-white w-[219px]"
          :options="petugasOptions"
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
        :rows="listLogPerwatanPerangkat"
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
