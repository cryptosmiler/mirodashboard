<template lang="html">
  <b-container>
    <div class="account-password-container">
      <p class="account-password-reset-title"> {{ $t('settings.profile.mfa.title')}}</p>
      <div class="account-password-reset text-center" v-if="step == 1">
        <div class="comment">
          Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
        </div>
        <br>
        <b-button variant="success" class="round-button" @click="enableMfa">Enable two-factor authentication</b-button>
      </div>
      <div v-if="step==2" class="bigTitle">
        <h4>Setup authenticator app</h4>
        <div>
          Authenticator apps and browser extensions like <a href="https://chrome.google.com/webstore/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa">1Password</a>, <a href="https://chrome.google.com/webstore/detail/authy/gaedmjdfmmahhbjefcbgaolhhanlaolb">Authy</a>, <a href="https://learn.microsoft.com/en-us/answers/questions/1340213/microsoft-authenticator-autofill-chrome-extension">Microsoft Authenticator</a>, etc. generate one-time passwords that are used as a second factor to verify your identity when prompted during sign-in.
        </div>
        <br>
        <h6>
          1. Scan the QR code
        </h6>
        <div>
          Use an authenticator app or browser extension to scan. Learn more about enabling 2FA.
        </div>
        <canvas id="qrcode-2" class="outline-box"></canvas>
        <br>
        <div>Unable to scan? You can use the <label class="setupkey" @click="showKey" v-b-modal="'asd'">setup key</label> to manually configure your authenticator app.</div>
        <b-modal id="asd" hide-footer size = "lg">
          <div class="codeField">Secret Code : <label class="code">{{ secretCode }}</label><i class="fa fa-copy copy-button" @click="copyClipboard"></i></div>
        </b-modal>
        <br>
        <h6>
          2. Verify the code from the app
        </h6>
        <input type="text" placeholder="XXXXXX" v-model="verifyCode" required class="verifyInput">
        <div class="line"></div>
        <div class="divUnderLine">
          <b-button class="round-button2 letter-button" @click="stepBack"> Cancel </b-button>
          <b-button variant="success" class="round-button2" @click="onverifyinputchange"> Verify </b-button>
        </div>
      </div>
      <div class="account-password-reset text-center" v-if="step == 3">
        <div class="comment">Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.</div>
        <br>
        <div>
          <b-button id="show-btn" @click="$bvModal.show('bv-modal-example')" variant="danger" class="round-button">Disable two-factor authentication</b-button>

          <b-modal id="bv-modal-example" hide-footer>
            <template #modal-title>
              Disable 2FA authentication?
            </template>
            <div class="radius-body">
              <p>Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.</p>
              <p>Runnertag.com highly recommends that you keep two-factor authentication enabled on your account. If you need to change your configuration, or generate new recovery codes, you can do that in the settings below.</p>
            </div>
            <div class="radius-btn-group">
              <b-button @click="$bvModal.hide('bv-modal-example')">Cancel</b-button>
              <b-button variant="danger" @click="disableMfa">Disable</b-button>
            </div>
          </b-modal>
        </div>
      </div>
      <br>
    </div>
</b-container>
</template>

<script>
import VuePassword from 'vue-password/dist/custom'
import { mapGetters } from 'vuex'
import QRious from 'qrious'
import EventBus from "../../event-bus";

