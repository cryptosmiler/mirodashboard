<template lang="html">
<b-container fluid class="photos-main-view-header px-4 pt-4 mt-3 mb-0">
  <b-row class="mb-2" align-h="between">
    <b-col cols="8" class="preview-header-title">
      <p>{{ $store.getters['Events/getSelectedEvent'].setting.title }}</p>
    </b-col>
    <b-col cols="12" md="4" class="text-right">
      
    </b-col>
  </b-row>
  
  <b-row class="filters-row text-center mx-0">
    <b-col
      cols="12" lg="8" xl="6"
      :class="[getCurrentFilter === 'All' ? 'active-filter' : '' ]"
      class="filter-button-column"
      @click="changeFilter('All')"
      >
      <button id="checkpointDropdown" class="filter-buttons" v-if="getCheckpoints.length <= 1">{{ currentCheckpointLabel }} ({{ photosCount.objects || 0}})</button> 
      <b-dropdown id="dropdownContainer" class="filter-buttons" v-else :text="this.getCurrentCheckpoint == 0 ? $t('event.uploader.select-checkpoint') : getCheckpointText()" variant="transparent">
        <b-dropdown-item href="#" v-for="(checkpoint, index) in getCheckpoints" v-bind:key="index" @click="selectCheckpoint(checkpoint.checkpoint_id, $event)">{{`${checkpoint.checkpoint_label} (${checkpoint.images})`}}</b-dropdown-item>
      </b-dropdown>
    </b-col>
   
    <div class="modal" tabindex="-1" role="dialog" id="discard-selection-modal">
      <discard-selection-modal></discard-selection-modal>
    </div>
    <div>
			<upload-logs-modal/>
		</div>
  </b-row>
</b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
import discardSelectionModal from '../ContentManager/DiscardSelectionModal.vue'
import jquery from 'jquery'
import UploadLogsModal from "./UploadLogsModal"

const $ = jquery

export default {
  name: 'upload-main-view-header',
  data () {
    return {
      bibNumber: '',
      tabToChange: '',
      changingCheckpoint: false,
      checkpointToChange: 0,
    }
  },
  methods: {
    changeFilter(filter, openModal = true, openUploadSelector = false) {
      if(this.getSelectMode && openModal) {
        $('#discard-selection-modal').modal('show')
        this.tabToChange = filter
      } else {
        this.$store.dispatch('PhotosFilter/changeCurrentFilter', filter)
        if(filter != 'Uploading') {
          this.startGetPhoto()
        } else {
          if (openUploadSelector) {
            $('#upload-dropzone').click()
          }
        }
      }
    },
    searchBibNumber() {
      if(this.bibNumber != '' && !isNaN(this.bibNumber)){
        EventBus.$emit('set-bib-filter', true)
        this.changeFilter('Filtering')
        this.bibNumber = parseInt(this.bibNumber)
        EventBus.$emit('filter-by-bib-number', this.bibNumber)
      }
    },
    getCheckpointText() {
      return this.getCheckpoints.filter(e =>  e.checkpoint_id == this.getCurrentCheckpoint).reduce((a,e) => `${e.checkpoint_label} (${e.images})`, '') 
    },
    selectCheckpoint(id) {
      if(!isNaN(id) && id !== '') {
        if(this.getSelectMode) {
          $('#discard-selection-modal').modal('show')
          this.changingCheckpoint = true
          this.checkpointToChange = id
        } else {
          this.changeCheckpoint(id)
        }
      }
    },
    changeCheckpoint(id) {
      this.$store.dispatch('EventCheckpoint/selectCheckpoint', id)
      this.startGetPhoto()
    },
    startGetPhoto() {
      EventBus.$emit('reset-pagination')
      let start = 1
      let offset = this.$store.getters['PhotosFilter/getMaxPhotosPerPage']
      let isRecent = this.getCurrentFilter === 'Recent'
      let state = 'all'
      let checkpoint = this.getCurrentCheckpoint

      if(this.getCurrentFilter != 'Filtering') {
        EventBus.$emit('set-bib-filter', false)
      }
      if (this.getCurrentFilter !== 'Uploading' && this.getCurrentFilter !== 'Filtering' && !isRecent) {
        if (this.getCurrentFilter === 'Published') {
          state = 'visible'
        } else {
          state = this.getCurrentFilter
        }
      }

      this.$store.dispatch('Events/getEventContent', {
        eventId: this.$route.params.id,
        start,
        offset,
        recent: isRecent,
        status: state,
        checkpoint
      })
    },
    stopPro(event) {
      if(event) {
        event.stopPropagation()
      }
      $('#checkpointDropdown').click()
    },
    keydowns (e) {
      if (e.keyCode === 13) {
        this.searchBibNumber()
      }
    }
  },
  computed: {
    ...mapGetters([
      'getIsUploading',
      'getTotalPhotosCount',
      'getRecentImagesUploaded'
    ]),
    ...mapGetters(['getSelectMode', 'getAllPhoto']),
    ...mapGetters('EventCheckpoint', ['getCheckpoints', 'getCurrentCheckpoint']),
    
    currentCheckpointLabel() {
      return this.getCheckpoints.filter(e =>  e.checkpoint_id == this.getCurrentCheckpoint).reduce((a,e) => `${e.checkpoint_label}`, '') 
    },

    photosCount () {
      return this.$store.getters['Events/getEventContentSummary']
    },
    isUploading () {
      return this.getIsUploading ? 'Uploading...' : 'Upload'
    },
    getCurrentFilter () {
      return this.$store.getters['PhotosFilter/getCurrentFilter']
    },
    dayMonth(){
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      const month = months[today.getMonth()];
      const day = today.getDate();
      const formattedDate = month + ' ' + day;
      return formattedDate
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keydowns),

    EventBus.$on('discard-selection-modal', (discardSelection) => {
      $('#discard-selection-modal').modal('hide')
      if(this.changingCheckpoint) {
        if(discardSelection) {
          this.changeCheckpoint(this.checkpointToChange)
        }
      } else {
        if(discardSelection && this.tabToChange != '') {
          this.changeFilter(this.tabToChange, false)
          this.tabToChange == ''
        }
      }
    })

    EventBus.$on('open-checkpoint-dropdown', ()=> {
      console.log('open-checkpoint-dropdown click')
      $('#checkpointDropdown').click()
    })

    $('#checkpointDropdown').on('click', (e)=> {
      e.preventDefault()
    })

    EventBus.$on('finished-image-upload', ()=> {
      console.log('finished-image-upload')
      this.changeFilter('Published')
    })
  },
  beforeMount() {
    console.log('tab-reset-image-filter')
    this.checkpointToChange = 0
    console.log(`${this.checkpointToChange}`)
    this.selectCheckpoint(this.checkpointToChange)
    this.selectCheckpoint(this.checkpointToChange)
  },
  beforeDestroy () {
    EventBus.$off('discard-selection-modal')
    EventBus.$off('open-checkpoint-dropdown')
    EventBus.$off('finished-image-upload')
  },
  components: {
    discardSelectionModal: discardSelectionModal,
    UploadLogsModal
  },
}
</script>

