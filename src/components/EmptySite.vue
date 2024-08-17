<template lang="html">
  <b-container class="empty-site" fluid>
    <div class="empty-site-header"  v-bind:style="{background: '#F4F8F9'}">
      <b-row class="" no-gutters>
        <b-col cols="11" class="site-copy">
          <h6>New Event</h6>
          <p class="site-copy">
            {{ newEventLink }}
          </p>
        </b-col>
      </b-row>

      <b-row align-h="end" no-gutters class="photo-count">
        <b-col cols="5">
          <p>0 photos</p>
        </b-col>
      </b-row>
    </div>

    <div class="empty-site-body">
      <b-row class="site-description">
        <b-col>
          A BLANK CANVAS
        </b-col>
      </b-row>

      <b-row class="description-words-site-preview-box">
        <b-col cols="7" md="7">
          <p>Create your first event</p>

          <p>All it takes is a few minutes to customize &amp; you'll be ready to upload!</p>
        </b-col>

        <b-col cols="5" md="4">
          <empty-site-color-box/>
        </b-col>
      </b-row>

      <b-row align-h="end">
        <b-col cols="6">
          <button v-if="platformHelper.defaultSetup()" class="create-event" @click="goCreate">+ CREATE EVENT</button>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import EmptySiteColorBox from "./EmptySiteColorBox"
import EventBus from "../event-bus"
import platformHelper from "@/utils/platformHelper"

export default {
  name: "empty-site",
  data() {
    return {
      platformHelper,
    }
  },
  components: {
    EmptySiteColorBox,
  },
  methods: {
    goCreate() {
      EventBus.$emit("start-create-event")
      this.$router.push("create")
    },
  },
  computed: {
    newEventLink() {
      return `https://${process.env.DOMAIN}`
    }
  },
}
</script>

<style lang="css" scoped>
.empty-site {
  box-shadow: 1px 1px 10px #888888;
  padding-right: 0;
  padding-left: 0;
  color: #9fa9ba;
}

.empty-site-header {
  font-weight: bold;
  padding: 1.5em 1em 0 1em;
  line-height: 0.5em;
}

.material-icons.content-copy {
  font-size: 12px;
  position: relative;
  top: 2px;
}

.empty-site-body {
  padding: 1em;
  font-size: 12px;
  background: #fff;
  padding-bottom: 2em;
}

.site-description {
  margin-bottom: 1em;
}

.site-copy {
  font-size: 12px;
}

.photo-count {
  text-align: right;
  font-size: 12px;
}

.create-event {
  background: var(--main-theme);
  color: #fff;
  border: none;
  box-shadow: 0px 3px 20px #ccc;
  border-radius: 0;
  font-size: 12px;
  padding: 0.5em 1em;
  margin-top: 20px;
}
</style>
