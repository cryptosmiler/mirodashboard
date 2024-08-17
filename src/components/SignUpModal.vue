<template>
  <b-modal ref="signUpModal" static centered v-model="visible" hide-backdrop no-close-on-backdrop content-class="shadow"
    size="lg" id="sign-up-modal-id" :no-close-on-esc="onSignUpPage">
    <template v-slot:modal-header>
      <b-col order="1">{{ $t("signup.header") }}</b-col>
      <b-col cols="4" order="2">
        <b-img fluid right :src="getMainLogo()"></b-img>
      </b-col>
    </template>
    <b-container fluid>
      <div class="text-bold py-3">
        Automatic Signup is currently disabled. Please contact <a
          href="mailto:support@runnertag.com">support@runnertag.com</a> to sign up a new account.
      </div>
      <b-form @submit="onSignUp" class="sign-up-form" style="opacity: 0.5">
        <b-row>
          <b-col sm="12" md="6">
            <b-form-group id="sign-up-first-name-group" :label="$t('signup.first-name')" label-for="sign-up-first-name"
              class="required" mx-auto>
              <b-form-input id="sign-up-first-name" type="text" required v-model="form.firstName" autofocus
                ref="signUpFirstName" class="sign-up-input" placeholder="First" :disabled="disabled">
              </b-form-input>
            </b-form-group>
          </b-col>

          <b-col sm="12" md="6">
            <b-form-group id="sign-up-last-name-group" :label="$t('signup.last-name')" label-for="sign-up-last-name"
              class="required">
              <b-form-input id="sign-up-last-name" type="text" v-model="form.lastName" ref="signUpLastName"
                class="sign-up-input" placeholder="Last" :disabled="disabled">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group id="sign-up-email-address-group" :label="$t('signup.email-address-label')"
          label-for="sign-up-email-address" class="required">
          <b-row class="input-row">
            <b-col cols="12">
              <b-form-input id="sign-up-email-address" type="email" :label="$t('signup.email-address-label')" required
                v-model="form.email" placeholder="Enter your email" ref="signInEmailAddress" class="sign-up-input">
              </b-form-input>
              <b-form-invalid-feedback id="inputLiveFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                Email does not exist in our record.
              </b-form-invalid-feedback>
            </b-col>
            <b-col cols="1" class="icon-indicators">
              <i class="material-icons green-check" v-show="emailIsValid">done</i>
              <i class="material-icons red-warning" v-show="emailAlreadyExists && signInAttempted">report_problem</i>
            </b-col>
          </b-row>
        </b-form-group>
        <b-form-group id="sign-up-password-group" :label="$t('signup.password-label')" label-for="sign-up-password"
          class="required">
          <b-row class="input-row">
            <b-col cols="12" class="">
              <div class="control">
                <vue-password v-model="form.password" classes="input sign-up-input" :user-inputs="[form.email]"
                  :score="score" @input="updateScore" :placeholder="$t('signup.password-placeholder')"
                  :strengthMessages="$t('strengthMessages')" :disabled="disabled">
                </vue-password>
              </div>
            </b-col>
            <b-col cols="1" class="icon-indicators">
              <i class="material-icons green-check" v-show="score > 1">done</i>
            </b-col>
          </b-row>
          <!-- <b-row align-h="end">
              <b-col cols="12" class="score-message">
                <span :style="{color: scoreMessageColor}">{{scoreMessage}}</span>
              </b-col>
            </b-row> -->
          <p style="font-size: 11px">{{ $t("signup.password-recipe") }}</p>
        </b-form-group>

        <b-form-group id="sign-up-company-name-group" :label="$t('signup.company-name-label')"
          label-for="sign-up-company-name" class="required">
          <b-form-input id="sign-up-company-name" type="text" :label="$t('signup.company-name-label')" required
            v-model="form.company" placeholder="Enter your Company Name" ref="signInCompanyName" class="sign-up-input"
            :disabled="disabled">
          </b-form-input>
        </b-form-group>

        <b-form-group id="sign-up-company-url-group" :label="$t('signup.company-url')" label-for="sign-up-company-url"
          mx-auto>
          <b-form-input id="sign-up-company-url" type="text" v-model="form.company_url" ref="signUpCompanyUrl"
            class="sign-up-input" :placeholder="$t('signup.company-url-placeholder')" :disabled="disabled">
          </b-form-input>
        </b-form-group>

        <b-row>
          <b-col cols="10" class="required">
            <i18n path="signup.accept-tnc" tag="label" for="accept-tnc">
              <a :href="tnc_url" target="_blank">{{ $t("signup.tos") }}</a>
            </i18n>
          </b-col>
          <b-col cols="2" class="text-right">
            <label class="switch">
              <input type="checkbox" name="accept-tnc" v-model="form.acceptedTNC"
                @change="this.form.acceptedTNC = !this.form.acceptedTNC" />
              <span class="slider round"></span>
            </label>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p v-show="!!signUpErrorMessage" style="color: red">
              {{ signUpErrorMessage }}
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <button type="submit" class="sign-up-button" :disabled="signUpDisabled"
              :class="{ disabled: signUpDisabled }">
              {{ $t("signup.signup") }}
            </button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
    <template v-slot:modal-footer>
      <router-link to="/passwordhelp" class="forgot-password">{{
        $t("signup.forgot-password")
      }}</router-link>
      <router-link to="/signin">{{ $t("signup.signin") }}</router-link>
    </template>
  </b-modal>
