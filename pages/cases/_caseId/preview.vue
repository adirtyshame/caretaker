<template>
  <div>
    <h3><v-btn icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn> Name: test</h3>
    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Beschreibung</th>
          <th class="text-left">Datum</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tracks" :key="item.name">
          <td>{{ item.description }}</td>
          <td>{{ formatDate(item.timestamp) }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  </div>
</template>
<script>
export default {
  layout: 'empty',
  computed: {
    tracks() {
      return this.$store.getters['tracks/getSortedTracks']
    },
  },
  methods: {
    formatDate(date) {
      return date
        ? this.$dateFns.format(date)
        : ''
    }
  }
}
</script>