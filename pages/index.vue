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
      <v-card>
        <v-card-title>
          Willkommen bei Caretaker!
          <v-subheader>Einfach Pflege</v-subheader>
        </v-card-title>
        <v-img
        height="160px"
        contain
          src="/icon.png">
        </v-img>
        <v-card-text>
          <p>Verwalten Sie ihre Pflegefälle, ganz bequem auf jedem Endgerät</p>
          <p>Zu Hause oder unterwegs!</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="$router.push('/cases')">
            Start >
          </v-btn>
          <!-- <nuxt-link to="/cases">Fälle bearbeiten</nuxt-link> -->
        </v-card-actions>
      </v-card>
      
    </v-flex>
  </v-layout>
</template>

<style scoped>
  .v-image {
    background-color: white;
  }
</style>

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
