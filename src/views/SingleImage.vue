<template lang="html">
  <div class="single-image-modal" v-show="isOpen" ref="singleImageModal">
    <div class="single-image-modal-header">
      <div class="single-image-modal-header-close" @click="closeSingleImageModal">
        <i class="fas fa-times"></i>
        <span style="padding-left:20px; font-weight:bold;">
          Close
        </span>
      </div>
    </div>

    <single-image-main />

    <single-image-carosel />
  </div>
</template>

<script>
import EventBus from '../event-bus'
import SingleImageCarosel from '../components/SingleImage/Carosel'
import SingleImageMain from '../components/SingleImage/Main'

export default {
  name: 'single-image',
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    closeSingleImageModal () {
      this.isOpen = false
      EventBus.$emit('change-single-image-status', false)
    },
    keydowns (e) {
      // if 'esc' key, close single image
      if (e.keyCode === 27) { 
        this.isOpen = false
        EventBus.$emit('change-single-image-status', false)
      }
    }
  },
  components: {
    SingleImageCarosel,
    SingleImageMain
  },
  mounted () {
    EventBus.$on('open-single-image', () => {
      this.isOpen = true
    })

    EventBus.$on('close-single-image', () => {
      this.closeSingleImageModal()
    })

    window.addEventListener('keydown', this.keydowns)
  }
}
</script>

<style lang="css" scoped>
  .single-image-modal {
      display: block;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      background: #00283D;
      z-index: 999;
      padding: 1em;
      grid-template-rows: 10% 70% 10% 10%;
  }

  .single-image-modal-header {
    display:block;
  }

  .single-image-modal-header-close {
    color: #fff;
  }

  .single-image-modal-header-close:hover {
    cursor: pointer;
  }
</style>
