<template lang="html">
  <b-container class="side-nav-menu">
    <b-row>
      <b-col class="d-flex align-items-center px-3 py-2">
        <h5 v-if="profile.role === 0" class="d-flex align-items-center"><i class="fas fa-user"></i>&nbsp;<span class="username">{{ getUser }}</span></h5>
        <h5 v-else class="d-flex align-items-center"><i class="fas fa-user"></i>&nbsp;<span class="username">{{ getUser }}</span></h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center px-3 py-2">
        <h4 @click="goUpload"><i class="fas fa-plus"></i>&nbsp;Create New Event</h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center px-3 py-2">
        <router-link to="/profile"><h4>Account</h4></router-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center px-3 py-2">
        <router-link to="/billing"><h4>Billing</h4></router-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center px-3 py-2">
        <router-link to="/bib"><h4>Bib Testing</h4></router-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col @click="logout" class="d-flex align-items-center px-3 py-2">
        <h4>Logout</h4>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EventBus from "../event-bus";

export default {
  name: 'SideBar',
  methods: {
    ...mapActions('Auth', ['signOut']),
    logout () {
      this.signOut()
    },
    goUpload() {
      this.$router.push(`/create`);
      EventBus.$emit("start-create-event");
      this.$store.dispatch("PhotosFilter/changeCurrentFilter", "Uploading");
    },
  },
  computed: {
    ...mapGetters('Auth', ['profile']),
    getUser () {
      return this.profile.first_name || this.profile.email
    }
  }
}
</script>

<style lang="css" scoped>
  .side-nav-menu {
    display: inline-block;
    padding: 1em;
    height: 90%;
    position: absolute;
    z-index: 2;
    background: #fff;
    border: 1px solid #dedede;
    line-height: 3em;
    top: 6.5em;

    
  }

  .side-nav-menu a {
    color: inherit;
  }

  .account-circle {
    /* color: #fff; */
  }
</style>
