<template lang="html">
  <div class="">

    <edit-event-side-component :header-text="$t('event.settings.details.event-logo.heading')">
      <b-container class="basic-info-body" slot="body">
          <b-row class="mb-0">
            <b-col class="mb-0">
              <b-row  align-v="center" class="upload-image-box mb-0" align-h="center">
                <image-upload-component parent="logo"/>
              </b-row>
            </b-col>

          </b-row>

          

      </b-container>
    </edit-event-side-component>
 
    <edit-event-side-component >
      <b-container class="basic-info-body" slot="body">
        <b-row>
            <b-col cols="2" md="1">
            </b-col>
            <b-col cols="9" md="11">
              <label for="" class="input-label" :class="{ requiredBlue: true }">{{`Information`}}</label>
            </b-col>
            <b-col cols="2" md="1" class="icons">
              <i :class="`fas fa-file-alt`"></i>
            </b-col>
            <b-col cols="9" md="11">
              <vue-editor v-model="form.description" :editorToolbar="customToolbar" @input="inputChange('description')"></vue-editor>
            </b-col>
          </b-row>
      </b-container>
    </edit-event-side-component>

    

    <edit-event-side-component :required="false" header-text="" :header-show="false">
        <b-container class="info-body" slot="body">
          <b-row :class="{ notPremiumAccount : form.rt_brand_option === 0 }">
            <b-col cols="10">
              <label for="" style="margin-bottom:0">Remove Runnertag Branding</label>
              <br>
              <span
                style="font-size: 12px;
                position: relative;
                bottom: 5px;"
                >
                Only available to premium accounts
              </span>
            </b-col>
            <b-col cols="2">
              <label class="switch">
                <input type="checkbox" v-model="removeBrand" @change="addRemoveMiroBranding()" :disabled="form.rt_brand_option === 0">
                <span class="slider round"></span>
              </label>
            </b-col>
          </b-row>
          <b-row v-if="!form.rt_brand">
            <b-col cols="12">
              <label for="" class="mt-3">Upload your brand logo (drag to rearrange)</label>
            </b-col>
            <b-col cols="12">
              <b-row  align-v="center" class="upload-image-box" align-h="center">
                <image-upload-component parent="brand"/>
              </b-row>
            </b-col>
            <b-col cols="12">
              <label for="" class="mt-3">Brand URL</label>
            </b-col>
            <b-col cols="12">
              <input type="text" v-model="form.client_brand_url" @input="updateUrl()">
            </b-col>
          </b-row>
        </b-container>
    </edit-event-side-component>

    <edit-event-side-component header-text="COLOR SCHEME">
      <b-container class="basic-info-body" slot="body">
          <b-row class="row-margin-bottom mb-1">
            <b-col cols="12">
              <label for="" class="input-label">Choose your colors</label>
            </b-col>

            <b-row v-for="(color, index) in selectedColors" :key='index' class="color-box-rows">
              <b-col cols="2" @click="openColor(color, index)">
                <div class="color-box" :style="{background: color.color}">

                </div>
              </b-col>

              <b-col cols="10" align-self="center" @click="openColor(color, index)">
                <span class="color-name">{{color.name}}</span>
              </b-col>
                <color-picker
                  :name="color.name"
                  :propColor="color.color"
                  v-if="color.isActive"
                  :objectName="color.objectName"
                  :index="index" id="color-picker-id" @change="changed(color)"
                  parent="design"/>
            </b-row>
          </b-row>
      </b-container>
    </edit-event-side-component>

    <edit-event-side-component v-if="this.getSelectedEvent.setting.theme_id == 2" header-text="SPONSOR LOGOS">
      <b-container class="basic-info-body" slot="body">
          <b-row class="row-margin-bottom">
            <b-col cols="12">
              <label for="" class="input-label">Upload your sponsors logos (drag to rearrange)</label>
            </b-col>

            <b-col>
              <b-row  align-v="center" class="upload-image-box sponsor" align-h="center">
                <image-upload-component parent="sponsor"/>
              </b-row>
            </b-col>

          </b-row>
      </b-container>
    </edit-event-side-component>

    <edit-event-side-component v-if="this.getSelectedEvent.setting.theme_id == 2" header-text="PRESENTER LOGOS">
      <b-container class="basic-info-body" slot="body">
          <b-row class="row-margin-bottom">
            <b-col cols="12">
              <label for="" class="input-label">Upload your presenter logos (drag to rearrange)</label>
            </b-col>

            <b-col>
              <b-row  align-v="center" class="upload-image-box organiser" align-h="center">
                <image-upload-component parent="organiser"/>
              </b-row>
            </b-col>

          </b-row>
      </b-container>
    </edit-event-side-component>

    
    <!-- <edit-event-side-component header-text="TYPEFACE">
      <b-container class="basic-info-body" slot="body">
          <b-row class="row-margin-bottom">
            <b-col cols="12">
              <label for="" class="input-label">Choose your font</label>
            </b-col>

            <div class="dropdown font-dropdown-menu">
              <button class="dropdown-toggle font-dropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="selected-font">Montserrat</span>
              </button>
              <div class="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenu2">
                <button class="dropdown-item" type="button" v-for="(font, index) in fonts" :key="index">{{font}}</button>
              </div>
            </div>
          </b-row>
      </b-container>
    </edit-event-side-component> -->
  </div>
