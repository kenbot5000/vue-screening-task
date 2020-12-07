<template>
<v-app app>
  <!-- Data loader dialog -->
  <!-- Loads data either for viewing or for editing -->
  <v-dialog width="600" v-model="dataLoaderDialog">
    <v-card class="pa-4">
      <!-- Edit dialog -->
      <template v-if="editMode == true">
        <v-card-title>Edit Item</v-card-title>
        <v-select label="Type" :items="itemTypes" item-text="text" item-value="value" v-model="loadedData.type" outlined />
        <v-text-field label="Title" v-model="loadedData.title" outlined />
        <v-textarea label="Content" v-model="loadedData.content" outlined />
        <v-card-actions>
          <v-btn color="success" @click="patchItem()">Submit</v-btn>
          <v-btn color="warning" @click="deleteItem()">Delete this Item</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dataLoaderDialog = false">Cancel</v-btn>
        </v-card-actions>
      </template>
      <!-- Read-only Dialog -->
      <template v-else>
        <v-card-title>
          {{ loadedData.title }}
        </v-card-title>
        <v-card-text>
          {{ loadedData.content }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="dataLoaderDialog = false">Close</v-btn>
        </v-card-actions>
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

  <!-- Add dialog -->
  <v-dialog width="500" v-model="addDialog">
    <v-card class="pa-4">
      <v-card-title>Add Item</v-card-title>
      <v-select label="Type" :items="itemTypes" item-text="text" item-value="value" v-model="addData.type" outlined />
        <v-text-field label="Title" v-model="addData.title" outlined />
        <v-textarea label="Content" v-model="addData.content" outlined />
        <v-card-actions>
          <v-btn color="success" @click="addItem()">Submit</v-btn>
          <v-btn color="error" @click="addDialog = false">Cancel</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Clear Dialog -->
  <v-dialog width="500" v-model="clearDialog">
    <v-card class="pa-4">
      Are you sure you want to delete everything?
      <v-card-actions>
        <v-btn color="warning" @click="clear()">Yes, delete everything</v-btn>
        <v-btn color="error" @click="clearDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container>
    <!-- Control Panel -->
    <v-row>
      <v-col>
        <v-card class="d-flex align-center pa-4">
          <v-switch color="warning" label="Toggle Edit mode" class="mx-2" v-model="editMode" />
          <v-btn color="primary" class="mx-2" @click="addDialog = true">Add New Item</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="warning" class="mx-2" @click="repopulationDialog = true">Re-populate Items</v-btn>
          <v-btn color="error" class="mx-2" @click="clearDialog = true">Clear Database</v-btn>
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
          <ItemDisplay v-for="item in values" :key="item._id" :item-data="item.title" :ref="'item-'+item._id" @click.native="loadInfo(item)" />
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined class="pa-4 secondary white--text">
          <v-card-title class="text-h4">
            Principles
          </v-card-title>
          <ItemDisplay v-for="item in principles" :key="item._id" :item-data="item.title" :ref="'item-'+item._id" @click.native="loadInfo(item)"/>
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
      itemTypes: [
        {text: 'Value', value: 'value'},
        {text: 'Principle', value: 'principle'}
      ],
      dataLoaderDialog: false,
      loadedData: {
        title: '',
        content: ''
      },
      editMode: false,
      repopulationDialog: false,
      preclearSwitch: false,
      addDialog: false,
      addData: {
        type: 'value',
        title: '',
        content: ''
      },
      clearDialog: false,
    }
  },
  mounted () {
      this.getAllItems()
  },
  methods: {
    // Re/loads all data 
    async getAllItems () {
      let items = await axios.get('/api/');
      items = items.data.res;
      [this.values, this.principles] = items.reduce((result, element) => {
        result[element.type === 'value' ? 0 : 1].push(element);
        return result;
      },
      [[],[]]);
    },
    async addItem () {
      const res = await axios.post('/api/', this.addData);
      if(res.status === 201) {
        this.addData.type === 'value' ? this.values.push(this.addData) : this.principles.push(this.addData)
      }
    },
    // Edit request
    async patchItem () {
      const res = await axios.patch(`/api/?id=${this.loadedData._id}`, this.loadedData)
      if(res.status === 200) {
        // Updates title display
        this.$refs[`item-${this.loadedData._id}`][0].updateTitle(this.loadedData.title)

        // Updates actual content
        // I know this is really inefficient, but for a dataset this small, and with what little time I have, this will do
        this.getAllItems()
      }
    },
    // Delete request
    async deleteItem () {
      const res = await axios.delete(`/api/?id=${this.loadedData._id}`)
      if(res.status === 200) {
        this.getAllItems()
      }
    },
    // Loads info into the dialog
    loadInfo (itemData) {
      this.dataLoaderDialog = true;
      this.loadedData = {...itemData};
    },
    // Population request
    async repopulate() {
      const res = await axios.post(`/api/populate?clear=${!this.preclearSwitch}`)
      if(res.status === 201) {
        this.getAllItems()
      } 
    },
    // Clear request
    async clear() {
      const res = await axios.delete('/api/clear');
      if(res.status === 200) {
        // Clears all so no update is needed
        this.values = []
        this.principles = []
      }
    }
  },
}
</script>

<style>

</style>
