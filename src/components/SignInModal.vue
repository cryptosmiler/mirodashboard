<template>
  <div class="sign-in-modal">
    <b-modal ref="signInModal" hide-backdrop centered no-close-on-backdrop content-class="shadow" id="sign-in-modal-id"
      :no-close-on-esc="onSignInPage" header-class="align-items-center">
      <template v-slot:modal-header>
        <b-col order="1">{{ $t("signup.signin") }}</b-col>
        <b-col cols="4" order="2">
          <b-img fluid right :src="getMainLogo()"></b-img>
        </b-col>
      </template>
      <b-container fluid v-if="step == 1">
        <b-form @submit="onSignIn" class="sign-in-form">
          <b-form-group id="sign-in-email-address-group" :label="$t('signup.email-address-label')"
            label-for="sign-in-email-address">
            <b-row class="input-row">
              <b-col cols="12">
                <b-form-input id="sign-in-email-address" type="email" :label="$t('signup.email-address-label')" required
                  v-model="form.email" :placeholder="$t('signup.email-address-placeholder')" ref="signInEmailAddress"
                  class="sign-in-input" :state="emailExists" spellcheck="false">
                </b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">
                  {{ $t("signup.invalid-email") }}.
                </b-form-invalid-feedback>
              </b-col>
              <b-col cols="1" class="icon-indicators">
                <i class="material-icons green-check" v-show="emailIsValid">done</i>
                <i class="material-icons red-warning" v-show="emailExists && signInAttempted">report_problem</i>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group id="sign-in-password-group" :label="$t('signup.password-label')"label-for="sign-in-password">
            <b-row class="input-row">
              <b-col cols="12">
                <b-form-input id="sign-in-password" type="password" :label="$t('signup.password-label')" required
                  v-model="form.password" :placeholder="$t('signup.password-placeholder')" class="sign-in-input"
                  :state="passwordMatch" spellcheck="false">
                </b-form-input>
              </b-col>
              <b-col cols="1" class="icon-indicators">
                <!-- <i class="material-icons green-check" v-show="passwordIsValid">done</i> -->
                <i class="material-icons red-warning" v-show="passwordMatch && signInAttempted">report_problem</i>
              </b-col>
            </b-row>
          </b-form-group>
          <b-row>
            <b-col cols="12">
              <button type="submit" class="sign-in-button" :disabled="signInDisabled"
                :class="{ disabled: signInDisabled }">
                {{ $t("signup.signin") }}
              </button>
            </b-col>
          </b-row>
          <b-row v-show="errorMessage">
            <b-col>
              <p class="incorrect-email-password">{{ errorMessage }}</p>
            </b-col>
          </b-row>
        </b-form>
      </b-container>
      <b-container fluid v-if="step == 2">
        <b-row>
          <b-col cols="12" class="authentication-code">
            Authentication Code
          </b-col>
          <b-col cols="12">
            <b-form-input required placeholder="XXXXXX" class="sign-in-input" v-model="TOTP">
            </b-form-input>
          </b-col>
          <b-col cols="12" class="invalid-totp" v-if="TOTP_ERROR">
            {{
              $t("signup.invalid-code")
            }}
          </b-col>
          <b-col cols="12">
            <button type="submit" class="sign-in-button" @click="sendTOTP0">
              Verify
            </button>
          </b-col>
        </b-row>
      </b-container>
      <template #modal-footer>
        <router-link to="/passwordhelp" class="forgot-password">{{
          $t("signup.forgot-password")
        }}</router-link>
        <router-link v-if="platformHelper.platform() == 1" to="/signup">{{
          $t("signup.signup")
        }}</router-link>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex"

import EventBus from "../event-bus"
import platformHelper from "@/utils/platformHelper"
import { onBeforeMount } from "vue"

