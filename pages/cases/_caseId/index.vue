<template>
  <v-card>
    <v-card-title>
      <v-btn @click="$router.back()" icon>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      {{ currentCase.lastName }}, {{ currentCase.firstName }}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Suche"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <p>Straße Hausnummer: {{ currentCase.address1 }}</p>
      <p>PLZ Ort: {{ currentCase.address2 }}</p>
      <p>Gesamtstrecke: {{ totalDistance }}km</p>
      <p>Zeitaufwand: {{ totalEffort }}h</p>
      <v-data-table :headers="headers" :items="tracks" :search="search">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Anfahrten</v-toolbar-title>
            <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Neue Anfahrt</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-col>
                      <v-row cols="12" sm="6" md="4">
                        <v-textarea v-model="editedItem.description" label="Description"></v-textarea>
                      </v-row>
                      <v-row cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.effort" label="Effort (h)"></v-text-field>
                      </v-row>
                      <v-row cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.distance" label="Distance (km)"></v-text-field>
                      </v-row>
                    </v-col>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Abbrechen</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Speichern</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template slot="items" slot-scope="props">
          <tr @click="editItem(props.item)">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.description }}</td>
          <td class="text-xs-right">{{ props.item.effort }}</td>
          <td class="text-xs-right">{{ props.item.distance }}</td>
            </tr>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon class="mr-2" @click="editItem(item)">mdi-file-edit-outline</v-icon>
          <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="mdi-alert">
          Keine Ergebnisse für "{{ search }}" gefunden.
        </v-alert>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import uuid from 'uuid/v4'
export default {
  data() {
    return {
      search: '',
      dialog: false,
      editedIndex: -1,
      editedItem: {
        description: '',
        effort: 0,
        distance: 0,
        uid: '',
        timestamp: ''
      },
      defaultItem: {
        description: '',
        effort: 0,
        distance: 0,
        uid: undefined,
        timestamp: ''
      },
      headers: [
        { text: 'Description', value: 'description' },
        { text: 'Effort (h)', value: 'effort', align: 'center' },
        { text: 'Distance (km)', value: 'distance', align: 'center' },
        { text: 'Actions', value: 'action', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    currentCase() {
      return this.$store.getters['cases/getCases'].find(
        c => c.uid === this.$route.params.caseId
      )
    },
    tracks() {
      return this.$store.getters['tracks/getTracks']
    },
    totalDistance() {
      return this.tracks.reduce((sum, curr) => sum + curr.distance, 0)
    },
    totalEffort() {
      return this.tracks.reduce((sum, curr) => sum + curr.effort, 0)
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.tracks.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(track) {
      const index = this.tracks.indexOf(track)
      confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch('tracks/remove', {
          caseId: this.$route.params.caseId,
          track
        })
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
        description: this.editedItem.description,
        distance: parseFloat(this.editedItem.distance),
        effort: parseFloat(this.editedItem.effort),
        timestamp: this.editedItem.timestamp
      }

      if (this.editedIndex > -1) {
        this.$store.dispatch('tracks/save', {
          caseId: this.$route.params.caseId,
          track
        })
      } else {
        this.$store.dispatch('tracks/add', {
          caseId: this.$route.params.caseId,
          track
        })
      }
      this.$snotify.success('Track saved')
      this.close()
    }
  },
  mounted() {
    this.$store.dispatch('tracks/fetch', this.currentCase.uid)
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  }
}
</script>