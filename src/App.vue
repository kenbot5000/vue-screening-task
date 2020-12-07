<template>
<v-app app>
  <!-- Data loader dialog -->
  <!-- Loads data either for viewing or for editing -->
  <v-dialog width="500" v-model="dataLoaderDialog">
    <v-card class="pa-4">
      <template v-if="editMode == true">
        <v-card-title>Edit Item</v-card-title>
        <v-text-field label="Title" v-model="loadedData.title" outlined />
        <v-textarea label="Content" v-model="loadedData.content" outlined />
      </template>
      <template v-else>
        No
      </template>
    </v-card>
  </v-dialog>

  <!-- Re-population dialog -->
  <v-dialog width="500" v-model="repopulationDialog">
    <v-card class="pa-4">
      <v-card-title>Repopulate the Database?</v-card-title>
      <v-switch class="ml-2" v-model="preclearSwitch" color="primary" label="Don't pre-clear the database (Keep current data)" />
      <v-card-actions>
        <v-btn color="success" @click="repopulate()">Repopulate</v-btn>
        <v-btn color="error" @click="repopulationDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container>
    <!-- Control Panel -->
    <v-row>
      <v-col>
        <v-card class="d-flex align-center pa-4">
          <v-switch color="warning" label="Toggle Edit mode" class="mx-2" v-model="editMode" />
          <v-btn color="primary" class="mx-2">Add New Item</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="warning" class="mx-2" @click="repopulationDialog = true">Re-populate Items</v-btn>
          <v-btn color="error" class="mx-2">Clear Databse</v-btn>
        </v-card>
      </v-col>
    </v-row>
    <!--  Data display -->
    <v-row>
      <v-col>
        <v-card outlined class="pa-4 primary white--text">
          <v-card-title class="text-h4">
            Values
          </v-card-title>
          <ItemDisplay v-for="item in values" :key="item._id" :item-data="item.title" @click.native="loadInfo(item)" />
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined class="pa-4 secondary white--text">
          <v-card-title class="text-h4">
            Principles
          </v-card-title>
          <ItemDisplay v-for="item in principles" :key="item._id" :item-data="item.title" @click.native="loadInfo(item)"/>
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
      dataLoaderDialog: false,
      loadedData: null,
      editMode: false,
      repopulationDialog: false,
      preclearSwitch: false,
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
    loadInfo (itemData) {
      this.dataLoaderDialog = true;
      this.loadedData = itemData
    },
    async repopulate() {
      await axios.post(`http://localhost:5000/populate?clear=${this.preclearSwitch}`)
    }
  },
}
</script>

<style>

</style>
