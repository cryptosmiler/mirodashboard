<template lang="html">
  <b-container fluid class="edits-top-bar">
    <b-row  align-v="center" style="height: 100%;" class="d-flex justify-content-around flex-nowrap">

      <div cols="2" md="2">
        <button 
        type="button"
        name="button"
        class="top-bar-buttons "
        :class="[isCurrentPage === 'Event' || isCurrentPage === 'EventSettings' ? 'activePage' : '' ]"
        >
          <router-link :to="{ name: 'Event', params: { id: this.getSelectedEvent.event_id }}" class="event-home-router">
            <i class="fas fa-home icon_topbar"></i>
            Event Home
          </router-link>
        </button>
      </div>
      <div cols="2" md="2">
        <button
          type="button"
          name="button"
          class="top-bar-buttons"
          :class="[isCurrentPage === 'EventGallery' ? 'activePage' : '' ]"
          @click="changePage('gallery')"
          >
          <i class="fas fa-paint-brush icon_topbar"></i>
          Gallery Design
        </button>
      </div>
      <div cols="2" md="2">
        <button
          type="button"
          name="button"
          class="top-bar-buttons"
          :class="[isCurrentPage === 'EventGalleryOverlay' ? 'activePage' : '' ]"
          @click="changePage('overlay')"
          >
          <i class="fas fa-layer-group icon_topbar"></i>
          Overlay
        </button>
      </div>
      <div v-if="this.getSelectedEvent.setting.theme_id == 2" cols="2" md="2">
        <button
          type="button"
          name="button"
          class="top-bar-buttons"
          :class="[isCurrentPage === 'EventRunners' ? 'activePage' : ''  ]"
          @click="changePage('runners')"
          >
          <i class="fas fa-running icon_topbar"></i>
          Participants
        </button>
      </div>
      <div cols="2" md="2">
        <button
          type="button"
          name="button"
          class="top-bar-buttons"
          :class="[isCurrentPage === 'EventPhotos' ? 'activePage' : ''  ]"
          @click="changePage('photos')"
          >
          <i class="fas fa-image icon_topbar"></i>
          Photos
        </button>
      </div>

      <div cols="2" md="2">
        <button
          type="button"
          name="button"
          class="top-bar-buttons"
          :class="[isCurrentPage === 'EventUpload' ? 'activePage' : ''  ]"
          @click="changePage('upload')"
          >
          <i class="fas fa-upload icon_topbar"></i>
          Uploads
        </button>
      </div>

      <div v-if="role === 0 && this.getSelectedEvent.event_type == 1 && platformHelper.defaultSetup()" cols="2" md="2">
        <button
          type="button"
          name="button"
          class="top-bar-buttons"
          :class="[isCurrentPage === 'EventVips' ? 'activePage' : ''  ]"
          @click="changePage('vips')"
          >
          <i class="fas fa-star icon_topbar"></i>
          VIPs
        </button>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import platformHelper from '@/utils/platformHelper'

export default {
  name: 'edits-top-bar',
  data () {
    return {
      role: null,
      platformHelper
    }
  },
  computed: {
    ...mapGetters('Events', ['getSelectedEvent']),
    ...mapGetters('Auth', ['profile']),
    isCurrentPage () {
      return this.$router.history.current.name
    },
  },
  mounted(){
    this.getRole()
  },
  methods: {
    getRole() {
      this.$nextTick(() => {
        this.role = this.profile.role
      });
    },
    changePage (page) {
      this.$router.push(`/events/${this.getSelectedEvent.event_id}/${page}`)
    },
  }
}
</script>

<style lang="css" scoped>

  .edits-top-bar {
    height: 4.5em;
    background: #fff;
  }

  .top-bar-buttons {
    background: none;
    border: none;
    color: #a3a9b3;
    font-weight: 400;
    border-bottom: 5px solid #fff;
    height: 4.5em;
    width: 100%;
  }

  .top-bar-buttons:hover {
    border-bottom: 5px solid #a1a8b8;
    cursor: pointer;
  }

  .activePage {
    border-bottom: 5px solid var(--main-theme) !important;
    color: var(--main-theme);
    font-weight: bold;
  }

  .event-home-router a {
    color: #a3a9b3;
  }

  .event-home {
    float: left;
  }

  .event-home-text {
    position: relative;
    top: -4px;
    color: #a3a9b3;
  }

  .event-home-router:hover {
    text-decoration: none;
  }

  .material-icons.arrow-back {
    top: 2px;
    position: relative;
    color: #a3a9b3;
  }

  @media only screen and (max-width: 768px) {
    .photos-main-view-header {
      padding: 1em;
    }

    .top-bar-buttons {
      font-size: 12px;
      height: 6em;
    }

    .filters-row {
      width: 100%;
      margin: 0 auto;
      padding: 1em 0;
    }

    .filter-buttons {
      height: 0;
    }

    .image-count-upload {
      padding-left: 0;
    }

    .image-count {
      margin-bottom: 5px;
    }

    .create-event-button {
      width: 100%;
      padding: 9px 5px 0px 5px;
    }

    .icon_topbar{
      margin-right: 10px;
    }
  }
</style>
