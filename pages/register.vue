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
      <v-text-field
        label="Verify"
        type="password"
        v-model="verify">
      </v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn outlined @click="register" color="#4285F4">
        Register
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