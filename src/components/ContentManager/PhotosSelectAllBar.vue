<template lang="html">
  <b-row
    class="photos-select-all-bar"
    :class="{selectModeOn : getSelectMode}"
    align-v="center"
    >
    
    <b-col cols="6" lg="9">
      <button class="select-all-button" :class="{selectMode: getSelectMode}">
      <div
        v-show="getSelectMode"
        class="exit-select-mode-x"
        @click="exitSelectMode">
        <i class="fas fa-times"></i>
      </div>
      <label class="form-check-inline">
        <span
          class="select-all-text"
          :class="{selectMode : getSelectMode, 'font-weight-bold' : selectAll}"
          @click="selectAllChanged"
          >Select All <span v-show="getSelectMode"></span>
          </span>
        <span
          class="select-all-text right"
          :class="{selectMode : getSelectMode, 'font-weight-bold' : selectVisable}"
          @click="selectVisibleChanged"
          >Select Visible <span v-show="getSelectMode"></span>
          </span>
      </label>
      </button>
    </b-col>

    <b-col cols="6" lg="3" class="event-site-dropdown px-0" v-show="!getSelectMode">
      <div class="btn-group">
        <button
          type="button"
          class="btn orderby-button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          >
          <div class="float-left">ORDER BY </div>
          <i class="material-icons more-vert">more_vert</i>
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <button class="dropdown-item" type="button" @click="getEventsWithFilter('t_asc')">Date Taken asc</button>
          <button class="dropdown-item" type="button" @click="getEventsWithFilter('t_desc')">Date Taken desc</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" type="button" @click="getEventsWithFilter('asc')">Upload date asc</button>
          <button class="dropdown-item" type="button" @click="getEventsWithFilter('desc')">Upload date desc</button>
        </div>
                  <!-- <i class="far fa-trash-alt"></i> -->

      </div>
      
    </b-col>

    <b-col cols="6" lg="3" class="event-site-dropdown px-0" v-show="getSelectMode">
      <div class="btn-group">
        <button
          type="button"
          class="btn selectedImages"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          >
          <span
            style="
              position: relative;
              top: -4px;"
            >{{getSelectedCount}} selected
          </span>
          <i class="material-icons more-vert">more_vert</i>
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <button v-show="getCheckpoints && getCheckpoints.length > 1" class="dropdown-item" type="button" @click="moveCheckpoint()">Move Checkpoint</button>
          <button v-show="getCurrentFilter != 'Published'" class="dropdown-item" type="button" @click="imagesState('visible')">Publish Images</button>
          <button v-show="getCurrentFilter != 'Hidden'" class="dropdown-item" type="button" @click="imagesState('hidden')">Hide Images</button>
          <!-- <button class="dropdown-item" type="button">Download All</button> -->
          <button class="dropdown-item" type="button" @click="deleteSelected">Delete</button>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import EventBus from '../../event-bus'

export default {
  name: 'photos-select-all-bar',
  data () {
    return {
      selectAll: false,
      selectVisable: false,
      selectMode: false
    }
  },
  methods: {
    ...mapActions([
      'changeSelectMode'
    ]),
    selectAllChanged () {
      this.exitSelectMode()
      this.selectAll = true
      this.$store.dispatch('changeSelectAll')
    },
    selectVisibleChanged () {
      this.exitSelectMode()
      this.selectVisable = true
      this.$store.dispatch('changeSelectVisible', this.$store.getters['PhotosFilter/getPaginationValue'])
    },
    exitSelectMode () {
      this.selectAll = false
      this.selectVisable = false
      EventBus.$emit('exit-select-mode-empty-array')
      this.$store.dispatch('changeSelectMode', [])
      this.$store.dispatch('changeSelectedImagesObjects', [])
    },
    deleteSelected () {
      EventBus.$emit('delete-event-content-modal-display', {
        status: 'show'
      })
    },
    imagesState (val) {
      this.$store.dispatch('Events/setEventContentState', {
        id: this.$route.params.id,
        state: val
      })
    },
    getEventsWithFilter (filter) {
      this.$store.dispatch('PhotosFilter/changePaginationValue', 1)
      this.$store.dispatch('Events/getEventContent', {
        eventId: this.$route.params.id,
        order: filter })
    },
    moveCheckpoint() {
      EventBus.$emit('open-photos-checkpoint-modal')
    }
  },
  computed: {
    ...mapGetters([
      'getSelectMode',
      'getSelectedCount',
      'getCurrentFilter',
      'getSelectedImagesObjects'
    ]),
    ...mapGetters('PhotosFilter', ['getCurrentFilter']),
    ...mapGetters('EventCheckpoint', ['getCheckpoints', 'getCurrentCheckpoint']),
  },
  mounted() {
    this.exitSelectMode()

    EventBus.$on('exit-select-mode', ()=> {
      this.exitSelectMode()
    })
  },
}
</script>

<style lang="css" scoped>
  .photos-select-all-bar {
    background: #DDD;
    margin: 0;
    color: white;
    height: 3em;
  }

  .select-all-text:hover {
    cursor: pointer;
    font-weight: bolder;
  }

  .select-all-text.right {
    margin-left: 15px;
  }

  .exit-select-mode-x {
    display: inline-block;
    margin-right: 20px;
  }

  .exit-select-mode-x:hover {
    cursor: pointer;
  }

  .select-all-button {
    border: none;
    background: none;
    color: #777676;
    position: relative;
    top: 3px;
  }

  .select-all-button.selectMode {
    color: #fff;
  }

  .selectModeOn {
    background: var(--main-theme);
    color: #fff;
  }


  .material-icons.more-vert:hover {
    cursor: pointer;
  }

  .dropdown-menu.dropdown-menu-right {
    top: 5px;
    right: 15px;
  }

  .event-site-dropdown {
    position: relative;
    text-align: right;
    /* right: -30px; */
  }

  .dropdown-item {
    min-height: 2.5rem;
    font-size: 14px;
    color: #a0abba;
  }

  .orderby-button {
    color: #777676;
  }

  .selectedImages {
    color: #fff;
  }

  .selectedImages:focus {
    background-color: transparent;
  }

  .orderby-button:hover {
    background-color: transparent;
  }

  .orderby-button:focus {
    background-color: transparent;
  }

  .event-site-dropdown .btn-group {
    margin: 5px 1px;
  }

</style>
