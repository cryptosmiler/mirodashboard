<template lang="html">
  <div class="sign-in">
    <sign-in-modal/>
  </div>
</template>

<script>
import EventBus from '../event-bus'

export default {
  name: 'sign-in',
  mounted () {
    EventBus.$emit('open-sign-in-modal')
  }
}
</script>

