<template lang="html">
  <b-container> 
    <div class="account-information-container">
      <p class="account-information-title">
        Account
        <div class="text-right required-fields">*required fields</div>
      </p>
      <div class="account-information">
        <b-form>
          <b-row>
            <b-col cols="12" md="6">
              <b-form-group label="Company Name *"
                          label-for="account-company"
                          class="red">
                <b-form-input id="account-company"
                            type="text"
                            v-model="form.account_name"
                            @change="makeChange"
                            required>
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="12" md="6">
              <b-form-group label="Company Website"
                            label-for="company-website">
                <b-form-input id="company-website"
                              type="text"
                              v-model="form.account_url"
                              @change="makeChange"
                              >
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" lg="6">
              <div class="d-flex flex-row justify-content-between">
                <b-form-group label="Company Logo"
                            label-for="custom-logo">
                  <label for="custom-logo">
                    <div class="img-wrapper" @mouseover="handleMouseOver1" @mouseleave="handleMouseLeave1" @dragover.prevent="handleMouseOver1">
                      <upload-component v-show="showUploader1" />
                      <img :src = "brandLogoSrc" class="img-brand-logo" v-show="!showUploader1">
                    </div>
                  </label>
                </b-form-group>
              </div>
              <div class="d-flex flex-row justify-content-between">
                <label for="custom-watermark">
                  Custom purchase watermark?
                </label>
                <label class="switch">
                  <input
                    type="checkbox"
                    name="custom-watermark"
                    id="custom-watermark"
                    v-model="custom_watermark"
                    @change="makeChange"
                  />
                  <span class="slider round"></span>
                </label>
              </div>
              <div v-show="custom_watermark">
                <b-form-group label=""
                            label-for="custom-logo">
                    <label for="custom-logo">
                  <div class="img-wrapper" @mouseover="handleMouseOver2" @mouseleave="handleMouseLeave2" @dragover.prevent="handleMouseOver2">
                    <upload-component-watermark-overlay v-show="showUploader2" />
                    <img :src = "watermarkOverlaySrc" class="img-logo" v-show="!showUploader2">
                  </div>
                  </label>
                </b-form-group>
                <div v-if="loadingPreview == -1" disabled>No overlay yet..</div>
                <div v-if="loadingPreview == 1 && showUploadingProgress" disabled>Preparing the Watermark Overlay preview...</div>
                <b-button v-b-modal.modal-center v-if = "loadingPreview == 0" class="preview-btn">Preview Watermark Overlay</b-button>
                <b-modal id="modal-center" size = "xl" centered title="Watermark Overlay Preview" hide-footer hide-header no-fade class="custom-animation">
                  <div class="modal-background">
                    <b-row style="padding: 10px;">
                      <b-col cols="12" v-show="loadingPreview == 0 && previewImages.length > 0">
                        <b-row class="preview-wrapper">
                          <b-col cols = "6">
                            <div class="overlay-title">LANDSCAPE</div>
                            <img :src="`data:image/jpeg;base64,${image(0)}`" class="full-width" />
                          </b-col>
                          <b-col cols = "6">
                            <div class="overlay-title">PORTRAIT</div>
                            <img :src="`data:image/jpeg;base64,${image(1)}`" class="full-width" />
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </div>
                </b-modal>
              </div>
            </b-col>
            <b-col cols="6" class="text-uppercase">
              <b-form-group
                label-for="defaults"
                label="event defaults"
              >
              <div class="event-details-wrapper">
                <b-row>
                  <b-col cols="2" md="1">
                  </b-col>
                  <b-col cols="10" md="11">
                    <label for="" class="input-label" >Currency</label>
                  </b-col>
                  <b-col cols="2" md="1" class="icons text-right">
                    <i class="fas fa-dollar-sign icon-scale-up"></i>
                  </b-col>
                  <b-col cols="10" md="11">
                    <b-form-select @change="makeChange" class="b-form-custom" v-model="form.currency" :options="getCurrencies"></b-form-select>
                  </b-col>
                </b-row>
                <br>

                <b-row>
                  <b-col cols="2" md="1">
                  </b-col>
                  <b-col cols="9" md="11">
                    <label for="" class="input-label" >Language</label>
                  </b-col>
                  <b-col cols="2" md="1" class="icons text-right">
                    <i class="fas fa-globe icon-scale-up"></i>
                  </b-col>
                  <b-col cols="10" md="11">
                    <b-form-select @change="makeChange" class="b-form-custom" v-model="form.language" :options="languages"></b-form-select>
                  </b-col>
                </b-row>
                <br>

                <b-row>
                  <b-col cols="2" md="1">
                  </b-col>
                  <b-col cols="9" md="11">
                    <label for="" class="input-label" >Timezone</label>
                  </b-col>
                  <b-col cols="2" md="1" class="icons text-right">
                    <i class="fas fa-clock icon-scale-up"></i>
                  </b-col>
                  <b-col cols="10" md="11">
                    <b-form-select @change="makeChange" class="b-form-custom" v-model="form.timezone" :options="timezone2"></b-form-select>
                  </b-col>
                </b-row>
              </div>
              </b-form-group>
            </b-col>
          </b-row>
          <button @click="onSubmit" variant="secondary" class="save-button" :class="{hasChanges: changesMade}" :disabled="!changesMade">SAVE</button>
        </b-form>
      </div>
    </div>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from "../../event-bus";
