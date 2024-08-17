<template lang="html">
  <div class="sign-up-modal">
    <div class="create-sub-account-container">
      <div class="create-sub-account">
        <b-container fluid>
          <b-form @submit="onSignUp" class="sign-up-form">
            <b-row>
              <b-col sm="12" md="6">
                <b-form-group id="sign-up-first-name-group"
                              :label="$t('signup.first-name')"
                              label-for="sign-up-first-name"
                              class="required"
                              mx-auto
                              >
                  <b-form-input id="sign-up-first-name"
                                type="text"
                                required
                                v-model="form.firstName"
                                ref="signUpFirstName"
                                class="sign-up-input"
                                placeholder="First"
                                >
                  </b-form-input>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="6">
                <b-form-group id="sign-up-last-name-group"
                              :label="$t('signup.last-name')"
                              label-for="sign-up-last-name"
                              class="required"
                              >
                  <b-form-input id="sign-up-last-name"
                                type="text"
                                v-model="form.lastName"
                                ref="signUpLastName"
                                class="sign-up-input"
                                placeholder="Last"
                                >
                  </b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-form-group id="sign-up-email-address-group"
                          :label="$t('signup.email-address-label')"
                          label-for="sign-up-email-address"
                          class="required"
                          >
              <b-row class="input-row">
                <b-col cols="12">
                  <b-form-input id="sign-up-email-address"
                                type="email"
                                :label="$t('signup.email-address-label')"
                                required
                                v-model="form.email"
                                placeholder="Enter your email"
                                ref="signInEmailAddress"
                                class="sign-up-input"
                                >
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
            <b-form-group id="sign-up-password-group"
                          :label="$t('signup.password-label')"
                          label-for="sign-up-password"
                          class="required"
                          >
              <b-row class="input-row">
                <b-col cols="12" class="">
                  <p class="control">
                      <vue-password v-model="form.password"
                                    classes="input sign-up-input"
                                    :user-inputs="[form.email]"
                                    :score="score"
                                    @input="updateScore"
                                    :placeholder="$t('signup.password-placeholder')"
                                    :strengthMessages="strengthMessages"
                      >
                      </vue-password>
                  </p>
                </b-col>
                <b-col cols="1" class="icon-indicators">
                  <i class="material-icons green-check" v-show="score > 1">done</i>
                </b-col>
              </b-row>
              <p style="font-size: 11px;">{{ $t('signup.password-recipe') }}</p>
            </b-form-group>

            <b-row>
              <b-col>
                <p
                  v-show="!!signUpErrorMessage"
                  style="color:red"
                  >
                  {{signUpErrorMessage}}
                </p>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <button type="submit" class="sign-up-button" :disabled="signUpDisabled" :class="{disabled: signUpDisabled}">CREATE</button>
              </b-col>
            </b-row>
          </b-form>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "../../event-bus";
