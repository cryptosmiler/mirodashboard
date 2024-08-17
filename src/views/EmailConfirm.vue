<template>
  <div class="email-confirm">
    <miro-style-modal
      header="Confirm Email"
      class="confirm-email-modal"
      v-show="!incorrect && !confirmed"
    >
    <div slot="body" class="confirm-email-body">
      <span v-show="!sentCode" style="height: 50px;">Enter your Confirmation Code</span>
      <span v-show="sentCode" style="height: 50px;">A new code has been sent. Please check your email</span>

      <div class="input-div">
        <label for="code-confirm">Code</label>
        <span class="input-span"><input type="number" id="code-confirm" v-model="form.code"></span>
      </div>
      <button class="confirm-email-go" @click="attemptConfirmation">Go</button>
    </div>
    </miro-style-modal>

    <miro-style-modal
      title="Confirm Email"
      class="confirm-email-modal"
      v-show="incorrect"
    >
    <div slot="body" class="try-again">
      <span v-show="!errorSending">Sorry, that code does not match the email</span>
      <span v-show="errorSending">There was an error. Please check you entered the code correctly correctly</span>

      <div class="try-again-buttons">
        <button class="confirm-email-go" @click="incorrect = false">Try Again</button>
        <button class="confirm-email-go" @click="resendCode">Resend Code</button>
      </div>
    </div>
    </miro-style-modal>

    <miro-style-modal
      header="Email Confirmed"
      class="confirm-email-modal"
      v-show="confirmed"
    >
    <div slot="body" class="try-again">
      <p>Your email is confirmed</p>
      <button class="confirm-email-go" @click="goSignIn">Please Sign In</button>
    </div>
    </miro-style-modal>
  </div>
</template>

<script>
import MiroStyleModal from '../components/MiroStyleModal'
import EventBus from '../event-bus.js'
import { mapActions } from 'vuex'
import { sendVerificationCode } from '@/api'

export default {
  name: 'email-confirm',
  data () {
    return {
      confirmed: false,
      incorrect: false,
      form: {
        code: ''
      },
      sentCode: false,
      errorSending: false,
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions('Auth', ['verifyEmail']),
    goSignIn () {
      this.$router.push('/signin')
    },
    tryAgain () {
      this.incorrect = false
    },
    attemptConfirmation () {
      this.verifyEmail(this.form)
        .then((resp) => {
          this.$router.push({name: 'Dashboard'})
        })
        .catch((err) => {
          console.log(err)
        })
    },
    resendCode () {
      sendVerificationCode()
      this.incorrect = false
    }
  },
  components: {
    MiroStyleModal
  },
  created () {
    this.email = this.$route.query.email || ''
    this.form.code = this.$route.query.code || ''
  },
  mounted () {
    EventBus.$on('verify-email-error', (payload) => {
      this.incorrect = true
      this.errorMessage = payload
    })
  }
}
</script>

<style scoped>
  .email-confirm {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr) ;
    grid-template-rows: 1fr 2fr 1fr;
    grid-column-start: 2;
    justify-items:center;
    color: #9ea9b8;
    background: white;
  }

  .email-confirm input {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #ccc;
  }

  .email-confirm input:focus {
    box-shadow: none;
    border-bottom: 1px solid var(--main-theme);
    outline: none;
  }

  #code-confirm {
    -moz-appearance:textfield;

  }
  /* Remove arrows from input[number] */
  #code-confirm::-webkit-inner-spin-button,
  #code-confirm::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

  .confirm-email-body {
    display: grid;
    grid-template-rows: repeat(4, autofit)
  }

  .try-again {
    display: grid;
    grid-template-rows: repeat(3, auto)
  }

  .try-again-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }

  .confirm-email-modal {
    width: 100%;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    background: #fff;
    white-space: nowrap;
  }

  .confirm-email-go {
    background: var(--main-theme);
    color: #fff;
    height: 3em;
    align-self: center;
    border-radius: 2px;
  }

  .input-div {
    margin-bottom: 2em;
  }

  .input-div label{
    font-weight: bold;
    font-size: 14px;
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

  @media only screen and (max-width: 768px) {
    .email-confirm {
      grid-template-columns: 10% 1fr 10%;
      grid-template-rows: 10% 1fr 10%;
    }
  }
</style>



