<template lang="html">
  <div class="">
    <b-modal 
      centered
      visible
      hide-header-close
      hide-backdrop
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
      id="main-modal" 
      >
      <template #modal-title>
        <div class="modal-header custom-header">
          <b-row>
            <b-col>Welcome</b-col>
            <b-col cols="4" order="2">
              <b-img fluid right :src="getMainLogo()"></b-img>
            </b-col>
          </b-row>
        </div>
      </template>
      <div class="box-container">
        <div class="box-content">
          <div class="box-image">
            <b-img :src="getMainCongratulationImage()" ></b-img>
          </div>
          <div class="box-invited">
            <div>You are invited to join</div>
            <b class="tenant_name">{{ tennant_name }}</b> as a user!
          </div>
          <div class="box-order">
            For your first event, please reset your password as a <b>strong</b> one.
          </div>
        </div>
        <div class="box-input">
          <b-form-input v-model="newPassword" type="password" placeholder="enter your new password" class="newPassword custom-input"></b-form-input>
          <b-form-input v-model="confirmPassword" type="password" placeholder="confirm your password" class="confirmPassword custom-input"></b-form-input>
        </div>
        <div class="box-progress" v-if="passwordStrength>0">
          <b-row v-if="passwordStrength == 0">
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
          </b-row>
          <b-row v-if="passwordStrength == 1">
            <b-col class="filler1"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
          </b-row>
          <b-row v-if="passwordStrength == 2">
            <b-col class="filler2"></b-col>
            <b-col class="filler2"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
          </b-row>
          <b-row v-if="passwordStrength == 3">
            <b-col class="filler3"></b-col>
            <b-col class="filler3"></b-col>
            <b-col class="filler3"></b-col>
            <b-col class="filler-empty"></b-col>
            <b-col class="filler-empty"></b-col>
          </b-row>
          <b-row v-if="passwordStrength == 4">
            <b-col class="filler4"></b-col>
            <b-col class="filler4"></b-col>
            <b-col class="filler4"></b-col>
            <b-col class="filler4"></b-col>
            <b-col class="filler-empty"></b-col>
          </b-row>
          <b-row v-if="passwordStrength == 5">
            <b-col class="filler5"></b-col>
            <b-col class="filler5"></b-col>
            <b-col class="filler5"></b-col>
            <b-col class="filler5"></b-col>
            <b-col class="filler5"></b-col>
          </b-row>
        </div>
        <div class="box-strength-msg" v-if="passwordStrength>0">
          Your password is {{passwordStrengthArray[passwordStrength]}}
        </div>
        <div class="box-button">
          <b-button @click="_sendPasswordSetRequest" class="submit-button" v-if="passwordStrength>3 && newPassword === confirmPassword">Submit </b-button>
          <b-button class="submit-button-disabled" @click="_verifyOldPassword" v-else>submit </b-button>
        </div>
      </div>
    </b-modal>
    
  </div>
</template>

<script>

import MiroStyleModal from './MiroStyleModal'
import platformHelper from "@/utils/platformHelper"
import JSConfetti from 'js-confetti'

import { mapActions } from "vuex"

const confetti = new JSConfetti()

