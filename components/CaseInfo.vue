<template>
    <v-card v-if="currentCase" class="mb-2">
      <v-card-title>
        Aktenzeichen: {{ currentCase.caseRef ? currentCase.caseRef : '---' }}
        <v-spacer></v-spacer>   
        <v-btn @click="editCase" icon>
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-dialog v-model="dialog">
          <!-- <template v-slot:activator="{ on }">
          <v-btn color="pink" dark absolute bottom right fab v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>-->
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
                    <v-text-field v-model="editedCase.caseRef" label="Aktenzeichen"></v-text-field>
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
                    >
                      <v-avatar
                        slot="prepend-inner"
                      :color="severity(editedCase.levelOfCare)"
                      size="24" />
                    </v-select>
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
      </v-card-title>
      <v-card-text>
        <b>Geburtstag:</b> {{ currentCase.birthday ? $dateFns.format(currentCase.birthday) : '---' }}<br/>
        <b>Pflegegrad:</b> <v-chip :color="severity(currentCase.levelOfCare)">{{currentCase.levelOfCare || 0}}</v-chip>
        <v-row>
          <v-col>
            <b>Adresse:</b>
            <div>{{ currentCase.address1 ? currentCase.address1 : '---' }}</div>
            <div>{{ currentCase.address2 ? currentCase.address2 : '---' }}</div>
            <br/>
            <b>Bankverbindung:</b>
            <div>{{ currentCase.iban ? currentCase.iban : '---' }}</div>
            <div>{{ currentCase.bic ? currentCase.bic : '---' }}</div>
          </v-col>
          <v-col>
            <b>Versicherung:</b>
            <div>{{ currentCase.insurance ? currentCase.insurance : '---' }}</div>
            <br/>
            <b>Angehörige:</b>
            <div>{{ currentCase.relatives ? currentCase.relatives : '---' }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  props: ['currentCase'],
  data() {
    return {
      dialog: false,
      birthdayMenu: false,
      levelsOfCare: [
        { value: 0, text: 'kein Pflegegrad', color: 'lime' },
        { value: 1, text: 'Pflegegrad 1', color: 'yellow' },
        { value: 2, text: 'Pflegegrad 2', color: 'amber' },
        { value: 3, text: 'Pflegegrad 3', color: 'orange' },
        { value: 4, text: 'Pflegegrad 4', color: 'red' },
        { value: 5, text: 'Pflegegrad 5', color: 'purple' },
      ],
      editedCase: {
        lastName: '',
        firstName: '',
        birthday: '',
        address1: '',
        address2: '',
        insurance: '',
        levelOfCare: '',
        caseRef: '',
        iban: '',
        bic: '',
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
        caseRef: '',
        iban: '',
        bic: '',
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
    
    computedDateFormattedDatefns() {
      return this.editedCase.birthday
        ? this.$dateFns.format(this.editedCase.birthday)
        : ''
    }
  },
  methods: {


    editCase(item) {
      this.editedCase = Object.assign({}, this.currentCase)
      this.dialog = true
    },

    closeCase() {
      this.dialog = false
      setTimeout(() => {
        this.editedCase = Object.assign({}, this.defaultCase)
      }, 300)
    },

    saveCase() {
      this.$store.dispatch('cases/save', this.editedCase)
      this.$snotify.success('Case saved')
      this.closeCase()
    },

    severity(val) {
      return this.levelsOfCare[val || 0].color
    }
  }
}
</script>