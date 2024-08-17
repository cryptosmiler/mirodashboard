<template lang="html">
  <b-container fluid  class="mt-3" style="height: 100%;">
    <photos-main-view-header ref="photosMainViewHeader"/>
    <photos-select-all-bar v-show="getCurrentFilter !== 'Uploading' && this.$store.getters['Events/getEventContent'].length > 0 && getCurrentFilter !== 'Filtering'"/>
    <photos-manager v-show="getCurrentFilter !== 'Uploading'"/>
    <photos-uploading v-show="getCurrentFilter === 'Uploading'"/>
    <!-- <photos-upload-screen v-show="this.$store.getters['Events/getEventContent'].length === 0 && getCurrentFilter !== 'Uploading'"/> -->
    <div class="dz-default dz-message" @click="clickUpload" v-show="this.$store.getters['Events/getEventContent'].length === 0 && getCurrentFilter !== 'Uploading'">
      <div id="file-upload-area" class="dz-details">
        <div
          style="
            font-size: 50px;
            height: 50px;"
            >
          <i class="fas fa-upload"></i>
        </div>
        <br>
        <span>Drag files here to begin uploading</span>
        <br>
        <span>OR</span>
        <br>
        <span>browse files from your device</span>
        <span class="choose-file"
          style="
            display: block;
            width: 150px;
            padding: 5px 0px;
            margin: 5px auto;
            color: #979797;
            background: #f4f4f4;
            box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);"
            >
          <i class="material-icons"
            style="font-size: 18px;
              position: relative;
              top: 4px;
              "
              >
            file_upload
            </i> CHOOSE FILE
        </span>
        <span>Files must be less than 10MB in size</span>
      </div>
    </div>
    <photos-footer v-show="getCurrentFilter !== 'Uploading' && getCurrentFilter !== 'Filtering'"/>
    <photos-checkpoint-modal />
  </b-container>
</template>

<script>
import PhotosMainViewHeader from "./PhotosMainViewHeader"
import PhotosSelectAllBar from "./PhotosSelectAllBar"
import PhotosManager from "./PhotosManager"
import PhotosFooter from "./PhotosFooter"
import PhotosUploading from "./PhotosUploading"
import PhotosCheckpointModal from "./PhotosCheckpointModal"
// import PhotosUploadScreen from './PhotosUploadScreen'

export default {
  name: "photos-main-view",
  components: {
    PhotosMainViewHeader,
    PhotosSelectAllBar,
    PhotosManager,
    PhotosFooter,
    PhotosUploading,
    PhotosCheckpointModal
    // PhotosUploadScreen
  },
  mounted() {
    let vm = this
    window.addEventListener("dragenter", function(e) {
      console.log("dragenter")
      if (vm.$refs.photosMainViewHeader && (vm.$store.getters["PhotosFilter/getCurrentFilter"] !== 'Uploading' || vm.$store.getters["PhotosFilter/getCurrentFilter"] !== 'Upload')) {
        vm.$refs.photosMainViewHeader.changeFilter('Uploading', false, false)
      }
    })
    window.addEventListener("dragleave", function(e) {
      e.preventDefault()
    })
    window.addEventListener("dragover", function(e) {
      e.preventDefault()
    })
    window.addEventListener("drop", function(e) {
      e.preventDefault()
    })
  },
  methods: {
    clickUpload() {
      let vm = this
      if (vm.$refs.photosMainViewHeader && vm.$store.getters["PhotosFilter/getCurrentFilter"] !== 'Uploading') {
        vm.$refs.photosMainViewHeader.changeFilter('Uploading', false, true)
      }
    }
  },
  computed: {
    getCurrentFilter() {
      return this.$store.getters["PhotosFilter/getCurrentFilter"]
    }
  }
};
</script>

<style lang="css" scoped>
i {
    color: #CCC;
}

#file-upload-area {
  line-height: 2;
  letter-spacing: 0.2px;
}

.dz-message {
    text-align: center;
    margin: 2em 0;
}
</style>