</template>

<script>
import EventBus from "../event-bus"
import VuePassword from "vue-password/dist/custom"
import { mapActions } from "vuex"
import platformHelper from "@/utils/platformHelper"

export default {
  name: "SignUpModal",
  props: {
    visible: Boolean
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        company: "",
        company_url: "",
        acceptedTNC: false,
      },
      validEmail: null,
      emailExists: true,
      validPassword: null,
      validCompanyName: null,
      signInAttempted: false,
      emailDoesntExist: false,
      passwordNotMatch: false,
      emailAlreadyExists: false,
      user: {
        password: "",
        email: "",
      },
      score: 0,
      tnc_url: "https://runnertag-1.s3.amazonaws.com/tnc/tnc.html",
      platformHelper,
      disabled: true
    }
  },
  methods: {
    ...mapActions("Auth", ["signUp"]),

    getMainLogo() {
      return platformHelper.getLogo()
    },
    onSignUp(e) {
      e.preventDefault()
      // request to server
      this.signInAttempted = true
      this.validEmail = this.emailCheck()
      this.validPassword = this.passwordCheck()
      this.validCompanyName = this.companyNameCheck()

      this.signUp(this.form).then(() => {
        this.$router.push({ name: "Dashboard" })
      })

      // check if email
      if (!this.validEmail) {
        this.emailExists = false
      }
    },

    emailCheck() {
      // eslint-disable-next-line
      var re =
        ///^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|)@miro.io$/
      return re.test(String(this.form.email).toLowerCase())

      //  check if email is in records
    },

    passwordCheck() {
      return this.form.password.length >= 8
    },

    companyNameCheck() {
      return this.form.company.length >= 3
    },

    updateScore(password, userInputs) {
      // eslint-disable-next-line
      var strongestRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{20,})"
      )
      // eslint-disable-next-line
      var strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{16,})"
      )
      // eslint-disable-next-line
      var mediumRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
      )
      if (strongestRegex.test(password)) {
        this.score = 4
        this.scoreMessage = "Very Strong"
        this.scoreMessageColor = "rgb(75, 150, 50)"
      } else if (strongRegex.test(password)) {
        this.score = 3
        this.scoreMessage = "Strong"
        this.scoreMessageColor = "rgb(100, 200, 75)"
      } else if (mediumRegex.test(password)) {
        this.score = 2
        this.scoreMessage = "Medium"
        this.scoreMessageColor = "rgb(255, 160, 65)"
      } else if (password.length > 0) {
        this.score = 1
        this.scoreMessage = "Weak"
        this.scoreMessageColor = "rgb(230, 30, 30)"
      } else {
        this.scoreMessage = "Input a password"
        this.scoreMessageColor = "grey"
        this.score = 0
      }
    },
  },
  computed: {
    emailIsValid() {
      this.disabled = !this.emailCheck()
      return this.emailCheck()
    },
    passwordIsValid() {
      return this.passwordCheck()
    },
    signUpDisabled() {
      return (
        !this.emailCheck() ||
        !this.companyNameCheck ||
        !(this.score > 1) ||
        !(this.form.firstName.length > 0) ||
        !(this.form.lastName.length > 0) ||
        !this.form.acceptedTNC
      )
    },
    activeColor() {
      if (this.form.password.length >= 8) {
        return "green"
      } else if (this.form.password.length >= 4) {
        return "yellow"
      } else if (this.form.password.length > 0) {
        return "red"
      } else {
        return "#f4f5f7"
      }
    },
    onSignUpPage() {
      return this.$router.history.current.name === "SignUp"
    },

    signUpErrorMessage() {
      return this.$store.getters["Auth/error"]
        ? this.$store.getters["Auth/error"].message
        : ""
    },
  },
  beforeMount() {
    this.scoreMessage = "Input a password"
    this.scoreMessageColor = "grey"
    this.score = 0
  },
  components: {
    VuePassword,
  },
}
</script>


