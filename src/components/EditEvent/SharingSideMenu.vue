<template lang="html">
  <div class="edit-event-side-menu">
    <b-container fluid>
      <b-row style="margin-bottom:0.5em;" align-h="center">
        <side-header/>
      </b-row>

      <b-row align-h="center">
        <side-sharing v-show="getCurrentTab === 'Sharing'"/>
        <side-checkpoint v-show="getCurrentTab === 'Checkpoint'"/>
        <side-overlay v-show="getCurrentTab === 'Overlay'"/>
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
import SideSharing from "./SideSharing"
import SideOverlay from "./SideOverlay"
import SideCheckpoint from "./SideCheckpoint"
import EventBus from "../../event-bus.js"

import { mapGetters } from "vuex";

export default {
  name: "edit-event-side",
  components: {
    SideHeader,
    SideSharing,
    SideOverlay,
    SideCheckpoint
  },
  data () {
    return {
      form: {
        enabled: false,
        overlay: {
          position: 1
        }
      }
    }
  },
  computed: {
    ...mapGetters(["getCurrentTab"]),
    ...mapGetters('EditEvent', ["getIsDifferent"]),
    ...mapGetters('Events', ["getEventOverlay"]),
    hasChanges() {
      return this.getIsDifferent
    },
    getOverlay() {
      return this.getEventOverlay
    }
  },
  methods: {
    undoChanges() {
      if(this.getCurrentTab == 'Sharing') {
        this.$store.dispatch(
          "Events/selectEvent",
          this.$store.getters["Events/getSelectedEvent"]
        )
      } else if(this.getCurrentTab == 'Overlay') {
        this.$store.dispatch("Events/resetEventOverlayValue")
        EventBus.$emit("undo-image-overlay", 'left');
        EventBus.$emit("undo-image-overlay", 'center');
        EventBus.$emit("undo-image-overlay", 'right');
      } else {
        this.$store.dispatch("Events/getCheckpoint")
      }
    },
    saveEdit() {
      if(this.getCurrentTab == 'Sharing') {
        var validate = true
        var errorText = ''
        const postdata = this.$store.getters['EditEvent/getEventSettingsRequestObject']
        if(postdata.sharing_enabled == true) {
          if(postdata.share_setting.email.text == '') {
            errorText = 'Please fill in the Email Share Text'
            validate = false
          }
          if(postdata.share_setting.email.title == '') {
            errorText = 'Please fill in the Email Share Title'
            validate = false
          }
          if(postdata.share_setting.twitter == '') {
            errorText = 'Please fill in the Twitter Share Text'
            validate = false
          }
          if(postdata.share_setting.facebook.text == '') {
            errorText = 'Please fill in the Facebook Share Text'
            validate = false
          }
          if(postdata.share_setting.facebook.title == '') {
            errorText = 'Please fill in the Facebook Share Title'
            validate = false
          }
        }
        if(validate) {
          this.$store.dispatch("Events/setEventSetting")
        } else {
          this.$toasted.show(errorText, {
            duration: 3000,
            fullWidth: true,
            theme: 'bubble',
            className: 'verify-email',
            position: 'bottom-center'
          })
        }
      } else if(this.getCurrentTab == 'Overlay') {
        const overlay = this.getOverlay
        const postData = {}
        postData.enabled = overlay.enabled
        postData.overlay = {}
        postData.overlay.mask_enabled = overlay.overlay.mask_enabled
        postData.overlay.position = overlay.overlay.position
        postData.overlay.mask = {}
        postData.overlay.mask.color = overlay.overlay.mask.color
        postData.overlay.mask.opacity = overlay.overlay.mask.opacity
        if(overlay.overlay.left.media_id != null) {
          postData.overlay.left = overlay.overlay.left
        }
        if(overlay.overlay.right.media_id != null) {
          postData.overlay.right = overlay.overlay.right
        }

        const requestedObject = this.$store.getters['EditEvent/getEventSettingsRequestObject']
        console.log(`requestedObject - ${JSON.stringify(requestedObject)}`)
        if (requestedObject.finish_time_overlay_enabled != null) {
          postData.finish_time_overlay_enabled = requestedObject.finish_time_overlay_enabled
        } 

        console.log(`postData - ${JSON.stringify(postData)}`)
        this.$store.dispatch('Events/setEventOverlay', {overlayRequest: postData, emit: true})
        EventBus.$emit("upload-image-save", 'left')
        EventBus.$emit("upload-image-save", 'right')
        EventBus.$emit("save-overlay")
      } else {
        this.$store.dispatch('EventCheckpoint/saveCheckpoint')
      }
    },
  },
  mounted() {
    
  }
};
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
