import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/static/prevent-refresh.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/auth.js',
    '~/plugins/nuxt-offline-alert.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    ['@nuxtjs/date-fns', {
      locales: ['de'],
      defaultLocale: 'de',
      format: 'dd. MMMM yyyy',
    }]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Firebase stuff
    [
      'nuxt-fire',
      {
        config: {
          apiKey: "AIzaSyApOBDR6QkUmFpWZDqS1EXnayrM7nGxzqU",
          authDomain: "caretaker-248319.firebaseapp.com",
          databaseURL: "https://caretaker-248319.firebaseio.com",
          projectId: "caretaker-248319",
          storageBucket: "caretaker-248319.appspot.com",
          messagingSenderId: "753779758705",
          appId: "1:753779758705:web:85e5262a6c5b0851"
        },
        services: {
          auth: true,
          realtimeDb: true,
          firestore: {
            static: false, // default
            preload: true, // default
            chunkName: process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]', // default
            enablePersistence: true
          }
        }
      }
    ]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  router: {
    middleware: 'router-auth'
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^nuxt-fire/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
