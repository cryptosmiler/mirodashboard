<template lang="html">
  <div class="edit-event-side-menu">
    <b-container fluid>
      <b-row align-h="center">
        <side-gallery-overlay />
      </b-row>

        <b-row class="undo-save-buttons" align-h="center">
          <b-col class="col-undo-save">
            <button name="button" class="undo-save save" :class="{disabled: !hasChanges}" :disabled="!hasChanges" @click="undoChanges">UNDO</button>
          </b-col>

          <b-col class="col-undo-save">
            <button name="button" class="undo-save save" :class="{disabled: !hasChanges}" :disabled="!hasChanges" @click="saveEdit">SAVE</button>
          </b-col>
        </b-row>
    </b-container>

  </div>
</template>

<script>
import SideHeader from "./SideHeader"
import SideGallerySettings from "./SideGallerySettings"
import SideGalleryOverlay from "./SideGalleryOverlay"
import SideGalleryDesign from "./SideGalleryDesign"
import EventBus from "../../event-bus.js"

import { mapGetters } from "vuex"

export default {
  name: "gallery-side-menu-for-overlay",
  components: {
    SideHeader,
    SideGallerySettings,
    SideGalleryOverlay,
    SideGalleryDesign,
  },
  data() {
    return {
      form: {
        enabled: false,
        overlay: {
          position: 1,
        },
      },
    }
  },
  computed: {
    ...mapGetters(["getCurrentTab"]),
    ...mapGetters("EditEvent", { hasChanges : "getIsDifferent"}),
    ...mapGetters('Events', ["getEventOverlay"]),
  },
  methods: {
    undoChanges() {
      if (this.getCurrentTab == "GallerySettings") {
        this.$store.dispatch(
          "Events/selectEvent",
          this.$store.getters["Events/getSelectedEvent"]
        )
      } else if (this.getCurrentTab == "GalleryOverlay") {
        this.$store.dispatch("Events/resetEventOverlayValue")
        this.$store.dispatch(
          "EditEvent/changeIsModifiedCheckpointOverlay",
          false
        )
        EventBus.$emit("undo-image-overlay", "left")
        EventBus.$emit("undo-image-overlay", "center")
        EventBus.$emit("undo-image-overlay", "right")
      } else {
        this.$store.dispatch("Events/getCheckpoint")
      }
    },
    saveEdit() {
      
        const overlay = this.getEventOverlay
        const postData = {}
        console.log('overlay: ', overlay);
        postData.enabled = overlay.enabled
        postData.overlay = {}
        postData.overlay.overlay_id =
          this.$store.getters["EventCheckpoint/getOverlayId"]
        postData.overlay.margin =
          overlay.overlay.margin !== null &&
          overlay.overlay.margin !== undefined
            ? overlay.overlay.margin
            : 40
        postData.overlay.mask_enabled = overlay.overlay.mask_enabled
        postData.overlay.position = overlay.overlay.position
          ? overlay.overlay.position
          : 4
        postData.overlay.mask = {}
        postData.overlay.mask.color = overlay.overlay.mask.color
        postData.overlay.mask.opacity = overlay.overlay.mask.opacity
        if (overlay.overlay.left && overlay.overlay.left.position) {
          if (!overlay.overlay.left.media_id) {
            overlay.overlay.left.media_id = -1
          }
          postData.overlay.left = overlay.overlay.left
        }
        if (overlay.overlay.center && overlay.overlay.center.position) {
          if (!overlay.overlay.center.media_id) {
            overlay.overlay.center.media_id = -1
          }
          postData.overlay.center = overlay.overlay.center
        }
        if (overlay.overlay.right && overlay.overlay.right.position) {
          if (!overlay.overlay.right.media_id) {
            overlay.overlay.right.media_id = -1
          }
          postData.overlay.right = overlay.overlay.right
        }

        const requestedObject =
          this.$store.getters["EditEvent/getEventSettingsRequestObject"]
        console.log(`requestedObject - ${JSON.stringify(requestedObject)}`)
        if (requestedObject.finish_time_overlay_enabled != null) {
          postData.finish_time_overlay_enabled =
            requestedObject.finish_time_overlay_enabled
        }
        if (requestedObject.same_overlay != null) {
          postData.same_overlay = requestedObject.same_overlay
        }
        console.log(`postData - ${JSON.stringify(postData)}`)
        this.$store
          .dispatch("Events/setEventOverlay", {
            overlayRequest: postData,
            emit: true,
          })
          .then((res) => {
            if (!postData.overlay.overlay_id) {
              this.$store.dispatch("EventCheckpoint/setOverlayId", res)
            }
            EventBus.$emit("upload-image-save", "left")
            EventBus.$emit("upload-image-save", "right")
            EventBus.$emit("upload-image-save", "center")
            setTimeout(() => {
              EventBus.$emit("save-overlay")
              // aka finished
            }, 1000)
          })
    },
  },
  mounted() {
    this.$store.dispatch("Events/getCheckpoint")
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

.save {
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
    margin: auto;
  }
}
</style>
