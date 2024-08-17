<template lang="html">
  <div class="edit-event-side-menu">
    <b-container fluid>
      <!-- <b-row style="margin-bottom:0.5em;" align-h="center">
        <side-header/>
      </b-row> -->

      <b-row align-h="center">
        <!-- <side-gallery-settings v-show="getCurrentTab === 'GallerySettings'"/> -->
        <side-gallery-design  class="some-margin-top"/>
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
  name: "gallery-side-menu",
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
    ...mapGetters([
      "EditEvent/getEventSettingsRequestObject",
    ]),
  },
  methods: {
    undoChanges() {
      // if (this.getCurrentTab == "GallerySettings") {
      //   this.$store.dispatch(
      //     "Events/selectEvent",
      //     this.$store.getters["Events/getSelectedEvent"]
      //   )
      // } else if (this.getCurrentTab == "GalleryOverlay") {
      //   this.$store.dispatch("Events/resetEventOverlayValue")
      //   this.$store.dispatch(
      //     "EditEvent/changeIsModifiedCheckpointOverlay",
      //     false
      //   )
      //   EventBus.$emit("undo-image-overlay", "left")
      //   EventBus.$emit("undo-image-overlay", "center")
      //   EventBus.$emit("undo-image-overlay", "right")
      // } else {
      //   this.$store.dispatch("Events/getCheckpoint")
      // }
      this.$store.dispatch("Events/getCheckpoint")
    },
    saveEdit() { 
      // if (this.getCurrentTab == "GallerySettings") {
      //   var validate = true
      //   var errorText = ""
      //   const postdata =
      //     this.$store.getters["EditEvent/getEventSettingsRequestObject"]
      //   const stickerData = this.$store.getters["Event/getEventStickers"]

      //   console.log("stickerData:", stickerData)
      //   if (postdata.sharing_enabled == true) {
      //     if (postdata.share_setting.email.text == "") {
      //       errorText = "Please fill in the Email Share Text"
      //       validate = false
      //     }
      //     if (postdata.share_setting.email.title == "") {
      //       errorText = "Please fill in the Email Share Title"
      //       validate = false
      //     }
      //     if (postdata.share_setting.twitter == "") {
      //       errorText = "Please fill in the Twitter Share Text"
      //       validate = false
      //     }
      //     if (postdata.share_setting.facebook.text == "") {
      //       errorText = "Please fill in the Facebook Share Text"
      //       validate = false
      //     }
      //     if (postdata.share_setting.facebook.title == "") {
      //       errorText = "Please fill in the Facebook Share Title"
      //       validate = false
      //     }
      //   }
      //   if (postdata.subdomain) {
      //     let requestObjectDomain =
      //       this.$store.getters["EditEvent/getEventSettingsRequestObject"]
      //         .domain
      //     if (
      //       postdata.subdomain !==
      //       this.$store.getters["EditEvent/getOriginalForm"].subdomain
      //     ) {
      //       this.$store.dispatch("Events/setEventDomain", {
      //         subdomain: postdata.subdomain,
      //         domain: process.env.DOMAIN
      //           ? process.env.DOMAIN
      //           : "myracetag.com/events",
      //       })
      //     }
      //   }
      //   if (validate) {
      //     EventBus.$emit("upload-image-save", "stickers")
      //     this.$store.dispatch("Events/setEventSetting")
      //   } else {
      //     this.$toasted.show(errorText, {
      //       duration: 3000,
      //       fullWidth: true,
      //       theme: "bubble",
      //       className: "verify-email",
      //       position: "bottom-center",
      //     })
      //   }
      // } 
      // else if (this.getCurrentTab == "GalleryOverlay") {
      //   const overlay = this.getEventOverlay
      //   const postData = {}
      //   console.log('overlay: ', overlay);
      //   postData.enabled = overlay.enabled
      //   postData.overlay = {}
      //   postData.overlay.overlay_id =
      //     this.$store.getters["EventCheckpoint/getOverlayId"]
      //   postData.overlay.margin =
      //     overlay.overlay.margin !== null &&
      //     overlay.overlay.margin !== undefined
      //       ? overlay.overlay.margin
      //       : 40
      //   postData.overlay.mask_enabled = overlay.overlay.mask_enabled
      //   postData.overlay.position = overlay.overlay.position
      //     ? overlay.overlay.position
      //     : 4
      //   postData.overlay.mask = {}
      //   postData.overlay.mask.color = overlay.overlay.mask.color
      //   postData.overlay.mask.opacity = overlay.overlay.mask.opacity
      //   if (overlay.overlay.left && overlay.overlay.left.position) {
      //     if (!overlay.overlay.left.media_id) {
      //       overlay.overlay.left.media_id = -1
      //     }
      //     postData.overlay.left = overlay.overlay.left
      //   }
      //   if (overlay.overlay.center && overlay.overlay.center.position) {
      //     if (!overlay.overlay.center.media_id) {
      //       overlay.overlay.center.media_id = -1
      //     }
      //     postData.overlay.center = overlay.overlay.center
      //   }
      //   if (overlay.overlay.right && overlay.overlay.right.position) {
      //     if (!overlay.overlay.right.media_id) {
      //       overlay.overlay.right.media_id = -1
      //     }
      //     postData.overlay.right = overlay.overlay.right
      //   }

      //   const requestedObject =
      //     this.$store.getters["EditEvent/getEventSettingsRequestObject"]
      //   console.log(`requestedObject - ${JSON.stringify(requestedObject)}`)
      //   if (requestedObject.finish_time_overlay_enabled != null) {
      //     postData.finish_time_overlay_enabled =
      //       requestedObject.finish_time_overlay_enabled
      //   }
      //   if (requestedObject.same_overlay != null) {
      //     postData.same_overlay = requestedObject.same_overlay
      //   }
      //   console.log(`postData - ${JSON.stringify(postData)}`)
      //   this.$store
      //     .dispatch("Events/setEventOverlay", {
      //       overlayRequest: postData,
      //       emit: true,
      //     })
      //     .then((res) => {
      //       if (!postData.overlay.overlay_id) {
      //         this.$store.dispatch("EventCheckpoint/setOverlayId", res)
      //       }
      //       EventBus.$emit("upload-image-save", "left")
      //       EventBus.$emit("upload-image-save", "right")
      //       EventBus.$emit("upload-image-save", "center")
      //       setTimeout(() => {
      //         EventBus.$emit("save-overlay")
      //         // aka finished
      //       }, 1000)
      //     })
      // } 
      
      // else if (this.getCurrentTab == "GalleryDesign") {
      //   EventBus.$emit("upload-image-save", "brand")
      //   EventBus.$emit("upload-image-save", "sponsor")
      //   EventBus.$emit("upload-image-save", "organiser")
      //   this.$store.dispatch("Events/setEventColorScheme") 
      // }

      EventBus.$emit("upload-image-save", "logo") 

      EventBus.$emit("upload-image-save", "brand")
      EventBus.$emit("upload-image-save", "sponsor")
      EventBus.$emit("upload-image-save", "organiser")
      this.$store.dispatch("Events/setEventColorScheme") 

      let settings =
          this.$store.getters["EditEvent/getEventSettingsRequestObject"]
        this.$store.dispatch("Events/setEventSetting", { settings })
    },
  },
  mounted() {
    this.$store.dispatch("Events/getCheckpoint")
  },
}
</script>

<style lang="css" scoped>

.some-margin-top{
  margin-top: 15px;
}
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
