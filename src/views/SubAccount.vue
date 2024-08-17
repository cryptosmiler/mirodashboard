<template lang="html">
  <div class="">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <settings-top-bar/>
    <b-container fluid v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}" class="account-container">
      <b-row class="main-account-view">
        <b-col cols="1" class="account-side">
          <!-- <account-side-menu/> -->
        </b-col>
        <b-col md="10">
          <p class="global-settings-header">
            Users
          </p>
          <user-list/>
          <create-sub-account/>
        </b-col>
        <b-col cols="1" class="account-side">

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EventBus from '../event-bus'
// import AccountSideMenu from '../components/AccountSideMenu'
import SettingsTopBar from '../components/SettingsTopBar'
import CreateSubAccount from '../components/UserManagement/CreateUser'
import UserList from '../components/UserManagement/UserList'

export default {
  name: 'sub-account',
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
    // AccountSideMenu,
    SettingsTopBar,
    CreateSubAccount,
    UserList
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

  .account-container {
    margin-top: 3em;
  }

  @media only screen and (max-width: 768px) {
    .account-side-menu {
      display: none;
    }
  }
</style>
