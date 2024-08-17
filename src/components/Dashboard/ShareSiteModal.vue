<template>
  <b-modal 
    ref="shareInviteSiteModal"
    hide-header
    hide-footer
    class="share-invite-site-modal"
    id="share-invite-site-modal" 
    body-class="px-0 py-0"
    role="dialog"
    dialog-class="dialog-position"
    >
      <div class="share-site-header">
        <p class="modal-title" v-show="state === 0">Share Review Link</p>
        <p class="modal-title" v-show="state === 1">Share Event Link</p>
      </div>
      <div class="share-site-body">
        <b-form @submit="onShareLink" class="sign-in-form">
          <div class="input-div">
            <label for="email-confirm">Email</label> 
            <span class="input-span">
              <input type="email" class="share-email" 
                            spellcheck="false" v-model="email">
            </span>
          </div>
          <div v-show="state === 0">
            <p class="pin-number">
              <span>PIN:</span>
              <span class="number">{{getPin}}</span>
            </p>
            <p class="note">Note: Any user with this PIN may view your event.</p>
          </div>
          <button type="submit" class="share-review-button" :disabled="!signInDisabled" :class="{disabled: !signInDisabled}">SHARE REVIEW LINK &amp; PIN</button>
        </b-form>
      </div>
      <div class="modal-footer">
        <p class="copy-review-link">Copy review link:</p>
        <p class="url-copy"
          @click="copyLink"
        ><u>{{event.url}}</u> <i class="fas fa-link"></i></p>
      </div>
    </b-modal>
</template>

<script>
import * as clipboard from "clipboard-polyfill"
import EventBus from '../../event-bus.js'

export default {
  data () {
    return {
      email: '',
    }
  },
  props: {
    event: {
      type: Object,
      required: true
    },
    state: {
      type: Number,
      default: 0
    }
  },
  computed: {
    signInDisabled () {
      // eslint-disable-next-line
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.email).toLowerCase())
    },
    getPin() {
      return this.$store.getters['Events/getSelectedEvent'].setting ? this.$store.getters['Events/getSelectedEvent'].setting.pin : ''
    }
  },
  mounted() {
    EventBus.$on('open-share-review-link-modal', () => {
      console.log('show bus')
      this.$refs.shareInviteSiteModal.show()
    })
    EventBus.$on('close-share-review-link-modal', () => {
      console.log('close bus')
      this.$refs.shareInviteSiteModal.hide()
    })
  },
  beforeDestroy () {
    EventBus.$off('open-share-review-link-modal')
    EventBus.$off('close-share-review-link-modal')
  },
  methods: {
    copyLink () {
      clipboard.writeText(this.event.url)

      this.$toasted.global.link_copied()
    },
    onShareLink(e) {
      e.preventDefault()
      const pin = this.$store.getters['Events/getSelectedEvent'].setting ? this.$store.getters['Events/getSelectedEvent'].setting.pin : ''
      const eventTitle = this.$store.getters['Events/getSelectedEvent'].setting ? this.$store.getters['Events/getSelectedEvent'].setting.title : ''
      
      let payload = {
        race: {
          name: eventTitle,
          pin: pin,
          link: `${this.event.url}/#/?pin=${pin}`
        },
        to: [
          {
            email: this.email
          }
        ]
      }
      this.$store.dispatch('Events/sendReviewLinkEmail', payload, {root: true})
    }
  },
}
</script>

<style scoped lang="css">
  .share-site-modal {
    /* display: grid;
    grid-template-rows: 6em auto;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); */
    width: 355px;
  }

  .share-site-header {
    background: var(--main-theme);
    color: #d6eef8;
    font-size: 30px;
    padding: 1em 1.2em 0.5em;
    margin-bottom: 0;
    font-weight: 300;
  }

  .share-site-body {
    display: grid;
    padding: 2em;
    padding-bottom: 0em;
  }

  .input-div {
    margin-bottom: 2em;
  }

  input[type=text] {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #ccc;
    padding-bottom: 0.5em;
  }

  input[type=text]:focus {
    box-shadow: none;
    border-bottom: 1px solid var(--main-theme);
    outline: none;
  }

  .input-div label{
    font-weight: bold;
    font-size: 14px;
    color: #9ea9b8;
  }

  input {
    color: #9ea9b8;
    line-height: 2.5em;
    width: 100%;
  }

  .input-span {
    display: block;
    overflow: hidden;
  }

  .url-copy {
    color: var(--main-theme);
    justify-self: end;
  }

  .url-copy:hover {
    cursor: pointer;
  }

  .copy-review-link {
    color: var(--miro-grey);
    justify-content: start;
  }

  .pin-number {
    text-align: center;
    font-size: 30px;
  }

  .number {
    color: var(--main-theme);
  }

  .note {
    color: var(--miro-grey);
    text-align: center;
  }

  .modal-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0.5em 2em;
  }

  .share-review-button {
    background: var(--main-theme);
    width: 100%;
    border-radius: 0;
    font-weight: bold;
    margin: 1.5em 0;
    color: #fff;
    padding: 1.5em;
    border: none;
  }

  .share-review-button.disabled {
    background: #e3e6eb;
    color: #c4d4db;
  }

  .share-review-button:hover {
    cursor: pointer;
  }
</style>

<style lang="css">
  #share-invite-site-modal .modal-dialog {
    top: 15%;
  }
</style>