<template lang="html">
  <b-container>
    <div class="account-password-container">
      <p class="account-password-reset-title">Password Reset</p>
      <div class="account-password-reset">
        <b-form @submit="onSubmit">
          <b-row>
            <b-col cols="12" md="6">
              <b-form-group label="Current Password"
                            label-for="currentPassword"
                            breakpoint="md">
                <b-form-input id="currentPassword"
                              type="password"
                              v-model="form.currentPassword"
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6" class="">
              <p class="control">
                <label class="new-password-label" aria-autocomplete="new-password">
                  New Password
                </label>
                  <vue-password v-model="form.newPassword"
                                classes="input sign-up-input"
                                :score="score"
                                @input="updateScore"
                                :strengthMessages="strengthMessages"
                  >
                  </vue-password>
              </p>
            </b-col>
            <b-col sm="12" md="6">
              <b-form-group label="Verify Password"
                            label-for="verifyPassword"
                            aria-autocomplete="new-password">
                <b-form-input id="verifyPassword"
                              type="password"
                              v-model="form.verifyPassword"
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>
            
          </b-row>
          <p style="font-size: 12px;">Must be 8 or more characters with at least 1 capitalized letter and 1 number</p>

          <button type="submit" variant="secondary" class="change-password-button" :class="{formValid: isValid}" :disabled="!isValid">CHANGE PASSWORD</button>
        </b-form>
    </div>
    </div>
</b-container>
</template>

<script>
import VuePassword from 'vue-password/dist/custom'

export default {
  name: 'password-reset',
  data () {
    return {
      form: {
        currentPassword: '',
        newPassword: '',
        verifyPassword: ''
      },
      showDismissibleAlert: false,
      isValid: false,
      score: 0,
      strengthMessages: ['Input a password', 'Weak', 'Medium', 'Strong', 'Very Strong']
    }
  },
  methods: {
    onSubmit (e) {
      e.preventDefault()
      if (this.form.newPassword !== this.form.verifyPassword) {
        this.$toasted.show('New Password and Verify Password do not match!', {
          duration: 3000,
          fullWidth: true,
          theme: 'bubble',
          className: 'verify-email',
          position: 'bottom-center'
        })
      } else {
        this.$store.dispatch('Auth/changePassword', {
          oldPassword: this.form.currentPassword,
          newPassword: this.form.newPassword
        }).then((resp) => {
          if (resp) {
            this.form.currentPassword = ''
            this.form.newPassword = ''
            this.form.verifyPassword = ''
          }
        })
      }
    },
    updateScore (password, userInputs) {
      // eslint-disable-next-line
      var strongestRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{20,})")
      // eslint-disable-next-line
      var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{16,})")
      // eslint-disable-next-line
      var mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")
      if (strongestRegex.test(password)) {
        this.score = 4
        this.scoreMessage = 'Very Strong'
        this.scoreMessageColor = 'rgb(75, 150, 50)'
      } else if (strongRegex.test(password)) {
        this.score = 3
        this.scoreMessage = 'Strong'
        this.scoreMessageColor = 'rgb(100, 200, 75)'
      } else if (mediumRegex.test(password)) {
        this.score = 2
        this.scoreMessage = 'Medium'
        this.scoreMessageColor = 'rgb(255, 160, 65)'
      } else if (password.length > 0) {
        this.score = 1
        this.scoreMessage = 'Weak'
        this.scoreMessageColor = 'rgb(230, 30, 30)'
      } else {
        this.scoreMessage = 'Input a password'
        this.scoreMessageColor = 'grey'
        this.score = 0
      }
    }
  },
  watch: {
    form: {
      handler (newVal, oldVal) {
        for (let key in newVal) {
          if (newVal[key].length === 0) {
            this.isValid = false
            break
          }
          if (this.score > 1) { this.isValid = true }
        }
      },
      deep: true
    }
  },
  components: {
    VuePassword
  }
}
</script>

<style lang="css">
  .account-password-container {
    background: #fff;
    box-shadow: 0px 4px 10px 1px rgba(204,204,204,1);
  }

  .account-password-reset-title {
    font-size: 20px;
    padding: 1.5em 2em;
    color: #a0a9b8;
    margin: 0;
    font-weight: 500;
    border-bottom: 1px solid #ccd0d8;
  }

  .account-password-reset {
    padding: 3em;
    margin-bottom: 2em;
    color: #a0a9b8 !important;
    padding-bottom: 5em;
  }

  .form-control {
    border: none;
    border-bottom: 1px solid #ccd0d8;
    border-radius: 0;
    padding: 0 0 0.5em 0;
    color: #a0a9b8;
    font-weight: 400;
    background-image: none;
  }

  .form-control:focus {
    box-shadow: none;
    border-bottom: 1px solid var(--main-theme);
  }

  .form-control:invalid {
    background: none;
  }

  .change-password-button {
    border: none;
    background: #afb7c3;
    color: #fff;
    padding: 1em 2em;
    float: right;
    border-radius: 5px;
    font-weight: 400;
    box-shadow: 0px 4px 10px 1px rgba(204,204,204,1);
  }

  .change-password-button:hover {
    cursor: pointer;
  }

  .change-password-button.formValid {
    background: var(--main-theme);
  }

  .VuePassword__Message {
    display: none;
  }

  .VuePassword__Input .VuePassword__Toggle {
    top: -0.5em;
    color: var(--input-text-color) !important;
  }

  .VuePassword .VuePassword__Meter {
    padding: 0;
  }

  .VuePassword input {
    border: none;
    border-radius: 0;
    padding-left: 0;
    border-bottom: 1px solid #ccc;
    padding-bottom: 7px;
  }

  .sign-up-input:focus {
    box-shadow: none;
    border-bottom: 1px solid var(--main-theme);
    outline: none;
  }

  #verifyPassword {
    margin-top: 2px;
  }
</style>
