<template>
  <q-dialog v-model="internalModelValue">
    <q-card :class="widthClass" class="card text-center">
      <q-card-section>
        <div class="flex justify-center">
          <img src="/images/help.png" alt="logoHelp" class="w-[64px] h-[64px]">
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-lg font-bold capitalize">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="description">
        {{ description }}
      </q-card-section>

      <q-card-section class="q-pt-none q-pb-none">
        <slot />
      </q-card-section>
      <div
        :class="[
          'gap-4 p-4',
          position == 'right' ? 'flex items-center justify-end' : 'grid grid-cols-1 md:grid-cols-2',
        ]"
      >
        <q-btn
          v-for="(button, index) in buttons"
          :key="index"
          :label="button.label"
          no-caps
          :outline="button.outline || false"
          :flat="button.flat || false"
          :dense="button.dense || true"
          :color="button.color"
          :class="['text-zinc-500 !rounded-lg', button.class]"
          :loading="button.loading || false"
          @click="handleButtonClick(button)"
          v-close-popup="button.closePopup !== false"
          padding="sm lg"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DialogConfirm',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Perhatian',
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
      default: 'min-w-32',
    },
    position: {
      type: String,
      default: 'center',
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
  },
}
</script>
