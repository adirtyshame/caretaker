<template>
  <v-card>
    <v-card-title>
      Nursing cases
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <!-- <v-data-table :headers="headers" :items="cases" :search="search">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Tracks</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template slot="item" slot-scope="props">
          <tr @click="openItem(props.item)">
            <td>{{ props.item.lastName }}</td>
            <td class="text-xs-right">{{ props.item.firstName }}</td>
            <td class="text-xs-right">{{ props.item.address1 }}</td>
            <td class="text-xs-right">{{ props.item.address2 }}</td>
          </tr>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon class="mr-2" @click="editItem(item)">mdi-file-edit-outline</v-icon>
          <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="mdi-alert"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table> -->
      <v-list>
        <v-list-item
          v-for="item of cases"
          :key="item.uid"
          :to="`/cases/${item.uid}`"
        >{{ item.lastName }}, {{ item.firstName }}<v-spacer /><v-icon>mdi-chevron-right</v-icon></v-list-item>
      </v-list>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="pink" dark absolute bottom right fab v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-col>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.lastName" label="Last Name"></v-text-field>
                </v-row>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.firstName" label="First Name"></v-text-field>
                </v-row>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.address1" label="Address 1"></v-text-field>
                </v-row>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.address2" label="Address 2"></v-text-field>
                </v-row>
              </v-col>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<style scoped>
</style>

<script>
export default {
  data() {
    return {
      search: '',
      dialog: false,
      editedIndex: -1,
      editedItem: {
        lastName: '',
        firstName: '',
        address1: '',
        address2: '',
        uid: undefined
      },
      defaultItem: {
        lastName: '',
        firstName: '',
        address1: '',
        address2: '',
        uid: undefined
      },
      headers: [
        { text: 'Name', value: 'lastName' },
        { text: 'First Name', value: 'firstName', align: 'center' },
        { text: 'Address 1', value: 'address1', align: 'center' },
        { text: 'Address 2', value: 'address2', align: 'center' },
        { text: 'Actions', value: 'action', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    cases() {
      return this.$store.getters['cases/getCases']
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  methods: {
    openItem(item) {
      this.$router.push(`/cases/${item.uid}`)
    },
    editItem(item) {
      this.editedIndex = this.cases.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(track) {
      const index = this.cases.indexOf(track)
      confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch('cases/remove', track)
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      const track = {
        uid: this.editedItem.uid,
        firstName: this.editedItem.firstName,
        lastName: this.editedItem.lastName,
        address1: this.editedItem.address1,
        address2: this.editedItem.address2
      }

      if (this.editedIndex > -1) {
        this.$store.dispatch('cases/save', track)
      } else {
        this.$store.dispatch('cases/add', track)
      }
      this.$snotify.success('Case saved')
      this.close()
    }
  },
  mounted() {
    this.$store.dispatch('cases/fetch')
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  }
}
</script>