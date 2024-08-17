<template lang="html">
  <div class="photos-manager">
    <div
      class="jamie"
      v-for="(image, index) in newImages"
      :key='index'
      :class="{
        landscape: isWide(image),
        portrait: !isWide(image),
        selected: selectedImagesObjectIds.includes(image.object_id)}
      "
       v-show="getCurrentFilter !== 'Uploading'"
       >
      <input
        type="checkbox"
        name=""
        :value="image.object_id"
        class="image-select-checkbox"
        v-model="selectedImagesObjectIds"
        @change="selectImage(image, index, $event)"
        :class="{
          //'in-select-mode': [$store.getters['getSelectMode']],
          'hidden': isFiltering
        }"
        >
      <span class="checkmark" :class="{'hidden': isFiltering}"></span>

      <div class="magnifying-glass" v-if="$store.getters['getSelectMode']" @click="clickMagnify(image, index)">
        <i class="fas fa-search"></i>
      </div>
      <img
        :src="image.url"
        @click="clickImage(image, index)">
    </div>
    <div class="no-result-hint text-center py-4" v-if="isFiltering && newImages.length == 0">No result</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import EventBus from '../../event-bus'
import storage from '@/utils/storage'
import { AUTH_TOKENS_STORAGE_KEY } from '@/constants'
import axios from 'axios'
import JQuery from 'jquery'
const $ = JQuery

