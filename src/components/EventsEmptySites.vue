<template lang="html">
  <b-container class="events-public-sites">
    <b-row>
      <b-col>
        <p class="active-sites">CREATE AN EVENT</p>
      </b-col>
    </b-row>
    <b-col cols="12" md="6" lg="4" style="padding: 0;">
      <empty-site/>
    </b-col>
    <b-row>

    </b-row>
  </b-container>
</template>

<script>
import EmptySite from './EmptySite'

export default {
  name: 'events-public-sites',
  components: {
    EmptySite
  }
}
</script>

<style lang="css" scoped>
  .events-public-sites {
    padding: 2em 0em;
  }

  .active-sites {
    font-size: 16px;
    color: #9FA9BA;
  }

</style>
