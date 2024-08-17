<template lang="html">
  <div class="">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <settings-top-bar/>
    <b-container fluid class="mt-5">
      <b-row class="justify-content-center mb-5">
        <b-col cols="12" lg="8">
          <account-balance/>
        </b-col>
      </b-row>
      <b-row class="justify-content-center mb-5">
        <b-col cols="12" lg="8">
          <top-up/>
        </b-col>
      </b-row>
      <b-row class="justify-content-center mb-5">
        <b-col cols="12" lg="8">
          <billing-invoices/>
        </b-col>
      </b-row>
      <b-row class="justify-content-center mb-5">
        <b-col cols="12" lg="8">
          <balance-notes/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EventBus from "../event-bus";
import SettingsTopBar from "../components/SettingsTopBar";
import AccountBalance from "../components/Balance/AccountBalance";
import TopUp from "../components/Balance/TopUp";
import BillingInvoices from "../components/Balance/Invoices";
import BalanceNotes from "../components/Balance/Notes";

export default {
  name: "balance",
  data() {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true
    };
  },
  created() {
    EventBus.$on("change-side-nav", () => {
      this.show = !this.show;
      this.sideMenuIsOpen = !this.sideMenuIsOpen;
      this.sideMenuIsClosed = !this.sideMenuIsClosed;
    });
  },
  components: {
    SettingsTopBar,
    AccountBalance,
    TopUp,
    BillingInvoices,
    BalanceNotes,
  }
};
</script>

<style lang="css" scoped>
.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
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

@media only screen and (max-width: 768px) {
  .payment-method-side-menu {
    display: none;
  }
}
</style>
