<!-- AuthLayout -->
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout',

  components: {},

  data() {
    return {}
  },
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
