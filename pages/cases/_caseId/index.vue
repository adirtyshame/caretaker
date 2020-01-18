<template>
<div>
  <v-toolbar>
    <v-toolbar-title>
      <v-btn @click="$router.back()" icon>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
     zurück
    </v-toolbar-title>
  </v-toolbar>
  
  <CaseInfo :currentCase="currentCase" class="mt-2"></CaseInfo>
  <v-card>
    <v-card-text>
      <v-data-table :headers="headers" :items="tracks" :search="search" sort-by="timestamp">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Anfahrten</v-toolbar-title>
            <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Suche"
              single-line
              hide-details
            ></v-text-field>&nbsp;
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
                        <v-textarea v-model="editedItem.description" label="Beschreibung"></v-textarea>
                      </v-row>
                      <v-row cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.effort" label="Aufwand (h)"></v-text-field>
                      </v-row>
                      <v-row cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.distance" label="Strecke (km)"></v-text-field>
                      </v-row>
                      <v-row>
                        <v-menu v-model="dateMenu" :close-on-content-click="false" max-width="290">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="computedDateFormattedDatefns"
                          clearable
                          label="Datum"
                          prepend-icon="mdi-calendar-edit"
                          readonly
                          v-on="on"
                          @click:clear="editedItem.timestamp = null"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.timestamp"
                        locale="de-DE"
                        header-color="pink"
                        @change="dateMenu = false"
                      ></v-date-picker>
                    </v-menu>
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
          <td class="text-xs-right">will be replaced by template slot</td>
            </tr>
        </template>
        <template v-slot:item.timestamp="{ item }">
           <span>{{ item.timestamp ? $dateFns.format(item.timestamp, 'dd.MM.yyyy') : '' }}</span>
         </template>
        <template v-slot:item.action="{ item }">
          <v-icon class="mr-2" @click="editItem(item)">mdi-pencil-outline</v-icon>
          <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="mdi-alert">
          Keine Ergebnisse für "{{ search }}" gefunden.
        </v-alert>
      </v-data-table>
    </v-card-text>
  </v-card>
</div>
</template>

<script>
import uuid from 'uuid/v4'
import CaseInfo from '~/components/CaseInfo'
export default {
  components: {
    CaseInfo
  },
  data() {
    return {
      dateMenu: false,
      levelsOfCare: [
        { value: 0, text: 'kein Pflegegrad', color: 'lime' },
        { value: 1, text: 'Pflegegrad 1', color: 'yellow' },
        { value: 2, text: 'Pflegegrad 2', color: 'amber' },
        { value: 3, text: 'Pflegegrad 3', color: 'orange' },
        { value: 4, text: 'Pflegegrad 4', color: 'red' },
        { value: 5, text: 'Pflegegrad 5', color: 'purple' },
      ],
      search: '',
      dialog: false,
      dialog1: false,
      menu2: false,
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
      editedCase: {
        lastName: '',
        firstName: '',
        birthday: '',
        address1: '',
        address2: '',
        insurance: '',
        levelOfCare: '',
        iban: '',
        relatives: '',
        uid: undefined
      },
      defaultCase: {
        lastName: '',
        firstName: '',
        birthday: '',
        address1: '',
        address2: '',
        insurance: '',
        levelOfCare: '',
        iban: '',
        relatives: '',
        uid: undefined
      },
      headers: [
        { text: 'Beschreibung', value: 'description' },
        { text: 'Aufwand (h)', value: 'effort', align: 'center' },
        { text: 'Strecke (km)', value: 'distance', align: 'center' },
        { text: 'Datum', value: 'timestamp', align: 'center'},
        { text: 'Aktionen', value: 'action', align: 'center', sortable: false }
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
      return this.editedIndex === -1 ? 'Neuer Eintrag' : 'Eintrag bearbeiten'
    },
    computedDateFormattedDatefns() {
      return this.editedItem.timestamp
        ? this.$dateFns.format(this.editedItem.timestamp)
        : ''
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.tracks.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editCase(item) {
      this.editedIndex = this.tracks.indexOf(item)
      this.editedCase = Object.assign({}, this.currentCase)
      this.dialog1 = true
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

    closeCase() {
      this.dialog1 = false
      setTimeout(() => {
        this.editedCase = Object.assign({}, this.defaultCase)
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
    },

    saveCase() {
      this.$store.dispatch('cases/save', this.editedCase)
      this.$snotify.success('Case saved')
      this.closeCase()
    },

    severity(val) {
      return this.levelsOfCare[val || 0].color
    }

  },
  mounted() {
    this.$store.dispatch('tracks/fetch', this.$route.params.caseId)
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialog1(val) {
      val || this.closeCase()
    }
  }
}
</script>