<template lang="html">
  <div class="">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <settings-top-bar/>
    <b-container fluid v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}" class="account-container mb-4">
      <b-row class="main-account-view">
        <b-col cols="2" class="account-side">
          <!-- <account-side-menu/> -->
        </b-col>
        <b-col cols="12" lg="8">
          <p class="profile-settings">{{ $t("settings.detail-column-title") }}</p>
          <account-information/> 
          <tenant-information  v-show="isAdmin"/>
          <p class="profile-settings">{{ $t("settings.password-column-title") }}</p>
          <account-password/>
          <account-mfa/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EventBus from '../event-bus'
import AccountSideMenu from '../components/AccountSideMenu'
import AccountInformation from '../components/Account/Information'
import TenantInformation from '../components/Account/TenantInformation'
import AccountPassword from '../components/Account/Password'
import AccountMfa from '../components/Account/MFA.vue'
import SettingsTopBar from '../components/SettingsTopBar'

import { mapGetters } from 'vuex'


export default {
  name: 'profile',
  data () {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true
    }
  },
  computed : {
    ...mapGetters('Auth', ['isAdmin']),
  },
  created () {
    EventBus.$on('change-side-nav', () => {
      this.show = !this.show
      this.sideMenuIsOpen = !this.sideMenuIsOpen
      this.sideMenuIsClosed = !this.sideMenuIsClosed
    })
  },
  components: {
    AccountSideMenu,
    AccountInformation,
    TenantInformation,
    AccountPassword,
    SettingsTopBar,
    AccountMfa,
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
