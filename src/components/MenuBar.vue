<template lang="html">
  <div class="menu-bar">
    <b-container fluid>
      <b-row class="mobile-row" align-h="between" align-v="center">
        <b-col cols="3" @click="showHideSideBar">
          <!-- <div class="hamburger-bar"></div>
          <div class="hamburger-bar"></div>
          <div class="hamburger-bar"></div> -->
          <i class="fas fa-bars"></i>
        </b-col>
        <b-col class="text-center" cols="6">
          <img :style="{ cursor: 'pointer'}" @click="goToDashboard()" :src="getMainLogo()" alt="miro-logo" class="miro-logo">
        </b-col>
        <b-col cols="3">
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="desktop-row">
      <b-row class="desktop-row" align-v="center">
        <b-col cols="3" lg="2">
          <img :style="{ cursor: 'pointer'}" @click="goToDashboard()" :src="getMainLogo()" alt="miro-logo" class="miro-logo">
        </b-col>
        <b-col cols="4" lg="6">
          <router-link to="/dashboard"> <img src="../assets/6_square.png" alt="6-squares" class="six-square">Dashboard </router-link>
          <span v-if="showBreadCrumbs">
            /
            <router-link :to="{ name: 'Event', params: { id: $store.getters['Events/getSelectedEvent'].event_id }}" class="event-home-router">
              <span class="event-home-text">{{$store.getters['Events/getSelectedEvent'].setting.title}}</span>
            </router-link>
            <!-- &gt;
            <b-link class="preview-btn" :href="getEventUrl()" target="_blank">Preview</b-link> -->
          </span>
        </b-col>
        <b-col v-if="role === 0 && platformHelper.defaultSetup()" class="text-right">
          <router-link :to="{ name: 'Balance'}">
            <i class="fas fa-wallet account-credits"></i><span class="mx-2 account-credits">{{ formatter.formatNumber(credits) }}</span>
          </router-link>
        </b-col>
        <b-col  class="avatar-dropdown">
          <b-dropdown variant="transparent" v-if="role === 0 && platformHelper.defaultSetup()">
            <template v-slot:button-content>
              <i class="fas fa-user"></i><span class="mx-2 username">{{ username }}</span>
            </template>
            <b-dropdown-item @click="goUpload"><i class="fas fa-plus"></i> Create New Event</b-dropdown-item>
            <b-dropdown-item to="/profile">Account</b-dropdown-item>
            <b-dropdown-item to="/billing">Billing</b-dropdown-item>
            <b-dropdown-item to="/bib">Bib Testing</b-dropdown-item>
            <b-dropdown-item @click="showEmailModal">Technical Support</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="doSignOut">Logout</b-dropdown-item>
          </b-dropdown>
          <b-dropdown variant="transparent" v-else>
            <template v-slot:button-content>
              <i class="fas fa-user-friends"></i><span class="mx-2 username">{{ username }}</span>
            </template>
            <b-dropdown-item to="/profile">Account</b-dropdown-item>
            <b-dropdown-item @click="showEmailModal">Technical Support</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="doSignOut">Logout</b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-container>
    <email-enquiry-modal />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import EventBus from "../event-bus"
import EmailEnquiryModal from "./EditEvent/EmailEnquiryModal"
import platformHelper from "@/utils/platformHelper"
import formatter from "@/utils/formatter"

export default {
  data() {
    return {
      formatter,
      role: null,
      platformHelper,
    }
  },

  components: {
    EmailEnquiryModal,
  },
  computed: {
    ...mapGetters("Auth", ["profile"]), 
    ...mapGetters("Events", ["getSelectedEvent"]),

    onDashboard() {
      return this.$router.history.current.name === "Dashboard"
    },
    username() {
      const {
        first_name: firstName,
        last_name: lastName,
        email,
        role,
      } = this.profile

      return firstName && lastName ? `${firstName} ${lastName}` : email
    },
    credits() {
      let credits = 0
      if (
        this.profile &&
        this.profile.balance &&
        this.profile.balance.credits
      ) {
        credits = this.profile.balance.credits
      }
      return credits || 0
    },
    showBreadCrumbs() {
      let routeName = this.$route.name
      return (
        routeName === "Event" ||
        routeName === "EventSettings" ||
        routeName === "EventSharing" ||
        routeName === "EventPhotos" ||
        routeName === "EventRunners" ||
        routeName === "EventBib" ||
        routeName === "EventDetails" ||
        routeName === "EventGallery" ||
        routeName === "EventVips"
      )
    },
  },

  mounted() {
    this.getRole()
    EventBus.$on("EventUrlRequest", ()=>{
      const payload = this.getEventUrl()
      EventBus.$emit("EventUrlResponse", payload)
    })
  },

  methods: {
    ...mapActions("Auth", ["signOut"]),

    getMainLogo() {
      return platformHelper.getLogo()
    },
    showHideSideBar() {
      EventBus.$emit("change-side-nav")
    },

    goUpload() {
      this.$router.push(`/create`)
      EventBus.$emit("start-create-event")
      this.$store.dispatch("PhotosFilter/changeCurrentFilter", "Uploading")
    },

    doSignOut() {
      this.signOut().then(() => {
        this.$router.push({ name: "SignIn" })
      })
    },

    goToDashboard() {
      this.$router.push(`/dashboard`)
    },

    getEventUrl() {
      var url = ""
      if (this.showBreadCrumbs) {
        if (this.getSelectedEvent && this.getSelectedEvent.url)
          url = `${this.getSelectedEvent.url.replace("https://", "//")}`
        if (this.getSelectedEvent.state == 0) {
          url += `#/?pin=${this.getSelectedEvent.setting.pin}`
        }
      }
      return url
    },
    showEmailModal() {
      EventBus.$emit("show-enquiry-modal")
    },
    getRole() {
      this.$nextTick(() => {
        this.role = this.profile.role
      })
    },
  },
}
</script>

<style lang="css" scoped>
.miro-logo {
  height: 100%;
  width: 9em;
}

.fa-bars {
  font-size: 3em;
  padding-top: 0.5em;
}

.six-square {
  padding-right: 20px;
  padding-bottom: 3px;
}

a {
  color: #fff;
}

.menu-bar {
  height: 6.5em;
  background: var(--main-theme);
  color: #fff;
  font-weight: bold;
}

.container {
  height: 100%;
}

.mobile-row {
  margin: 0;
  height: 100%;
}

.hamburger-bar {
  width: 35px;
  height: 5px;
  background-color: #fff;
  margin: 6px 0;
}

.desktop-row {
  color: #fff;
  height: 100%;
}

@media only screen and (min-width: 768px) {
  .mobile-row {
    display: none;
  }

  .avatar-dropdown {
    text-align: right;
  }
}

@media only screen and (max-width: 768px) {
  .desktop-row {
    display: none;
  }

  .miro-logo {
    height: 100%;
    margin-top: 1em;
  }
}
</style>
