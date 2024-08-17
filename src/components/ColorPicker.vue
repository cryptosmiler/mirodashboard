<template lang="html">
  <transition name="slide">
  <div class="color-picker-container" ref="colorPicker">
    <b-container fluid>
      <b-row no-gutters align-v="center">
        <b-col cols="2">
          <div class="color-box" :style="{background: propColor}">

          </div>
        </b-col>
        <b-col cols="9">
          <span class="color-text">{{name}}</span>
        </b-col>
        <b-col cols="1">
          <button type="button" name="button" id="close-color-picker" @click="closeColorPalette"><i class="material-icons">clear</i></button>
        </b-col>

      </b-row>
    </b-container>
    <material-picker v-model="colors" id="material-picker-id" @input="updateValue" name="materialPicker"/>
    <compact-picker v-model="colors" id='compact-picker-id' @input="updateValue" name="compactPicker"/>
  </div>
  </transition>
</template>

<script>
import { Compact, Material } from 'vue-color'
// eslint-disable-next-line
import Vue from 'vue'
import EventBus from '../event-bus'

export default {
  name: 'color-picker',
  data () {
    return {
      colors: '#194d33',
      color: {
        name: 'Link Color'
      }
    }
  },
  props: {
    objectName: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    propColor: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    parent: {
      type: String,
      required: true
    }
  },
  components: {
    'compact-picker': Compact,
    'material-picker': Material
  },
  mounted() {
    console.log(`color Picker - ${this.propColor}`)
    console.log(`color Picker - ${this.colors}`)
    this.colors = this.propColor

  },
  methods: {
    updateValue (selectedValue) {
      this.colors = selectedValue.hex
      let payload = {
        fieldName: `colors.${this.objectName}`,
        fieldValue: selectedValue.hex,
        index: this.index,
        parent: this.parent
      }
      if(this.objectName != undefined && this.objectName != 'undefined') {
        if(this.objectName != 'overlay') {
          this.$store.dispatch('EditEvent/changeEventValues', payload)
        }
        EventBus.$emit('change-color', payload)
      }
    },
    closeColorPalette () {
      EventBus.$emit('close-color-picker', {index: this.index, parent: this.parent})
    },
    documentClick (e) {
      // let el = this.$refs.colorPicker
      // let target = e.target
      // if (!el.contains(target)) {
      //   EventBus.$emit('close-color-picker', this.index)
      // }
    }
  },
  created () {
    document.addEventListener('click', this.documentClick)
  },
  destroyed () {
    document.removeEventListener('click', this.documentClick)
  },
}
</script>

<style lang="css" scoped>
#material-picker-id {
  width: 100%;
  height: 30%;
  padding: 0 1em;
  box-shadow: none;
  display: flex;
}

#material-picker-id > div.vc-editable-input.vc-material-hex {
  max-width: 20%;
  display: inline-block;
  float: left;
  margin-right: 1em;
  border-bottom: none;
  position: relative;
  top: 11px;
  box-shadow: none;
}

#material-picker-id > div.vc-material-split > div {
  float: right;
  max-width: 15%;
}

#compact-picker-id {
  width: 100%;
  box-shadow: none;
  padding: 1em;
  padding-top: 0;
}

#compact-picker-id > ul > li {
  width: 6.3%;
  height: 18px;
  margin: 3px;
}

.color-picker-container {
  background: #fff;
  display: inline-block;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
  max-width: 360px;
  padding-top: 10px;
  position: relative;
  top: -45px;
  margin-top: 5px;
  z-index: 1;
}

.color-picker-container:hover {
  cursor: pointer;
}

#close-color-picker {
  float: right;
  position: relative;
  z-index: 1;
  color: #a8afb8;
  left: 10px;
  border: none;
  background-color: #fff;
}

#close-color-picker:hover {
  cursor: pointer;
}

.color-box {
  padding: 16px;
  width: 32px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  margin-bottom: 3px;
}

.color-box:hover {
  cursor: pointer;
}

.color-text {
  position: relative;
  left: 7px;
}

.color-text:hover {
  cursor: pointer;
}

.slide-leave-active {
  transition: 0.2s ease;
}
.slide-enter-active {
  transition: 0.2s ease;
}
.slide-enter {
  opacity: 0;
  transform: translate(0, -100%);
  overflow: hidden;
}
.slide-leave-to {
  opacity: 0;
  transform: translate(0, -100%);
  overflow: hidden;
}

@media only screen and (max-width: 768px) {
  #compact-picker-id > ul > li {
    width: 6%;
    height: 16px;
    margin: 3px;
  }
}
</style>
