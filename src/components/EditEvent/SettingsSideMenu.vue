<template lang="html">
  <div class="edit-event-side-menu">
    <b-container fluid>
      <b-row style="margin-bottom:0.5em;" align-h="center">
        <side-header/>
      </b-row>

      <b-row align-h="center">
        <side-settings
          v-show="getCurrentTab === 'Settings'"
          />
        <side-design
          v-show="getCurrentTab === 'Design'"
          />
        <side-advanced
          v-show="getCurrentTab === 'Advanced'"
          />
      </b-row>

        <b-row class="undo-save-buttons" align-h="center">
          <b-col class="col-undo-save">
            <button name="button" class="btn btn-primary" :class="{disabled: !hasChanges}" :disabled="!hasChanges" @click="undoChanges">UNDO</button>
          </b-col>

          <b-col class="col-undo-save">
            <button name="button" class="btn btn-primary" @click="saveEdit" :class="{disabled: !hasChanges}" :disabled="!hasChanges">SAVE</button>
          </b-col>
        </b-row>
    </b-container>

  </div>
</template>

<script>
import { mapGetters } from "vuex"
import EventBus from "../../event-bus.js"

import SideHeader from "./SideHeader"
import SideSettings from "./SideSettings"
import SideDesign from "./SideDesign"
import SideAdvanced from "./SideAdvanced"

export default {
  name: "edit-event-side",
  computed: {
    ...mapGetters([
      "getCurrentTab",
      "EditEvent/getOriginalForm",
      "EditEvent/getEventSettingsRequestObject",
    ]),
    hasChanges() {
      return this.$store.getters["EditEvent/getIsDifferent"]
    },
  },
  components: {
    SideHeader,
    SideSettings,
    SideDesign,
    SideAdvanced,
  },
  methods: {
    undoChanges() {
      EventBus.$emit("reset-form")
      this.$store.dispatch("EditEvent/changeIsDifferentValues", false)
    },
    saveEdit() {
      let requestObjectSubdomain =
        this.$store.getters["EditEvent/getEventSettingsRequestObject"].subdomain
      let requestObjectDomain =
        this.$store.getters["EditEvent/getEventSettingsRequestObject"].domain
      if (
        requestObjectSubdomain &&
        requestObjectSubdomain !==
          this.$store.getters["EditEvent/getOriginalForm"].subdomain
      ) {
        this.$store.dispatch("Events/setEventDomain", {
          subdomain: requestObjectSubdomain,
          domain: process.env.DOMAIN
            ? process.env.DOMAIN
            : "myracetag.com/events",
        })
      }
      EventBus.$emit("upload-image-save", "logo")
      EventBus.$emit("upload-image-save", "sponsor")
      EventBus.$emit("upload-image-save", "organiser")
      if (this.$store.getters["EditEvent/getIsNotSubdomainDifferent"]) {
        let settings =
          this.$store.getters["EditEvent/getEventSettingsRequestObject"]
        this.$store.dispatch("Events/setEventSetting", { settings })
      }
    },
  },
}
</script>

<style lang="css" scoped>
.undo-save-buttons {
  background: var(--main-theme);
  border: 1px solid rgba(151, 151, 151, 0.24);
}

.undo-save {
  background: var(--main-theme);
  box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  font-size: 15px;
  color: #ffffff;
  width: 100%;
  padding: 1em;
  border: none;
  font-weight: 500;
}

.undo-save:hover {
  background: #9fa9ba;
  cursor: pointer;
}

.purple {
  background: var(--main-theme);
}

.undo-save.disabled {
  opacity: 0.5;
  background: var(--main-theme);
}

.col-undo-save {
  padding: 1em;
}

@media only screen and (max-width: 768px) {
  .undo-save-buttons {
    max-width: 540px;
  }
}
</style>
