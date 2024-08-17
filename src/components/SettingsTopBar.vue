<template lang="html">
  <b-container fluid class="settings-top-bar text-center" v-show="profile.role !== 1">
    <b-row align-h="center" align-v="center" style="height: 100%;" class="d-flex flex-row flex-nowrap justify-content-center">
      <button type="button" name="button" class="top-bar-buttons" :class="{ 'activePage': isActive('Profile') }"
        @click="goTo('profile')">
        <font-awesome-icon class="px-1" :icon="['fad', 'gear']" />
        <span class="settings-label pr-1 d-none d-md-inline-block" :class="{ 'd-inline-block': isActive('Profile') }">{{
          $t('settings.top-bar.profile') }}</span>
      </button>
      <button v-if="platformHelper.defaultSetup()" type="button" name="button" class="top-bar-buttons"
        :class="{ 'activePage': isActive('Billing') }" @click="goTo('billing')">
        <font-awesome-icon class="px-1" :icon="['fad', 'credit-card']" />
        <span class="settings-label pr-1 d-none d-md-inline-block" :class="{ 'd-inline-block': isActive('Billing') }">{{
          $t('settings.top-bar.billing') }}</span>
      </button>
      <button v-if="platformHelper.defaultSetup()" type="button" name="button" class="top-bar-buttons"
        :class="{ 'activePage': isActive('Balance') }" @click="goTo('balance')">
        <font-awesome-icon class="px-1" :icon="['fad', 'file-invoice-dollar']" />
        <span class="settings-label pr-1 d-none d-md-inline-block" :class="{ 'd-inline-block': isActive('Balance') }">{{
          $t('settings.top-bar.balance') }}</span>
      </button>
      <button type="button" name="button" class="top-bar-buttons" :class="{ 'activePage': isActive('SubAccount') }"
        @click="goTo('subaccount')">
        <font-awesome-icon class="px-1" :icon="['fad', 'users']" />
        <span class="settings-label pr-1 d-none d-md-inline-block"
          :class="{ 'd-inline-block': isActive('SubAccount') }">{{ $t('settings.top-bar.subaccount') }}</span>
      </button>
    </b-row>
  </b-container>
</template>

<script>
import platformHelper from '@/utils/platformHelper'
import { mapGetters } from "vuex"

export default {
  name: 'settings-top-bar',
  data() {
    return {
      platformHelper,
    }
  },
  mounted() {
    console.log("mounted settingtopbar")
  },
  computed: {
    ...mapGetters("Auth", ["profile"]),
    getCurrentPage() {
      return this.$router.history.current.name
    },
  },
  methods: {
    isActive(tab) {
      return this.$router.history.current.name === tab
    },
    goTo(view) {
      this.$router.push(view)
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes slideIn {
  0% {
    transform: translateY(1em);
  }

  100% {
    transform: translateY(0);
  }
}

.settings-top-bar {
  height: 4.5em;
  background: #fff;

  .row {
    gap: 1em;
  }
}

.top-bar-buttons {
  background: none;
  border: none;
  color: #ccd0d8;
  font-weight: bold;
  border-bottom: 5px solid #fff;
  height: 4.5em;

  span {
    transition: all 0.6s ease-out;
    animation: slideIn 0.6s forwards;
  }
}

.top-bar-buttons:hover {
  border-bottom: 5px solid #a1a8b8;
  cursor: pointer;

  span {
    display: inline-block !important;
    left: 0;
    transition: 500ms;
  }
}

.activePage {
  border-bottom: 5px solid #5c358f !important;
  color: #a1a8b8;
}
</style>
