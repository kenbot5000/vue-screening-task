<template>
<v-app app>
  <v-container>
    <ItemLoader :dialog-data="dialogData" />
    <v-row>
      <v-col>
        <v-card outlined class="pa-4 primary white--text">
          <v-card-title class="text-h4">
            Values
          </v-card-title>
          <ItemDisplay v-for="item in values" :key="item._id" :item-data="item.title" @click="loadInfo(item)" />
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined class="pa-4 secondary white--text">
          <v-card-title class="text-h4">
            Principles
          </v-card-title>
          <ItemDisplay v-for="item in principles" :key="item._id" :item-data="item.title" @click="loadInfo(item)"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</v-app>
</template>

<script>
import axios from 'axios';
import ItemDisplay from '@/components/ItemDisplay.vue'

export default {
  components: {
    ItemDisplay,
  },
  data () {
    return {
      values: [],
      principles: [],
      dialogData: null,
    }
  },
  mounted () {
      this.getAllItems()
  },
  methods: {
    async getAllItems () {
      let items = await axios.get('/api/');
      items = items.data.res;
      [this.values, this.principles] = items.reduce((result, element) => {
        result[element.type === 'value' ? 0 : 1].push(element);
        return result;
      },
      [[],[]]);
    },
  }
}
</script>

<style>

</style>
