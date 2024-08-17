<template lang="html">
  <b-container fluid class="main-card-description">
    <b-row>
      <b-col>
        <p class="event-name">{{ getSelectedEvent.setting.title }}</p>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-link :href="getSelectedEvent.url" target="_blank" class="event-link">
          {{ getSelectedEvent.url}}
        </b-link>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <!-- <p class="event-description" v-html="getSelectedEvent.setting.description"></p> -->
        <p class="mb-1">{{ eventDate() }}</p> 
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <p class="mb-1">{{ eventType() }}</p>
      </b-col>
    </b-row>

    <b-row no-gutters v-show="profile.role === 0">
      <b-col cols="6" lg="3">
        <b-link :href="getSelectedEvent.url" target="_blank" class="event-link">
          <b-button class="dashboard-main-card-buttons edit-button">
            <span class="main-card-button-text"><i class="fas fa-eye"></i>&nbsp;View Site</span>
          </b-button>
        </b-link>
      </b-col>
      <b-col cols="6" lg="3">
        <b-button v-if="platformHelper.defaultSetup()" class="dashboard-main-card-buttons remove-button" @click="removeEvent">
          <span class="main-card-button-text">
            <i class="fas fa-trash"></i>
             Delete Event
          </span>
        </b-button>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "../../event-bus";
import platformHelper from '@/utils/platformHelper'

export default {
  name: "dashboard-manage-event-main-card-description",
  data() {
    return {
      platformHelper
    };
  },
  methods: {
    goToEdit() {
      this.$router.push({
        name: "EventDetails",
        params: { id: this.getSelectedEvent.event_id }
      });
    },
    removeEvent() {
      EventBus.$emit("delete-event-modal-state", {
        selectedEvent: this.getSelectedEvent,
        status: "show"
      });
    },
    eventDate() {
      let date = new Date(this.getSelectedEvent.event_date);
      return `${date.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)} ${date.getFullYear()}`;
    },
    eventType() {
      // 1 = face , 2 = bib, 3 = both
      // console.log(`event_type - ${this.getSelectedEvent.event_type}`)
      switch (this.getSelectedEvent.event_type) {
        case 1:
          return `[ FACE ]`;
          break;
        case 2:
          return `[ BIB ]`;
          break;
        case 3:
          return `[ FACE + BIB ]`;
          break;
        default:
          return ``;
      }
    }
  },
  computed: {
    ...mapGetters("Events", ["getSelectedEvent"]),
    ...mapGetters("Auth", ["profile"]),
  }
};
</script>

<style lang="css" scoped>
.event-name {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 0;
}

.event-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0;
  font-size: 12px;
}

.main-card-description {
  color: #afb7c3;
  font-weight: normal;
}

.dashboard-main-card-buttons {
  border: none;
  box-shadow: 0px 3px 20px #ccc;
  border-radius: 0;
  font-size: 12px;
  padding: 0.5em 1em;
  margin-top: 20px;
}

.event-link {
  color: var(--main-theme);
}

.edit-button {
  background: #fff;
  color: #12a6de;
  width: 90%;
}

.edit-button:hover {
  cursor: pointer;
}

.remove-button {
  background: #ff4136;
  color: #fff;
  width: 90%;
}

.main-card-button-text {
  font-size: 12px;
  position: relative;
  top: 0px;
  font-weight: 500;
}

.image-count {
  width: 100%;
  position: relative;
  top: 21px;
}

.image-count i {
  height: 18px;
  position: relative;
  top: -1px;
}

@media only screen and (min-width: 768px) {
  .image-count-mobile {
    display: none;
  }
}
</style>
