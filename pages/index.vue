<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <nuxt-link to="/cases">Go to cases</nuxt-link>
      
    </v-flex>
  </v-layout>
</template>

<script>
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    VuetifyLogo,
    Logo
  }
}
</script>
