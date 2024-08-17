<template lang="html">
  <div class="" @click="selectAccountProfile">
    <h2>Profile</h2>
    <ul>
      <li>Account Information</li>
      <li>Manage Passwords</li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'account-side-menu-profile',
  methods: {
    ...mapActions([
      'changeCurrentView'
    ]),
    selectAccountProfile () {
      this.$store.dispatch('changeCurrentView', 'account-profile-settings')
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentView'
    ])
  }
}
</script>

<style lang="css" scoped>

  li {
    list-style-type: none;
  }
</style>
