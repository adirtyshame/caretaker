<template>
  <v-card>
    <section id="auth-container"></section>
    <v-btn outlined @click="googleSignIn" color="#4285F4">
      Sign in with Google&nbsp;
      <v-icon>mdi-google</v-icon>
    </v-btn>
  </v-card>
</template>
<script>

export default {
  layout: 'empty',
  data() {
    return {}
  },
  methods: {
    googleSignIn() {
      this.$store
        .dispatch('user/googleSignIn')
        .catch(e => this.$snotify.error(e.message))
        .then(() => this.$router.push('/'))
        .then(() => this.$snotify.success('Logged in'))
    }
  },
}
</script>