export default {
  name: 'photos-manager',
  data () {
    return {
      selectedImagesObjectIds: [],
      isFiltering: false,
      filteredImages: [],
      selectedImagesObjects: []
    }
  },
  watch: {
    selectedImagesObjectIds (val) {
      this.$store.dispatch('changeSelectMode', val)
    },
    newImages () {
      setTimeout(() => {
        EventBus.$emit('change-loader-state', false)
      }, 2000)
    }
  },
  methods: {
    selectImage (image, index, event) {
      if(event) event.preventDefault()
      // select checkbox in image or image when in select mode
      let inArray = false
      this.selectedImagesObjects.find((eachImage, eachIndex) => {
        if (eachImage && image.object_id === eachImage.object_id) {
          inArray = true

          // find image in selectedImagesObjects array and remove it
          this.selectedImagesObjects.splice(eachIndex, 1)

          // ends .find
          return false
        }
      })

      if (!inArray) {
        // if not already in selectedImagesObjects, push in image object
        this.selectedImagesObjects.push(image)
      }

      // update selectedImagesObjects array in store
      this.$store.dispatch('changeSelectedImagesObjects', this.selectedImagesObjects)
    },
    isWide (image) {
      return image.width > image.height
    },
    ...mapActions(['changeSelectMode', 'changeSelectedImage']),
    clickImage (image, index) {
      //  click on image itself and not on checkbox
      if (this.$store.getters['getSelectMode']) {
        $(`input.image-select-checkbox[value="${image.object_id}"]`).click()
      } else {
        this.$store.dispatch('changeSelectedImage', {
          image,
          index
        })
        EventBus.$emit('open-single-image', image)
      }
    },
    clickMagnify (image, index) {
      this.$store.dispatch('changeSelectedImage', {
        image,
        index
      })
      EventBus.$emit('open-single-image', image)
    },
    addDelayLoader() {
      for (const key in this.getEventContent) {
        if (this.getEventContent.hasOwnProperty(key)) {
          const image = this.getEventContent[key]
          const timestampDiff = new Date() - new Date(image.create_date)
          const diffSecond = Math.floor(timestampDiff / 1e3)
          if(!this.getEventContent[key].url || (this.getEventContent[key].url && !this.getEventContent[key].url.includes('loading.gif'))) {
            this.getEventContent[key].url = `${process.env.S3_IMAGE_URL}/IMAGES/THUMBNAIL_300/${image.image_key}`
            if(diffSecond < 15) {
              const originalUrl = this.getEventContent[key].url
              this.getEventContent[key].url = `${process.env.S3_IMAGE_URL}/IMAGES/MEDIA/loading.gif`
              // console.log(`to delay: ${(10 - Math.max(0, diffSecond))*1000}`)
              setTimeout(()=> {
                const cloneImages = []
                for (let index = 0; index < this.getEventContent.length; index++) {
                  const clone = JSON.parse(JSON.stringify(this.getEventContent[index]))
                  cloneImages.push(clone)
                }
                this.$store.dispatch('Events/setEventContent', [])
                cloneImages[key].url = originalUrl
                this.$store.dispatch('Events/setEventContent', cloneImages)
                // console.log(`show image: ${originalUrl}`)
              }, 15 * 1000, key, originalUrl )
            }
          }
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      'getAllPhoto',
      'getSelectMode',
      'getSelectedImage',
      'getSelectedImages',
      'getSelectedImagesObjects'
    ]),
    ...mapGetters('EventCheckpoint', ['getCurrentCheckpoint']),
    ...mapGetters('Events', ['getEventContent','getSelectedEvent']),
    getCurrentFilter () {
      return this.$store.getters['PhotosFilter/getCurrentFilter']
    },
    newImages () {
      if(this.isFiltering) {
        return this.filteredImages
      } else {
        this.addDelayLoader()
        return this.getEventContent
      }
    }
  },
  mounted () {

    EventBus.$on('discard-selection-modal', (discardSelection) => {
      if(discardSelection) {
        this.selectedImagesObjectIds = []
        this.selectedImagesObjects = []
        this.$store.dispatch('changeSelectMode', [])
        this.$store.dispatch('changeSelectedImagesObjects', [])
      }
    })

    EventBus.$on('exit-select-mode-empty-array', () => {
      this.selectedImagesObjectIds = []
      this.selectedImagesObjects = []
      this.$store.dispatch('changeSelectMode', [])
      this.$store.dispatch('changeSelectedImagesObjects', [])
    })

    EventBus.$on('select-all-images', () => {
      this.isFiltering = false
      const allIds = []
      const allImages = []
      for(const key in this.getAllPhoto) {
        const allphoto = this.getAllPhoto[key]
        if(this.getCurrentCheckpoint == 0 || allphoto.checkpoint == this.getCurrentCheckpoint) {
          if(this.getCurrentFilter == 'All' || (this.getCurrentFilter == 'Published' && allphoto.state == 'visible') || (this.getCurrentFilter == 'Hidden' && allphoto.state == 'hidden')) {
            allImages.push(allphoto)
            allIds.push(allphoto.object_id)
          }
        }
      }
      this.selectedImagesObjectIds = allIds
      this.selectedImagesObjects = JSON.parse(JSON.stringify(allImages))
      this.$store.dispatch('changeSelectMode', allIds)
      this.$store.dispatch('changeSelectedImagesObjects', allImages)
    })

    EventBus.$on('select-visible-images', () => {
      const eventContent = this.getEventContent

      for(const key in eventContent) {
        const photo = eventContent[key]
        if (!this.selectedImagesObjectIds.includes(photo.object_id)) {
          this.selectedImagesObjectIds.push(photo.object_id)
          var exist = false
          for(const key in this.selectedImagesObjects) {
            const img = this.selectedImagesObjects[key]
            if(img.object_id == photo.object_id) {
              exist = true
              break
            }
          }
          if(!exist) {
            this.selectedImagesObjects.push(photo)
          }
        }
      }

      this.$store.dispatch('changeSelectedImagesObjects', this.selectedImagesObjects)
    })

    EventBus.$on('empty-selected-images-array', () => {
      this.selectedImagesObjectIds = []
      this.selectedImagesObjects = []

      this.$store.dispatch('changeSelectedImagesObjects', [])
    })
    EventBus.$on('set-bib-filter', status => {
      this.isFiltering = status
    })
    EventBus.$on('filter-by-bib-number', bib_number => {
      this.selectedImagesObjectIds = []
      this.selectedImagesObjects = []
      this.filteredImages = []

      const axiosClient = axios.create({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storage.load(AUTH_TOKENS_STORAGE_KEY).AccessToken}`
        }
      })
      const vm = this
      let url_variable = this.getSelectedEvent.event_type == 1 ? this.getSelectedEvent.event_id + '/images/' : this.getSelectedEvent.event_id + '/bibs/'

      axiosClient.get(`${process.env.API_BASE_URL}events/${url_variable}${bib_number}`,).then(resp => {
        const response = resp.data

        var index = 0
        for (const key in response.images) {
          if (response.images.hasOwnProperty(key)) {
            const image = response.images[key]
            const tempData = {}
            tempData.event_id = this.$route.params.id
            tempData.width = image.width
            tempData.height = image.height
            tempData.object_id = image.image_id
            tempData.index = index

            switch (this.getSelectedEvent.event_type) {
              case 1:
                if(image) {
                  tempData.src = `${process.env.S3_IMAGE_URL}/IMAGES/PREVIEW/${image.image_key}`
                  tempData.url = `${process.env.S3_IMAGE_URL}/IMAGES/PREVIEW/${image.image_key}`
                  tempData.image_key = image.image_key
                  tempData.state = image.status == 0 ? 'visible' : 'hidden'
                  this.filteredImages.push(tempData)
                  index++
                }
                break;
              case 2:
              case 3:
                if(image.image && image.image != null) {
                  tempData.src = `${process.env.S3_IMAGE_URL}/IMAGES/PREVIEW/${image.image.image_key}`
                  tempData.url = `${process.env.S3_IMAGE_URL}/IMAGES/PREVIEW/${image.image.image_key}`
                  tempData.image_key = image.image.image_key
                  tempData.state = image.image.status == 0 ? 'visible' : 'hidden'
                  this.filteredImages.push(tempData)
                }
                break;
            }
            index++
          }
        }
        EventBus.$emit('bib-filtered-image', this.filteredImages)
      })

      this.$store.dispatch('changeSelectedImagesObjects', [])
    })

    EventBus.$on('update-bib-search-array', index => {
      if(this.isFiltering) {
        const tmp = []
        var index = 0
        for(var i = 0; i < this.filteredImages.length; i++) {
          if(i !== index) {
            this.filteredImages[i].index = index
            index++
            tmp.push(this.filteredImages[i])
          }
        }
        this.filteredImages = tmp
      }
    })
  },
  beforeDestroy () {
    EventBus.$off('filter-by-bib-number')
  },
}
</script>

<style lang="css" scoped>
  .photos-manager {
    position: relative;
    margin: 0.5em 0 0 0;
    display: grid;
    grid-template-columns: minmax(150px, max-content) repeat(auto-fill, 150px) minmax(150px, max-content);
    grid-auto-rows: 220px;
    grid-gap: 10px;
    padding-bottom: 4em;
  }

  img {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    object-fit: cover;
  }

  .landscape {
    grid-column: span 2;
  }

  .portrait {
    grid-column: span 1;
  }

  .jamie {
    position: relative;
  }

  .jamie:hover {
    cursor: pointer;
    opacity: .9;
  }

  .no-result-hint {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .image-select-checkbox {
    width: 1.3em;
    height: 1.3em;
    background-color: white;
    border-radius: 50%;
    vertical-align: middle;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
    position: absolute;
    top: 5px;
    left: 5px;
    opacity: 0.3;
  }

  .image-select-checkbox.in-select-mode {
    width: 100%;
    height: 100%;
    opacity: 0 !important;
    border-radius: 5%;
  }

  .magnifying-glass {
    width: 1.3em;
    height: 1.3em;
    vertical-align: middle;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0.3;
  }

  .magnifying-glass:hover {
    opacity: 1;
    color: #fff;
  }

  .selected {
    /* padding: 0.5em; */
  }

  .image-select-checkbox:hover {
    opacity: 0.7;
  }

  .image-select-checkbox:checked {
    opacity: 1;
    background-color: var(--main-theme);
  }

  .checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

  input:checked ~ .checkmark:after {
  display: block;
}

.image-select-checkbox.in-select-mode.hidden {
  display: none;
}

  .checkmark:after {
  left: 13px;
  top: 10px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  cursor: pointer;
}

  @media only screen and (min-width: 1690px) {
    .photos-manager {
      grid-template-columns: repeat(12, minmax(100px, autofill));
      justify-content: center;
    }
  }
</style>