import UploadComponent from './UploadComponent.vue';
import UploadComponentWatermarkOverlay from './UploadComponentWatermarkOverlay.vue';

import { listTz, clientTz } from 'timezone-select-js';
import { SELECT_LANGUAGES, SELECT_CURRENCIES } from "@/constants";

import 'animate.css';

export default {
  name: 'tenant-information',
  components: {
    UploadComponent,
    UploadComponentWatermarkOverlay
  },
  data () {
    return {
      form: {},
      brandLogoSrc : "",
      watermarkOverlaySrc : "",
      custom_watermark: 0,
      previewImages: [],

      selected_module: clientTz(),
      timezones_module: listTz(),
      
      showUploader1 : false,
      showUploader2 : false,
      changesMade: false,
      loadingPreview: -1,
      showUploadingProgress: false,
      languages: SELECT_LANGUAGES,
      currencies: SELECT_CURRENCIES,
      timezone2:[],
      freeze1: false,
      freeze2: false,
    }
  },
  methods: {
    onSubmit () {
      EventBus.$emit("post-tenant-logo")
    },
    makeChange(){
      this.changesMade = true
    },
    image(key){
      return this.previewImages[key]
    },
    handleMouseOver1(){
      this.showUploader1 = true
    },
    handleMouseOver2(){
      this.showUploader2 = true
    },
    handleMouseLeave1(){
      if(this.brandLogoSrc!="" && !this.freeze1){
        this.showUploader1 = false
      }
    },
    handleMouseLeave2(){
      if(this.watermarkOverlaySrc!="" && !this.freeze2){
        this.showUploader2 = false
      }
    },
  },
  computed: {
    ...mapGetters('Auth', ['profile','isAdmin']),
    ...mapGetters("Prices", ["getPricesForCurrencyCodeAndType", "getCurrencies","getPricesForCurrencyCode"]),
    email_address(){
      return this.profile.email
    }
  },
  created () {
    this.$store.dispatch("Prices/loadPrices")

    this.showUploadingProgress = true
    this.timezone2 = []
    this.timezone2 = this.timezones_module.map((e) =>  { 
      return {
        value: e.value,
        text: e.label 
      }
    })
    this.form = this.profile.account
    this.custom_watermark = this.profile.account.watermark_overlay_id?1:0
    console.log("this.form --> ", this.form)
    this.brandLogoSrc = this.profile.account.logo_media_key?`${process.env.S3_IMAGE_URL}/${this.profile.account.logo_media_key}`:null
    this.watermarkOverlaySrc = this.profile.account.watermark_media_key?`${process.env.S3_IMAGE_URL}/${this.profile.account.watermark_media_key}`:null
    const req = {media_key : this.profile.account.watermark_media_key}

    this.loadingPreview = -1
    if(this.profile.account.watermark_media_key){
      this.loadingPreview = 1
    }
    //this.loadingPreview = -1
    if(this.watermarkOverlaySrc){
      this.$store.dispatch('Auth/getWatermarkOverlay', req).then((resp) => {
        this.showUploadingProgress = false
        this.loadingPreview = 0
        this.previewImages = resp.images
      })
    }
  },
  mounted(){
    EventBus.$on("freeze1", payload=>{
      console.log("payload ==> ", payload)
      if(payload == true){
        this.showUploader1 = true
        this.freeze1 = true
      }else{
        this.showUploader1 = false
        this.freeze1 = false
      }
      console.log("this.showUploader1 -> ", this.showUploader1)
    })
    EventBus.$on("freeze2", payload2=>{
      console.log("payload2 ==> ", payload2)
      if(payload2 == true){
        this.showUploader2 = true
        this.freeze2 = true
      }else{
        this.showUploader2 = false
        this.freeze2 = false
      }
      console.log("this.showUploader2 -> ", this.showUploader2)
    })
    EventBus.$on("change-made", () => {
      if(!this.showUploadingProgress){
        this.changesMade = true
      }
    })
    EventBus.$on("change-made0", () => {
      this.changesMade = true
    })
    EventBus.$on("progressing", ()=>{
      this.showUploadingProgress = true
      this.loadingPreview = 1
      EventBus.$emit("post-tenant-watermark-overlay")
    })
    EventBus.$on("preview-ready", resp => {
      this.showUploadingProgress = false
      this.loadingPreview = 0
      this.previewImages = []
      this.previewImages = resp.images
      this.form.watermark_overlay_id = resp.overlay_id
      this.changesMade = true
    })
    EventBus.$on("go-on-updating-tenant", resp0=> {
      if(resp0.changed){
        this.form.client_brand_image_id = resp0.media_id
      }
      if(!this.custom_watermark){
        this.form.watermark_overlay_id = null
      }
      this.$store.dispatch('Auth/putTenantProfile', this.form).then((resp) => {
        if (resp.status) {
          this.brandLogoSrc = resp.account.logo_media_key?`${process.env.S3_IMAGE_URL}/${resp.account.logo_media_key}`:null
          this.watermarkOverlaySrc = resp.account.watermark_media_key?`${process.env.S3_IMAGE_URL}/${resp.account.watermark_media_key}`:null
          if(!resp.account.watermark_media_key){this.loadingPreview = -1}
          this.form = resp.account
          this.custom_watermark = resp.account.watermark_overlay_id?1:0
          EventBus.$emit("set-media_id-on-upload-component", resp.account.client_brand_image_id)
          EventBus.$emit("empty-dropzone")
        }
      })

      this.changesMade = false
    })
  },
  destroyed(){
    EventBus.$off("go-on-updating-tenant")
  }
}
</script>

