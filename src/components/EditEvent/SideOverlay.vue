<template lang="html">
  <div style="width:100%;">
    <edit-event-side-component :required="false" header-text="" :header-show="false">
        <b-container class="info-body" slot="body">
          <b-row>
            <b-col cols="10">
              <label for="">Add Overlay</label>
            </b-col>
            <b-col cols="2">
              <label class="switch">
                <input type="checkbox" v-model="form.add_overlay" @change="addRemoveOverlay()">
                <span class="slider round"></span>
              </label>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="10">
              <label for="">Enable finish time as overlay</label>
            </b-col>
            <b-col cols="2">
              <label class="switch">
                <input type="checkbox" v-model="form.finish_time_overlay_enabled" @change="addRemoveFinishTimeOverlay()">
                <span class="slider round"></span>
              </label>
            </b-col>
          </b-row>

          <b-row :class="{ notPremiumAccount : isNotPremiumAccount }">
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
                <input type="checkbox" v-model="form.remove_miro_branding" @change="addRemoveMiroBranding()" :disabled="isNotPremiumAccount">
                <span class="slider round"></span>
              </label>
            </b-col>
          </b-row>
        </b-container>
    </edit-event-side-component>


    <edit-event-side-component :required="false" header-text="Customize Photo Overlay" v-show="form.add_overlay">
        <b-container class="basic-info-body" slot="body">
          <b-row>
            <b-col>
              <label for="">Upload Right Logo Overlay</label>
              <span
                v-if="getEventOverlay && getEventOverlay.overlay && getEventOverlay.overlay.right.media_id && getEventOverlay.overlay.right.media_id > 1"
                class="primary-color cursor-pointer float-right" @click="deleteOverlay('right')"
              >Remove</span>
            </b-col>
          </b-row>

            <b-row  align-v="center" class="upload-image-box" align-h="center">
              <image-upload-component parent="right"/>
            </b-row>

          <b-row>
            <b-col>
              <label for="">Upload Left Logo Overlay</label>
              <span
                v-if="getEventOverlay && getEventOverlay.overlay && getEventOverlay.overlay.left.media_id && getEventOverlay.overlay.left.media_id > 1"
                class="primary-color cursor-pointer float-right" @click="deleteOverlay('left')">Remove</span>
            </b-col>
          </b-row>

          <b-row  align-v="center" class="upload-image-box" align-h="center">
            <image-upload-component parent="left"/>
          </b-row>

          <b-row class="row-margin-bottom">
            <b-col cols="12">
              <label for="" class="input-label">Position</label>
            </b-col>

            <div class="dropdown position-dropdown-menu">
              <button class="dropdown-toggle position-dropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="selected-position">
                  <span style="float:left;">
                    {{form.position}}
                  </span>
                  <img
                    :src="form.positionImg"
                    class="position-img"
                    style="position: relative;top: 3px;">
                </span>
              </button>
              <div class="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenu2">
                <button
                  class="dropdown-item"
                  type="button"
                  v-for="(position, index) in positions"
                  :key="index"
                  @click="selectPosition(position)">
                  {{position.name}}
                  <img :src="position.img" class="position-img">
                </button>
              </div>
            </div>
          </b-row>

          <b-row class="row-margin-bottom">
            <b-col cols="10">
              <label for="">Add Background Mask</label>
            </b-col>
            <b-col cols="2">
              <label class="switch">
                <input type="checkbox" v-model="form.add_background_mask" @change="addRemoveBackgroundMask()">
                <span class="slider round"></span>
              </label>
            </b-col>
          </b-row>

          <b-row class="row-margin-bottom" v-show="form.add_background_mask">
            <b-row v-for="(color, index) in colors" :key='index' class="color-box-rows" >
              <b-col cols="2" @click="openColor(color, index)">
                <div class="color-box" :style="{background: color.color}">

                </div>
              </b-col>

              <b-col cols="10" align-self="center" @click="openColor(color, index)">
                <span class="color-name">{{color.name}}</span>
              </b-col>
              <transition name="slide">
                <color-picker :name="color.name" :propColor="color.color" objectName="overlay" v-if="color.isActive" :index="index" parent="overlay" id="color-picker-id"/>
              </transition>
            </b-row>
          </b-row>

          <b-row class="row-margin-bottom" v-show="form.add_background_mask">
            <b-col cols="12">
              <label for="">Background Opacity</label>
            </b-col>
            <b-col class="col-slider">
              <vue-slider
                ref="slider"
                v-model="value"
                :interval="10"
                :piecewise="true"
                formatter="{value}%"
                v-if="true"
                :show="true"
                @callback="changeOpacity()"
                :tooltipStyle="tooltipStyle"
                style="padding: 8px 0;">
              </vue-slider>
            </b-col>
          </b-row>
        </b-container>
    </edit-event-side-component>
  </div>
