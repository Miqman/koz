<template>
  <q-dialog v-model="internalModelValue">
    <q-card :class="widthClass" class="!bg-mainCard text-bgPrimary">
      <q-card-section class="row items-center">
        <div>
          <div class="flex items-center gap-2">
            <div class="text-h6">{{ title }}</div>
            <p v-if="status" :class="[getBadge(status), 'text-xs']">{{ status }}</p>
          </div>
          <p class="text-bgSecondary" v-if="description">{{ description }}</p>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator></q-separator>

      <!-- Slot Konten -->
      <q-card-section class="">
        <slot />
      </q-card-section>

      <q-card-actions align="right" class="!px-4 !pb-4">
        <DialogButton v-for="(button, index) in buttons" :key="index" v-bind="button" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import DialogButton from '@/components/DialogButton.vue'
export default {
  name: 'DialogForm',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Perhatian',
    },
    status: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    buttons: {
      type: Array,
      default: () => [],
    },
    widthClass: {
      type: String,
      default: '!w-[700px] !max-w-[80vw]',
    },
  },
  computed: {
    internalModelValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  methods: {
    handleButtonClick(button) {
      if (typeof button.onClick === 'function') {
        button.onClick()
      }
    },

    getBadge(status) {
      if (status === 'Selesai' || status === 'Aktif') {
        return 'badge-green w-fit'
      }
      if (status === 'Belum Selesai' || status === 'Non-Aktif') {
        return 'badge-red w-fit'
      }
      if (status === 'Selesai dengan perbedaan data') {
        return 'badge-orange w-fit'
      }
    },
  },
  components: {
    DialogButton,
  },
}
</script>