</template>

<script>
import ActiveSiteColorBox from '../ActiveSiteColorBox'
import EventBus from '../../event-bus'
import { mapGetters, mapActions } from 'vuex'
import ColorPicker from '../ColorPicker'
import _ from 'lodash'

import { VueEditor, Quill } from "vue2-editor"

var Block = Quill.import("blots/block")
Block.tagName = "h5"
Quill.register(Block, true)

export default {
  name: 'side-gallery-design',
  data () {
    return {
      form: {},
      showColorPicker: false,
      defaultColors: [
        {name: 'Button Color', color: '#EC1C24', isActive: false, objectName: 'accent'},
        {name: 'Background Color', color: '#FFFFFF', isActive: false, objectName: 'background'},
        {name: 'Main Text Color', color: '#4A4A4A', isActive: false, objectName: 'text'},
        {name: 'Button Text Color', color: '#FFFFFF', isActive: false, objectName: 'link'}
      ],
      selectedColors: [],
      fonts: [
        'Arial',
        'Montserrat',
        'Times New Roman',
        'San serif'
      ],
      removeBrand: 1,
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "link", "header", "clean"],
      ],
    }
  },
  components: {
    ActiveSiteColorBox,
    ColorPicker,
    VueEditor,
  },
  methods: {
    ...mapActions('EditEvent', ['changeEventValues']),
    inputChange(fieldName) {
      var fieldValue = this.form[fieldName]
      // check if the fieldValue is String first
      if (is.string(fieldValue)) {
        // it is a string we can check it
        fieldValue = this.uglifyURL(fieldValue)
        // if (fieldValue.includes('<a href=')) {
        //   let newString = []
        //   console.log(`split - ${fieldValue.split('<a')}`)
        //   for (var s of fieldValue.split('<a')) {
        //     if (s.includes('href=')) {
        //       console.log(`s - ${s}`)
        //       // if (is.not.url(s)) {
        //       if (!s.includes('https://')) {
        //         s = this.insertHTTPS(s, 7)
        //       }
        //     }
        //     newString.push(s)
        //   }
        //   newString = newString.join('<a')
        //   fieldValue = newString
        // }
      }

      this.changeEventValues({
        fieldName,
        fieldValue: fieldValue,
      })
    },

    uglifyURL(text) {
      let vm = this
      var urlRegex = /href=[\'|\"]([^[\'|\"]*)/gi
      return text.replace(urlRegex, function (urlComponent) {
        let url = urlComponent.split('href="')[1]
        console.log(`url ${url} - isURL - ${is.url(url)}`)
        if (is.not.url(url) || is.not.include(url, "https://")) {
          url = "https://" + url
        }
        return `href="${url}"`
      })
    },

    openColor (color, index) {
      if(this.openingIndex != index) {
        color.isActive = true
        this.selectedColors.forEach((c, i) => {
          // eslint-disable-next-line
          i !== index ? c.isActive = false : ''
        })
      }
    },
    closeColor (index) {
      let closeThis = this.selectedColors[index]
      this.$set(this.selectedColors, index, {
        name: closeThis.name,
        color: closeThis.color,
        isActive: false,
        objectName: closeThis.objectName,
      })
    },
    inputChange (fieldName) {
      console.log(`change input: ${fieldName}`)
      this.changeEventValues({
        fieldName,
        fieldValue: this.form[fieldName]
      })
    },
    changed (color) {
      this.changeEventValues({
        fieldName: color.objectName,
        fieldValue: color.color,
        color: true
      })
    },
    isColorsLengthShort (colors) {
      return Object.keys(colors).length < 4
    },
    updateColor() {
      let vm = this;
      if (this.isColorsLengthShort(this.form.colors)) {
        this.selectedColors = this.defaultColors
        for (var i = 0; i < this.selectedColors.length; i++) {
          vm.changeEventValues({
            fieldName: this.selectedColors[i].objectName,
            fieldValue: this.selectedColors[i].color,
            color: true
          }).then(() => {
          })
        }
        this.$store.dispatch('Events/setEventSetting')
      } else {
        this.selectedColors = []
        for (let color in this.form.colors) {
          let bgColor = this.form.colors[color]
          let name = _.find(this.defaultColors, (o) => { return o.objectName == color })
          this.selectedColors.push({
            name: name? name.name : `${color} color`,
            isActive: false,
            color: bgColor,
            objectName: `${color}`
          })
        }
      }

      if(this.getEventSettings.colors != undefined && this.getEventSettings.colors instanceof Array) {
        for (const key in this.getEventSettings.colors) {
          if (this.getEventSettings.colors.hasOwnProperty(key)) {
            const colorCode = this.getEventSettings.colors[key];
            for (var i = 0; i < this.selectedColors.length; i++) {
              if(this.selectedColors[i].name.includes(key)) {
                this.selectedColors[i].color = colorCode
                break
              }
            }
          }
        }
      }
    },
    addRemoveMiroBranding () {
      // console.log('addRemoveMiroBranding', this.form.rt_brand)
      this.form.rt_brand = !this.removeBrand
      this.inputChange('rt_brand')
    },
    updateUrl() {
      setTimeout(()=> {
        this.inputChange('client_brand_url')
      }, 100)
    },
    loadLogo() {
      setTimeout(()=> {
        if(this.getEventSettings.rt_brand === 0 && this.getEventSettings.client_brand_image_id) {
          EventBus.$emit('show-img-preview', {parent: 'brand', url: this.getBrandUrl})
        }
      }, 1000)
    },
    loadLogo2() {
      setTimeout(() => {
        if (
          this.getEventSettings.logo &&
          this.getEventSettings.logo.url.indexOf("default-logo.png") < 0
        ) {
          EventBus.$emit("show-img-preview", {
            parent: "logo",
            url: this.getEventSettings.logo.url,
          })
        }
      }, 1000)
    },
  },
  computed: {
    ...mapGetters('EditEvent', ['getEventSettings', 'getOriginalForm']),
    ...mapGetters('Events', ['getSelectedEvent']),
    getBrandUrl() {
      let logo = '';
      if(this.getEventSettings && this.getEventSettings.rt_brand === 0 && this.getEventSettings.client_brand_image_id) {
        logo = this.getEventSettings.client_brand_image;
      }
      return logo;
    }
  },
  watch: {
    getEventSettings(newVal, oldVal) {
      console.log(newVal)
      this.form = newVal
      this.updateColor()
      this.removeBrand = !newVal.rt_brand
    },
    getBrandUrl(newVal, oldVal) {
      this.loadLogo()
    },
  },
  created() {
    console.log(`created`)
    let vm = this
    this.form = this.getEventSettings
    this.updateColor()
  },
  mounted () {
    console.log(`mounted`)
    // this.loadLogo();
    this.loadLogo2()
    if(this.getEventSettings) {
      this.removeBrand = !this.getEventSettings.rt_brand
    }
    EventBus.$on('close-color-picker', ({index, parent}) => {
      if(parent == 'design') {
        this.closeColor(index)
      }
    })

    EventBus.$on('change-color', ({ index, fieldValue, parent }) => {
      if(parent == 'design') {
        this.selectedColors[index].color = fieldValue
      }
    })

    EventBus.$on('reset-form', () => {
      this.form = JSON.parse(JSON.stringify(this.getOriginalForm))

      this.selectedColors = []
      if (this.isColorsLengthShort(this.form.colors)) {
        this.form.colors = this.defaultColors
      } else {
        for (let color in this.form.colors) {
          let bgColor = this.form.colors[color]
          let name = _.find(this.defaultColors, (o) => { return o.objectName == color })
          this.selectedColors.push({
            name: name? name : `${color} color`,
            isActive: false,
            color: bgColor,
            objectName: `${color}`
          })
        }
      }
    })

  }
}
</script>

