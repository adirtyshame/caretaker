<template>
  <v-app>

    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app
      v-if="$vuetify.breakpoint.smAndUp">
      <v-list>
        <v-list-item :to="'/profile'" router exact>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/settings" router exact>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'Einstellungen'" />
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Abmelden</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" aria-label="Navigation" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app
      v-if="$vuetify.breakpoint.smAndUp">
      <span>&copy; 2020</span>
    </v-footer>
    <client-only>
      <offline-alert onlineMessage="Sie sind wieder online!" offlineMessage="Sie sind offline!" />
    </client-only>
    <v-bottom-navigation
      v-if="$vuetify.breakpoint.xsOnly"
      v-model="bottomNav"
      fixed
      grow
      app
      shift
      :input-value="drawer"
    >
    <!-- <v-btn to="/">
      <span>Startseite</span>
      <v-icon>mdi-home</v-icon>
    </v-btn> -->

    <v-btn to="/cases">
      <span>Pflegefälle</span>
      <v-icon>mdi-account-multiple</v-icon>
    </v-btn>

    <v-btn to="/settings">
      <span>Einstellungen</span>
      <v-icon>mdi-settings</v-icon>
    </v-btn>

    <v-btn @click="logout">
      <span>Abmelden</span>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: '',
      goDark: true,
      clipped: false,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Startseite',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Pflegefälle',
          to: '/cases'
        }
      ],
      miniVariant: false,
      title: 'Caretaker'
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    }
  },
  mounted() {
    this.$store.dispatch('cases/fetch')
  }
}
</script>