<style lang="scss" scoped>
  .photos-main-view-header {
    /* height: 13.5em; */
    background: var(--main-theme);
    color: #fff;
  }

  .preview-header-title {
    font-size: 24px;
    height: 1.5em;
    font-weight: bold;
  }

  .image-count {
    width: 100px;
    display:inline-block;
    font-size: 18px;
  }


  .image-count-upload img {
    height: 16px;
    position: relative;
    top: -2px;
    color: #fff;
  }

  .create-event-button {
    background: var(--main-theme);
    color: #fff;
    display:inline-block;
    margin-left: 20px;
  }

  .material-icons {
    font-size: 18px;
    position: relative;
    top: 2px;
  }

  .upload-images-text {
    font-weight: 500;
    font-size: 16px;
    transition: width 0.2s;
  }

  .filters-row {
    width: 80%;
  }

  .filter-button-column {
    border-bottom: 4px solid var(--main-theme);
    padding: 0;
  }

  .filter-button-column:hover {
    cursor: pointer;
  }

  .filter-buttons {
    background: none;
    border: none;
    color: #fff;
    font-weight: 400;
    height: 4.5em;
    padding-left: 0;
    padding-right: 0;
  }

  .filter-buttons:hover {
    cursor: pointer;
  }

  .filter-buttons .dropdown, .filter-buttons .dropdown .dropdown-toggle {
    color: #fff;
    outline: none;
    font-size: 12px;
    font-family: 'Roboto';
    font-weight: 400;
  }

  .filter-buttons .dropdown .dropdown-toggle:hover, .filter-buttons .dropdown .dropdown-toggle:active, .filter-buttons .dropdown .dropdown-toggle:focus{
    color: #fff;
    background-color: transparent;
    border:none;
    box-shadow:none;
  }

  .active-filter {
    border-bottom: 4px solid #fff;
  }

  .preview-header-search-box {
    width: -webkit-calc(100% - 119px);
    width: -moz-calc(100% - 119px);
    width: calc(100% - 119px);
    padding-right: 30px;
    display: inline-block;
    margin-top: 10px;
  }

  .preview-header-search-box input {
    color: #fff;
    width: 100%;
    height: 39px;
    background: transparent;
    border: none;
    border-bottom: 2px solid #fff;
    font-family: Roboto;
    font-size: 16px;
  }

  .preview-header-search-box input::placeholder {
    color: #fff;
    font-family: Roboto;
    font-size: 16px;
  }

  .preview-header-search-box input:focus {
    outline: none;
  }

  .preview-header-search-button {
    width: 115px;
    display: inline-block;
    margin-top: 10px;
  }

  .preview-header-search-button .search-button {
    text-align: center;
    display: block;
    width: 100%;
    cursor: pointer;
    background: var(--main-theme);
    color: #fff;
    padding: 10px;
    border-radius: 2px;
    line-height: normal;
  }

  input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
      -moz-appearance: textfield;
  }
  

  @media only screen and (max-width: 768px) {
    .upload-tab {
      display: none;
    }


    .preview-header-title {
      font-size: 20px;
    }

    .create-event-button {
      margin-left: 0;
    }

    .filters-row {
      width: 100%;
      height: 40%;
      margin: auto;
      font-size: 12px;
    }

    .upload-images-text {
      font-size: 12px;
    }
  }
</style>
<style lang="scss">
  #dropdownContainer > ul {
    overflow-y: scroll;
    /* height: 80vh; */
  } 
</style>
