<template lang="html">
  <b-container fluid class="edit-event-preview-main">
    <b-row align-h="center" align-v="center" class="height100">
      <b-col cols="12" class="height100">
        <iframe 
          v-if="this.$route.name != 'EventGalleryOverlay'"
          id="site-preview-iframe"
          :src="iFrameSrc" 
          frameborder="0" 
          allowfullscreen 
          scrolling="yes"
          :class="{mobile: desktopMobileView}"
          ></iframe>
        <div :class="{mobile: desktopMobileView}" v-else>
          <div class="overlay-container">
            <b-row style="padding: 10px;">
              <b-col cols="12" class="loading-preview" v-show="loadingPreview">Generating image preview...</b-col>
              <b-col cols="12" class="loading-preview" v-show="!loadingPreview && previewImages.length == 0">
                No image preview is available
              </b-col>
              <b-col cols="12" v-show="!loadingPreview && previewImages.length > 0">
                <b-row>
                  <b-col cols="12" class="display-3 font-weight-bold text-center py-2">Image Preview</b-col>
                  <b-col cols="6" v-for="(image, index) in images(0)" :key="index">
                    <img :src="`data:image/jpeg;base64,${image}`"/>
                  </b-col>
                  <b-col cols="12" class="display-3 font-weight-bold text-center py-2" v-show="!loadingPreview">Finish Time Image Preview</b-col>
                  <b-col cols="6" v-for="(image, index) in images(1)" :key="index+99" v-show="!loadingPreview">
                    <img :src="`${image}`" v-show="image"/>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex"
import EventBus from "../../event-bus"
import platformHelper from "@/utils/platformHelper"

export default {
  name: "edit-event-preview-main",
  data() {
    return {
      previewImages: [],
      loadingPreview: true,
      platformHelper,
    }
  },
  computed: {
    ...mapGetters(["getSelectedType", "getCurrentTab"]),
    ...mapGetters("EditEvent", ["getOriginalForm"]),
    ...mapGetters("Events", ["getSelectedEvent"]),
    desktopMobileView() {
      return this.getSelectedType === "mobile"
    },
    iFrameSrc() {
      let event = this.getOriginalForm
      // currently use http and not https like in selectedEvent.url
      return event
        ? platformHelper.platform() != 4
          ? `${event.url}?pin=${this.getSelectedEvent.setting.pin}`
          : `${event.url}#/?pin=${this.getSelectedEvent.setting.pin}`
        : ""
    },
  },
  mounted() {
    EventBus.$on("refresh-overview-iframe", () => {
      if (
        this.$route.name == "EventGalleryOverlay" 
      ) {
        this.refreshOverlay()
      } else {
        if (document.getElementById("site-preview-iframe") !== null) {
          document.getElementById("site-preview-iframe").src += ""
        }
      }
    })

    if (
      this.$route.name == "EventGalleryOverlay" 
    ) {
      this.refreshOverlay()
    }

    EventBus.$on("get-overlay-preview", ({ overlay, finishTimeOverlay }) => {
      this.previewImages = []
      if (overlay) {
        this.previewImages.push(overlay)
      }
      if (finishTimeOverlay) {
        this.previewImages.push(finishTimeOverlay)
      }
      this.loadingPreview = false
    })

    EventBus.$on("overlay-changed", (payload) => {
      setTimeout(() => {
        this.refreshOverlay()
      }, 1000)
    })

    EventBus.$on("get-overlay-preview-failed", () => {
      this.previewImages = []
      // this.loadingPreview = false
    })
  },
  methods: {
    images(index) {
      return this.previewImages[index]
    },
    refreshOverlay() {
      this.loadingPreview = true
      this.previewImages = []
      this.$store.dispatch("Events/getOverlayPreview")
    },
  },
  beforeDestroy() {
    EventBus.$off("overlay-changed")
    EventBus.$off("get-overlay-preview")
    EventBus.$off("refresh-overview-iframe")
  },
}
</script>

<style lang="css" scoped>
.edit-event-preview-main {
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  border-radius: 0 2px 2px 2px;
  min-height: 700px;
  /* height: 600px; */
}

.height100 {
  /* min-height: 600px; */
}

.img-placeholder {
  padding: 1em;
}

iframe {
  border: 1px solid black;
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: block;
  margin-top: 1em;
}

.mobile {
  width: 370px !important;
  margin: 1em auto;
}

.overlay-container {
  border: 1px solid black;
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: block;
  margin-top: 1em;
}

.overlay-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loading-preview {
  text-align: center;
  color: #a8afb8;
  height: 100%;
  margin-top: 90px;
}
</style>
