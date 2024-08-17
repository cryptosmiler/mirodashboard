<template>
  <div class="create-event-wizard">
    <div class="wizard-header">
      <p class="header-title">{{ headerTitle }}</p>
      <p class="header-description">{{ headerDescription }}</p>
      <!-- <p class="header-step">Step {{ step }} of 2</p> -->
    </div>

    <slot name="wizard-body" class="wizard-body">

    </slot>

    <div class="wizard-footer-buttons">
      <!-- <button
        class="left-button"
        :class="{purple: bottomLeftButton.purpleButton}"
        @click="navigateButton(bottomLeftButton)"
        >
        {{bottomLeftButton.text}}
      </button> -->
      <button
        class="right-button"
        :class="{purple: bottomRightButton.purpleButton}"
        @click="navigateButton(bottomRightButton)"
        :disabled="disabled"
        >
        {{bottomRightButton.text}}
      </button>
    </div>
  </div>
</template>

<script>

import EventBus from '../event-bus'

export default {
  name: 'create-event-wizard',
  data () {
    return {
      submitting: false,
      disabled: true
    }
  },
  props: {
    step: {
      type: Number,
      required: true
    },
    headerTitle: {
      type: String,
      required: true
    },
    headerDescription: {
      type: String,
      required: true
    },
    bottomLeftButton: {
      type: Object,
      required: false
    },
    bottomRightButton: {
      type: Object,
      required: false
    }
  },
  methods: {
    navigateButton (btn) {
      if(!this.disabled) {
        if (btn.router === 'next') {
          // this.$store.dispatch('changeStep', 2)
        } else if (btn.router === 'dashboard') {
          this.$router.push('dashboard')
        } else if (btn.router === 'back') {
          // this.$store.dispatch('changeStep', 1)
        } else if (btn.router === 'submit' && !this.submitting) {
          this.submitting = true
          EventBus.$emit('create-event')
        }
      }
    },
    setDisabled(disabled) {
      this.disabled = disabled
    }
  },
  mounted() {
    EventBus.$on('start-create-event', () => {
      this.submitting = false
    })
  },
}
</script>

<style lang="css" scoped>
  .create-event-wizard {
    display: grid;
    grid-template-rows: 8em auto;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }

  .wizard-header {
    background: var(--main-theme);
    color: #fff;
    display: grid;
    grid-template-rows: 60% 30%;
    grid-template-columns: 70% 30%;
    padding: 1em 2em 1em;
  }

  .header-title {
    grid-column: 1 / 3;
    font-size: 28px;
  }

  .header-step {
    justify-self: end;
  }

  .wizard-body {
    display: grid;
    background: #fff;
  }

  .wizard-footer-buttons {
    display: grid;
    grid-template-columns: 1fr;
    background: #fff;
    padding: 1em;
    grid-gap: 20px;
  }

  .wizard-footer-buttons button {
    border: none;
    color: var(--blue);
  }

  .wizard-footer-buttons .purple {
    background: var(--main-theme);
    color: #fff;
    padding: 0 1.5em;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.05);
    border-radius: 2px;
    font-weight: bold;
    height: 3em;
    align-self: center;
  }

  .left-button {
    padding: 0 1.5em;
    -webkit-box-shadow: 0 5px 10px 0 rgba(0,0,0,0.05);
    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.05);
    border-radius: 2px;
    font-weight: bold;
    height: 3em;
    -ms-flex-item-align: center;
    align-self: center;
  }

  .left-button:hover {
    color: #6c757d;
    background-color: rgba(153, 153, 153, 0.2);
    border-color: rgba(153, 153, 153, 0.2);
  }

  .right-button:hover {
    opacity: 0.9;
  }

  .right-button:disabled {
    cursor: auto;
    opacity: 0.2;
  }

  button:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) { 
    .header-step, .header-description {
      font-size: 13px;
      position: relative;
      top: 5px;
      
    }
  }
</style>
