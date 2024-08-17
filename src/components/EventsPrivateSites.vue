<template lang="html">
  <div class="events-private-sites">
    <p class="active-sites">PRIVATE SITES</p>
    <div class="event-sites">
      <div class="event-site"
        v-for="(event, index) in eventsPresent"
        :key="index"
        >
        <event-site :private="true" :event="event"/>
      </div>
    </div>
  </div>
</template>

<script>
import EventSite from "./EventSite";
import { mapGetters } from "vuex";
import { TIME_FILTER_FUNCS } from "@/constants";

export default {
  name: "events-private-sites",
  props: {
    timeFilter: String
  },
  components: {
    EventSite
  },
  computed: {
    ...mapGetters("Events", ["getPrivateEvents"]),
    eventsPresent() {
      return this.getPrivateEvents.filter(TIME_FILTER_FUNCS[this.timeFilter])
    },
  }
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
  grid-gap: 20px;
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
    grid-template-columns: repeat(auto-fit, minmax(24rem, 100%));
  }
}
</style>
