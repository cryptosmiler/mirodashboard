<template lang="html">
    <div class="sign-up-modal">
      <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 create-board">
        <div class="plus-button" @click="toggleCreateBox()">
        </div>
        <div class="plus-caption" @click="toggleCreateBox()">
          Add a new user
        </div>
      </div>
      <div v-show="showCreateBox" class="col-xl-6 col-lg-6 col-md-12 col-sm-12 create-board">
        <div class="user-temp-avatar-outer">
              <div v-show="form.firstName" class="user-temp-avatar" v-if="form.firstName">
                {{form.firstName[0].toUpperCase()}}
              </div>
            </div>
        <b-form @submit="onSignUp" class="add-new-user-form">
          <div class="name-email-region">
            <div class="sign-up-name">
              <div class="sign-up-first-name-outer">
                <b-form-input id="sign-up-first-name-real" type="text" required v-model="form.firstName" ref="signUpFirstName" class="sign-up-first col-md-6" placeholder="First Name">
                </b-form-input>
              </div>
              <div class="sign-up-last-name-outer">
                <b-form-input id="sign-up-last-name" type="text" v-model="form.lastName" ref="signUpLastName" class="sign-up-last col-md-6" placeholder="Last Name">
                </b-form-input>
              </div>

            </div>
            <b-form-input id="sign-up-email-address" type="email" :label="$t('signup.email-address-label')" required v-model="form.email" ref="signInEmailAddress" class="sign-up-email" placeholder="Email Address">
            </b-form-input>
          </div>
          <div class="action-region">
            <div class="check" v-show = "signUpDisabled"></div>
            <button type="submit" class="check-success" v-show = "!signUpDisabled"></button>
          </div>
          <div class="role-region">
            <select  class="select-theme" v-model="form.role">
              <option value="0" >Admin</option>
              <option value="1" >User</option>
            </select>
          </div>
        </b-form>
      </div>
      <div class="create-sub-account-container" v-show="showOldForm">
        
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
        showOldForm:false,
        formLog:{},
        form: {
          email: "",
          password: "Ssc-3227",
          firstName: "",
          lastName: "",
          role: 1,
          company: "",
          company_url: ""
        },
        showCreateBox: false,
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
      ...mapActions("Auth", ["signUpSubAccount", "resetPassword"]),
  
      toggleCreateBox(){
        this.showCreateBox = !this.showCreateBox;
        this.form.email = "";
        this.form.firstName = "";
        this.form.lastName = "";
        this.form.role = 1
      },
      async onSignUp(e) {
        e.preventDefault();
        EventBus.$emit("change-loader-state", true)
  
        // request to server
        this.signInAttempted = true;
        this.validEmail = this.emailCheck();
        this.validPassword = this.passwordCheck();
  
        try {
          this.formLog = this.form
          await this.signUpSubAccount(this.form);
          const {email} = this.formLog
          this.showCreateBox = false;
          await this.resetPassword({
            email: email,
          })
          .then(resp => {
            if (resp === true) {
              this.$toasted.global.check_email()
            }
          })
          .catch(err => {
            console.log("error", err)
            alert('err', err)
          })
        } catch(error){
          alert("The same email already exist!");
          location.reload();
          //console.log("front error ", error);
        }
        //  console.log("res =============> ");
  
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
          password: "Ssc-3227",
          firstName: "",
          lastName: "",
          role: 1,
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

  .create-board{
    background-color: white;
    border: 1px solid #ccc;
    padding: 15px;
    padding-left: 17px;
    margin-bottom: 10px;
    height: 90px;
  }
  .plus-button{
    background-image: url("../../assets/plus.png");
    width: 60px;
    height: 60px;
    background-size: cover;
    border-radius: 30px;
    border: 1px solid #646060;
    padding: 5px;
    cursor: pointer;
    float: left;
    transition: 0.3s;
  }

  .plus-button:hover{
    background-image: url("../../assets/plus-hover.png");
  }

  .plus-caption{
    color: #b80b34;
    float: left;
    padding: 10px 0px 0px 15px;
    font-size: 25px;
    font-weight:400;
    cursor: pointer;
    transition: 0.3s;
  }

  .plus-caption:hover{
    color: #e23f65;
  }

  .plus-avatar{
    background-image: url("../../assets/plus.png");
    width: 60px;
    height: 60px;
    background-size: cover;
    border-radius: 30px;
    border: 1px solid #a0a9b8;
    padding: 5px;
    cursor: pointer;
    float: left;
  }

  .name-email-region{
    float: left;
    margin-left: 15px;
    transform: translate(0, -1px);
    width: 50%;
  }

  .sign-up-name{
    
  }

  .sign-up-first{
    float: left;
    height: 30px;
    padding: 3px !important;
    margin-right: 2px;
    margin-bottom: 2px;
    border: 1px solid rgb(204, 204, 204) !important;
  }

  .sign-up-last{
    float: left;
    height: 30px;
    padding: 3px !important;
    margin-left: 2px;
    margin-bottom: 2px;
    border: 1px solid rgb(204, 204, 204) !important;
  }

  .sign-up-first-name-outer{
    padding-right: 1px;
  }

  .sign-up-last-name-outer{
    padding-left: 7px;
  }

  .sign-up-email{
    height: 30px;
    padding: 3px !important;
    padding-left: 10px;
    font-size: 17px;
    border: 1px solid rgb(204, 204, 204) !important;
  }

  .add-new-user-form{

  }

  .role-region{
    float: right;
    margin-right: 40px;
    margin-top: 12px;
  }

  .action-region{
    float: right;
    transform: translate(0, -7px);
  }

  .check{
    width: 30px;
    height: 30px;
    margin-top: 20px;
    background-size: cover;
    background-image: url("../../assets/check.png");
    transition: background-image 0.3s ease;
    cursor: not-allowed;
  }
  
  .check-success{
    width: 30px;
    height: 30px;
    margin-top: 20px;
    cursor: pointer;
    background-size: cover;
    background-image: url("../../assets/check-success.png");
    transition: 0.3s;
    background-color: white !important;
    border: 0px !important;
  }

  .check-success:hover{
    background-image: url("../../assets/check-success-hover.png");
  }

  .select-theme{
    border: 1px solid #E61547;
    border-radius: 5px;
    padding: 7px 15px 7px 6px;
  }

  .user-temp-avatar{
    border-radius: 60px;
    background-color: #da525d;
    height: 60px;
    width: 60px;
    font-size: 35px;
    padding-top: 5px;
    font-weight: bold;
    color: white;
    text-align: center;
  }

  .user-temp-avatar-outer{
    border-radius: 68px;
    border: 1px solid #a0a9b8;
    height: 68px;
    width: 68px;
    text-align: center;
    padding: 3px;
    float: left;
    transform: translate(0, -4px);
  }

  @media screen and (max-width: 992px) {
    .user-board {
      min-width: 460px;
      height: 90px;
    }
  }

  /* Styles for screens between 601px and 1200px */

  @media screen and (max-width: 506px) {
    .create-board{
      min-width: 460px;
    }
    .name-email-region{
      min-width: 140px;
    }
    .sign-up-first{
      width: 48%;
    }
    .sign-up-last{
      width: 48%;
    }
    .role-region{
      margin-right: 5px;
    }
  }

  @media screen and (min-width: 507px) and (max-width: 559px) {
    .create-board{
      min-width: 460px;
    }
    .name-email-region{
      width: 48%;
    }
    .sign-up-first{
      width: 48%;
    }

    .sign-up-last{
      width: 48%;
    }
    .role-region{
      margin-right: 8px;
    }
  }

  @media screen and (min-width: 560px) and (max-width: 767px) {
    .create-board{
      min-width: 460px;
    }
    .name-email-region{
      width: 50%;
    }
    .sign-up-first{
      width: 50%;
    }

    .sign-up-last{
      width: 50%;
    }
  }

  @media screen and (min-width: 768px) and (max-width: 884px) {
    .create-board{
      width: 100%;
    }
    .name-email-region{
      width: 45%;
    }
  }

  @media screen and (min-width: 885px) and (max-width: 991px) {
    .create-board{
      min-width: 550px !important;
    }
  }

  @media screen and (min-width: 992px) and (max-width: 1380px) {
    .create-board{
      min-width: 550px !important;
    }
  }

  /* Styles for screens between 601px and 1200px */
  @media screen and (min-width: 1380px) and (max-width: 1479px) {
    .name-email-region{
      width: 46%;
    }
    .role-region{
      margin-right: 10px;
    }
  }
  /* Styles for screens between 601px and 1200px */
  @media screen and (min-width: 1480px) and (max-width: 1599px) {
    .name-email-region{
      width: 48%;
    }
    .role-region{
      margin-right: 20px;
    }
  }

  /* Styles for screens larger than 1200px */
  @media screen and (min-width: 1600px) {
    .name-email-region{
      width: 50%;
    }
    .role-region{
      margin-right: 30px;
    }
  }

  
  </style>
  