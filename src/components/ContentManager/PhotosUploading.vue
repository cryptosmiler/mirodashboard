<template lang="html">
  <div class="photos-uploading">
    <div class="photos-uploading-bars-view" :class="{uploading : getIsUploading}">

      <div class="clear-retry">

        <div class="clear-retry-container clear" @click="didPressClearQueue">
          <div>
            <i class="fas fa-times"></i>
          </div>
          <span class="clear-queue">Clear Queue</span>
        </div>
        <!-- <div class="clear-retry-container retry" v-show="getPaused" @click="retryFailedUploads">
          <div class="">
            <i class="fas fa-undo"></i>
          </div>
          <span class="clear-queue">Retry Uploads</span>
        </div> -->
      </div>

      <div class="uploading-progress-bar">
        <div
          class="upload-complete"
          :class="{paused: getPaused}"
          :style="{ width: (progressBarWidth > 100 ? 100 : progressBarWidth) + '%'}"
          style="height:100%; transition: width 0.3s;"
          >
          <span class="processed-files">
            Processed: {{ getPhotosProcessedCountRegulated() }} / {{ getSetTotalPhotosCount }}
          </span>
          <span class="completed-total-files">
            Uploaded: {{ getSuccessfulUploadsCount }} / {{ getSetTotalPhotosCount }}
          </span>
        </div>
      </div>

      <div class="pause-button">
        <button class="pause-play" v-show="!getPaused" @click="clickPause">
          <i class="fas fa-pause-circle"></i>
        </button>

        <button class="pause-play" v-show="getPaused" @click="clickPlay">
          <i class="fas fa-play-circle"></i>
        </button>
      </div>
    </div>
    <photos-upload-screen :content = "content" :checkpoint = "checkpoint" :freeupload = "freeupload" />
    <photos-upload-clear-queue-modal/>
    <div class="text-center" v-if="!freeupload && profile.role==0">
      <b-button v-b-modal.modal-center variant="danger main fancy-button" v-if="profile.role === 0">+ New Upload Link</b-button>
      <b-modal id="modal-center" centered title="+ New Upload Link" hide-footer @close="modalClosed">
        <p class="my-4">
          <photos-upload-link-create @closeModal="closeModal" />
        </p>
      </b-modal>
      <photos-upload-link-list />
    </div>
  </div>
</template>

<script>
import PhotosUploadScreen from "./PhotosUploadScreen";
import PhotosUploadClearQueueModal from "./PhotosUploadClearQueueModal";
import PhotosUploadLinkList from "./PhotosUploadLinkList"
import PhotosUploadLinkCreate from "./PhotosUploadLinkCreate"
import { mapGetters } from "vuex";

import EventBus from "../../event-bus";
import { getProfile } from "../../api";

export default {
  name: "photos-uploading",
  props: ['content', 'checkpoint', 'freeupload'],
  data() {
    return {
      completed: 20,
    };
  },
  computed: {
    ...mapGetters([
      "getPaused",
      "getIsUploading",
      "getTotalPhotosCount",
      "getSetTotalPhotosCount",
      "getPhotosProcessedCount",
      "getSuccessfulUploadsCount"
    ]),
    ...mapGetters("Auth", ["profile"]),
    progressBarWidth() {
      return (this.getPhotosProcessedCount / this.getSetTotalPhotosCount) * 100;
    }
  },
  components: {
    PhotosUploadScreen,
    PhotosUploadClearQueueModal,
    PhotosUploadLinkCreate,
    PhotosUploadLinkList,
  },
  mounted() {
    EventBus.$on("clear-queue-warning-reply", () => {
      EventBus.$emit("dropzone-clear-queue");
    });
  },
  methods: {
    closeModal() {
      this.$bvModal.hide('modal-center');
    },
    modalClosed() {
      // Do something when the modal is closed
    },
    clickPause() {
      this.$store.dispatch("pausePhotosUploads", true);
    },
    clickPlay() {
      this.$store.dispatch("pausePhotosUploads", false);
      EventBus.$emit("resume-photos-uploads", true);
    },
    retryFailedUploads() {
      EventBus.$emit("retry-failed-uploads");
    },
    didPressClearQueue() {
      EventBus.$emit("show-clear-queue-modal");
    },
    getPhotosProcessedCountRegulated() {
      return this.getPhotosProcessedCount > this.getSetTotalPhotosCount ? this.getSetTotalPhotosCount : this.getPhotosProcessedCount
    }
  }
};
</script>

<style lang="css" scoped>
.photos-uploading {
  display: block;
  height: 100%;
}

.photos-uploading-bars-view {
  display: none;
  grid-template-columns: 80px auto 80px;
  width: 100%;
  background: #f4f4f4;
  margin: 0;
  color: var(--miro-grey);
  /* height: 5em; */
}

.uploading {
  display: grid;
}

.clear-retry {
  position: relative;
}

.clear-retry:hover {
  cursor: pointer;
}

.clear-retry-container {
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  color: #fff;
  line-height: 2.2;
  padding-top: 15%;
}

.clear {
  background: #9fa9b9;
}

.retry {
  background: #f04b72;
}

.upload-complete {
  position: relative;
  background: var(--main-theme);
}

.completed-total-files {
  position: absolute;
  font-size: 20px;
  color: #FFF;
  top: 50%;
  transform: translateY(-50%);
  left: 20em;
  min-width: 200px;
}

.processed-files {
  position: absolute;
  font-size: 20px;
  color: #FFF;
  top: 50%;
  transform: translateY(-50%);
  left: 2em;
  min-width: 200px;
}

.pause-play {
  font-size: 40px;
  line-height: 2em;
  /* width: 100%; */
  height: 100%;
  text-align: center;
  background-color: inherit;
  border: none;
  color: #9fa9ba;
  border-left: 1px solid #9fa9ba;
}

.pause-play:hover {
  cursor: pointer;
}

.main{
  background-color: var(--main-theme);
}
.pull-right{
  float: right;
}

.fancy-button{
  height: 50px;
  border-radius: 8px !important;
  padding: 10px 30px 10px 30px;
}
</style>
