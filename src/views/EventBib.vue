 <template lang="html">
  <div class="events-photos">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>
    <menu-bar/>
    <edits-top-bar/>
  <bib-test></bib-test>
  </div>
</template>

<script>
import EventBus from '../event-bus'
import EditsTopBar from '../components/EditEvent/EditsTopBar'
import BibTest from '../components/EditEvent/BibTest'

import { mapActions } from 'vuex'
import jquery from 'jquery'

export default {
  name: 'event-bib',
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

    this.$store.dispatch('changeCurrentTab', 'Runners')

    EventBus.$on('change-side-nav', () => {
      this.show = !this.show
      this.sideMenuIsOpen = !this.sideMenuIsOpen
      this.sideMenuIsClosed = !this.sideMenuIsClosed
    })

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
    BibTest
  }
}
</script>

<style lang="css" scoped>
div.toasted.link-copied.bubble {
  background: var(--main-theme);
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

.event-side-menu {
  min-width: 28em;
}

@media only screen and (max-width: 768px) {
  .event-side-menu {
    min-width: 16em;
  }

  .edit-event-preview {
    display: none;
  }
}

@media only screen and (min-width: 768px) {
  .event-side-menu {
    min-width: 26em;
    max-width: 28em;
  }
}
</style>
