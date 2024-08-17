<template lang="html">
  <b-container class="">
    <p class="profile-settings">Billing Settings</p>
    <payment-methods/>
    <add-payment-method/>
    <!-- <invoices/> -->
  </b-container>
</template>

<script>
import PaymentMethods from './PaymentMethods'
import AddPaymentMethod from './AddPaymentMethod'
import Invoices from '../Balance/Invoices'

export default {
  name: 'billing-settings',
  components: {
    PaymentMethods,
    AddPaymentMethod,
    Invoices
  }
}
</script>

<style lang="css" scoped>
  .profile-settings {
    color: #aeb4c3;
    font-size: 24px;
  }
</style>
