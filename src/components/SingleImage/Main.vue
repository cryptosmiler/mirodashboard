<template lang="html">
  <div class="">
    <div class="single-image-modal-main" ref='singleimage' @keydown.left="changeImage(-1)"  @keydown.right="changeImage(1)">
      <div  class="change-image-left" v-bind:class="{ 'hidden-arrow': startReached}" @click="changeImage(-1)" >
        <i class="fas fa-arrow-circle-left"></i>
      </div>

      <div id="single-image">
        <img
          id="single-image-preview"
          :src="selectedImage ? getPhotoUrl(selectedImage) : ''"
          alt="single-image"
          class="single-image-main"
          style="margin: 0 auto;">
      </div>

      <div :class="{'change-image-right': true}" v-if="!endReached" @click="changeImage(1)">
        <i class="fas fa-arrow-circle-right"></i>
      </div>
    </div>

    <div :class="{'single-image-modal-controls-container': true}">
      <div class="single-image-modal-controls">
        <button type="button" name="button" class="modal-control-buttons"
        >
        <a
        @click="downloadResource(selectedImage ? getPhotoUrl(selectedImage) : '')"
        :download="selectedImage.object_id"
        class="modal-control-buttons download-button"
        >

          <i class="material-icons button-icon">
            file_download
          </i>
          DOWNLOAD
        </a>
        </button>

        <button type="button" name="button" class="modal-control-buttons" @click="deleteImage">
          <i class="material-icons button-icon">
            delete
          </i>
          DELETE
        </button>

        <div class="hidden-published-switch">
          <span
            class="hidden-published-text"
            :class="{activeText: !published}"
            >
            Hidden
          </span>
          <label class="switch">
            <input type="checkbox" v-model="published" @change="slide">
            <span class="slider round"></span>
          </label>
          <span
            class="hidden-published-text"
            :class="{activeText: published}"
            >
            Published
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../../event-bus'
import Axios from 'axios'
import JQuery from 'jquery'
const $ = JQuery

