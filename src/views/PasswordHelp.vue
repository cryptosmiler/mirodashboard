<template>
  <div class="password-help">
    <b-modal
      centered
      hide-backdrop
      no-close-on-backdrop
      no-close-on-esc
      visible
      static
      ref="chagePasswordModal"
    >
      <template v-slot:modal-header>
        <b-col order="1">Password Reset</b-col>
        <b-col cols="4" order="2">
          <b-img fluid right :src="getMainLogo()"></b-img>
        </b-col>
      </template>
      <b-col cols="12" class="input-div">
        <div class="col-12"></div>
        <label for="password-reset-input">
          EMAIL ADDRESS
        </label>
        <span class="input-span">
          <input
            type="text"
            placeholder="Enter your email"
            class="password-reset-input"
            v-model="email"
          />
        </span>
      </b-col>

      <b-col class="input-div" v-show="confirmPasswordView">
        <label for="password-reset-input">
          Code
        </label>
        <span class="input-span"
          ><input
            type="number"
            placeholder="Enter your code"
            class="password-reset-input"
            v-model="code"
        /></span>
      </b-col>

      <b-col class="input-div password-reset-body" v-show="confirmPasswordView">
        <label for="password-reset-input">
          New Password
        </label>
        <vue-password
          v-model="password"
          classes="input sign-up-input"
          :user-inputs="[email]"
          :score="score"
          @input="updateScore"
          :placeholder="$t('signup.password-placeholder')"
          :strengthMessages="$t('strengthMessages')"
        >
        </vue-password>

        <!-- <password
          v-model="password"
          :strength-meter-only="true"
          :secureLength="8"
          @score="showScore"
          @feedback="showFeedback"
        />. -->
        <p style="font-size: 11px">{{ $t("signup.password-recipe") }}</p>
      </b-col>

      <b-col v-show="errorMessage">
        <p class="incorrect-email-password" style="color: red;">
          {{ errorMessage }}
        </p>
      </b-col>
      <b-col cols="12">
        <button
          @click="resetPasswordRequest"
          class="miro-button"
          :class="{
            active: isValidEmail,
            'bg-grey': confirmPasswordView && !isValidEmail,
          }"
          :disabled="!isValidEmail"
        >
          {{ requestAPI }}
        </button>
      </b-col>
      <template #modal-footer>
        <a href="#" 
          class="text-grey"
          variant="link" @click="changeView"> {{ navigationText }}
        </a>
        <router-link to="/signin">{{
          $t("signup.signin")
        }}</router-link>
      </template>
    </b-modal>
  </div>
</template>

<script>
import MiroStyleModal from "../components/MiroStyleModal"
import EventBus from "../event-bus.js"
import { mapActions } from "vuex"
import platformHelper from "@/utils/platformHelper"
import Password from "vue-password-strength-meter"
import VuePassword from "vue-password/dist/custom"

export default {
  name: "password-help",
  data() {
    return {
      email: "",
      password: "",
      code: "",
      confirmPasswordView: false,
      enterCode: "Enter your code",
      platformHelper,
      rules: [
        { message: "One uppercase letter required.", regex: /[A-Z]+/ },
        { message: "8 characters minimum.", regex: /.{8,}/ },
        { message: "One number required.", regex: /[0-9]+/ },
      ],
      validPassword: false,
    }
  },
  methods: {
    ...mapActions("Auth", ["resetPassword", "confirmResetPassword"]),
    getMainLogo() {
      return platformHelper.getLogo()
    },
    resetPasswordRequest() {
      if (this.confirmPasswordView) {
        this.confirmResetPassword({
          email: this.email,
          code: this.code,
          password: this.password,
        })
          .then(resp => {
            // resp returns as true
            if (resp) {
              this.$router.push({ name: "SignIn" })
              this.$toasted.global.password_reset()
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.resetPassword({
          email: this.email,
        })
          .then(resp => {
            if (resp === true) {
              this.confirmPasswordView = true
              this.$toasted.global.check_email()
            }
          })
          .catch(err => {
            console.log("error", err)
          })
      }
    },

    emailCheck(email) {
      // eslint-disable-next-line
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.email).toLowerCase())

      //  check if email is in records
    },

    changeView() {
      this.$store.dispatch("Auth/errorToNull")
      this.confirmPasswordView = !this.confirmPasswordView
    },
    showFeedback({ suggestions, warning }) {
      console.log("🙏", suggestions)
      console.log("⚠", warning)
    },
    showScore(score) {
      console.log("💯", score)
    },
    passwordValidation() {
      let errors = []
      for (let condition of this.rules) {
        if (!condition.regex.test(this.password)) {
          errors.push(condition.message)
        }
      }
      if (errors.length === 0) {
        this.validPassword = true
        return { valid: true, errors }
      } else {
        this.validPassword = false
        return { valid: false, errors }
      }
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
  components: {
    MiroStyleModal,
    VuePassword,
    Password,
  },
  computed: {
    requestAPI() {
      return this.confirmPasswordView ? "UPDATE PASSWORD" : "REQUEST CODE"
    },
    isValidEmail() {
      if (!this.confirmPasswordView) {
        return this.emailCheck(this.email)
      } else {
        return (
          this.emailCheck(this.email) &&
          this.code.length >= 6 &&
          this.score >= 2
        )
      }
    },
    navigationText() {
      return this.confirmPasswordView ? "GET NEW CODE" : "ENTER EXISTING CODE"
    },
    errorMessage() {
      return this.$store.getters["Auth/error"]
        ? this.$store.getters["Auth/error"].message
        : ""
    },
  },
  mounted() {
    EventBus.$on("confirm-reset-password", () => {
      this.confirmPasswordView = true
    })

    console.log(this)

    this.$bvModal.show("passwordModal")

    this.$store.dispatch("Auth/errorToNull")
  },
}
</script>

<style scoped>
.password-help {
  height: 100%;
}

.password-help > div {
  max-width: 470px;
  width: 90%;
  grid-column: 1 / 4;
  grid-row: 2 / 3;
}

.password-reset-body {
  display: grid;
  grid-template-rows: auto;
  grid-gap: 30px;
}

input {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #ccc;
  height: 2.2em;
  color: #9ea9b8;
  line-height: 1.5em;
  width: 100%;
}

input:focus {
  box-shadow: none;
  border-bottom: 1px solid var(--main-theme);
  outline: none;
}

.input-div {
  margin-bottom: 0.5em;
}

.input-div label {
  font-weight: bold;
  font-size: 14px;
  color: #9ea9b8;
  margin-bottom: 0;
  padding-bottom: calc(0.4375rem + 1px);
}

.input-span {
  margin-top: 1.5em;
  margin-bottom: 1em;
  height: 2.5em;
  display: block;
  overflow: hidden;
}


.share-site-modal {
  background: #fff;
}

.miro-button {
  background: var(--main-theme);
  width: 100%;
  border-radius: 0;
  font-weight: bold;
  margin: 1.5em 0;
  color: #fff;
  padding: 0.5em;
  border: none;
}
.miro-button:disabled {
  background: var(--miro-grey);
}

.confirm-reset-button.active {
  background: var(--main-theme);
}

.confirm-reset-button:hover {
  cursor: pointer;
}

/* For Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
/* Webkit browsers like Safari and Chrome */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
