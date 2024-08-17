<template lang="html">
  <div class="" @click="selectAccountBilling">
    <h2>Billing Settings</h2>
    <ul>
      <li>Payment Method</li>
      <li>Billing Information</li>
      <li>Billing History</li>
    </ul>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'account-side-menu-billing',
    methods: {
      ...mapActions([
        'changeCurrentView'
      ]),
      selectAccountBilling () {
        this.$store.dispatch('changeCurrentView', 'account-billing-settings')
      }
    }
  }
</script>

<style lang="css" scoped>

  li {
    list-style-type: none;
  }
</style>