export default {
  name: "SignInModal",
  data() {
    return {
      form: {
        email: "",
        password: "",
        platform_id: platformHelper.platform(),
      },
      validEmail: null,
      emailExists: null,
      validPassword: null,
      signInAttempted: false,
      passwordMatch: null,
      platformHelper,
      step: 1,
      TOTP: '',
      Session: '',
      TOTP_ERROR: false,
    }
  },

  methods: {
    ...mapActions("Auth", ["signIn", "sendTOTP"]),

    getMainLogo() {
      return platformHelper.getLogo()
    },

onBeforeMount() {
  console.log("before platformhelper.platform", platformHelper.platform());
},

    mounted() {
 console.log("platformhelper.platform", platformHelper.platform());
 },

    onSignIn(e) {
      e.preventDefault()
      // request to server and check email and password combination

      this.signInAttempted = true
      this.signIn(this.form).then((data) => {
        if (data) {
          console.log("data -> ", data)
          this.Session = data.data.Session
          this.step = 2
        }
        else {
          this.$router.push({ name: "Dashboard" })
        }
      }
      )
    },

    emailCheck(email) {
      // eslint-disable-next-line
      var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.form.email).toLowerCase())

      //  check if email is in records
    },

    passwordCheck() {
      return this.form.password.length >= 8
    },

    sendTOTP0() {
      const payload = {
        TOTP: this.TOTP,
        Session: this.Session,
        Email: this.form.email,
        Password: this.form.password
      }
      this.sendTOTP(payload).then(() => {
        this.$router.push({ name: "Dashboard" })
      })
        .catch(err => {
          console.log("err => ", err)
        })
    }
  },

  computed: {
    emailIsValid() {
      return this.emailCheck()
    },
    passwordIsValid() {
      return this.passwordCheck()
    },

    signInDisabled() {
      return !this.emailCheck() || !this.passwordCheck()
    },

    onSignInPage() {
      return this.$router.history.current.name === "SignIn"
    },

    errorMessage() {
      const authError = this.$store.getters["Auth/error"];
      return authError
        ? (
          authError.code && authError.code === 'UserLambdaValidationException'
            ? "Unrecognised username or password."
            : authError.message)
        : ""
    },
  },
  created() {
    EventBus.$on("open-sign-in-modal", () => {
      this.$refs.signInModal.show()

      setTimeout(() => {
        this.$refs.signInEmailAddress.focus()
      }, 500)
    })

    EventBus.$on('set-totp-mismatch-error', (value) => {
      this.TOTP_ERROR = value
    })

    EventBus.$on('set-unknown-error', (value) => {
      if (value) {
        this.$toasted.show(this.$t("signup.unknown-error"), {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
      }
    })

    this.$store.dispatch("Auth/errorToNull")
  },
}
</script>

<style lang="css" scoped>
.miro-logo {
  height: 100%;
  width: 4em;
}
</style>

<style lang="css">
.sign-in-modal-header {
  background: var(--main-theme);
  color: #d6eef8;
  font-size: 2em;
  padding: 1em 1.2em 0.5em;
  margin-bottom: 0;
  font-weight: 300;
}

.sign-in-form {
  /* padding: 1em 2.5em; */
  color: #9ea9b8;
  line-height: 2rem;
  padding: 1em 0;
}

.sign-in-input {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #ccc;
}

.sign-in-input:focus {
  box-shadow: none;
  border-bottom: 1px solid var(--main-theme);
  outline: none;
}

.col-form-label {
  font-weight: bold;
  font-size: 14px;
}

.sign-in-button {
  background: var(--main-theme);
  width: 100%;
  border-radius: 0;
  font-weight: bold;
  margin: 1.5em 0;
  color: #fff;
  padding: 0.5em;
  border: none;
  text-transform: uppercase;
}

.sign-in-button.disabled {
  background: #e3e6eb;
  color: #c4d4db;
}

.incorrect-email-password {
  color: red;
}

.forgot-password {
  color: #ccc;
  font-size: 14px;
  font-weight: bold;
}

.green-check {
  color: var(--main-theme);
}

.red-warning {
  color: #f54971;
}

.input-row {
  flex-wrap: nowrap;
}

.icon-indicators {
  position: relative;
  right: 3.5em;
  height: 30px;
  top: 12px;
}

::-webkit-input-placeholder {
  font-size: 1em !important;
  color: #ccc !important;
}

:-moz-placeholder {
  /* Firefox 18- */
  font-size: 13px !important;
  color: #ccc !important;
}

::-moz-placeholder {
  /* Firefox 19+ */
  font-size: 13px !important;
  color: #ccc !important;
}

.authentication-code {
  color: #9ea9b8;
  font-size: 20px;
}

.invalid-totp {
  color: red;
  margin-top: 5px;
  font-weight: bold;
}
</style>
