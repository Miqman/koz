<template>
  <q-btn
    :label="label"
    :outline="outline"
    :dense="dense"
    :color="color"
    :loading="computedLoading"
    no-caps
    :class="[classBtn, 'md:!min-w-32']"
    :disable="computedLoading"
    v-close-popup="closePopup !== false"
    @click="handleClick"
  >
    <template>
      <span class="">{{ label }}</span>
    </template>
  </q-btn>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  label: String,
  outline: Boolean,
  dense: Boolean,
  color: {
    type: String,
    default: '',
  },
  whiteText: Boolean,
  closePopup: {
    type: Boolean,
    default: true,
  },
  onClick: Function,
  loading: Boolean,
  classBtn: {
    type: String,
    default: '',
  },
})

const internalLoading = ref(false)

const computedLoading = computed(() => {
  return typeof props.loading === 'boolean' ? props.loading : internalLoading.value
})

const handleClick = async () => {
  if (!props.onClick) return

  const useExternalLoading = typeof props.loading === 'boolean'
  if (!useExternalLoading) internalLoading.value = true

  try {
    await props.onClick()
    // kamu yang handle alertForm.value = false di luar
  } catch (e) {
    console.error('Button error:', e)
  } finally {
    if (!useExternalLoading) internalLoading.value = false
  }
}

onMounted(() => {})
</script>
