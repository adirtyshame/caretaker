<template>
  <v-card>
    <v-card-text>
      <v-text-field
        label="Email"
        type="email"
        v-model="email">
      </v-text-field>
      <v-text-field
        label="Password"
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
        .catch(e => this.$snotify.error(e.message))
        .then(() => this.$router.push('/'))
        .then(() => this.$snotify.success('Logged in'))
    },
    passwordSignIn() {
      this.$store
        .dispatch('user/passwordSignIn', {
          email: this.email,
          password: this.password,
        })
        .catch(e => this.$snotify.error(e.message))
        .then(() => this.$router.push('/'))
        .then(() => this.$snotify.success('Logged in'))
    },
  }
}
</script>