export default {
  name: 'invite-modal',
  props: {
    _email: '',
    _password: ''
  },
  data(){
    return{
      newPassword: '',
      confirmPassword: '',
      platformHelper,
      tennant_name: '',
      passwordStrengthArray: ["Zero", "Very Weak", "Weak", "Moderate", "Strong!", "Very Strong!!"]
    }
  },
  components: {
    MiroStyleModal
  },
  mounted () {
    //this.$bvModal.show("main-modal")
    this.showConfetti()
  },
  watch: {
    _email: {
      //immediate: true,
      handler(newVal) {
        this._verifyOldPassword();
      }
    }
  },
  beforeRouteEnter(to, from, next){
    this.signOut()
    next()
  },
  beforeRouteUpdate(to, from, next){
    this.signOut()
    next()
  },
  methods: {
    ...mapActions("Auth", ["sendPasswordSetRequest"]),
    ...mapActions("Auth", ["verifyOldPassword"]),
    ...mapActions('Auth', ['signOut']),
    getMainLogo() {
      return platformHelper.getLogo()
    },
    getMainCongratulationImage() {
      return platformHelper.getCongratulationImage()
    },
    showConfetti() {
      confetti.addConfetti()
    },
    _sendPasswordSetRequest(){
      this.sendPasswordSetRequest({
          email: this._email,
          oldPassword: this._password,
          newPassword: this.newPassword,
        })
        .then(resp => {
          if (resp) {
            this.$toasted.show("You password successfully changed!", {
              duration: 3000,
              fullWidth: true,
              theme: "bubble",
              className: "link-copied",
              position: "bottom-center"
            });
            this.$router.push('/signin')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async _verifyOldPassword(){
      //this.$store.dispatch("Auth/verifyOldPassword", {oldPassword: this._password, email: this._email, platform_id: platformHelper.platform()})
      await this.verifyOldPassword({
        oldPassword: this._password,
        email: this._email,
        platform_id: platformHelper.platform()
      })
      .then(resp => {
        if (resp) {
          console.log("resp=> ", resp)
          console.log("resp.tenant_name => ", resp.tenant_name)
          this.tennant_name = resp.tenant_name
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    passwordStrength(){
      let strength = 0;

      // Check password length
      if (this.newPassword.length >= 8) {
        strength += 1;
      }

      // Check for uppercase letters
      if (/[A-Z]/.test(this.newPassword)) {
        strength += 1;
      }

      // Check for lowercase letters
      if (/[a-z]/.test(this.newPassword)) {
        strength += 1;
      }

      // Check for numbers
      if (/[0-9]/.test(this.newPassword)) {
        strength += 1;
      }

      // Check for special characters
      if (/[$@&!]/.test(this.newPassword)) {
        strength += 1;
      }

      return strength;
    }
  }
}
</script>

<style lang="css" scoped>

  li {
    list-style-type: none;
  }

  .custom-header {
    border-bottom: none;
    width: 100%;
    margin: 0px;
    padding: 0.6rem 1rem !important;
    font-weight: bold;
    color: white;
  }

  .submit-button {
    width: 100%;
    background-color: var(--main-theme);
    color: white;
    font-weight: bold;
    padding: 10px;
  }

  .submit-button-disabled {
    width: 100%;
    background-color: white;
    color: var(--main-theme);
    border: 1px solid var(--main-theme);
    font-weight: bold;
    padding: 10px;
  }

  .box-container{
    padding: 10px
  }

  .box-content{
    height: 305px;
  }

  .box-invited{
    font-size: 20px;
    font-weight: bold;
    color: var(--main-theme);
    text-align: center;
  }

  .box-order{
    font-size: 15px;
    color: black;
    text-align: center;
  }

  .box-image{
    margin: 10px;
    text-align: center;
  }
  .box-input{
    height: 100px;
  }

  .box-progress{
    padding: 0px 15px 0px 15px;
    height: 30px;
  }

  .box-button{
    height: 100%;
  }

  .newPassword{
    margin-bottom: 8px;
  }
  .confirmPassword{

  }

  .custom-input{
    transition: 0.5s;
  }
  .custom-input:focus {
    border: 1px solid rgb(163, 161, 161);
    box-shadow: 0 0 0 0 rgba(163, 161, 161);
  }

  .filler-empty{
    height: 7px;
    border-radius: 2px;
    border: 1px solid rgb(211, 210, 210);
    margin: 3px;
  }

  .filler1{
    height: 7px;
    border-radius: 2px;
    background-color: #ee4c4c;
    margin: 3px;
  }

  .filler2{
    height: 7px;
    border-radius: 2px;
    background-color: #f78c4f;
    margin: 3px;
  }

  .filler3{
    height: 7px;
    border-radius: 2px;
    background-color: #addd3d;
    margin: 3px;
  }

  .filler4{
    height: 7px;
    border-radius: 2px;
    background-color: #1ec743;
    margin: 3px;
  }

  .filler5{
    height: 7px;
    border-radius: 2px;
    background-color: #2253be;
    margin: 3px;
  }

  .box-strength-msg {
    height: 35px;
    font-size: 12px;
    font-weight: bold;
  }

  .tenant_name{
    color: #2253be;
  }

</style>
