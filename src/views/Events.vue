<template lang="html">
  <div class="">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <edits-top-bar />
    <settings-top-bar />
    <b-container fluid="lg" class="events" v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}">
      <b-row class="events-top-bar" align-h="between">
        <b-col class="event-sites">
          Event Sites
        </b-col>
        <b-col cols="auto" >
          <b-button v-if="profile.role === 0" variant="primary" @click="goCreate()">
            <i class="fas fa-plus"></i><span class="mx-2">CREATE EVENT</span>
          </b-button>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col cols="12" order="1" class="d-flex flex-row align-items-start filter-bar">
          <div class="dropdown" v-if="profile.role === 0">
            <i class="fas fa-filter"></i>
            <button class="btn btn-secondary dropdown-toggle dropdown-style"
              type="button" id="all-sites-dropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              {{$t(`event.dashboard.${getFilters.eventFilter}`)}} Sites 
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
              <button
                class="dropdown-item"
                type="button"
                v-for="(eventFilter, index) in EVENT_FILTERS"
                :key="index"
                @click="selectEvent(eventFilter)"
                >
                {{ $t(`event.dashboard.${eventFilter}`)}} ({{ getEvents.filter(EVENT_FILTER_FUNCS[`${eventFilter}`]).length }})
              </button>
            </div>
          </div>
          <div class="dropdown">
            <i class="fas fa-calendar"></i>
            <button class="btn btn-secondary dropdown-toggle dropdown-style"
              type="button" id="date-filter-dropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              {{ $t(`event.dashboard.${getFilters.timeFilter}`) }} Events
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
              <button
                class="dropdown-item"
                type="button"
                v-for="(tFilter, index) in TIME_FILTERS"
                :key="index"
                @click="filterByTime(tFilter)"
                >
                {{ $t(`event.dashboard.${tFilter}`) }} ({{ getEvents.filter(EVENT_FILTER_FUNCS[`${getFilters.eventFilter}`]).filter(TIME_FILTER_FUNCS[`${tFilter}`]).length }}) 
              </button>
            </div>
          </div>
        </b-col>      
      </b-row>

      <b-row class="mb-4" v-show="this.publicEventsPresent && (getFilters.eventFilter === 'E_ALL' || getFilters.eventFilter === 'E_PUBLIC') ">
        <b-col cols="12">
          <events-public-sites :time-filter="getFilters.timeFilter"/>
        </b-col>
      </b-row>

      <b-row class="mb-4" v-show="this.privateEventsPresent && (getFilters.eventFilter === 'E_ALL' || getFilters.eventFilter === 'E_PRIVATE')" v-if="profile.role === 0">
        <b-col cols="12">
          <events-private-sites :time-filter="getFilters.timeFilter"/>
        </b-col>
      </b-row>

      <b-row v-show="!this.publicEventsPresent && !this.privateEventsPresent">
        <b-col v-if="role === 0" cols="12">
          <events-empty-sites/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EventsPublicSites from "../components/EventsPublicSites"
import EventsPrivateSites from "../components/EventsPrivateSites"
import EventsEmptySites from "../components/EventsEmptySites"
import MiroStyleModal from "../components/MiroStyleModal"
import EventBus from "../event-bus"
import { mapGetters } from "vuex"
import { EVENT_FILTERS, TIME_FILTERS, EVENT_FILTER_FUNCS, TIME_FILTER_FUNCS } from '@/constants'
import EditsTopBar from "../components/EditEvent/EditsTopBar.vue"
import SettingsTopBar from "../components/SettingsTopBar.vue"

export default {
  name: "Events",
  data() {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true,
      role: null,
      EVENT_FILTERS,
      TIME_FILTERS,
      EVENT_FILTER_FUNCS,
      TIME_FILTER_FUNCS
    }
  },
  components: {
    EventsPublicSites,
    EventsPrivateSites,
    EventsEmptySites,
    MiroStyleModal,
    "edits-top-bar": EditsTopBar,
    SettingsTopBar
  },
  methods: {
    goCreate() {
      EventBus.$emit("start-create-event")
      this.$router.push("create")
    },
    selectEvent(event) {
      this.$store.dispatch("LocalSettings/setFilters", { eventFilter: event })
    },
    filterByTime(tFilter) {
      this.$store.dispatch("LocalSettings/setFilters", { timeFilter: tFilter })
    },
    getRole() {
      this.$nextTick(() => {
        this.role = this.profile.role
        console.log("role=======", this.profile.role)
      })
    },
  },
  computed: {
    ...mapGetters("Events", ["getEvents","getPublicEvents", "getPrivateEvents"]),
    ...mapGetters("Auth", ["profile"]),
    ...mapGetters("LocalSettings", ["getFilters"]),

    publicEventsPresent() {
      return this.getPublicEvents.length > 0
    },

    privateEventsPresent() {
      return this.getPrivateEvents.length > 0
    },
  },
  mounted() {
    this.getRole()
  },
  created() {
    EventBus.$on("change-side-nav", () => {
      this.show = !this.show
      this.sideMenuIsOpen = !this.sideMenuIsOpen
      this.sideMenuIsClosed = !this.sideMenuIsClosed
    })
    this.$store.dispatch("Events/loadEvents")
  },
}
</script>

<style lang="css" scoped>
.events {
  padding-top: 2em;
  background: #f4f8f9;

}

.event-sites {
  opacity: 0.5;
  font-size: 24px;
  color: #575c65;
  position: relative;
}
.filter-bar {
  gap:2em;
  font-size: 16px;
  color: #9fa9ba;
  background: none;
}

.noleftPadding {
  padding-left: 0 !important;
}

.dropdown-style {
  color: #9fa9ba;
  background: none;
  background-color: none;
  position: relative;
  border: none;
  font-weight: normal;
  padding: 0;
  box-shadow: none;
  background: none;
}
.dropdown-style:hover {
  color: #6c757d;
  border-color: rgba(153, 153, 153, 0.2);
}


.material-icons.keyboard_arrow_down {
  position: relative;
  top: 6px;
}

@media only screen and (max-width: 768px) {
  .create-event-button {
    font-size: 14px;
    position: relative;
    top: -63px;
  }
}

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
  opacity: 0.5;
  box-sizing: content-box;
}

.sideMenuClosed {
  transition: all 0.3s linear;
  padding-left: -260px;
}
</style>