</template>

<script>
import EventBus from '../../event-bus'
import vueSlider from 'vue-slider-component'
import {mapGetters} from 'vuex'

export default {
  name: 'edit-event-side-overlay',
  data () {
    return {
      hasChanges: false,
      colors: [
        {name: 'Background Color', color: '#EC1C24', isActive: false}
      ],
      form: {
        add_overlay: false,
        finish_time_overlay_enabled: false,
        remove_miro_branding: false,
        overlay: false,
        add_background_mask: false,
        positionId: 4,
        position: 'Bottom',
        positionImg: require('../../assets/bottom.png')
      },
      positions: [
        {id: 1, name: 'Top', img: require('../../assets/top.png')},
        {id: 2, name: 'Top -20%', img: require('../../assets/top-20.png')},
        {id: 3, name: 'Bottom -20%', img: require('../../assets/bottom-20.png')},
        {id: 4, name: 'Bottom', img: require('../../assets/bottom.png')}
      ],
      value: 60,
      tooltipStyle: {
        'backgroundColor': `var(--main-theme);`,
        'opacity': '0.5'
      },
      isNotPremiumAccount: true
    }
  },
  methods: {
    changeOpacity (reset = false) {
      let opacity = `${this.value / 100}`

      this.tooltipStyle.opacity = 1
      this.tooltipStyle.color = '#fff'
      this.tooltipStyle.backgroundColor = 'var(--main-theme);'
      this.tooltipStyle.border = '1px solid var(--main-theme);'

      if(!reset) {
        this.$store.dispatch("Events/setEventOverlayValue",{key: 'opacity', value: opacity})
      }
    },
    addRemoveOverlay () {
      console.log(this.form.add_overlay)
      this.$store.dispatch("Events/setEventOverlayValue",{key: 'enabled', value: this.form.add_overlay})
    },
    addRemoveFinishTimeOverlay() {
      console.log(this.form.finish_time_overlay_enabled)
      this.$store.dispatch("Events/setEventFinishTimeOverlay",{key: 'enabled', value: this.form.finish_time_overlay_enabled})
    },
    addRemoveMiroBranding () {
      console.log(this.form.remove_miro_branding)
    },
    switchOverlay () {
      console.log(this.form.overlay)
    },
    addRemoveBackgroundMask () {
      console.log(this.form.add_background_mask)
      this.$store.dispatch("Events/setEventOverlayValue",{key: 'mask_enabled', value: this.form.add_background_mask})
    },
    selectPosition (position) {
      this.form.position = position.name
      this.form.positionImg = position.img
      this.form.positionId = position.id
      this.$store.dispatch("Events/setEventOverlayValue",{key: 'position', value: this.form.positionId})
    },
    openColor (color, index) {
      color.isActive = true
      this.colors.forEach((c, i) => {
        // eslint-disable-next-line
        i !== index ? c.isActive = false : ''
      })
    },
    closeColor (index) {
      let closeThis = this.colors[index]
      this.$set(this.colors, index, {
        name: closeThis.name,
        color: closeThis.color,
        isActive: false
      })
    },
    deleteOverlay(cases) {
      let overlayRequest = this.getEventOverlay
      if(overlayRequest.overlay[cases].media_id) {
        EventBus.$emit('remove-img-preview', {parent: cases})
        overlayRequest.overlay[cases] = {media_id: -1, position: 4}
        this.$store.dispatch('Events/setEventOverlayValue', {key: cases, value: 4})
      }
    }
  },
  computed: {
    ...mapGetters('EditEvent', ['getOriginalForm', 'getIsDifferent']),
    ...mapGetters('Events', ['getEventOverlay', 'getSelectedEvent']),
    getOverlay() {
      return this.getEventOverlay
    },
    selectedEvent() {
      return this.getSelectedEvent
    }
  },
  watch: {
    selectedEvent(newSelectedEvent, oldSelectedEvent) {
      if(Object.keys(newSelectedEvent).length > 0) {
        this.form.finish_time_overlay_enabled = newSelectedEvent.finish_time_overlay_enabled
      }
    },
    getOverlay(newOverlay, oldOverlay) {
      if(Object.keys(newOverlay).length > 0) {
        this.form.add_overlay = newOverlay.enabled
        if(newOverlay.overlay != null) {
          this.form.positionId = newOverlay.overlay.position == null ? 1 : newOverlay.overlay.position
          this.form.position = this.positions[this.form.positionId-1].name
          this.form.positionImg = this.positions[this.form.positionId-1].img
          this.form.add_background_mask = newOverlay.overlay.mask_enabled
          this.tooltipStyle.opacity = newOverlay.overlay.mask.opacity
          this.value = newOverlay.overlay.mask.opacity*100
          this.changeOpacity(true)
          this.$refs.slider.refresh()
          if(newOverlay.overlay.mask.color) {
            this.colors.forEach(color => {
              if(color.name == 'Background Color') {
                color.color = newOverlay.overlay.mask.color
              }
            })
          }
          if(newOverlay.overlay.left.media_id != null) {
            EventBus.$emit('show-img-preview', {parent: 'left', url: newOverlay.overlay.left.url})
          }
          if(newOverlay.overlay.right.media_id != null) {
            EventBus.$emit('show-img-preview', {parent: 'right', url: newOverlay.overlay.right.url})
          }
        }
      }
    }
  },
  mounted () {
    EventBus.$on('close-color-picker', ({index, parent}) => {
      if(parent && parent == 'overlay') {
        this.closeColor(index)
      }
    })

    EventBus.$on('change-color', (payload) => {
      if(payload && payload.parent == 'overlay') {
        this.colors[payload.index].color = payload.fieldValue ? payload.fieldValue : '#CCCCCC'
        this.$store.dispatch("Events/setEventOverlayValue",{key: 'color', value: payload.fieldValue})
      }
    })

    EventBus.$on("save-overlay", () => {
      this.hasChanges = false
    })

    EventBus.$on('click-overlay', () => {
      setTimeout(()=> {
        if(this.$refs.slider && this.$refs.slider.currentValue) {
          this.$refs.slider.currentValue = this.value
          this.$refs.slider.refresh()
        }
      })
    })
  },
  components: {
    vueSlider
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.slider.refresh()
    })
  }
}
</script>

