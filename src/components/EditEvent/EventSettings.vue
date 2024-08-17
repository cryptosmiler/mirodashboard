<template lang="html">
  <div class="edit-event-side-menu">
    <div class="row">
      <side-detail class="col-md-6" />
      <side-gallery-settings class="col-md-6" /> 
    </div>
    <div class="fixed-row d-flex justify-content-end flex-nowrap" :class="{ visible : hasChanges }">
      <div class="col-undo-save ">
        <button name="button" class="undo-save purple" :class="{disabled: !hasChanges}" :disabled="!hasChanges" @click="undoChanges">UNDO</button>
      </div>
      <div class="col-undo-save">
        <button name="button" class="undo-save purple" @click="saveEdit" :class="{disabled: !hasChanges}" :disabled="!hasChanges">SAVE</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import EventBus from "../../event-bus.js"

import SideHeader from "./SideHeader"
import SideDetail from "./SideDetail"
import SideGallerySettings from "./SideGallerySettings"

export default {
  name: "event-settings-component",
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
    SideGallerySettings,
  },
  methods: {
    undoChanges() {
      EventBus.$emit("reset-form")
      this.$store.dispatch("EditEvent/changeIsDifferentValues", false)
    },
    saveEdit() { 
      console.log("Save Event Settings")
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

      EventBus.$emit("upload-image-save", "stickers") 
    },
  },
}
</script>

<style lang="scss" scoped>
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

div:has(> div.fixed-row) {
  /* parent with fixed row needs space */
  margin-bottom: 5em;
}
.fixed-row {
  position: fixed;
  height: 5em;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: white;
  box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.24);
  opacity:0;
  transition:visibility 0.5s linear,opacity 0.5s linear;
  &.visible {
    opacity: 1;
  }
}

@media only screen and (max-width: 768px) {
  .undo-save-buttons {
    max-width: 540px;
  }
}

</style>
