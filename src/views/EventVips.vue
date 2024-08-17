 <template lang="html">
  <div class="events-vips">
    <transition class="side-nav-menu-main" name="slide">
      <side-bar v-show="show"></side-bar>
    </transition>

    <menu-bar/>
    <edits-top-bar/>

    <div fluid v-bind:class="{sideMenuOpen: sideMenuIsOpen, sideMenuClosed: sideMenuIsClosed}" class="account-container">
      <vips-edit/>
    </div>

  </div>
</template>

<script>
import EventBus from '../event-bus'
import EditsTopBar from '../components/EditEvent/EditsTopBar'
import VipsEdit from '../components/EditEvent/VipsEdit'
import { mapActions } from 'vuex'
import jquery from 'jquery'

export default {
  name: 'event-vips',
  components: {
    EditsTopBar,
    VipsEdit
  },

  data () {
    return {
      show: false,
      sideMenuIsOpen: false,
      sideMenuIsClosed: true,
      // isNext: {}
    }
  },
  methods: {
    ...mapActions([
      'changeCurrentTab'
    ])
  },
  created () {
    this.$store.dispatch('changeCurrentTab', 'vips')
  },
}
</script>

<style lang="css" scoped>
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

@media only screen and (min-width: 768px) {
  .event-side-menu {
    min-width: 26em;
    max-width: 28em;
  }
}

.event-side-menu {
  min-width: 26em;
  max-width: 28em;
}

@media only screen and (max-width: 768px) {
  .event-side-menu {
    min-width: 16em;
  }

  .edit-event-preview {
    display: none;
  }
}
</style>