export default {
  name: 'account-mfa',
  data () {
    return {
      step: 1,
      verifyCode: '',
      secretCode: '',
      mfaStatus: false,
    }
  },
  computed: {
    ...mapGetters('Auth', ['profile']),
  },
  methods: {
    enableMfa(){
      const req = {
        user_id : this.profile.user_id
      }
      EventBus.$emit('change-loader-state', true)
      this.step = 2
      this.$store.dispatch('Auth/enableMfa', req).then((resp) => {
        console.log("resp -> ", resp)
        this.secretCode = resp.code
        var qr = new QRious({
            element: document.getElementById('qrcode-2'),
            value: `otpauth://totp/Runnertag:${encodeURI(this.profile.email)}?secret=${this.secretCode}&issuer=Runnertag`,
            background: '#ffffff',
            backgroundAlpha: 1,
            foreground: '#000000',
            foregroundAlpha: 1,
            level: 'H',
            padding: 0,
            size: 180,
        });
        this.mfaStatus = true
        EventBus.$emit('change-loader-state', false)
      })
    },
    disableMfa(){
      EventBus.$emit('change-loader-state', true)
      this.$store.dispatch('Auth/disableMfa').then((resp) => {
        // $bvModal.hide('bv-modal-example')
        console.log("resp ----> ", resp.data.success)
        this.mfaStatus = false
        this.step = 1
        EventBus.$emit('change-loader-state', false)

        this.$toasted.show("Your MFA successfully disabled!", {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
      })
    },
    onverifyinputchange() {
      if(/^\d{6}$/.test(this.verifyCode)){
        const req = {
          initialpasscode : this.verifyCode
        }
        EventBus.$emit('change-loader-state', true)
        this.$store.dispatch('Auth/verifyInitialPasscode', req).then((resp) => {
          if(resp.status == "SUCCESS"){
            console.log("Verify Succeeded!")
            this.step = 3
            EventBus.$emit('change-loader-state', false)
            this.$toasted.show("Your MFA successfully enabled!", {
              duration: 3000,
              fullWidth: true,
              theme: "bubble",
              className: "link-copied",
              position: "bottom-center"
            });
          }
        })
      }
    },
    copyClipboard(){
      navigator.clipboard.writeText(this.secretCode)
    },
    stepBack() {
      this.step = 3
    },
    showKey(){
      
    }
  },
  watch: {
    
  },
  components: {
    
  },
  created(){
    this.$store.dispatch('Auth/getMfaEnabled').then((resp) => {
      console.log("resp -> ", resp)
      this.mfaStatus = resp.status[0]=="SOFTWARE_TOKEN_MFA" ? true : false
      if(this.mfaStatus){
        this.step = 3
      }
      console.log("resp -> ", resp.status[0])
      EventBus.$emit('change-loader-state', false)
    })
  }
}
</script>

<style lang="css">
  #qrcode-2 {
    max-width: 300px;
    max-height: 300px;
  }
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

  .round-button {
    border-radius: 7px;
  }

  .outline-box{
    border: 1px solid rgb(226, 226, 226);
    border-radius: 6px;
    padding: 15px 0px 0px 15px;
    margin: 10px 0px 10px 0px;
  }

  .copy-button{
    margin-left: 10px;
    cursor: pointer;
    color: #a1a1a1;
  }

  .copy-button:hover{
    color: #555555 !important;
  }

  .comment{
    text-align: left;
  }

  .radius-body{
    padding: 0px 12px 0px 12px;
  }

  .radius-btn-group{
    text-align: right;
    padding-right: 10px;
  }

  .bigTitle{
    margin-top: 20px;
    margin-left: 40px;
  }

  .commentLayout{
    margin-left: 40px;
  }

  .verifyInput{
    width: 205px;
    padding: 5px 10px 5px 10px;
    border-radius: 7px;
    border: 1px solid rgb(202, 202, 202);
  }

  .line{
    border: 1px solid rgb(233, 233, 233);
    margin-top: 13px;
    margin-right: 40px;
  }

  .divUnderLine{
    padding: 20px 40px;
    text-align: right;
  }

  .round-button2 {
    border-radius: 5px;
    padding: 7px 13px 7px 13px;
  }

  .letter-button {
    color: rgb(83, 83, 83);
    background-color: white;
    border: 0px;
    margin-right: 10px;
  }

  .letter-button:hover{
    background-color: #909192;
  }

  .setupkey{
    font-weight: bold;
    color: #218bff;
    cursor: pointer;
    text-decoration: underline;
  }

  .setupkey:hover{
    color: #1967bb;
  }

  .codeField {
    text-align: center;
    margin-top: 5px;
  }

  .code{
    font-weight: bold;
    font-size: 17px;
    padding: 5px;
    color: #1967bb;
    border: 1px solid #ccd0d8;
    border-style: dashed;
    border-radius: 10px;
    padding: 5px 20px 5px 20px;
    margin-left: 5px;
    background-color: #fcfcfc;
  }

</style>
