<template>
  <div>
    <dashboard-menu-bar/>
    <router-link to="/signin">Sign In</router-link>
    <br>
    <router-link to="/signup">Sign Up</router-link>
    <br /> 
    <router-link to="/dashboard">Events List</router-link>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>