<style lang="scss" scoped>

  @mixin checkers($size: 50px, $contrast: 0.07) {
    $checkerColor: rgba(#000, $contrast);
    $angle: 45deg;
    $tp: 25%;

    background-image: linear-gradient($angle, $checkerColor $tp, transparent $tp),
      linear-gradient(-$angle, $checkerColor $tp, transparent $tp),
      linear-gradient($angle, transparent 3 * $tp, $checkerColor 3 * $tp),
      linear-gradient(-$angle, transparent 3 * $tp, $checkerColor 3 * $tp);
    background-size: $size $size;
    background-position: 0 0, 0 $size/2, $size/2 -1 * $size/2, -1 * $size/2 0;
  }

  .account-information-container {
    background: #fff;
    box-shadow: 0px 4px 10px 1px rgba(204,204,204,1);
  }

  .account-information-title {
    font-size: 20px;
    padding: 1.5em 2em;
    color: #a0a9b8;
    margin: 0;
    font-weight: 500;
    border-bottom: 1px solid #ccd0d8;
  }

  .account-information {
    padding: 3em;
    margin-bottom: 2em;
    color: #a0a9b8 !important;
    padding-bottom: 5em;
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
    box-shadow: 0px 4px 10px 1px rgba(204,204,204,1);
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

  .full-width{
    width: 100%;
    margin: auto;
    border: 4px solid rgb(240, 240, 240);
    border-radius: 4px;
    animation: fadeInAnime 2.5s;
  }

  .preview-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-background{
    background-color: rgb(210, 210, 210);
    margin: -23px -15px -23px -15px;
    padding: 20px;
    border: 7px solid grey;
    border-radius: 5px;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  }

  .red{
    color: red;
  }

  .required-fields{
    margin-right: 30px;
    transform: translate(0, -55px);
    color: #a0a9b8;
  }

  .img-logo{
    max-width: 270px;
    max-height: 270px;
    margin: auto;
  }

  .img-brand-logo{
    margin: auto;
    width: 80%;
  }

  
  .img-wrapper{
    @include checkers(4px, 0.2 );
    width : 300px;
    height : 285px;
    border: thick dashed gray;
    border-radius: 1em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
  }

  .preview-btn{
    border-radius: 5px;
    background-color: var(--main-theme);
    border: 0px solid grey;
  }
  .preview-btn:hover{
    background-color: grey;
  }

  @keyframes fadeInAnime {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .overlay-title{
    color: rgb(182, 60, 80);
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    animation: fadeInAnime 2s;
    margin-bottom: 5px;
  }

  .b-form-custom{
    border: 0px;
    border-bottom: 1px solid rgb(211, 211, 211);
    padding-left: 0px;
  }

  .icon-scale-up{
    transform: scale(1.7, 1.7) translate(5px, 5px);
  }

  .event-details-wrapper{
    margin-left: -10px;
    margin-top: 5px;
  }

</style>