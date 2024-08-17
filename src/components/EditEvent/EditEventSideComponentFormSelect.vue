<template lang="html">
  <b-row>
    <b-col cols="2" md="1">
    </b-col>
    <b-col cols="9" md="11">
      <label for="" class="input-label" :class="{ requiredBlue: required }">{{input_title}}</label>
    </b-col>
    <b-col cols="2" md="1" class="icons text-right">
      <i :class="icon_class"></i>
    </b-col>
    <b-col cols="10" md="11">
      <slot></slot>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'edit-event-side-component-form-select',
  data () {
    return {
      form: {
        event_title: ''
      }
    }
  },
  computed: {
    charLimit () {
      return this.character_count >= this.character_limit
    }
  },
  props: {
    input_title: {
      type: String,
      required: true
    },
    icon_class: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  mounted () {
    this.$el.childNodes[6].childNodes[0].onfocus = function () {
      this.parentNode.classList.add('focused')
    }

    this.$el.childNodes[6].childNodes[0].onblur = function () {
      this.parentNode.classList.remove('focused')
    }
  }
}
</script>

<style lang="css" scoped>
  select {
    border: none;
    border-bottom: 1px solid #cdd0d5;
    width: 100%;
    padding-bottom: 0.5em;
    resize: none;
    color: var(--input-text-color)
  }

  select:focus {
    outline: none;
  }

  .requiredBlue {
    color: var(--main-theme);
  }

  .row-margin-bottom {
    margin-bottom: 1em;
  }

  .icons {
    font-size:1.5em;
    color: #9FA9BA;
  }

  .focused + .isRed{
    color: red;
  }

  @keyframes turnRed {
    from {color: red;}
    to {color: #a8afb8;}
  }
</style>