<style lang="css">
.sign-up-form {
  color: #9ea9b8;
  line-height: 2em;
}

.sign-up-input {
  border: none;
  border-radius: 0;
  padding-left: 0;
  border-bottom: 1px solid #ccc;
}

.sign-up-input:focus {
  box-shadow: none;
  border-bottom: 1px solid var(--main-theme);
  outline: none;
}

.form-control:invalid {
  background-image: none;
}

.input {
  margin-bottom: 1em;
}

.input:focus {
  box-shadow: none;
}

.sign-up-button {
  background: var(--main-theme);
  width: 100%;
  border-radius: 0;
  padding: 0.5em;
  font-weight: bold;
  margin: 1.5em 0;
  color: #fff;
  border: none;
  text-transform: uppercase;
}

.sign-in-button:hover {
  color: red;
}

.sign-up-button.disabled {
  background: #ccc;
}

.btm-links {
  margin: 1em 0;
}

.forgot-password {
  color: #ccc;
}

.form-control {
  margin-top: 0.5em;
  color: var(--input-text-color);
  background-image: none;
}

.form-control.is-valid {
  border-color: none;
}

.col-form-label {
  font-weight: 500;
  font-size: 14px;
}

.green-check {
  color: var(--main-theme);
  display: inline;
}

.red-warning {
  color: #f54971;
}

.passwordStrength {
  padding: 1px;
  background: lightgray;
}

.score-message {
  text-align: right;
  line-height: 0.5em;
}

.input-row {
  flex-wrap: nowrap;
}

.icon-indicators {
  position: relative;
  right: 3em;
  top: 0.5em;
  height: 30px;
}

.VuePassword__Message {
  display: none;
  height: 0px;
}

.VuePassword__Toggle__Icon {
  margin-right: 1em;
}

.VuePassword__Input .VuePassword__Toggle {
  top: -0.5em;
  color: var(--input-text-color) !important;
}

.VuePassword .VuePassword__Meter {
  padding: 0;
}

@media only screen and (max-width: 768px) {
  .icon-indicators {
    right: 2.6em;
  }
}

::-webkit-input-placeholder {
  font-size: 1em !important;
  color: #ccc !important;
}

:-moz-placeholder {
  /* Firefox 18- */
  font-size: 1em !important;
  color: #ccc !important;
}

::-moz-placeholder {
  /* Firefox 19+ */
  font-size: 1em !important;
  color: #ccc !important;
}

/* #sign-up-modal-id___BV_modal_body_ {
    margin: 0;
  } */
</style>