<style lang="css" scoped>
  .edit-event-side-design {
    width: 100%;
    background: #eeeff3;
    color: #a8afb8;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    margin-bottom: 1.5em;
  }

  .basic-info-header {
    height: 2em;
    padding: 1em;
  }

  .basic-info-header-text {
    margin-bottom: 0;
    height: 100%;
  }

  .basic-info-body {
    background: #fff;
    padding-top: 1em;
    padding-bottom: 1em;
  }

  .check-mark {
    position: relative;
    right: 10px;
  }

  .gallery-type-box {
    background:#F4F8F9;
    padding: 1em 0;
    margin: 0.5em;
  }

  .upload-image-box {
    background:#F4F8F9;
    padding: 0;
    margin: 0.5em;
  }

  .input-label {
    padding-left: 0.5em;
  }

  .upload-btn {
    border: 1px solid #a8afb8;
    background: inherit;
    color: #a8afb8;
    padding: 0.75em 2em;
  }

  .color-box {
    padding: 1em;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  }

  .color-box-rows {
    width: 100%;
    padding-left: 2em;
    padding-bottom: 10px;
    max-height: 190px;
  }

  .color-name:hover {
    cursor: pointer;
  }

  .font-dropdown-menu {
    position: relative;
    left: 25px;
    color: #d8d8d8;
    width: 45%;
  }

  .font-dropdown {
    outline: 1px solid #ededed;
    width: 100%;
    padding: 0.7em;
  }

  .selected-font {
    float: left;
    color: #d8d8d8;
  }

  .dropdown-toggle::after {
    float: right;
    position: relative;
    top: 9px;
    color: #d8d8d8;
  }

  #color-picker-id {
    overflow: hidden;
  }

  .notPremiumAccount {
    opacity: 0.5;
  }
</style>
