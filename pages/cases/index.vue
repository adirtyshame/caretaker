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
        <v-list-item
        three-line
          v-for="item of filteredCases"
          :key="item.uid"
          :to="`/cases/${item.uid}`">
          <v-list-item-content>
            <v-list-item-title>{{ item.lastName }}, {{ item.firstName }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.caseRef ? item.caseRef : '---' }}</v-list-item-subtitle>
          <v-list-item-subtitle>{{ item.address1 }} {{ item.address2 }}</v-list-item-subtitle>

          
          </v-list-item-content>

          <v-avatar
            v-if="item"
            :color="severity(item.levelOfCare)"
            size="36">
            {{ item.levelOfCare || 0}}
          </v-avatar>
          <v-icon>mdi-chevron-right</v-icon>
        </v-list-item>
        
      </v-list>
      <v-dialog v-model="dialog">
        <template v-slot:activator="{ on }">
          <v-btn color="pink" dark absolute bottom right fab v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
          <v-card>
            <v-card-title>
              <span class="headline">Pflegefall bearbeiten</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field v-model="editedCase.lastName" label="Nachname"></v-text-field>
                    <v-text-field v-model="editedCase.firstName" label="Vorname"></v-text-field>
                    <v-menu v-model="birthdayMenu" :close-on-content-click="false" max-width="290">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="computedDateFormattedDatefns"
                          clearable
                          label="Geburtstag"
                          prepend-icon="mdi-calendar-edit"
                          readonly
                          v-on="on"
                          @click:clear="editedCase.birthday = null"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedCase.birthday"
                        locale="de-DE"
                        header-color="pink"
                        @change="birthdayMenu = false"
                      ></v-date-picker>
                    </v-menu>
                    <v-text-field v-model="editedCase.address1" label="Straße Hausnummer"></v-text-field>
                    <v-text-field v-model="editedCase.address2" label="Postleitzahl Ort"></v-text-field>

                  </v-col>
                  <v-col>
                    <v-text-field v-model="editedCase.insurance" label="Versicherung"></v-text-field>
                    <v-row>
                      <v-select
                      v-model="editedCase.levelOfCare"
                      :items="levelsOfCare"
                      label="Pflegegrad"
                    ></v-select>
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-icon color="primary" dark v-on="on">mdi-information-outline</v-icon>
                      </template>
                      <pre>{{locDescription}}</pre>
                    </v-tooltip>
                    </v-row>
                    <v-text-field v-model="editedCase.iban" label="IBAN"></v-text-field>
                    <v-text-field v-model="editedCase.bic" label="BIC"></v-text-field>
                    <v-text-field v-model="editedCase.relatives" label="Angehörige (Tel.)"></v-text-field>

                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeCase">Abbrechen</v-btn>
              <v-btn color="blue darken-1" text @click="saveCase">Speichern</v-btn>
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
      birthdayMenu: false,
      levelsOfCare: [
        { value: 0, text: 'kein Pflegegrad', color: 'lime' },
        { value: 1, text: 'Pflegegrad 1', color: 'yellow' },
        { value: 2, text: 'Pflegegrad 2', color: 'amber' },
        { value: 3, text: 'Pflegegrad 3', color: 'orange' },
        { value: 4, text: 'Pflegegrad 4', color: 'red' },
        { value: 5, text: 'Pflegegrad 5', color: 'purple' },
      ],
      editedIndex: -1,
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
      locDescription: `
  Pflegegrad 1:
      Geringe Beeinträchtigung der Selbstständigkeit
  Pflegegrad 2:
      Erhebliche Beeinträchtigung der Selbstständigkeit
      (ehemals Pflegestufe 1)
  Pflegegrad 3:
      Schwere Beeinträchtigung der Selbstständigkeit
      (ehemals Pflegestufe 2)
  Pflegegrad 4:
      Schwerste Beeinträchtigung der Selbstständigkeit
      (ehemals Pflegestufe 3)
  Pflegegrad 5:
      Schwerste Beeinträchtigung der Selbstständigkeit mit
      besonderen Anforderungen an die pflegerische Versorgung
      (ehemals Härtefall)
            `
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
      return this.editedCase.birthday
        ? this.$dateFns.format(this.editedCase.birthday)
        : ''
    }
  },
  methods: {

    closeCase() {
      this.dialog = false
      setTimeout(() => {
        this.editedCase = Object.assign({}, this.defaultCase)
        this.editedIndex = -1
      }, 300)
    },

    async saveCase() {
      const res = await this.$store.dispatch('cases/add', this.editedCase)
      this.$snotify.success('Case added')
      this.closeCase()
      this.$router.push(`/cases/${res.id}`)
    },

    severity(val) {
      return this.levelsOfCare[val || 0].color
    }
  },
  mounted() {
    this.filteredCases = this.cases
  },
  watch: {
    dialog(val) {
      val || this.closeCase()
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