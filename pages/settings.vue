<template>
    
          <v-switch :label="`Dark Theme`" v-model="dark" @change="setTheme" color="primary"></v-switch>
</template>

<script>
export default {
    computed: {
        dark: {
            get() {
                return this.$store.getters['user/getDarkMode']
            },
            set(mode) {
                this.$store.dispatch('user/darkMode', mode)
            }
        }
    },
    methods: {

    setTheme() {
            if (this.dark === true) {
                return (this.$vuetify.theme.dark = true);
            } else {
                return (this.$vuetify.theme.dark = false);
            }
        }
    }
}
</script>