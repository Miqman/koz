<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  mounted() {
    document.title = import.meta.env.VITE_APP_TITLE
  },
})
</script>
<script setup></script>
