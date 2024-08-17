 <template lang="html">
  <div class="events-photos">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <edits-top-bar/>
  <CSV-upload-screen></CSV-upload-screen>
  </div>
</template>

<script>
import EventBus from '../event-bus'
import EditsTopBar from '../components/EditEvent/EditsTopBar'
import CSVUploadScreen from '../components/EditEvent/CSVUploadScreen'

import { mapActions } from 'vuex'
import jquery from 'jquery'

export default {
  name: 'event-runners',
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
    // this.$store.dispatch('Events/getEventContent', {
    //   eventId: this.$route.params.id
    // })

    this.$store.dispatch('changeCurrentTab', 'Runners')

    

    EventBus.$on('navigate-warning-reply', (payload) => {
      if (payload.navigateAway) {
        this.isNext()

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
    CSVUploadScreen
  }
}
</script>

<style lang="css" scoped>

</style>
