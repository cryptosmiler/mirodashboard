<template lang="html">

<div class="square">
  <div class="grey-header"></div>

  <div class="content">
      <b-row no-gutters style="width: 90%;">
        <b-col cols="11">
          <b-row class="body-color-line" no-gutters>
            <b-col cols="6" :style="{background: textColor}" class="text-color">
            </b-col>
            <b-col cols="3" :style="{background: linkColor}" class="link-color">
            </b-col>
          </b-row>

         <img src="../assets/sitePreviewSquares.svg" style="width:90%;">
        </b-col>

        <b-col cols="1" class="accent-color-boxes">
          <div class="accent-color-box" :style="{background: accentColor}">

          </div>

          <div class="accent-color-box" :style="{background: backgroundColor}">

          </div>
        </b-col>
      </b-row>
  </div>
</div>


</template>

<script>
export default {
  data () {
    return {
      boxes: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  },
  props: {
    colors: {
      type: Object,
      required: true,
      default: function () {
        return {
          text: 'blue',
          link: 'green',
          accent: '#161664',
          background: '#161664'
        }
      }
    }
  },
  computed: {
    textColor () {
      return this.colors.text
    },
    linkColor () {
      return this.colors.link
    },
    accentColor () {
      return this.colors.accent
    },
    backgroundColor () {
      return this.colors.background
    }
  }
}
</script>

<style lang="css" scoped>


.square {
  position: relative;
  width: 75%;
  margin: auto;
  text-align: center;
  box-shadow: 0px 3px 20px #ccc;
  max-width: 8em;
}

.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.content {
  padding: .5em;
  position: absolute;
  width: 100%;
  height: 100%;
}


  .grey-header {
    background: #f5f6f8;
    height: 0.5em;
    padding: 0;
  }

 

  .body-color-line {
    height: 0.4em;
    margin-bottom: 4px;
    padding-left: 2px;
  }

  .text-color {
    margin-right: 2px;
  }

  .background-color-boxes {
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 5px;
  }

  .background-color-box {
    height: 17px;
    max-width: 17px;
    padding: 0;
    margin: 1px;
    background: #ccc;
  }

  .accent-color-boxes {
    margin-top: 10px;
    position: relative;
  }

  .accent-color-box {
    height: 5px;
    min-width: 10px;
    padding: 0;
    margin-bottom: 2px;
  }
</style>
