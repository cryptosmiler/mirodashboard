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
      <slot name="input-slot"></slot>
    </b-col>
    <b-col v-show="show_character_count"  :class="{isRed : charLimit}">
      <span 
        class="word-count"
        >{{character_count}}/{{character_limit}}</span>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'edit-event-side-component-text-input',
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
    show_character_count: {
      type: Boolean,
      required: false,
      default: false
    },
    character_count: {
      type: Number,
      required: false
    },
    character_limit: {
      type: Number,
      required: false
    },
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
    }
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
  input, textarea {
    border: none;
    border-bottom: 1px solid #cdd0d5;
    width: 100%;
    padding-bottom: 0.5em;
    resize: none;
    color: var(--input-text-color)
  }

  textarea {
    height: 6em;
    overflow: hidden;
  }

  input::placeholder, textarea::placeholder {
    color: #cdd0d5;
  }

  input:focus, textarea:focus {
    outline: none;
  }

  .requiredBlue {
    color: var(--main-theme);
  }

  .word-count {
    float: right;
    font-size: 12px;
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
