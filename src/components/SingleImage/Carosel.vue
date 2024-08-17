<template lang="html">
  <div :class="{
      'modal-images-carosel': true
    }">
    <div 
      class="carosel-image" 
      v-for="(image, index) in images()" 
      :key="index"
      :class="{landscape: isWide(image), portrait: !isWide(image), square: isSquare(image), selected: isSelected(image, index)}"
      @click="changeImage(image)"
      >
      <img :src="getPhotoUrl(image)" :alt="image ? image.object_id : ''" class="each-image">
    </div>
  </div>
</template>

<script>
import EventBus from '../../event-bus'
import axios from 'axios'

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  name: 'modal-images-carosel',
  data () {
    return {
      caroselImages: [],
      selectedIndex: 0,
      isFiltering: false,
      bib_number: '',
      filteredIndex: 0,
    }
  },
  methods: {
    changeImage (image) {
      let found = JSON.parse(JSON.stringify(this.$store.getters['Events/getEventContent'])).findIndex((event, index) => {
        return event.object_id === image.object_id
      })
      if(this.isFiltering) {
        found = parseInt(this.caroselImages[this.filteredIndex].index)
      }
      this.$store.dispatch('changeSelectedImage', {
        image,
        index: found
      })
      this.selectedIndex = found

      EventBus.$emit('change-single-image-by-carosel', image)
    },

    isWide (image) {
      if (image) { return image.width > image.height }
    },
    isSquare (image) {
      if(this.isWide(image)) {
        return image.height/image.width > 0.75
      } else {
        return image.width/image.height > 0.75
      }
    },

    isSelected (image, index) {
      return (image ? image.object_id === this.$store.getters['getSelectedImage'].object_id : false)
    },
    getPhotoUrl(image) {
      // if(this.isFiltering) {
      //   return image.src
      // } else {
        return `${process.env.S3_IMAGE_URL}/IMAGES/THUMBNAIL_300/${image.image_key}`
      // }
    },
    images () {

      let images = JSON.parse(JSON.stringify(this.$store.getters['Events/getEventContent']))
      if(this.isFiltering) {
        images = this.caroselImages
      }
      let caroselLength = (images.length >= 9 ? 9 : images.length)
      let maxReached = false

      let currentIndex = this.$store.getters['getSelectedImageIndex'] - 4 
      if(this.isFiltering) {
        currentIndex = this.filteredIndex
      }    
      if (currentIndex < 0) { currentIndex = 0 }
        //  placeholder for when max is reached
        let defaultidx = currentIndex
        let imagesInCarosel = []

        let selectedImages = () => {
          if (imagesInCarosel.length === caroselLength) {
            return
          }

          if (images[currentIndex] && !maxReached){
            imagesInCarosel.push(images[currentIndex])
            currentIndex += 1
            selectedImages()
          } 

      else if (imagesInCarosel.length < caroselLength) {
          // move past images to the start of the carosel
          defaultidx--         
          maxReached = true
          imagesInCarosel.unshift(images[defaultidx])
          selectedImages()
        }
      }

      selectedImages()
      return imagesInCarosel
    }

  },
  mounted () {
    EventBus.$on('change-single-image', payload => {
      this.changeImage(payload)
    })
    EventBus.$on('set-bib-filter', status => {
      this.isFiltering = status
    })
    EventBus.$on('filter-by-bib-number', bib_number => {
      this.bib_number = bib_number
    })
    EventBus.$on('bib-filtered-image', images => {
      this.caroselImages = images
    })

    EventBus.$on('change-bib-filter-selected-image-index', index => {
      this.filteredIndex = parseInt(index)
    })

    
    EventBus.$on('deleted-bib-search-photo', () => {
      if(this.isFiltering) {
        this.changeImage(this.caroselImages[this.filteredIndex])
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
        if(this.caroselImages.length > index) {
          this.changeImage(this.caroselImages[index])
        } else if(this.caroselImages.length > 0) {
          this.changeImage(this.caroselImages[this.caroselImages.length - 1])
        } else {
          EventBus.$emit('close-single-image')
        }
      }
    })
  }

}
</script>

<style lang="css" scoped>
  .modal-images-carosel {
    display: grid;
    grid-template-columns: repeat( auto-fit, 5%);
    grid-template-rows: 100px;
    justify-content: center;
    align-content: center;
    margin: 0 auto;
    width: 100%;
    grid-gap: 5px;
    align-items: end;
  }

  .modal-images-carosel.hidden {
    display: none;
  }

  .carosel-image {
    height: 75px;
    transition: height 0.2s linear;
  }

  .landscape {
    grid-column: span 2;
  }

  .portrait {
    grid-column: span 1;
  }

  .square {
    grid-column: span 2;
  }

  .carosel-image:hover {
    border: 1px solid #fff;
    height: 90px;
    width: 100%;
  }

  .each-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .each-image:hover {
    cursor: pointer;
  }

  .selected {
    outline: 1px solid red;
    height: 90px;
  }
</style>
