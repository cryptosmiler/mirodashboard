<template lang="html">
  <b-container class="main-card">
    <b-row no-gutters>
      <b-col cols="2" class="manage-event-color-box text-center">
        <active-site-color-box
          :colors="getSelectedEvent.setting.colors"
          v-if="!isEventLogoSet()"
        />
        <b-img fluid v-if="isEventLogoSet()" :src="getLogo()"></b-img>
      </b-col>
      <b-col cols="12" md="7">
        <event-main-card-description/>
      </b-col>

      <b-col cols="12" md="3" class="event-counts d-flex justify-content-around align-items-end justify-content-md-start align-items-end flex-row flex-md-column flex-nowrap">
          <router-link tag="div" :to="{ name: 'EventPhotos', params: { id: this.getSelectedEvent.event_id }}" class="image-count d-flex flex-row-reverse flex-md-row align-items-center">
            <div>{{ imageCount }}</div>
            <i class="fas fa-images fa-fw"></i>
          </router-link>
          <router-link tag="div" :to="{ name: 'EventRunners', params: { id: this.getSelectedEvent.event_id }}" class="image-count d-flex flex-row-reverse flex-md-row align-items-center">
            <div>{{ RunnersCount() }}</div>
            <i class="fas fa-running fa-fw"></i>
          </router-link>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import EventMainCardDescription from "./EventMainCardDescription";
import ActiveSiteColorBox from "../ActiveSiteColorBox";
import { mapGetters } from "vuex";
import _ from 'lodash'
import { getEventContentSummary } from "../../api";

export default {
  name: "dashboard-manage-event-main-card",
  data() {
    return {
      imagesCount: 0
    };
  },
  components: {
    EventMainCardDescription,
    ActiveSiteColorBox
  },
  computed: {
    ...mapGetters("Events", ["getEvents", "getSelectedEvent", "getEventContentSummary"]),
    runnersCount : function() {
      const currentEvent = this.getEvents.find(event => event.event_id === this.getSelectedEvent.event_id)
      return currentEvent ? currentEvent.runners : 0;
    },
    imageCount : function() {
      return this.imagesCount
    }
  },
  watch: {
    getEventContentSummary(newValue, oldValue) {
      this.imagesCount = newValue.objects || 0;
    }
  },
  methods: {
    RunnersCount() {
      const currentEvent = this.getEvents.find(event => event.event_id === this.getSelectedEvent.event_id)
      return currentEvent ? currentEvent.runners : 0;
    },
    isEventLogoSet() {
      return _.has(this.getSelectedEvent, 'setting.logo.url') && this.getSelectedEvent.setting.logo.url.length && !_.includes(this.getSelectedEvent.setting.logo.url, 'default')
    },
    getLogo() {
      if (_.has(this.getSelectedEvent, 'setting.logo.url') && this.getSelectedEvent.setting.logo.url.length && !_.includes(this.getSelectedEvent.setting.logo.url, 'default')) {
        return `${process.env.S3_IMAGE_URL}/${this.getSelectedEvent.setting.logo.url}`
      }
    }
  },
};
</script>

<style lang="css" scoped>
.main-card {
  background: #fff;
  box-shadow: 0 5px 25px -10px rgba(0, 0, 0, 0.24);
  padding: 1em 15px;
}

.manage-event-color-box {
  margin: auto 0;
}

.image-count {
  color: #afb7c3;
  font-size: 20px;
  gap: 0.2em;
  &:hover {
    color: var(--main-theme);
  }
}

@media only screen and (max-width: 768px) {
  .manage-event-color-box {
    display: none;
  }

  .event-counts {
    margin-top: 1em;
  }
}
</style>
