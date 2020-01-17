<template>
  <v-card>
    <v-card-title>
      Pflegefälle
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

      <v-list>
        <v-list-item v-for="item of filteredCases" :key="item.uid" :to="`/cases/${item.uid}`">
          {{ item.lastName }}, {{ item.firstName }}
          <v-subheader>{{ item.address1 }} {{ item.address2 }}</v-subheader>
          <v-spacer />
          <v-icon>mdi-chevron-right</v-icon>
        </v-list-item>
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
              <v-row>
                <v-col>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.lastName" label="Nachname"></v-text-field>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.firstName" label="Vorname"></v-text-field>
                  </v-row>
                  <v-row>
                    <v-menu v-model="menu2" :close-on-content-click="false" max-width="290">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="computedDateFormattedDatefns"
                          clearable
                          label="Geburtstag"
                          prepend-icon="mdi-calendar-edit"
                          readonly
                          v-on="on"
                          @click:clear="editedItem.birthday = null"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.birthday"
                        locale="de-DE"
                        header-color="pink"
                        @change="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.address1" label="Straße Hausnummer"></v-text-field>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.address2" label="Postleitzahl Ort"></v-text-field>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.insurance" label="Versicherung"></v-text-field>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.levelOfCare" label="Pflegestufe"></v-text-field>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.iban" label="IBAN"></v-text-field>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.relatives" label="Angehörige (Tel.)"></v-text-field>
                  </v-row>
                </v-col>
              </v-row>
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
      filteredCases: [],
      dialog: false,
      menu2: false,
      editedIndex: -1,
      editedItem: {
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
      defaultItem: {
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
      }
    }
  },
  computed: {
    cases() {
      return this.$store.getters['cases/getCases']
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Neuer Eintrag' : 'Eintrag bearbeiten'
    },
    computedDateFormattedDatefns() {
      return this.editedItem.birthday
        ? this.$dateFns.format(this.editedItem.birthday)
        : ''
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
      confirm('Möchten Sie diesen Eintrag wirklich löschen?') &&
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
    this.filteredCases = this.cases
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    search(val) {
      this.filteredCases = this.cases.filter(c =>
        [c.lastName, c.firstName, c.address1, c.address2]
          .join(' ')
          .includes(val)
      )
    }
  }
}
</script>