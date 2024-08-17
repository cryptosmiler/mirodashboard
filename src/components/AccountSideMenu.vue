<template lang="html">
  <div class="account-side-menu">
    <account-side-menu-profile/>
    <account-side-menu-billing/>
  </div>
</template>

<script>
import AccountSideMenuProfile from './AccountSideMenuProfile'
import AccountSideMenuBilling from './AccountSideMenuBilling'
export default {
  name: 'account-side-menu',
  components: {
    AccountSideMenuProfile,
    AccountSideMenuBilling
  }
}
</script>

<style lang="css" scoped>

</style>
