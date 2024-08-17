<template>
  <div class="modal" tabindex="-1" role="dialog" id="enquiry-modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <p>{{  $t('modal.email-enquiry.heading') }}</p>
            <p class="header-description">{{ $t('modal.email-enquiry.sub-heading') }}</p>
          </div>
        </div>

        <div class="p-4">
          <input class="mb-3" v-model="name" :placeholder="$t('core.name')"/>
          <input class="mb-3" v-model="email" :placeholder="$t('core.email-address')"/>
          <textarea class="mb-3" v-model="content" :placeholder="$t('modal.email-enquiry.request-title')"></textarea>
        </div>
        
        <div class="buttons-grid">
          <button type="button" class="global-button" @click="closeModal">{{ $t('core.cancel') }}</button>
          <button type="button" :disabled="checkError" class="global-button global-submit-button" @click="confirm">{{  $t('core.send') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../../event-bus'
import $ from 'jquery'
import { mapGetters } from "vuex";

export default {
  name: 'email-enquiry-modal',
  data () {
    return {
      name: '',
      email: '',
      content: ''
    }
  },
  computed: {
    ...mapGetters("Auth", ["profile"]),
    checkError() {
      return this.name == '' || this.email == '' || this.content == '' || !this.validateEmail()
    }
  },
  methods: {
    confirm () {
      if(!this.checkError && this.profile) {
        this.$store.dispatch('Events/sendEnquiryEmail', {
          name: this.name,
          email: this.email,
          content: this.content,
          user_id: this.profile.user_id,
          user_email: this.profile.email,
        })
        this.closeModal();
      }
    },
    closeModal () {
      this.name = '';
      this.email = '';
      this.content = '';
      $('#enquiry-modal').modal('hide')
    },
    validateEmail() {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    }
  },
  mounted() {
    EventBus.$on('show-enquiry-modal', () => {
      $('#enquiry-modal').modal('show')
    })
  }
}
</script>

<style scoped lang="css">
  .modal-header {
    background: var(--main-theme);
    color: #d6eef8;
    font-size: 30px;
    padding: 1em 1.2em 0.5em;
    margin-bottom: 0;
    font-weight: 300;
  }

  .header-description {
    font-size: 14px;
  }

  .buttons-grid {
    display: grid;
    padding: 2em;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
  }

  .modal.show .modal-dialog {
    top: 15%;
  }

  .description {
    text-align: center;
    margin-top: 2em;
    color: var(--grey-text);
  }

  #enquiry-modal input, #enquiry-modal textarea {
    border: none;
    border-bottom: 1px solid #cdd0d5;
    width: 100%;
    padding-bottom: 0.25em;
    resize: none;
    color: var(--input-text-color);
  }

  #enquiry-modal input:focus, #enquiry-modal textarea:focus {
    box-shadow: none;
    outline: none;
  }

  button:disabled {
    
  }

</style>
