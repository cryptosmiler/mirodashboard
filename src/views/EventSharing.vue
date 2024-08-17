<template lang="html">
  <div class="">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <edits-top-bar/>
    <b-container fluid v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}" class="account-container">
      <b-row no-gutters>
        <b-col md="7" lg="5" xl="4" class="event-side-menu">
          <sharing-side-menu/>
        </b-col>
        <b-col class="edit-event-preview">
          <image-preview/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EventBus from '../event-bus'
import EditsTopBar from '../components/EditEvent/EditsTopBar'
import SharingSideMenu from '../components/EditEvent/SharingSideMenu'
import { mapActions } from 'vuex'

export default {
  name: 'event-sharing',
  data () {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true
    }
  },
  methods: {
    ...mapActions([
      'changeCurrentTab'
    ])
  },
  created () {
    this.$store.dispatch('changeCurrentTab', 'Sharing')

    EventBus.$on('change-side-nav', () => {
      this.show = !this.show
      this.sideMenuIsOpen = !this.sideMenuIsOpen
      this.sideMenuIsClosed = !this.sideMenuIsClosed
    })
  },
  components: {
    EditsTopBar,
    SharingSideMenu
  }
}
</script>

<style lang="css" scoped>
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
  left: 260px;
  opacity: 0.5;
  box-sizing: content-box;
}

.sideMenuClosed {
  transition: all 0.3s linear;
  padding-left: -260px;
}

.event-side-menu {
  min-width: 28em;
}

@media only screen and (max-width: 768px) {
  .event-side-menu {
    min-width: 16em;
  }

  .edit-event-preview {
    display: none;
  }
}

@media only screen and (min-width: 768px) {
  .event-side-menu {
    min-width: 26em;
    max-width: 28em;
  }
}
</style>
