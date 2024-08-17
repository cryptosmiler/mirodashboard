<template lang="html">
  <sign-up-modal
    visible
  />
</template>

<script>
import SignUpModal from '../components/SignUpModal.vue'

export default {
  name: 'sign-up',
  components : {
    SignUpModal
  },
  mounted() {
    // Clear any Auth errors
    this.$store.dispatch("Auth/errorToNull")
  }
}
</script>

