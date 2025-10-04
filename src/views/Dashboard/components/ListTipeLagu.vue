<script setup>
const props = defineProps({
  songList: {
    type: Array,
    required: true,
  },
})

console.log(props.songList, 'sasdas')
</script>
<template>
  <div>
    <div v-if="songList.length === 0" class="flex items-center justify-center h-32">
      <div class="text-center">
        <q-icon name="queue_music" size="48px" color="grey-4" class="mb-2" />
        <p class="text-sm text-gray-500">Tidak ada data lagu yang diputar</p>
      </div>
    </div>

    <q-scroll-area v-else class="h-72 md:h-[550px] mt-2">
      <div class="space-y-3">
        <template v-for="(item, index) in songList" :key="index">
          <div class="flex items-center">
            <div class="flex flex-col justify-center items-start gap-1 flex-[1_0_0]">
              <p class="font-semibold">{{ item.judul_lagu }}</p>
              <p class="text-xs text-twSecondary">
                {{ item.judul_album }} - {{ item.nama_penyanyi }}
              </p>
            </div>
            <!-- <q-space></q-space> -->
            <div class="px-2.5 py-[5px] rounded-lg bg-twSecondary/10 text-twGrayBlack">
              {{ item.play_count }}
            </div>
          </div>
        </template>
      </div>
    </q-scroll-area>
  </div>
</template>
