<template>
    <v-card>
        <v-card-title>
            <!-- <v-avatar size="62"> -->
            <img :src="user.photoURL" alt="">
        <!-- </v-avatar> -->
        </v-card-title>
        <v-card-text>
            <dl>
                <dt>ID</dt>
                <dd>{{ user.uid }}</dd>
                <dt>Name</dt>
                <dd>{{ user.displayName }}</dd>
                <dt>Email</dt>
                <dd>{{ user.email }}</dd>
                <dt>Provider</dt>
                <dd>{{ user.providerId }}</dd>
            </dl>
        </v-card-text>
    </v-card>
</template>
<style lang="css" scoped>
    dt {
        color: rgba(255, 255, 255, 0.5)
    }
</style>
<script>
export default {
    data() {
        return {

        }
    },
    computed: {
        user() {
            return this.$store.getters['user/getUser']
        }
    }
}
</script>