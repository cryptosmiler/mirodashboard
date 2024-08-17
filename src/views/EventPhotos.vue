 <template lang="html">
  <div class="events-photos">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <edits-top-bar/>
    <div fluid v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}" class="account-container">
      <photos-main-view/>
    </div>

    <div class="modal" tabindex="-1" role="dialog" id="photos-upload-navigate-warning-modal">
      <photos-upload-navigate-warning-modal/>    
    </div>
  </div>
</template>

<script>
import EventBus from '../event-bus'
import EditsTopBar from '../components/EditEvent/EditsTopBar'
import PhotosUploadNavigateWarningModal from '../components/ContentManager/PhotosUploadNavigateWarningModal'
import PhotosMainView from '../components/ContentManager/PhotosMainView'
import { mapActions } from 'vuex'
import jquery from 'jquery'

export default {
  name: 'event-photos',
  data () {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true,
      isNext: {}
    }
  },
  methods: {
    ...mapActions([
      'changeCurrentTab'
    ])
  },
  created () {
    this.$store.dispatch('Events/getEventContent', {
      eventId: this.$route.params.id
    })

    this.$store.dispatch('changeCurrentTab', 'Photos')

    EventBus.$on('change-side-nav', () => {
      this.show = !this.show
      this.sideMenuIsOpen = !this.sideMenuIsOpen
      this.sideMenuIsClosed = !this.sideMenuIsClosed
    })

    EventBus.$on('navigate-warning-reply', (payload) => {
      if (payload.navigateAway) {
        // this.isNext()

        EventBus.$emit('dropzone-clear-queue')

        // clears all queue count
        this.$store.dispatch('photosFinishedUploading')
      }
      jquery('#photos-upload-navigate-warning-modal').modal(payload.status)
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.$store.getters['getIsUploading']) {
      // save next() to be wait to be triggered from modal
      this.isNext = next
      jquery('#photos-upload-navigate-warning-modal').modal('show')
    } else {
      next()
    }
  },
  components: {
    EditsTopBar,
    PhotosMainView,
    PhotosUploadNavigateWarningModal
  }
}
</script>

<style lang="css" scoped>
  .events-photos {
    height: 100%;
  }

.slide-enter-active {
  transition: all .3s ease;
}

.slide-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-enter {
  transform: translateX(-220px);
}

.slide-leave-to {
  transform: translateX(-220px);
}

.sideMenuOpen {
  transition: all 0.3s ease;
  padding-left: 260px;
  left: 260px;
  opacity: 0.5;
  box-sizing: content-box;
}

.sideMenuClosed {
  transition: all 0.3s linear;
  padding-left: -260px;
}

.account-container {
  height: 60%;
}
</style>
