<template lang="html"> 
  <div class="edit-event-side-menu">
    <b-container fluid>
      <b-row style="margin-bottom:0.5em;" align-h="center">
        <side-header/>
      </b-row>

      <b-row align-h="center">
        <side-detail
          v-show="getCurrentTab === 'Details'"
          />
      </b-row>

        <b-row class="undo-save-buttons" align-h="center">
          <b-col class="col-undo-save">
            <button name="button" class="undo-save purple" :class="{disabled: !hasChanges}" :disabled="!hasChanges" @click="undoChanges">
              UNDO
            </button>
          </b-col>

          <b-col class="col-undo-save">
            <button name="button" class="undo-save purple" @click="saveEdit" :class="{disabled: !hasChanges}" :disabled="!hasChanges">SAVE</button>
          </b-col>
        </b-row>
    </b-container>

  </div>
</template>

<script>
import { mapGetters } from "vuex"
import EventBus from "../../event-bus.js"

import SideHeader from "./SideHeader"
import SideDetail from "./SideDetail"

export default {
  name: "details-side-menu",
  computed: {
    ...mapGetters([
      "getCurrentTab",
      "EditEvent/getOriginalForm",
      "EditEvent/getEventSettingsRequestObject",
    ]),
    ...mapGetters({ hasChanges : 'EditEvent/getIsDifferent'}),
  },
  components: {
    SideHeader,
    SideDetail,
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
      this.$store.dispatch("EventCheckpoint/saveCheckpoint")
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
