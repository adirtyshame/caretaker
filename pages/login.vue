<template>
  <v-card class="cont">
    <v-list-item>
      <v-list-item-avatar color="white">
        <img src="/icon.png" alt="" srcset="">
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">Caretaker</v-list-item-title>
        <v-list-item-subtitle>Einfach Pflege</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      <v-text-field
        label="Email"
        type="email"
        v-model="email">
      </v-text-field>
      <v-text-field
        label="Passwort"
        type="password"
        v-model="password">
      </v-text-field>
      <nuxt-link to="/register">Neuer Benutzer?</nuxt-link>
    </v-card-text>
    <v-card-actions>
      <v-btn outlined @click="passwordSignIn" color="#4285F4">
        Anmelden
      </v-btn>
      <v-btn outlined @click="googleSignIn" color="#4285F4">
        <v-icon>mdi-google</v-icon>&nbsp;Mit Google anmelden
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style scoped>
  .cont {
    max-width: 500px;
    margin: 0 auto;
  }
</style>
<script>
export default {
  layout: 'empty',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    googleSignIn() {
      this.$store
        .dispatch('user/googleSignIn')
        .catch(e => console.error(e.message))
        .then(() => this.$router.push('/cases'))
    },
    passwordSignIn() {
      this.$store
        .dispatch('user/passwordSignIn', {
          email: this.email,
          password: this.password,
        })
        .catch(e => console.error(e.message))
        .then(() => this.$router.push('/cases'))
    },
  }
}
</script>