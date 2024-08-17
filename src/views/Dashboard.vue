<template lang="html">
  <div class="dashboard-view">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <edits-top-bar/>
    <b-container fluid class=""  v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}">
      <b-row>
        <b-col cols="12" sm="12">
          
          <manage-event/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EventBus from '../event-bus'
import ManageEvent from '../components/Dashboard/Event'
import EditsTopBar from '../components/EditEvent/EditsTopBar.vue'

export default {
  name: '',
  data () {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true
    }
  },
  created () {
    EventBus.$emit('change-loader-state', true)

    EventBus.$on('change-side-nav', () => {
      this.show = !this.show
      this.sideMenuIsOpen = !this.sideMenuIsOpen
      this.sideMenuIsClosed = !this.sideMenuIsClosed
    })
    this.$store.dispatch('Events/getEventContentSummary', {
      eventId: this.$route.params.id
    })
    this.$store.dispatch('Events/getEventStats', this.$route.params.id)
  },
  components: {
    ManageEvent,
    EditsTopBar
  }
}
</script>

<style lang="css" scoped>
  .dashboard-view {
    height: 100%;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
    background: #f1f5f8;
  }

  .slide-enter-active {
    transition: all .3s ease;
  }

  .slide-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-enter {
    transform: translateX(-220px);
  }

  .slide-leave-to {
    transform: translateX(-220px);
  }

  .sideMenuOpen {
    transition: all 0.3s ease;
    padding-left: 260px;
    opacity: 0.5;
    box-sizing: content-box;
  }

  .sideMenuClosed {
    transition: all 0.3s linear;
    padding-left: -260px;
  }

  @media only screen and (max-width: 768px) {
    .back-arrow {
      display: none;
    }
  }
</style>