export default {
  name: 'single-image-main',
  data () {
    return {
      published: true,
      endReached: false,
      startReached: false,
      currentIndex : this.$store.getters['getSelectedImageIndex'] + 1,
      sendButtonDisable : false,
      isFiltering: false,
      caroselImages: [],
      caroselIndex: 0,
      isOpen: false,
    }
  },
  computed: {
    selectedImage () {
      return this.$store.getters['getSelectedImage']
    },

  },
  methods: {
    slide () {
      this.$store.dispatch('Events/setEventContentState', {
        id: this.selectedImage.event_id,
        state: this.published === true ? 'visible' : 'hidden',
        objectId: [this.selectedImage.object_id]
      }).then((resp) => {
        if (resp.success) {
          this.$store.getters['Events/getEventContent'].forEach(event => {
            if (event.object_id === resp.event.updated_contents[0].object_id) {
              event.state = resp.event.updated_contents[0].state
            }
          })
        }
      })
    },
    leftArrowCheck(specialCheck = true){
      let checkIndex = this.currentIndex

      if(specialCheck && !this.isFiltering) {
        checkIndex--
      }
      if(checkIndex === 0){
        this.startReached = true
      } else {
        this.startReached = false
      }
    },
    changeImage : function(val) {
      var newSelectedImage = {}
      var lastImage = 0
      if(this.isFiltering) {
        this.currentIndex = this.caroselIndex
        newSelectedImage = this.caroselImages[this.currentIndex + val]
        this.caroselIndex = this.caroselIndex + val
        lastImage = this.caroselImages.length - 1
      } else {
        lastImage = this.$store.getters['Events/getEventContent'].length
        newSelectedImage = this.$store.getters['Events/getEventContent'][this.$store.getters['getSelectedImageIndex'] + val]
        this.currentIndex = this.$store.getters['getSelectedImageIndex'] + 1
      }

      if (val === 1){
        this.currentIndex++
      } else {
        this.currentIndex--
      }

      if(this.currentIndex === lastImage){
        this.endReached = true
      } else {
        this.endReached = false
      }

      this.leftArrowCheck()

      if (newSelectedImage) {
        this.published = newSelectedImage.state === 'visible'
        this.$store.dispatch('changeSelectedImage', {
          newSelectedImage,
          index: this.currentIndex + val
        })
        EventBus.$emit('change-single-image', newSelectedImage)
        if(this.isFiltering) {
          EventBus.$emit('change-bib-filter-selected-image-index', this.caroselIndex)
        }
      } else {
        let addToStart = val > 0 ? 20 : -20
        let settings = this.$store.getters['Events/getEventContentSettings']
        let start = settings.start + addToStart
        let offset = start + (this.$store.getters['PhotosFilter/getMaxPhotosPerPage'] - 1)
        if (start >= 0) {
          this.$store.dispatch('Events/getEventContent', {
            eventId: this.$route.params.id,
            recent: settings.recent,
            thumbnail: settings.thumbnail,
            start,
            offset,
            order: settings.order,
            status: settings.state
          }).then(res => {
            let newIndex = val > 0 ? 0 : (this.$store.getters['PhotosFilter/getMaxPhotosPerPage'] - 1)
            this.$store.dispatch('changeSelectedImage', {
              image: this.$store.getters['Events/getEventContent'][newIndex],
              index: newIndex
            })
            EventBus.$emit('change-single-image', this.$store.getters['Events/getEventContent'][newIndex])
            this.$store.dispatch('PhotosFilter/changePaginationValue', settings.start)
          })

        }
      }
    },

    deleteImage () {
      EventBus.$emit('delete-event-content-modal-display', {
        status: 'show',
        objectId: [this.selectedImage],
        singleImage: true
      })
    },
    keydowns (e) {
      if (e.keyCode === 37) {
        if(this.isOpen) this.changeImage(-1)
      } else if (e.keyCode === 39) {
        if(this.isOpen) this.changeImage(1)
      }
    },
    getPhotoUrl(image) {
      if(this.isFiltering) {
        return image.src
      } else {
        if (image.image_key != undefined) {
          return `${process.env.S3_IMAGE_URL}/IMAGES/PREVIEW/${image.image_key}`
        }
      }
    },
    downloadResource(url) {
      const vm = this
      const filename = url.split('\\').pop().split('/').pop()
      console.log(`downloadResource - ${url}`)
      const ts = Math.round((new Date()).getTime() / 1000)
      const urlWithTS = `${url}?t=${ts}`
      Axios.get(urlWithTS, {
        responseType: 'blob'
      }).then(response => {
        console.log(`downloadResource - ${JSON.stringify(response.headers)}`)
        return new Blob([response.data])
        // return response.data
      })
      .then(blob => {
        console.log(`downloadResource - ${blob.length}`)
        let blobUrl = window.URL.createObjectURL(blob)
        console.log(blobUrl)
        vm.forceDownload(blobUrl, filename)
      })
      .catch(e => console.error(e))
    },
    forceDownload(blobUrl, filename) {
      const a = document.createElement('a')
      a.download = filename
      a.href = blobUrl
      // For Firefox https://stackoverflow.com/a/32226068
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
  },
  mounted () {
    EventBus.$on('change-single-image-status', status => {
      this.isOpen = status
    })
    EventBus.$on('open-single-image', image => {
      this.isOpen = true
      this.published = image.state === 'visible'
      if(this.isFiltering) {
        this.caroselIndex = parseInt(image.index)
        if(this.caroselIndex == 0) {
          this.startReached = true
        } else {
          this.startReached = false
        }
      } else {
        this.currentIndex = this.$store.getters['getSelectedImageIndex'] + 1
        let lastImage = this.$store.getters['Events/getEventContentSummary'].objects
        if(this.currentIndex >= lastImage) {
          this.endReached = true
        } else {
          this.endReached = false
        }
        if(this.currentIndex <= 1) {
          this.startReached = true
        } else {
          this.startReached = false
        }
      }
      setTimeout(() => {
        this.published = this.$store.getters['getSelectedImage'].state === 'visible'
      }, 500)
    })

    EventBus.$on('change-single-image-by-carosel', payload => {
      this.published = payload.state === 'visible'
      if(this.isFiltering) {
        this.caroselIndex = parseInt(payload.index)
        this.currentIndex = this.caroselIndex
        if(this.currentIndex == 0) {
          this.startReached = true
        } else {
          this.startReached = false
        }
        if(this.caroselImages.length - 1 == this.currentIndex) {
          this.endReached = true
        } else {
          this.endReached = false
        }
      } else {
        console.log(payload)
        const images = this.$store.getters['Events/getEventContent']
        for (let index = 0; index < images.length; index++) {
          const image = images[index];
          if(image.object_id == payload.object_id) {
            this.caroselIndex = index
            this.currentIndex = index
            break
          }
        }
        if(this.currentIndex == 0) {
          this.startReached = true
        } else {
          this.startReached = false
        }
        if(images.length - 1 == this.currentIndex) {
          this.endReached = true
        } else {
          this.endReached = false
        }
      }
    })

    EventBus.$on('set-bib-filter', status => {
      this.isFiltering = status
    })

    EventBus.$on('filter-by-bib-number', bib_number => {
      this.bib_number = bib_number
    })

    EventBus.$on('bib-filtered-image', images => {
      this.caroselImages = images
      if(this.caroselImages.length <= 1) {
        this.startReached = true
        this.endReached = true
      } else {
        this.endReached = false
      }
    })

    EventBus.$on('update-bib-search-array', index => {
      if(this.isFiltering) {
        const tmp = []
        var index = 0
        for(var i = 0; i < this.caroselImages.length; i++) {
          if(i !== index) {
            this.caroselImages[i].index = index
            index++
            tmp.push(this.caroselImages[i])
          }
        }
        this.caroselImages = tmp
      }
    })

    window.addEventListener('keydown', this.keydowns)

    this.leftArrowCheck()

  }
}
</script>

<style lang="css">
  button:focus {
    outline: none;
  }
</style>

<style lang="css" scoped>
  .single-image-modal-main {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    margin: 1em;
    grid-auto-rows: minmax(200px, 450px);
  }

  .single-image-main {
    max-width:100%;
    max-height:100%;
    height: 90%;
    object-fit: contain;
  }

  .change-image-right, .change-image-left {
    align-self: center;
    justify-self: center;
    font-size: 30px;
  }

  .change-image-left:hover, .change-image-right:hover {
    cursor: pointer;
  }

  #single-image {
    justify-self: center;
    /* justify-content: center; */
    align-self: center;
    height: 100%;
    opacity: 1;
  }

  .single-image-modal-controls-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin: 1em;
  }

  .single-image-modal-controls-container.hidden {
    display: none;
  }

  .single-image-modal-controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr) ;
    grid-auto-rows: 40px;
    grid-column-start: 2;
    justify-items:center;
    grid-gap: 20px;
  }

  .modal-control-buttons {
    background: #335162;
    border-radius: 2px;
    font-size: 16px;
    color: #FFFFFF;
    border: none;
    box-shadow: 0 3px 15px 0 rgba(0,0,0,0.24);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    grid-column-start: 3;
    grid-column: span 1;
    width: 150px;
  }

  .modal-control-buttons:hover {
    cursor: pointer;
  }

  .download-button {
    box-shadow: none;
  }

  .download-button:hover {
    text-decoration: none;
  }

  .material-icons.button-icon {
    font-size: 18px;
    margin-right: 5px;
    line-height: inherit;
    top: -1px;
    position: relative;
  }

  .activeText {
    color: #fff;
  }

  .hidden-published-switch {
    color: #afb7c3;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column: span 1;
    align-content: center;
    grid-gap:10px;
  }

  .active-switch {
    height: 60px;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 35px;
    height: 20px;
  }

  /* Hide default HTML checkbox */
  .switch input {display:none;}

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #a1a9bb;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: var(--main-theme);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px var(--main-theme);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(15px);
    -ms-transform: translateX(15px);
    transform: translateX(15px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .hidden-arrow{
    font-size:0;
  }

</style>
