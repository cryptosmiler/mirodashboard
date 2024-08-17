<template>
  <div id="app">
    <moon-loader
      :loading="loading"
      :color="moonloaderColor"
      :size="moonloaderSize"
      class="moonloader">
    </moon-loader>
    <div class="transparent-overlay"
      v-show="loading">
    </div>

    <single-image/>

    <div class="modal" tabindex="-1" role="dialog" id="delete-event-modal">
      <delete-event-modal
        :event="deleteEvent">
      </delete-event-modal>
    </div>

    <div class="modal" tabindex="-1" role="dialog" id="delete-event-content-modal">
      <delete-event-content-modal
        :contentCount="deleteEventContentCount"
        :isSingleImage="deleteEventContentSingleImage"
        :objectId="objectId">
      </delete-event-content-modal>
    </div>

    <div class="modal" tabindex="-1" role="dialog" id="exceed-max-photos-modal">
      <photos-upload-exceed-max-modal
        :max="max">
      </photos-upload-exceed-max-modal>
    </div>
    <router-view/>
  </div>
</template>

<script>
import SingleImage from './views/SingleImage'
import DeleteEventModal from './components/DeleteEventModal'
import DeleteEventContentModal from './components/DeleteEventContentModal'
import PhotosUploadExceedMaxModal from './components/ContentManager/PhotosUploadExceedMaxModal'
import { MoonLoader } from 'vue-spinner/dist/vue-spinner.min'
import EventBus from './event-bus'
import jquery from 'jquery'
import Chart from "chart.js";

/*
  Some global chart.js defaults
*/
Chart.defaults.global.devicePixelRatio=2;
Chart.defaults.global.defaultFontFamily="sans-serif, 'Montserrat'";
Chart.defaults.global.tooltips.bodyFontFamily="sans-serif, 'Montserrat'";

export default {
  name: 'app',
  components: {
    SingleImage,
    MoonLoader,
    DeleteEventModal,
    DeleteEventContentModal,
    PhotosUploadExceedMaxModal
  },
  data () {
    return {
      loading: false,
      moonloaderColor: '#ff0000',
      moonloaderSize: '100px',
      showDeleteEventModal: false,
      deleteEvent: {},
      deleteEventContentCount: 0,
      deleteEventContentSingleImage: false,
      objectId: [],
      max: 0
    }
  },
  created () {
    EventBus.$on('change-loader-state', (payload) => {
      // payload - true || false
      this.loading = payload
    })
  },
  mounted () {

    EventBus.$on('delete-event-modal-state', (payload) => {
      this.deleteEvent = payload.selectedEvent
      jquery('#delete-event-modal').modal(payload.status)
    })

    EventBus.$on('image-uploads-max-exceeded', (payload) => {
      if(payload.max) {
        this.max = payload.max
      }
      jquery('#exceed-max-photos-modal').modal(payload.status)
    })

    EventBus.$on('delete-event-content-modal-display', (payload) => {
      if (payload.status === 'show') {
        // props passed to modal for deleteEventContent request
        this.deleteEventContentCount = payload.objectId ? 1 : this.$store.getters['getSelectedCount']
        this.deleteEventContentSingleImage = payload.singleImage
        this.objectId = payload.objectId
      }
      jquery('#delete-event-content-modal').modal(payload.status)
    })
  },
    watch: {
    $route (to ,from) {
      this.$store.dispatch('Auth/getProfile', {}, { root: true })
    }
    // this.$store.dispatch('Auth/getProfile', {}, { root: true })
  }
}
</script>

<style lang="scss">


  @import 'vue2-dropzone/dist/vue2Dropzone.min.css';
  /* @import 'assets/custom.scss'; */

  div > .toasted.bubble.error {
    background: red;
    justify-content: center;
  }

  div.toasted.link-copied.bubble {
    background: #0193DC;
    justify-content: center;
  }

  div.toasted.verify-email.bubble {
    background: red;
    justify-content: center;

    .action.ripple.icon {
      color: #fff;
    }
  }

  div.toasted.delete-toast.bubble {
    font-size: 24px;
    margin: 0 auto;
    width: 70%;
  }

  .toasted.bubble .action {
    color: #fff;
  }

  .moonloader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100000;
    opacity: 1;
  }

/*
* GLOBALS
*/
  .global-button {
    text-transform: capitalize;
    padding: 0 1.5em;
    -webkit-box-shadow: 0 5px 10px 0 rgba(0,0,0,0.05);
    box-shadow: 0 5px 14px 0 rgba(0,0,0,0.15);
    border-radius: 2px;
    border: none;
    font-weight: bold;
    height: 3em;
    -ms-flex-item-align: center;
    align-self: center;
    color: #a0abba;
  }

  .global-button:hover {
    cursor: pointer;
    color: #6c757d;
    background-color: rgba(153, 153, 153, 0.2);
    border-color: rgba(153, 153, 153, 0.2);
  }

  .global-submit-button {
    background: var(--main-theme);
    color: #fff;
  }

  .global-submit-button:disabled {
    cursor: not-allowed;
    background-color: buttonface;
    color: #a0abba;
  }

  .global-settings-header {
    color: #aeb4c3;
    font-size: 24px;
  }

  .row-titles {
    font-size: 16px;
    color: #a0a9b8;
    margin: 0;
    font-weight: 500 !important;
    text-transform: uppercase;
  }


</style>

<style lang="css" scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

body {
  overflow: auto;
}
body > div {
    background: #f4f8f9;
}

.btn {
  text-transform: none;
}

button:hover {
  cursor: pointer;
}

.transparent-overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  background: rgba(141, 140, 140, 0.6);
  z-index: 99999;
}

</style>
