<template lang="html">
  <b-container fluid class="section">
    <b-row class="header" align-v="center" align-h="between" v-show="headerShow">
      <b-col>
        <p class="label">
          <i :class=icon></i>
          {{headerText}}
        </p>
      </b-col>
      <b-col cols="5" md="5" class="header-right">
        <p class="required" v-show="required" style="float: right;">
          *required fields
        </p>
        <p class="tooltip-indicator" v-show="showTooltip"><i class="fa fa-info-circle" aria-hidden="true"></i></p>
        <div class="side-tooltip">
          <slot name="tooltip">
            Hello World
          </slot>
        </div>
      </b-col>
    </b-row>
    <slot name="body"></slot>
  </b-container>
</template>
 
<script>
export default {
  name: "edit-event-side-component",
  props: {
    icon: {
      type: String,
      required: false
    },
    headerText: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      required: false
    },
    headerShow: {
      type: Boolean,
      required: false,
      default: true
    },
    // stickerHelpText: {
    //   type: Boolean,
    //   required: false
    // }
  },
  computed: {
    showTooltip () {
      return !!(this.$slots.tooltip || [])[0]
    },
  }
};
</script>

<style lang="scss" scoped>

input,
textarea {
  border: none;
  border-bottom: 1px solid #cdd0d5;
  width: 100%;
  padding-bottom: 0.5em;
  resize: none;
}

textarea {
  height: 6em;
  overflow: hidden;
}

input::placeholder,
textarea::placeholder {
  color: #cdd0d5;
}

input:focus,
textarea:focus {
  outline: none;
}

.word-count {
  float: right;
  font-size: 12px;
}

.row-margin-bottom {
  margin-bottom: 1em;
}

.icons {
  font-size: 1.5em;
  color: #9fa9ba;
}

.undo-save-buttons {
  background: var(--main-theme);
  border: 1px solid rgba(151, 151, 151, 0.24);
}

.undo-save {
  background: var(--main-theme);
  box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  font-size: 15px;
  color: #ffffff;
  width: 100%;
  padding: 1em;
  border: none;
  font-weight: 500;
}

.undo-save:hover {
  background: #9fa9ba;
}

.save {
  background: var(--main-theme);
}

.undo-save.disabled {
  opacity: 0.5;
  background: var(--main-theme);
}

.col-undo-save {
  padding: 1em;
}

.header-right {
  position: relative;
  .tooltip-indicator {
    /* left: 40px; */
    top: 3px;
    float: right;
    color: #afb7c3;
    &:hover + .side-tooltip {
      visibility: visible;
    }
  }
  .side-tooltip {
    visibility: hidden;
    width: 320px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    left: 14em;
    text-align: center;
    border-radius: 10px;
    padding: 10px 15px;
    font-family: 'Roboto';
    font-size: 14px;
    /* Position the tooltip */
    position: absolute;
    z-index: 1;
    line-height: 18px;
    hr {
      border-color: #cccccc;
    }
  }
}



</style>
