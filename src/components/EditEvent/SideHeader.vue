<template lang="html">
  <b-container class="edit-event-side-header">
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EventBus from '../../event-bus'

export default {
  name: 'edit-event-side-header',
  computed: {
    ...mapGetters([
      'getCurrentTab'
    ]),
    currentPage () {
      return this.$router.history.current.name
    }
  },
  methods: {
    ...mapActions([
      'changeCurrentTab'
    ]),
    changeTab (newTab) {
      this.$store.dispatch('changeCurrentTab', newTab)
      if(newTab == 'Overlay' || newTab == 'GalleryOverlay') {
        EventBus.$emit('overlay-changed')
        EventBus.$emit('click-overlay')
      }
    }
  },
  created(){
    this.changeTab('GalleryDesign')
  }
}
</script>

<style lang="css" scoped>
  .edit-event-side-header {
    height: 50px;
    margin: 1em 0;
    color: white;
    width: 100%;
    background: var(--main-theme);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.08);
  }

  .edit-event-text {
    font-size: 30px;
    margin: 1em 0em;
  }

  .tab-box {
    border-bottom: 4px solid var(--main-theme);
    width: 30%;
  }

  .tab-box:hover {
    border-bottom: 4px solid #ccc;
    cursor: pointer;
  }

  .tab-text {
    font-size: 16px;
  }

  .activeTab {
    border-bottom: 4px solid #fff;
  }

  .tabs-row {
    padding: 0 1em;
  }

  @media only screen and (max-width: 768px) {
    .edit-event-text {
      margin-left: 0;
    }
  }
</style>
