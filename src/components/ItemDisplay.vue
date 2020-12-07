<template >
  <v-hover v-slot="{ hover }">
    <v-card class="pa-4 my-3" :elevation="hover ? 12 : 2" :class="{ 'on-hover' : 'hover'}" link >
      {{ title }}
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: ['item-data'],
  data () {
    return {
      title: this.itemData
    }
  }
}
</script>