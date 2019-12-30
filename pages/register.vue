<template>
  <v-card>
    <v-list-item>
      <v-list-item-avatar color="pink">
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
      <v-text-field
        label="Passwort (wiederholen)"
        type="password"
        v-model="verify">
      </v-text-field>
      <nuxt-link to="/login">Bereits registriert?</nuxt-link>
    </v-card-text>
    <v-card-actions>
      <v-btn outlined @click="register" color="#4285F4">
        Registrieren
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
      password: '',
      verify: ''
    }
  },
  methods: {
    register() {
        if (this.password !== this.verify) {
            return
        }
        this.$store.dispatch('user/register', {
            email: this.email,
            password: this.password,
        })
        .catch(e => this.$snotify.error(e.message))
        .then(() => this.$router.push('/'))
        .then(() => this.$snotify.success('Logged in'))
    }
  }
}
</script>