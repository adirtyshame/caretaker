<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          :to="'/profile'"
          router
          exact>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
            @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Abmelden</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-switch :label="`Dark Theme`" v-model="goDark" @change="setTheme" color="primary"></v-switch>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      fixed
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
    <vue-snotify></vue-snotify>
    <client-only>
      <offline-alert/>
    </client-only>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      goDark: true,
      clipped: false,
      drawer: true,
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
      this.$store.dispatch(('user/logout'));
    },
    setTheme() {
            if (this.goDark == true) {
                return (this.$vuetify.theme.dark = true);
            } else {
                return (this.$vuetify.theme.dark = false);
            }
        }
  },
  mounted() {
    this.$store.dispatch('cases/fetch')
  },
}
</script>