<style lang="css" scoped>
  .basic-info-body {
    background: #fff;
    padding: 1em 2em;
  }

  .info-body {
    background: #fff;
    padding: 2em 2em 1em 2em;
  }

  .row-margin-bottom {
    margin-bottom: 2em;
  }

  .icons {
    font-size:1.5em;
    color: #9FA9BA;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 35px;
    height: 20px;
  }

  .position-dropdown-menu {
    position: relative;
    left: 15px;
    width: 92%;
    font-size: 14px;
    color: #9FA9BA;
    text-align: center;
    border: 1px solid;
  }

  .position-dropdown {
    width: 100%;
    padding: 0.7em 0;
    border: none;
    background: none;
  }

  .selected-position {
    float: left;
    color: #9FA9BA;
    padding: 0 1em;
    font-size: 18px;
    width: 100%;
  }

  .dropdown-toggle::after {
    float: right;
    position: relative;
    top: -15px;
    color: #d8d8d8;
    font-size: 20px;
    left: -45px;
  }

  .dropdown-toggle[aria-expanded="true"]::after {
    transform: rotate(180deg);
  }

  .dropdown-item {
    min-width: 100%;
    padding: 0em 1em;
    font-size: 18px;
    display: inline-block;
    color: #9FA9BA;
  }

  .position-img {
    position: relative;
    float: right;
  }

  .color-name:hover {
    cursor: pointer;
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
    height: 15px;
    width: 15px;
    left: 3px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .primary-color {
    color: var(--main-theme);
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

  .upload-image-box {
    background:#F4F8F9;
    padding: 0;
    margin: 0.5em;
    /* height: 10em; */
    margin-bottom: 2em;
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
    padding-left: 1em;
    padding-bottom: 10px;
    max-height: 190px;
  }

  #color-picker-id {
    overflow: hidden;
  }

  .col-slider {
    margin: 2em 0;
  }

  .col-slider:hover {
    cursor: pointer;
  }

  .notPremiumAccount {
    opacity: 0.5;
  }

  .cursor-pointer {
    cursor: pointer;
  }
</style>
