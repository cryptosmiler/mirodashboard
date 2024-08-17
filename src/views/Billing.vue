<template lang="html">
  <div class="">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <settings-top-bar/>
    <b-container
      fluid
      v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}"
      class="payment-container">
      <b-row class="main-account-view justify-content-center">
        <!-- <b-col cols="2" class="payment-method-side-menu">
        </b-col> -->
        <b-col cols="12" lg="8">
          <billing-settings/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EventBus from '../event-bus'
import BillingSettings from '../components/Billing/Settings'
import SettingsTopBar from '../components/SettingsTopBar'

export default {
  name: 'billing',
  data () {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true
    }
  },
  created () {
    EventBus.$on('change-side-nav', () => {
      this.show = !this.show
      this.sideMenuIsOpen = !this.sideMenuIsOpen
      this.sideMenuIsClosed = !this.sideMenuIsClosed
    })
  },
  components: {
    BillingSettings,
    SettingsTopBar
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

  .payment-container {
    margin-top: 3em;
  }

  @media only screen and (max-width: 768px) {
    .payment-method-side-menu {
      display: none;
    }
  }
</style>
