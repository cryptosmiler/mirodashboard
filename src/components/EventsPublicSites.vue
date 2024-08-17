<template lang="html">
  <div class="events-public-sites">
    <p class="active-sites">PUBLIC SITES</p>
    <div class="event-sites">
      <div class="event-site"
        v-for="(event, index) in publicEventsPresent"
        :key="index"
        >
        <event-site :event="event"/>
      </div>
    </div>
  </div>
</template>

<script>
import EventSite from "./EventSite";
import { mapGetters } from "vuex";
import { TIME_FILTER_FUNCS } from "@/constants";

export default {
  name: "events-public-sites",
  props: {
    timeFilter: String
  },
  components: {
    EventSite
  },
  computed: {
    ...mapGetters("Events", ["getPublicEvents"]),
    publicEventsPresent() {
      return this.getPublicEvents.filter(TIME_FILTER_FUNCS[this.timeFilter])
    },
  },
}
</script>

<style lang="css" scoped>

.active-sites {
  font-size: 16px;
  color: #9fa9ba;
}

.event-sites {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, calc(50% - 1em)));
  grid-gap: 1rem;
  justify-content: space-between;
  grid-auto-rows: 1fr;
  align-items: stretch;
}

.event-site {
  display: flex;
  align-items: stretch;
}

@media only screen and (max-width: 52rem) {
  .event-sites {
    grid-template-columns: repeat(auto-fit, minmax(24em, 100%));
  }
}
</style>
