<template lang="html">
  <b-container class="">
    <p class="profile-settings">{{ $t("balance.balance-column-title") }}</p>
    <div class="account-balance-container">
      <b-container class="account-balance" fluid>
        <b-row>
          <account-balance-item
            faIcon="fa-running"
            :title="$t('balance.runner-tagged')"
            :counter="runnertagged"
          />
          <account-balance-item
            faIcon="fa-wallet"
            :title="$t('balance.credits')"
            :counter="credits"
          />
          <account-balance-item
            faIcon="fa-globe"
            :title="$t('balance.public-sites')"
            :counter="sites"
          />
        </b-row>
      </b-container>
    </div>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import EventBus from "../../event-bus";
import AccountBalanceItem from "./BalanceItem";

/* eslint-disable */
export default {
  name: "account-balance",
  data() {
    return {
      items: []
    };
  },
  computed: {
    ...mapGetters("Auth", ["profile"]),
    ...mapGetters("Events", ["getSelectedEvent"]),
    runnertagged() {
      const { runner_tagged } = this.profile.balance;

      return runner_tagged || 0
    },
    credits() {
      const { credits } = this.profile.balance;

      return credits || 0
    },
    sites() {
      const { sites } = this.profile.balance;

      return sites || 0
    },
  },
  methods: {},
  mounted() {},

  components: {
    AccountBalanceItem
  }
};
</script>

<style lang="css" scoped>


.account-balance-container {
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
}

.account-balance-title {
  font-size: 20px;
  padding: 1.5em 2em;
  color: #a0a9b8;
  margin: 0;
  font-weight: 500;
  border-bottom: 1px solid #ccd0d8;
}

.account-balance {
  padding: 2em 1em 2em 1em;
  /* margin-bottom: 2em; */
  color: #a0a9b8 !important;
}

.invoice-row {
  padding-bottom: 0.25em;
}

.see-more {
  border: none;
  background: #afb7c3;
  color: #fff;
  padding: 1em 2em;
  float: right;
  border-radius: 5px;
  font-weight: 400;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
  position: relative;
  right: 1em;
}

.blue-text {
  color: #6ec2e3;
}

.orange-icon {
  color: #fa8a5c;
  position: relative;
  top: 5px;
}

.top-5 {
  position: relative;
  top: -5px;
}

@media only screen and (max-width: 768px) {
  .download-text {
    display: none;
  }
}
</style>