import VuePassword from "vue-password/dist/custom";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "create-sub-account",
  data() {
    return {
      form: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        company: "",
        company_url: ""
      },
      validEmail: null,
      emailExists: true,
      validPassword: null,
      signInAttempted: false,
      emailDoesntExist: false,
      passwordNotMatch: false,
      emailAlreadyExists: false,
      user: {
        password: "",
        email: ""
      },
      score: 0,
      strengthMessages: [
        "Input a password",
        "Weak",
        "Medium",
        "Strong",
        "Very Strong"
      ],
      tnc_url: "https://runnertag-1.s3.amazonaws.com/tnc/tnc.html"
    };
  },
  methods: {
    ...mapActions("Auth", ["signUpSubAccount"]),

    onSignUp(e) {
      e.preventDefault();
      EventBus.$emit("change-loader-state", true)

      // request to server
      this.signInAttempted = true;
      this.validEmail = this.emailCheck();
      this.validPassword = this.passwordCheck();

      this.signUpSubAccount(this.form);

      // check if email
      if (!this.validEmail) {
        this.emailExists = false;
      }
    },

    emailCheck() {
      // eslint-disable-next-line
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.form.email).toLowerCase());
      //  check if email is in records
    },

    passwordCheck() {
      return this.form.password.length >= 8;
    },

    updateScore(password, userInputs) {
      // eslint-disable-next-line
      var strongestRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{20,})"
      );
      // eslint-disable-next-line
      var strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{16,})"
      );
      // eslint-disable-next-line
      var mediumRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
      );
      if (strongestRegex.test(password)) {
        this.score = 4;
        this.scoreMessage = "Very Strong";
        this.scoreMessageColor = "rgb(75, 150, 50)";
      } else if (strongRegex.test(password)) {
        this.score = 3;
        this.scoreMessage = "Strong";
        this.scoreMessageColor = "rgb(100, 200, 75)";
      } else if (mediumRegex.test(password)) {
        this.score = 2;
        this.scoreMessage = "Medium";
        this.scoreMessageColor = "rgb(255, 160, 65)";
      } else if (password.length > 0) {
        this.score = 1;
        this.scoreMessage = "Weak";
        this.scoreMessageColor = "rgb(230, 30, 30)";
      } else {
        this.scoreMessage = "Input a password";
        this.scoreMessageColor = "grey";
        this.score = 0;
      }
    },

  },
  computed: {
    emailIsValid() {
      return this.emailCheck();
    },
    passwordIsValid() {
      return this.passwordCheck();
    },
    signUpDisabled() {
      return (
        !this.emailCheck() ||
        !(this.score > 1) ||
        !(this.form.firstName.length > 0) ||
        !(this.form.lastName.length > 0)
      );
    },
    activeColor() {
      if (this.form.password.length >= 8) {
        return "green";
      } else if (this.form.password.length >= 4) {
        return "yellow";
      } else if (this.form.password.length > 0) {
        return "red";
      } else {
        return "#f4f5f7";
      }
    },
    onSignUpPage() {
      return this.$router.history.current.name === "subaccount";
    },

    signUpErrorMessage() {
      return this.$store.getters["Auth/error"]
        ? this.$store.getters["Auth/error"].message
        : "";
    }
  },
  created() {
    this.$store.dispatch("Auth/errorToNull");
  },
  beforeMount() {
    this.scoreMessage = "Input a password";
    this.scoreMessageColor = "grey";
    this.score = 0;
  },
  components: {
    VuePassword
  },
  mounted () {
    EventBus.$on('clearSubForm', (payload) => {
      this.form = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        company: "",
        company_url: ""
      };
      this.validEmail = null;
      this.emailExists = true;
      this.validPassword = null;
      this.signInAttempted = false;
      this.emailDoesntExist = false;
      this.passwordNotMatch = false;
      this.emailAlreadyExists = false;
      this.user = {
        password: "",
        email: ""
      };
      this.score= 0;
    })
  }
};
</script>

<style lang="css" scoped>
.create-sub-account-container {
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
}

.create-sub-account {
  padding: 3em;
  margin-bottom: 2em;
  color: #a0a9b8 !important;
  /* padding-bottom: 5em; */
}

.form-control {
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

.save-button {
  border: none;
  background: #afb7c3;
  color: #fff;
  padding: 1em 2em;
  float: right;
  border-radius: 5px;
  font-weight: 400;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
}

.save-button:hover {
  cursor: pointer;
}

.save-button.hasChanges {
  background: var(--main-theme);
}

.toasted-container .toasted {
  background: red;
  justify-content: center;
}

.sign-up-form {
  padding: 1em 2.5em;
  color: #a0a9b8;
  line-height: 2em;
}

.sign-up-button{
  width: 100%;
  color: #fff;
  background-color: red;
  border: none;
}

.sign-up-button.disabled{
  background-color: #afb7c3;
  border-color: #afb7c3;
}

.green-check {
  color: var(--main-theme);
}

::placeholder {
  color: #ccd0d8;
}

sign-up-input:focus {
  box-shadow: none;
  border-bottom: 1px solid var(--main-theme);
  outline: none;
}

.icon-indicators {
  position: relative;
  right: 3em;
  top: 0.5em;
  height: 30px;
}

.input-row {
  flex-wrap: nowrap;
}

</style>

<style lang="css">
.sign-up-input {
  border: none;
  border-radius: 0;
  padding-left: 0;
  border-bottom: 1px solid #ccc;
}

#sign-up-password-group .VuePassword__Input ::placeholder {
  color: #ccd0d8;
}
</style>
