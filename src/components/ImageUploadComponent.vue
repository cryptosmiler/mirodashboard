<template lang="html">
  <b-col
    class='image-upload-component'
    :class="{isActive : currentUploadComponentActive, [parent]: true}">
    <div id="vue-image-upload-area">
      <vue-dropzone
        ref="myVueDropzone"
        id="image-upload-area"
        :options="dropzoneOptions"
        @vdropzone-file-added="uploadImage"
        @vdropzone-success="uploadedImage"
      >
      </vue-dropzone>
    </div>
    <!-- <div class="img-preview" v-show="showPreview"><div><img :src="previewPath"></div></div> -->

    <div v-if="parent == 'sponsor'" id="sponsorOrder">
      <span class="drag-prompt">Drag to rearrange</span>
      <div class="sponsor-logo-element" v-for="(logoObj, index) in getSponsorLogos()">
        <b-row>
          <b-col cols="1" class="no-padding"><i class="fas fa-upload"></i></b-col>
          <b-col cols="2" class="no-padding"><img :src="getImage(logoObj)"/></b-col>
          <b-col cols="2" class="text-right no-padding" style="padding-top: 12px;"><span class="sponsor-text-outer"><span>URL: </span></span></b-col>
          <b-col cols="6" style="padding-top: 4px;"><input class="sponsor-link-input" type="text" v-model="logoObj.link" @input="linkChanged('sponsor', index)"></b-col>
          <b-col cols="1" class="no-padding text-right"><i class="fas fa-times" @click="showAlert(logoObj.media_id)"></i></b-col>
        </b-row>
        <div class="sponsor-logo-confirm d-none" :uuid="logoObj.newUpload ? logoObj.media_id : logoObj.filename">
          <b-row>
            <b-col cols="6" class="text-right"><button @click="toogleAlert(logoObj.media_id)">Cancel</button></b-col>
            <b-col cols="6" class="text-left"><button @click="removeSponsorLogo(logoObj.media_id)">Delete</button></b-col>
          </b-row>
        </div>
      </div>
    </div>

    <div v-if="parent == 'organiser'" id="organiserOrder">
      <span class="drag-prompt">Drag to rearrange</span>
      <div class="organiser-logo-element" v-for="(logoObj, index) in getOrganiserLogos()">
        <b-row>
          <b-col cols="1" class="no-padding"><i class="fas fa-upload"></i></b-col>
          <b-col cols="2" class="no-padding"><img class="img-fluid" :src="getImage(logoObj)"/></b-col>
          <b-col cols="2" class="text-right no-padding" style="padding-top: 12px;"><span class="organiser-text-outer"><span>URL: </span></span></b-col>
          <b-col cols="6" style="padding-top: 4px;"><input class="organiser-link-input" type="text" v-model="logoObj.link" @input="linkChanged('organiser', index)"></b-col>
          <b-col cols="1" class="no-padding text-right"><i class="fas fa-times" @click="showAlertOrganiser(logoObj.media_id)"></i></b-col>
        </b-row>
        <div class="organiser-logo-confirm d-none" :uuid="logoObj.newUpload ? logoObj.media_id : logoObj.filename">
          <b-row>
            <b-col cols="6" class="text-right"><button @click="toogleAlertOrganiser(logoObj.media_id)">Cancel</button></b-col>
            <b-col cols="6" class="text-left"><button @click="removeOrganiserLogo(logoObj.media_id)">Delete</button></b-col>
          </b-row>
        </div>
      </div>
    </div>

    <div v-if="parent == 'stickers'" id="stickersOrder">
      <!-- <span class="drag-prompt">Drag to rearrange</span> -->
      <div class="stickers-element" v-for="(stickerObj, index) in getStickers()">
        <b-row>
          <b-col cols="2" class="no-padding my-auto"><i class="fas fa-upload"></i></b-col>
          <b-col cols="2" class="no-padding my-auto"><img class="img-fluid" :src="getSticker(stickerObj)"/></b-col>
          <b-col cols="6"  class="my-auto no-padding" >
            <div class="dropdown position-dropdown-menu">
              <button class="dropdown-toggle position-dropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="selected-position">
                  <span style="float:left;">
                    {{capitalizeFirstChar(stickerObj.sticker_type)}}
                  </span>
                </span>
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <button
                  class="dropdown-item"
                  type="button"
                  v-for="(type) in sticker_type"
                  :key="type"
                  @click="selectStickerType(type, index)">
                  {{capitalizeFirstChar(type)}}
                </button>
              </div>
            </div>
          </b-col>
          <b-col cols="2" class="no-padding "><i class="fas fa-times" @click="showAlertStickers(stickerObj.media_id)"></i></b-col>
        </b-row>
        <!-- <div class="stickers-confirm d-none" :uuid="(stickerObj.newUpload != undefined) ? stickerObj.media_id : stickerObj.sticker_id"> -->
        <div class="stickers-confirm d-none" :uuid="stickerObj.media_id">
          <b-row>
            <b-col cols="6" class="text-right"><button @click="toogleAlertStickers(stickerObj.media_id)">Cancel</button></b-col>
            <b-col cols="6" class="text-left"><button @click="removeStickers(stickerObj.media_id)">Delete</button></b-col>
          </b-row>
        </div>
      </div>
    </div>

    <div v-if="parent == 'vips'" >
      <span class="">Upload your VIP headshots (drag to change the display order)</span>
      <draggable v-model="vips_detail" 
                    @end="onVipDragEnd" 
                 @change="vipsOrderChanged"
               animation="200" 
                   class="d-flex flex-row flex-wrap justify-content-center " 
                  handle=".handle"
               dragClass="dragging"
              ghostClass="ghost"
                          >
          <div class="vips-card" v-for="(vipsObj, index) in getVipsDetail()" :key="vipsObj.media_id">
            <div>
              <div class="d-flex justify-content-between text-dark">
                <i class="fa fa-bars fa-2x  handle"></i> 
                <span>{{ index+1 }}</span>
              </div>
              <div class="vips-image handle"><img :src="getImage(vipsObj)"/></div>
              <div class="flex-grow-1 vips-form py-2">
                <div class="d-flex flex-column">
                  <span class="vips-text-outer"><span>First Name: </span></span>
                  <input class="vips-link-input" type="text" v-model="vipsObj.first_name" @input="vipsData('first_name', index)">
                  <span class="vips-text-outer"><span>Last Name: </span></span>
                  <input class="vips-link-input" type="text" v-model="vipsObj.last_name" @input="vipsData('last_name', index)">
                  <span class="vips-text-outer"><span>(Job) Title: </span></span>
                  <input class="vips-link-input" type="text" v-model="vipsObj.title" @input="vipsData('title', index)">
                  <span class="vips-text-outer"><span>Location: </span></span>
                  <input class="vips-link-input" type="text" v-model="vipsObj.location" @input="vipsData('location', index)">
                  <span class="vips-text-outer"><span>Company/Organisation : </span></span>
                  <input class="vips-link-input" type="text" v-model="vipsObj.company_name" @input="vipsData('company_name', index)">
                </div>
              </div>
              <span class="flex-shrink align-self-end hover-black"><i class="fas fa-trash" @click="showAlertVips(vipsObj.media_id)"></i></span>
            </div>
            <div class="vips-detail-confirm d-none" :uuid="vipsObj.newUpload ? vipsObj.media_id : vipsObj.filename">
              <b-row>
                <b-col cols="6" class="text-right"><button @click="toogleAlertVips(vipsObj.media_id)">Cancel</button></b-col>
                <b-col cols="6" class="text-left"><button @click="removeVipsDetail(vipsObj.media_id)">Delete</button></b-col>
              </b-row>
            </div>
          </div>
      </draggable>
    </div>
    <!-- <div class="removeOverlay"
      :class="{removeOverlayActive : currentUploadComponentActive }"
      @click="showConfirm = !showConfirm"
      v-show="!showConfirm && currentUploadComponentActive">
      <div class="remove-file">
        <span style="font-size:2em;">
          <i class="far fa-trash-alt"></i>
        </span>
        <br>
        <span>Remove File</span>
      </div>
    </div> -->

        <!-- <div class="removeOverlay"
      :class="{removeOverlayActive : currentUploadComponentActive }"
      @click="showConfirm = !showConfirm"
      v-show="!showConfirm && currentUploadComponentActive">
      <div class="remove-file">
        <span style="font-size:2em;">
          <i class="far fa-trash-alt"></i>
        </span>
        <br>
        <span>Remove File</span>
      </div>
    </div> -->

    <!-- <div class="confirmOverlay" v-show="showConfirm">
      <div class="remove-file">
        <span>Are you sure?</span>
        <br>
        <div class="cancel-remove-buttons">
          <button
            type="button"
            name="button"
            @click="showConfirm = !showConfirm"
            class="cancel-remove"
            >
            <span style="font-size:1em;">
              <i class="fas fa-times"></i>
            </span>
            CANCEL
          </button>
          <button
            type="button"
            name="button"
            @click="clickRemove"
            class="cancel-remove"
            >
            <span style="font-size:1em;">
              <i class="far fa-trash-alt"></i>
            </span>
            REMOVE
          </button>
        </div>
      </div>
    </div> -->
  </b-col>
</template>

<script>

import vue2Dropzone from 'vue2-dropzone'
import storage from '@/utils/storage'
import { AUTH_TOKENS_STORAGE_KEY } from '@/constants'
import { mapGetters, mapActions} from 'vuex'
import store from '@/store'
import EventBus from '../event-bus'
import {setEventSetting, setEventStickers, getEventStickers, postEventMedia, removeEventSticker, updateEventSticker} from '@/api'
import jquery from 'jquery'
import Sortable from 'sortablejs'
import draggable from 'vuedraggable'
import _ from 'lodash'

const $ = jquery

export default {
  name: "image-upload-component",
  data() {
    return {
      showConfirm: false,
      image: "",
      showPreview: false,
      previewPath: "",
      add_overlay: this.$store.getters["Events/getEventOverlay"].enabled,
      dropzoneOptions: {
        url: `${process.env.API_BASE_URL}events/${
          store.getters["Events/getSelectedEvent"].event_id
        }/media`,
        thumbnailHeight: 100,
        thumbnailWidth: 200,
        parallelUploads: 4,
        autoProcessQueue: false,
        destroyDropzone: false,
        maxFilesize: this.getMaxFileSize(),
        paramName: "image",
        headers: {
          Authorization: `Bearer ${
            storage.load(AUTH_TOKENS_STORAGE_KEY).AccessToken
          }`
        },
        thumbnailMethod: "contain",
        // resizeHeight: 100,
        // resizeWidth: 100,
        maxFiles: this.getMaxFiles(),
        // addRemoveLinks: this.parent == 'sponsor' || this.parent == 'organiser'? false : true,
        addRemoveLinks: false,
        acceptedFiles: "image/jpeg, image/png",
        dictDefaultMessage: `
        <div class="dz-details ${this.parent}">
          <div class="img-preview"><span class="img-preview-hover-text"></span><div><img class="img-fluid"/></div></div>
          <div id="image-upload-area-inner" class="image-upload-area-inner">
            <i class="fas fa-upload"></i>
            <br>
            <span>Drag files to upload or</span>
            <br>
            <span class="choose-file"
              style="
                border: 1px solid #979797;
                display: block;
                width: 150px;upd
                padding: 5px 0px;
                margin: 5px auto;"
            >CHOOSE FILE</span>
            <span>Supports JPG or PNG files less than 1MB in size. Suggested dimensions (400px x 400px)</span>
            <span>${process.env.API_BASE_URL}events/${
          store.getters["Events/getSelectedEvent"].event_id
        }/media</span>
            <div class="overlay-preview-img ${
              this.parent
            } hidden"><img class="img-fluid"/></div>
          </div>
        </div>
        `
      },
      uploadComponents: ["logo", "left", "right", "center"],
      uploaded: 0,
      current_sponsor_logos: this.$store.getters["Events/getSelectedEvent"]
        .setting.sponsor_logos,
      sponsor_logos: [],
      clone_sponsor_logos: [],
      sponsor_logos_to_add: [],
      current_organiser_logos: this.$store.getters["Events/getSelectedEvent"]
        .setting.organiser_logos,
      organiser_logos: [],
      clone_organiser_logos: [],
      organiser_logos_to_add: [],
      // current_stickers : this.$store.getters['Events/getSelectedEvent'].setting.stickers,
      current_stickers : [],
      // current_stickers: [],
      stickers: [],
      // clone_stickers: this.$store.getters['Events/getSelectedEvent'].stickers,
      clone_stickers: [],
      stickers_to_add: [],
      stickers_to_add_db: [],
      stickers_to_remove: [],
      stickers_to_update: [],
      sticker_type: ['norm', 'wide', 'tall'],
      // TODO: test with api
      current_vips_detail: this.$store.getters["Events/getSelectedEvent"]
        .setting.vips_detail,
      vips_detail: [],
      clone_vips_detail: [],
      vips_detail_to_add: [],
      sortable: null,
      isUploading: false
    };
  },
  methods: {
    // ...mapActions('EditEvent', ['changeEventValues']),
    getMaxFileSize() {
      var size = 3;
      if (
        this.parent == "logo" ||
        this.parent == "brand" ||
        this.parent == "left" ||
        this.parent == "right" ||
        this.parent == "center"
      ) {
        size = 1;
      }
      return size;
    },
    getMaxFiles() {
      return this.parent == 'sponsor' || this.parent == 'organiser' || this.parent == 'vips' || this.parent == 'stickers' ? 50 : 1
    },
    uploadImage(file) {
      this.parent === "vips"
        ? $(".dz-default.dz-message").attr("style", "display: block !important")
        : null;
      const maxSize = this.getMaxFileSize();

      // file width aand height can not get at first time, need settimeout to wait update
      // setTimeout(() => {
      //   if(file.width > 1200 || file.height > 1200){
      //     this.$refs.myVueDropzone.removeFile(file)
      //     this.$toasted.show(`Image size is too large. Max dimension is 1200 * 1200.`, {
      //       duration: 5000,
      //       fullWidth: true,
      //       theme: 'bubble',
      //       className: 'verify-email',
      //       position: 'bottom-center'
      //     })
      //   }
      // }, 500);

      if (file.size > maxSize * 1000000) {
        this.$refs.myVueDropzone.removeFile(file);
        this.$toasted.show(`Image size is too big. Max size is ${maxSize}MB.`, {
          duration: 5000,
          fullWidth: true,
          theme: 'bubble',
          className: 'verify-email',
          position: 'bottom-center'
        })
        return
      }
      else if (this.parent != 'sponsor' && this.parent != 'organiser' && this.parent != 'stickers' && this.parent != 'vips' && this.$refs.myVueDropzone.getQueuedFiles().length > 0) {
        console.log(`Upload from ${this.parent}`)
        this.$refs.myVueDropzone.removeFile(this.$refs.myVueDropzone.getQueuedFiles()[0])
      }

      let vm = this;
      let fileReader = new FileReader();
      var fileUrl = "";
      var pass = true;

      fileReader.onload = function(event) {
        fileUrl = event.target.result;
        if(vm.parent == 'sponsor' || vm.parent == 'organiser' || vm.parent == 'stickers' || vm.parent == 'vips') {
          // if(vm.$refs.myVueDropzone.getQueuedFiles().length + vm.$refs.myVueDropzone.getRejectedFiles().length + Object.keys(vm.current_sponsor_logos).length <= vm.getMaxFiles()) {
          if(vm.parent == 'sponsor' && vm.sponsor_logos.length < vm.getMaxFiles()) {
              vm.addSponsorLogo(file, fileUrl)
          } else if(vm.parent == 'organiser' && vm.organiser_logos.length < vm.getMaxFiles()) {
              vm.addOrganiserLogo(file, fileUrl)
          } else if(vm.parent == 'stickers' && vm.stickers.length < vm.getMaxFiles()) {
              vm.addStickers(file, fileUrl)
          } else if(vm.parent == 'vips' && vm.vips_detail.length < vm.getMaxFiles()) {
              vm.addVipsDetail(file, fileUrl)
          } else {
            if(vm.$refs.myVueDropzone.getRejectedFiles().length > 0) {
              const lastItem = vm.$refs.myVueDropzone.getRejectedFiles().length - 1
              vm.$refs.myVueDropzone.removeFile(vm.$refs.myVueDropzone.getRejectedFiles()[lastItem])
            }
            vm.$toasted.show(`Excess ${vm.getMaxFiles()} upload photos.`, {
              duration: 5000,
              fullWidth: true,
              theme: 'bubble',
              className: 'link-copied',
              position: 'bottom-center'
            })
          }
        }
        vm.current_thumbnails = Math.min(
          vm.$refs.myVueDropzone.dropzone.files.length,
          vm.getMaxFiles()
        );
        jquery(".dz-preview").css("width", 200 / vm.current_thumbnails);

        vm.$store.dispatch("ImageUploadComponent/updateImageInfo", {
          fieldName: vm.parent,
          name: vm.parent,
          active: true,
          fieldValue: fileUrl
        });
        // }
        // }
        // img.src = fileUrl
        if (
          vm.parent == "left" ||
          vm.parent == "right" ||
          vm.parent == "center" ||
          vm.parent == "logo" ||
          vm.parent == "brand"
        ) {
          $(`.dz-details.${vm.parent} .img-preview`).removeClass("show");
          $(`.dz-details.${vm.parent} .image-upload-area-inner`).removeClass(
            "hide"
          );
          if ( vm.parent == "left" || vm.parent == "right" || vm.parent == "center" )
          {
            vm.$store.dispatch("EditEvent/changeIsModifiedCheckpointOverlay", true)
          }
        }
      };
      fileReader.readAsDataURL(file);
    },
    uploadedImage(file, response) {
      let parent = this.parent;
      let setting = {};
      if (this.parent === "logo" || this.parent === "brand") {
        setting[this.parent] = {
          media_id: response.media.media_id
        };
        setEventSetting(this.getSelectedEvent.event_id, setting);
        // EventBus.$emit("change-loader-state", false);


        if (response && response.media) {
          this.$refs.myVueDropzone.removeFile(file);

          EventBus.$emit("show-img-preview", {
            parent: this.parent,
            url: response.media.media_key
          });
        }
        setTimeout(() => {
          EventBus.$emit("refresh-overview-iframe");
        }, 1500);
      } else if (this.parent === "sponsor") {
        const logos = this.sponsor_logos;
        for (const key in logos) {
          if (logos.hasOwnProperty(key)) {
            const logo = logos[key];
            if (logo.newUpload && logo.filename == response.originalname) {
              logos[key].newUpload = false;
              logos[key].media_id = response.media.media_key;
              logos[key].filename = response.media.media_key.split("\\").pop();
              break;
            }
          }
        }
        this.uploaded++;
        this.$refs.myVueDropzone.dropzone.processQueue();

        if (this.$refs.myVueDropzone.dropzone.files.length == this.uploaded) {
          EventBus.$emit("change-loader-state", false);
          this.isUploading = false
          this.$toasted.show("Logo Uploaded.", {
            duration: 3000,
            fullWidth: true,
            theme: "bubble",
            className: "link-copied",
            position: "bottom-center"
          });
          setting["sponsor_logos"] = this.convertLogoData(
            this.sponsor_logos
          );
          this.current_sponsor_logos = setting["sponsor_logos"];
          setEventSetting(this.getSelectedEvent.event_id, setting);
          this.$refs.myVueDropzone.removeAllFiles();
          this.uploaded = 0;
          this.$store.dispatch("EditEvent/changeIsDifferentValues", false);
          this.clone_sponsor_logos = this.cloneSponsorLogo(
            this.sponsor_logos
          );
          this.sponsor_logos = [];
          setTimeout(() => {
            this.sponsor_logos = this.cloneSponsorLogo(
              this.clone_sponsor_logos
            );
          }, 100);
          setTimeout(() => {
            EventBus.$emit("refresh-overview-iframe");
          }, 1500);
        }
      } else if (this.parent === "organiser") {
        const logos = this.organiser_logos;
        for (const key in logos) {
          if (logos.hasOwnProperty(key)) {
            const logo = logos[key];
            if (logo.newUpload && logo.filename == response.originalname) {
              logos[key].newUpload = false;
              logos[key].media_id = response.media.media_key;
              logos[key].filename = response.media.media_key.split("\\").pop();
              break;
            }
          }
        }
        this.uploaded++;
        this.$refs.myVueDropzone.dropzone.processQueue();

        if (this.$refs.myVueDropzone.dropzone.files.length == this.uploaded) {
          EventBus.$emit("change-loader-state", false);
          this.isUploading = false
          this.$toasted.show("Logo Uploaded.", {
            duration: 3000,
            fullWidth: true,
            theme: "bubble",
            className: "link-copied",
            position: "bottom-center"
          });
          setting["organiser_logos"] = this.convertLogoData(
            this.organiser_logos
          );
          this.current_organiser_logos = setting["organiser_logos"];
          console.log(`setting setting - ${JSON.stringify(setting)}`);
          setEventSetting(this.getSelectedEvent.event_id, setting);
          this.$refs.myVueDropzone.removeAllFiles();
          this.uploaded = 0;
          this.$store.dispatch("EditEvent/changeIsDifferentValues", false);
          this.clone_organiser_logos = this.cloneOrgainserLogo(
            this.organiser_logos
          );
          this.organiser_logos = [];
          setTimeout(() => {
            this.organiser_logos = this.cloneOrgainserLogo(
              this.clone_organiser_logos
            );
          }, 100);
          setTimeout(() => {
            EventBus.$emit("refresh-overview-iframe");
          }, 1500);
        }
      } else if (this.parent === 'stickers') {
        const stickers = this.stickers

        console.log(`STICKERS`, JSON.stringify(stickers))

        for (const key in stickers) {
          if (stickers.hasOwnProperty(key)) {
            let logo = stickers[key]
            console.log(logo.newUpload)
            console.log(logo.filename)
            console.log(response.originalname)
            if(logo.newUpload && logo.filename == response.originalname) {
              const newData = {}
              logo.media_id = response.media.media_id
              logo.newUpload = false
              this.stickers_to_add_db.push(logo)
              break
            }
          }
        }
        this.uploaded ++
        this.$refs.myVueDropzone.dropzone.processQueue()

        console.log(this.$refs.myVueDropzone.dropzone.files.length)
        console.log(this.uploaded)
        console.log(this.stickers_to_add_db.length)
        if (this.$refs.myVueDropzone.dropzone.files.length == this.uploaded) {
          EventBus.$emit('change-loader-state', false)
          this.isUploading = false
          this.$toasted.show('Sticker Uploaded.', {
            duration: 3000,
            fullWidth: true,
            theme: 'bubble',
            className: 'link-copied',
            position: 'bottom-center'
          })

          const convertedStickers = this.convertStickers(this.stickers_to_add_db)
          console.log(convertedStickers.length)

          console.log(`CONVERTED STICKERS`, convertedStickers)
          if (this.stickers_to_add_db && this.stickers_to_add_db.length) {
            setEventStickers(this.$store.getters['Events/getSelectedEvent'].event_id, convertedStickers).then(res => {
              if(res.data.success) {
                this.stickers_to_add_db = []
                // reload sticker here
                getEventStickers(this.$store.getters['Events/getSelectedEvent'].event_id).then(data => {
                  this.stickers = data.data.stickers
                })
              }
              this.$refs.myVueDropzone.removeAllFiles()
              this.uploaded = 0
              this.$store.dispatch('EditEvent/changeIsDifferentValues', false)
              this.clone_stickers = this.cloneStickers(this.stickers)
              this.stickers = []
              setTimeout(()=> {
                this.stickers = this.cloneStickers(this.clone_stickers)
              }, 100)
              setTimeout(()=> {
                EventBus.$emit('refresh-overview-iframe')
              }, 1500)
            })
          } else {
            // error 
            console.log('ERROR stickers_to_add_db == 0', this.stickers_to_add_db.length)
          }
        }
      } else if (this.parent === 'vips') {
        const details = this.vips_detail
        for (const key in details) {
          if (details.hasOwnProperty(key)) {
            const one_detail = details[key];
            if (
              one_detail.newUpload &&
              one_detail.filename == response.originalname
            ) {
              details[key].newUpload = false;
              details[key].media_id = response.media.media_key;
              details[key].filename = response.media.media_key
                .split("\\")
                .pop();
              break;
            }
          }
        }
        this.uploaded++;
        this.$refs.myVueDropzone.dropzone.processQueue();

        if (this.$refs.myVueDropzone.dropzone.files.length == this.uploaded) {
          EventBus.$emit("change-loader-state", false);
          this.isUploading = false
          // this.$toasted.show('Your changes have been updated.', {
          //   duration: 3000,
          //   fullWidth: true,
          //   theme: 'bubble',
          //   className: 'link-copied',
          //   position: 'bottom-center'
          // })
          console.log(`this.vips_detail - ${this.vips_detail.length}`)
          console.log(`details - ${details.length}`)
          setting["vips_detail"] = this.convertVipsDetailsData(
            this.vips_detail
          );
          this.current_vips_detail = setting["vips_detail"];
          console.log(`setting setting - ${JSON.stringify(setting)}`);
          setEventSetting(this.getSelectedEvent.event_id, setting).then(res => {
              if(res.data.success) {
                this.current_vips_detail = res.data.setting.vips_detail
                this.vips_detail = this.fillVipsDetail(this.current_vips_detail)
                this.clone_vips_detail = this.cloneVipsDetail(this.vips_detail)
              }
          })
          this.$refs.myVueDropzone.removeAllFiles();
          this.uploaded = 0;
          this.$store.dispatch("EditEvent/changeIsDifferentValues", false);
          // this.clone_vips_detail = this.cloneVipsDetail(this.vips_detail);
          // console.log(`vips_detail - ${JSON.stringify(this.vips_detail)}`)
          // console.log(`vips_detail - ${this.vips_detail.length}`)
          // console.log(`clone_vips_detail - ${JSON.stringify(this.clone_vips_detail)}`)
          // console.log(`clone_vips_detail - ${this.clone_vips_detail.length}`)
          // this.vips_detail = [];
          // setTimeout(() => {
          //   console.log(`clone_vips_detail - ${JSON.stringify(this.clone_vips_detail)}`)
          //   console.log(`clone_vips_detail - ${this.clone_vips_detail.length}`)
          //   this.vips_detail = this.cloneVipsDetail(this.clone_vips_detail);
          // }, 100);
          setTimeout(() => {
            EventBus.$emit("refresh-overview-iframe");
          }, 1500);
        }
      } else {
        this.$refs.myVueDropzone.removeFile(file);
        // let overlayRequest = this.$store.getters['Events/getEventOverlay']
        // overlayRequest.enabled = this.add_overlay

        // if(overlayRequest.overlay == null) {
        //   overlayRequest.overlay = {}
        //   overlayRequest.overlay[this.parent] = {'media_id': response.media.media_id}
        // } else {
        //   for (let key in overlayRequest.overlay) {
        //     if (key === this.parent) {
        //       overlayRequest.overlay[key] = {'media_id': response.media.media_id}
        //     }
        //   }
        // }
        let overlayRequest = {
          enabled: true,
          overlay: {}
        };
        overlayRequest.overlay.overlay_id = this.$store.getters[
          "EventCheckpoint/getOverlayId"
        ];
        overlayRequest.overlay[this.parent] = {
          media_id: response.media.media_id
        };
        const requestedObject = this.$store.getters[
          "EditEvent/getEventSettingsRequestObject"
        ];
        if (requestedObject.same_overlay != null) {
          overlayRequest.same_overlay = requestedObject.same_overlay;
        }
        this.$store.dispatch("Events/setEventOverlay", {
          overlayRequest,
          emit: true
        });
        setTimeout(() => {
          EventBus.$emit("refresh-overview-iframe");
        }, 1500);
      }

      EventBus.$emit("set-event-setting-success");
    },
    clickRemove(e) {
      this.showConfirm = false;
      this.$refs.myVueDropzone.removeAllFiles();
      this.$store.dispatch("ImageUploadComponent/updateImageInfo", {
        fieldName: this.parent,
        name: this.parent,
        active: false,
        image: "new-image"
      });
    },
    getImage(logo) {
      if (logo.newUpload) {
        return logo.url;
      } else {
        return `${process.env.S3_IMAGE_URL}/${logo.media_id}`;
      }
    },
    getSticker(stickers) {
      // console.log(`getSticker - ${JSON.stringify(stickers)}`)
      if (!stickers) {
        return
      }
      if(stickers.newUpload !== undefined && stickers.newUpload) {
        return stickers.url
      } else if(stickers.media && stickers.media.media_key !== undefined) {
        return `${process.env.S3_IMAGE_URL}/${stickers.media.media_key}`
      } else {
      }
    },
    fillSponsorLogos(list) {
      const result = [];
      for (const key in list[0]) {
        if (list[0].hasOwnProperty(key)) {
          const logoArray = list[0][key];
          const tmpObject = {};
          tmpObject.media_id = logoArray.image_key;
          tmpObject.link = logoArray.url ? logoArray.url : "";
          // if(tmpObject.link.startsWith("//")) {
          //   tmpObject.link = tmpObject.link.replace('//', 'https://')
          // }
          tmpObject.newUpload = false;
          // tmpObject.order = parseInt(key)
          tmpObject.filename = logoArray.image_key.split("\\").pop();
          result.push(tmpObject);
        }
      }
      return result;
    },
    fillOrganiserLogos(list) {
      const result = [];
      if (list) {
        for (const key in list[0]) {
          if (list[0].hasOwnProperty(key)) {
            const logoArray = list[0][key];
            const tmpObject = {};
            tmpObject.media_id = logoArray.image_key;
            tmpObject.link = logoArray.url ? logoArray.url : "";
            // if(tmpObject.link.startsWith("//")) {
            //   tmpObject.link = tmpObject.link.replace('//', 'https://')
            // }
            tmpObject.newUpload = false;
            // tmpObject.order = parseInt(key)
            tmpObject.filename = logoArray.image_key.split("\\").pop();
            result.push(tmpObject);
          }
        }
      }

      return result;
    },
    fillStickers(stickers) {
      const result = []
      if (stickers) {
        for (let x in stickers) {
          let sticker = stickers[x]
          const tmpObject = sticker
          tmpObject.newUpload = false
          tmpObject.filename = sticker.media && sticker.media.media_key? sticker.media.media_key.split("\\").pop() : ''
          result.push(tmpObject)
          // {
          //   "sticker_id":1036,
          //   "sticker_label":"Event Sticker",
          //   "media_id":4011,
          //   "event_id":100278,
          //   "width":1,
          //   "height":0.3,
          //   "fit":"cover",
          //   "sticker_type":"wide",
          //   "media":{
          //     "media_key":"IMAGES/MEDIA/63_100278_8qLQFVheb6rjfRGC.png",
          //     "media_type":"image/png"
          //     }
          // }
        }
      }
      return result
    },
    fillVipsDetail(list) {
      const result = []
      if (list) {
        for (const key in list[0]) {
          if (list[0].hasOwnProperty(key)) {
            const detailArray = list[0][key];
            const tmpObject = {};
            tmpObject.media_id = detailArray.image_key;
            tmpObject.link = detailArray.url ? detailArray.url : "";

            tmpObject.first_name = detailArray.first_name;
            tmpObject.last_name = detailArray.last_name;
            tmpObject.company_name = detailArray.company_name;
            tmpObject.title = detailArray.title;
            tmpObject.location = detailArray.location;

            // if(tmpObject.link.startsWith("//")) {
            //   tmpObject.link = tmpObject.link.replace('//', 'https://')
            // }
            tmpObject.newUpload = false;
            // tmpObject.order = parseInt(key)
            tmpObject.filename = detailArray.image_key.split("\\").pop();
            result.push(tmpObject);
          }
        }
      }
      return result;
    },
    getSponsorLogos() {
      const data = this.parent == "sponsor" ? this.sponsor_logos : [];
      return data;
    },
    getOrganiserLogos() {
      // console.log(' this.parent',  this.parent)
      // console.log(' this.organiser_logos',  this.organiser_logos)
      const data = this.parent == "organiser" ? this.organiser_logos : [];
      return data;
    },
    getStickers() {
      const data = this.parent == 'stickers' ? this.stickers : []
      return data
    },
    getVipsDetail() {
      const data = this.parent == "vips" ? this.vips_detail : [];
      return data;
    },
    setSponsorLogos(data) {
      this.sponsor_logos = data;
      if (data.length > 0)
        this.clone_sponsor_logos = this.cloneSponsorLogo(data);
    },
    setOrganiserLogos(data) {
      this.organiser_logos = data;
      if (data.length > 0)
        this.clone_organiser_logos = this.cloneOrgainserLogo(data);
    },
    setStickers(data) {
      this.stickers = data
      if(data.length > 0) this.clone_stickers = this.cloneStickers(data)
    },
    setVipsDetail(data) {
      this.vips_detail = data;
      if (data.length > 0) this.clone_vips_detail = this.cloneVipsDetail(data);
    },
    searchSponsorLogoIndex(id) {
      const data = this.sponsor_logos;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (element.media_id == id) {
            return { key: key, data: element };
          }
        }
      }
    },
    searchOrganiserLogoIndex(id) {
      const data = this.organiser_logos;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (element.media_id == id) {
            return { key: key, data: element };
          }
        }
      }
    },
    searchStickerIndex(id) {
      const data = this.stickers
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (element.media_id == id) {
            return { key: key, data: element };
          }
        }
      }
    },
    searchVipsDetailIndex(id) {
      const data = this.vips_detail;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (element.media_id == id) {
            return { key: key, data: element };
          }
        }
      }
    },
    showAlert(id) {
      const logo = this.searchSponsorLogoIndex(id).data;
      $(".sponsor-logo-confirm").addClass("d-none");

      const checkingTag = logo.newUpload ? logo.media_id : logo.filename;
      $(`div[uuid="${checkingTag}"]`).removeClass("d-none");
    },
    showAlertOrganiser(id) {
      const logo = this.searchOrganiserLogoIndex(id).data;
      $(".organiser-logo-confirm").addClass("d-none");

      const checkingTag = logo.newUpload ? logo.media_id : logo.filename;
      $(`div[uuid="${checkingTag}"]`).removeClass("d-none");
    },
    showAlertStickers(id) {
      const sticker = this.searchStickerIndex(id).data
      $('.stickers-confirm').addClass('d-none')

      const checkingTag = sticker.media_id
      // const checkingTag = (sticker.newUpload != undefined) ? sticker.media_id : sticker.sticker_id;
      // console.log('logo: ', sticker)
      // console.log('checkingTag: ', checkingTag)
      $(`div[uuid="${checkingTag}"]`).removeClass("d-none");
    },
    showAlertVips(id) {
      const detail = this.searchVipsDetailIndex(id).data;
      $(".vips-detail-confirm").addClass("d-none");

      const checkingTag = detail.newUpload ? detail.media_id : detail.filename;
      $(`div[uuid="${checkingTag}"]`).removeClass("d-none");
    },
    toogleAlert(id) {
      const logo = this.searchSponsorLogoIndex(id).data;
      const checkingTag = logo.newUpload ? logo.media_id : logo.filename;
      $(`div[uuid="${checkingTag}"]`).addClass("d-none");
    },
    toogleAlertOrganiser(id) {
      const logo = this.searchOrganiserLogoIndex(id).data;
      const checkingTag = logo.newUpload ? logo.media_id : logo.filename;
      $(`div[uuid="${checkingTag}"]`).addClass("d-none");
    },
    toogleAlertStickers(id) {
      const sticker = this.searchStickerIndex(id).data
      const checkingTag = sticker.media_id
      // const checkingTag = (sticker.newUpload != undefined) ? sticker.media_id : sticker.sticker_id
      $(`div[uuid="${checkingTag}"]`).addClass('d-none')
    },
    toogleAlertVips(id) {
      const detail = this.searchVipsDetailIndex(id).data;
      const checkingTag = detail.newUpload ? detail.media_id : detail.filename;
      $(`div[uuid="${checkingTag}"]`).addClass("d-none");
    },
    removeSponsorLogo(id) {
      const vm = this;
      const result = [];
      const index = this.searchSponsorLogoIndex(id).key;
      const element = vm.sponsor_logos[index];

      if (element.newUpload) {
        const filesRef = vm.$refs.myVueDropzone.getQueuedFiles();
        for (const key in filesRef) {
          if (filesRef[key].upload.uuid == element.media_id) {
            vm.$refs.myVueDropzone.removeFile(filesRef[key]);
            break;
          }
        }
      }

      // vm.sponsor_logos = vm.sortByKey(vm.sponsor_logos, 'order')
      var i = 0;
      for (const key in vm.sponsor_logos) {
        if (vm.sponsor_logos.hasOwnProperty(key)) {
          if (vm.sponsor_logos[key].media_id != element.media_id) {
            result[i] = vm.sponsor_logos[key];
            // result[i].order = i
            i++;
          }
        }
      }
      vm.clone_sponsor_logos = this.cloneSponsorLogo(result);
      vm.sponsor_logos = [];
      setTimeout(() => {
        vm.sponsor_logos = result;
        vm.$store.dispatch("EditEvent/changeIsDifferentValues", true);
      }, 1);
    },
    removeOrganiserLogo(id) {
      const vm = this;
      const result = [];
      const index = this.searchOrganiserLogoIndex(id).key;
      const element = vm.organiser_logos[index];

      if (element.newUpload) {
        const filesRef = vm.$refs.myVueDropzone.getQueuedFiles();
        for (const key in filesRef) {
          if (filesRef[key].upload.uuid == element.media_id) {
            vm.$refs.myVueDropzone.removeFile(filesRef[key]);
            break;
          }
        }
      }

      var i = 0;
      for (const key in vm.organiser_logos) {
        if (vm.organiser_logos.hasOwnProperty(key)) {
          if (vm.organiser_logos[key].media_id != element.media_id) {
            result[i] = vm.organiser_logos[key];
            // result[i].order = i
            i++;
          }
        }
      }
      vm.clone_organiser_logos = this.cloneOrgainserLogo(result);
      vm.organiser_logos = [];
      setTimeout(() => {
        vm.organiser_logos = result;
        vm.$store.dispatch("EditEvent/changeIsDifferentValues", true);
      }, 1);
    },
    removeStickers(id) {
      const vm = this
      const index = this.searchStickerIndex(id).key
      const element = vm.stickers[index]

      if (element.newUpload) {
        const filesRef = vm.$refs.myVueDropzone.getQueuedFiles();
        for (const key in filesRef) {
          if (filesRef[key].upload.uuid == element.media_id) {
            vm.$refs.myVueDropzone.removeFile(filesRef[key]);
            break;
          }
        }
      }

      var i = 0

      const result = vm.stickers.filter((sticker) => {
        // prepare to remove stickers that are already in the database
        if(sticker.media_id == element.media_id && !element.newUpload) {
            vm.stickers_to_remove.push(sticker.media_id)
        }
        return sticker.media_id != element.media_id
      })

      vm.clone_stickers = this.cloneStickers(result)
      vm.stickers = []
      setTimeout(() => {
        vm.stickers = result
        vm.$store.dispatch('EditEvent/changeIsDifferentValues', true)
      }, 1);
    },
    removeVipsDetail(id) {
      const vm = this;
      const result = [];
      const index = this.searchVipsDetailIndex(id).key;
      const element = vm.vips_detail[index];

      if (element.newUpload) {
        const filesRef = vm.$refs.myVueDropzone.getQueuedFiles();
        for (const key in filesRef) {
          if (filesRef[key].upload.uuid == element.media_id) {
            vm.$refs.myVueDropzone.removeFile(filesRef[key]);
            break;
          }
        }
      }

      var i = 0;
      for (const key in vm.vips_detail) {
        if (vm.vips_detail.hasOwnProperty(key)) {
          if (vm.vips_detail[key].media_id != element.media_id) {
            result[i] = vm.vips_detail[key];
            // result[i].order = i
            i++;
          }
        }
      }
      vm.clone_vips_detail = this.cloneVipsDetail(result);
      vm.vips_detail = [];
      setTimeout(() => {
        vm.vips_detail = result;
        vm.$store.dispatch("EditEvent/changeIsDifferentValues", true);
      }, 1);
    },
    addSponsorLogo(file, url) {
      const vm = this;
      vm.sponsor_logos_to_add.push({
        media_id: file.upload.uuid,
        newUpload: true,
        link: "",
        filename: file.upload.filename,
        url: url
      });
      vm.sponsor_logos = [];
      setTimeout(() => {
        if (vm.sponsor_logos_to_add.length > 0) {
          const tmpData = vm.cloneSponsorLogo(vm.clone_sponsor_logos);
          for (const key in vm.sponsor_logos_to_add) {
            tmpData.push(vm.sponsor_logos_to_add[key]);
          }
          vm.sponsor_logos_to_add = [];
          vm.sponsor_logos = tmpData;
          vm.clone_sponsor_logos = vm.cloneSponsorLogo(tmpData);
        }
      }, 10);
    },
    addOrganiserLogo(file, url) {
      const vm = this;
      vm.organiser_logos_to_add.push({
        media_id: file.upload.uuid,
        newUpload: true,
        link: "",
        filename: file.upload.filename,
        url: url
      });
      vm.organiser_logos = [];
      setTimeout(() => {
        if (vm.organiser_logos_to_add.length > 0) {
          const tmpData = vm.cloneOrgainserLogo(vm.clone_organiser_logos);
          for (const key in vm.organiser_logos_to_add) {
            tmpData.push(vm.organiser_logos_to_add[key]);
          }
          vm.organiser_logos_to_add = [];
          vm.organiser_logos = tmpData;
          vm.clone_organiser_logos = vm.cloneOrgainserLogo(tmpData);
        }
      }, 10);
    },
    addStickers(file, url) {
      const vm = this
      const type = 'norm'
      const size = vm.changeStickerSize(type)
      const data = {
        media_id: file.upload.uuid,
        newUpload: true,
        sticker_type: type,
        width: size.width,
        height: size.height,
        fit: size.fit,
        position: size.position,
        filename: file.upload.filename,
        url: url
      }
      vm.stickers_to_add.push(data)
      setTimeout(() => {
        if(vm.stickers_to_add.length > 0) {
          const tmpData = vm.cloneOrgainserLogo(vm.stickers)
          vm.stickers = []
          for(const key in vm.stickers_to_add) {
            tmpData.push(vm.stickers_to_add[key])
          }
          vm.stickers_to_add = []
          vm.stickers = tmpData
          vm.clone_stickers = vm.cloneOrgainserLogo(tmpData)
        }
      }, 10);
    },
    addVipsDetail(file, url) {
      const vm = this;
      vm.vips_detail_to_add.unshift({
        media_id: file.upload.uuid,
        newUpload: true,
        first_name: "",
        last_name: "",
        company_name: "",
        title: "",
        location: "",
        filename: file.upload.filename,
        url: url
      });
      vm.vips_detail = [];
      setTimeout(() => {
        if (vm.vips_detail_to_add.length > 0) {
          const tmpData = vm.cloneVipsDetail(vm.clone_vips_detail);
          for (const key in vm.vips_detail_to_add) {
            tmpData.unshift(vm.vips_detail_to_add[key]);
          }
          vm.vips_detail_to_add = [];
          vm.vips_detail = tmpData;
          vm.clone_vips_detail = vm.cloneVipsDetail(tmpData);
        }
      }, 10);
    },
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    convertLogoData(logos) {
      const data = { 0: [] }
      for (const key in logos) {
        if (logos.hasOwnProperty(key)) {
          const element = logos[key]
          const item = {}
          item.image_key = element.media_id
          var tempUrl = element.link
          if(!tempUrl.includes('https://') && !tempUrl.includes('http://') && !tempUrl.startsWith('//') && tempUrl != '') {
            tempUrl = `https://${tempUrl}`
          }
          item.url = tempUrl
          data[0].push(item)
        }
      }
      return data
    },
    convertStickers(stickers) {
      // const data = {0:[]}
      const data = []
      stickers.forEach(sticker => {
        const converted = {}
        // converted.sticker_label = sticker.sticker_label
        converted.media_id = sticker.media_id
        converted.width = sticker.width
        converted.height = sticker.height
        converted.fit = sticker.fit
        converted.sticker_type = sticker.sticker_type
        data.push(converted)
      })
      return data
    },
    convertVipsDetailsData(details) {
      const data = { 0: [] };
      for (const key in details) {
        if (details.hasOwnProperty(key)) {
          const element = details[key];
          const item = {};
          item.image_key = element.media_id;
          item.first_name = element.first_name;
          item.last_name = element.last_name;
          item.company_name = element.company_name;
          item.title = element.title;
          item.location = element.location;

          // item.order = element.order

          data[0].push(item);
        }
      }
      return data;
    },
    cloneSponsorLogo(logos) {
      const data = [];
      for (const key in logos) {
        if (logos.hasOwnProperty(key)) {
          const element = logos[key];
          data[key] = JSON.parse(JSON.stringify(element));
        }
      }
      return data;
    },
    cloneOrgainserLogo(logos) {
      const data = [];
      for (const key in logos) {
        if (logos.hasOwnProperty(key)) {
          const element = logos[key];
          data[key] = JSON.parse(JSON.stringify(element));
        }
      }
      return data;
    },
    cloneStickers(stickers) {
      const data = [];
      for (const key in stickers) {
        if (stickers.hasOwnProperty(key)) {
          const element = stickers[key];
          data[key] = JSON.parse(JSON.stringify(element));
        }
      }
      return data;
    },
    cloneVipsDetail(detail) {
      const data = [];
      for (const key in detail) {
        if (detail.hasOwnProperty(key)) {
          const element = detail[key];
          data[key] = JSON.parse(JSON.stringify(element));
        }
      }
      return data;
    },
    inputChanged() {
      setTimeout(() => {
        this.$store.dispatch("EditEvent/changeIsDifferentValues", true);
      }, 100);
    },
    linkChanged(type, index) {
      switch (type) {
        case "sponsor":
          this.clone_sponsor_logos[index].link = this.sponsor_logos[index].link;
          this.inputChanged();
          break;
        case "organiser":
          this.clone_organiser_logos[index].link = this.organiser_logos[
            index
          ].link;
          this.inputChanged();
          break;
        default:
          break;
      }
    },
    vipsData(type, index) {
      this.clone_vips_detail[index][type] = this.vips_detail[index][type];
      this.inputChanged();
    },
    selectStickerType(type, id) {
      // updating stickers: look for previous update of sticker_id. if there's update, overwrite it. else, add it
      const changedStickerSize = this.changeStickerSize(type)
      this.stickers[id].sticker_type = type
      // check if user changed the type
      if(this.stickers[id].newUpload) {
        // if sticker is new, update it in the list of stickers
        this.stickers[id].height = changedStickerSize.height
        this.stickers[id].width = changedStickerSize.width
        this.stickers[id].fit = changedStickerSize.fit
        this.stickers[id].position = changedStickerSize.position
      } else {
        // if sticker is already added in the database, add it to stickers_to_update
          const toUpdate = {}

          toUpdate.media_id = this.stickers[id].media_id
          toUpdate.sticker_type = type
          toUpdate.height = changedStickerSize.height
          toUpdate.width = changedStickerSize.width
          toUpdate.fit = changedStickerSize.fit

          let newUpdate = true
          if(this.stickers_to_update.length > 0) {
            for(let i = 0; i < this.stickers_to_update.length; i++) {
              if(this.stickers_to_update[i].media_id == toUpdate.media_id) {
                // const changedStickerSize = this.changeStickerSize(type, this.stickers[id])
                this.stickers_to_update[i].sticker_type = type
                this.stickers_to_update[i].height = changedStickerSize.height
                this.stickers_to_update[i].width = changedStickerSize.width
                this.stickers_to_update[i].fit = changedStickerSize.fit
                newUpdate = false
                break
              }
            }
          }
          if(newUpdate) {
            this.stickers_to_update.push(toUpdate)
          }
          this.$store.dispatch('EditEvent/changeIsDifferentValues', true)
      }
    },
    // accepts sticker type and returns an object having height, width, fit, and position keys
    changeStickerSize(type) {
      const stickerObj = {}
      switch(type) {
        case 'tall':
          stickerObj.height = 1.0
          stickerObj.width = 0.3
          stickerObj.fit = 'cover'
          stickerObj.position = 'cover'
          break
        case 'wide':
          stickerObj.height = 0.3
          stickerObj.width = 1.0
          stickerObj.fit = 'cover'
          stickerObj.position = 'cover'
          break
        default:
          stickerObj.height = 0.15
          stickerObj.width = 0.15
          stickerObj.fit = 'contain'
          stickerObj.position = 'contain'
        }
      return stickerObj
    },
    capitalizeFirstChar(str) {
      if (str == undefined) {
        return ''
      }
      return (str.charAt(0).toUpperCase() + str.slice(1))
    },
    vipsOrderChanged() {
      this.$store.dispatch("EditEvent/changeIsDifferentValues", true);
    },
    onVipDragEnd(evt) {
      if (evt.oldIndex != evt.newIndex) {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        var tmpStorage = {};
        const spLogo = this.getVipsDetail();
        const clone = this.cloneVipsDetail(spLogo);
        this.setVipsDetail([]);
        setTimeout(() => {
          this.setVipsDetail(clone);
          this.$store.dispatch("EditEvent/changeIsDifferentValues", true);
        }, 0.01);
      }
    }
  },
  components: {
    vueDropzone: vue2Dropzone,
    draggable
  },
  props: {
    parent: {
      type: String,
      required: true
    },
    dropzoneOpts :{
      type: Object,
      required: false
    }
  },
  created() {
    this.dropzoneOptions = {
      ...this.dropzoneOptions,
      ...this.dropzoneOpts
    }
    if (this.parent === "vips") {
      this.dropzoneOptions.previewTemplate = `<div class=""></div>`;
      $(".dz-default.dz-message").attr("style", "display: block !important");
    }
  },
  computed: {
    ...mapGetters([
      "ImageUploadComponent/logo",
      "ImageUploadComponent/left",
      "ImageUploadComponent/right",
      "ImageUploadComponent/center",
      "ImageUploadComponent/sponsor",
      "ImageUploadComponent/organiser",
      "ImageUploadComponent/vips"
    ]),
    ...mapGetters("Events", ["getSelectedEvent"]),
    currentUploadComponentActive() {
      for (var i = 0; i < this.uploadComponents.length; i++) {
        if (
          this[`ImageUploadComponent/${this.uploadComponents[i]}`].fieldName ===
          this.parent
        ) {
          return this[`ImageUploadComponent/${this.uploadComponents[i]}`]
            .active;
        }
      }
    },
    currentSponsorLogo() {
      return this.getSelectedEvent
        ? this.getSelectedEvent.setting
          ? this.getSelectedEvent.setting.sponsor_logos
          : []
        : [];
    },
    currentOrganiserLogo() {
      return this.getSelectedEvent
        ? this.getSelectedEvent.setting
          ? this.getSelectedEvent.setting.organiser_logos
          : []
        : [];
    },
    currentStickers() {
      // console.log('currentStickers getSelectedEvent: ', this.getSelectedEvent.stickers)
      // console.log('currentStickers stickers: ', this.stickers)
      if (!this.isUploading) {
      //   return this.stickers
        return this.getSelectedEvent ? this.getSelectedEvent.stickers : []
      }
      // return this.getSelectedEvent ? this.getSelectedEvent.stickers : []
    },
    currentVipsDetail() {
      // console.log('currentVipsDetail getSelectedEvent: ', this.getSelectedEvent.setting.vips_detail)
      if (!this.isUploading) {
        return this.getSelectedEvent ? (this.getSelectedEvent.setting ? this.getSelectedEvent.setting.vips_detail : []) : []
      }
    },
    stickerSize(sticker) {
      switch(sticker.sticker_type) {
        case 'norm':
          sticker.width = 0.15
          sticker.height = 0.15
          break
        case 'wide':
          sticker.width = 0.8
          sticker.width = 0.8
          break
        case 'tall':
          sticker.height = 0.8
          sticker.height = 0.8
          break
      }
      return sticker
    }
  },
  watch: {
    currentSponsorLogo(newVal, oldVal) {
      this.current_sponsor_logos = newVal;
      this.sponsor_logos = this.fillSponsorLogos(this.current_sponsor_logos);
      this.clone_sponsor_logos = this.cloneSponsorLogo(this.sponsor_logos);
    },
    currentOrganiserLogo(newVal, oldVal) {
      // console.log(`currentOrganiserLogo new - ${JSON.stringify(newVal)}`)
      // console.log(`currentOrganiserLogo old - ${JSON.stringify(oldVal)}`)
      this.current_organiser_logos = newVal;
      this.organiser_logos = this.fillOrganiserLogos(
        this.current_organiser_logos
      );
      this.clone_organiser_logos = this.cloneOrgainserLogo(
        this.organiser_logos
      );
    },
    currentStickers(newVal, oldVal) {
      // console.log(`currentStickers - NEW ${JSON.stringify(newVal)}`)
      // console.log(`currentStickers - OLD ${JSON.stringify(oldVal)}`)
      // newVal ? console.log(`currentStickers - NEW ${newVal.length}`) : console.log(`currentStickers - NEW 0 - undefined`)
      // oldVal ? console.log(`currentStickers - OLD ${oldVal.length}`) : console.log(`currentStickers - OLD 0 - undefined`)
      // console.log(`compare new vs old ${_.isEqual(newVal, oldVal)}`)
      if (newVal && !_.isEqual(newVal, oldVal)) {
        this.current_stickers = newVal
        this.stickers = this.fillStickers(this.current_stickers)
        this.clone_stickers = this.cloneStickers(this.stickers)
      }
    },
    currentVipsDetail(newVal, oldVal) {
      // console.log(`currentVipsDetail - NEW ${JSON.stringify(newVal)}`)
      // console.log(`currentVipsDetail - OLD ${JSON.stringify(oldVal)}`)
      // newVal ? console.log(`currentVipsDetail - NEW ${newVal.length}`) : console.log(`currentVipsDetail - NEW 0 - undefined`)
      // oldVal ? console.log(`currentVipsDetail - OLD ${oldVal.length}`) : console.log(`currentVipsDetail - OLD 0 - undefined`)
      // console.log(`compare new vs old ${_.isEqual(newVal, oldVal)}`)
      if (newVal && !_.isEqual(newVal, oldVal)) {
        this.current_vips_detail = newVal
        this.vips_detail = this.fillVipsDetail(this.current_vips_detail)
        this.clone_vips_detail = this.cloneVipsDetail(this.vips_detail)
      }
    }
  },
  mounted() {
    const vm = this;

    if (this.parent == "sponsor") {
      vm.sponsor_logos = vm.fillSponsorLogos(vm.current_sponsor_logos);
      vm.clone_sponsor_logos = vm.cloneSponsorLogo(vm.sponsor_logos);
      const el = document.getElementById("sponsorOrder");
      vm.sortable = Sortable.create(el, {
        animation: 150,
        onEnd: evt => {
          if (evt.oldIndex != evt.newIndex) {
            const oldIndex = evt.oldIndex - 1;
            const newIndex = evt.newIndex - 1;
            var tmpStorage = {};
            const spLogo = vm.getSponsorLogos();
            if (oldIndex > newIndex) {
              //order from lower to higher
              tmpStorage = JSON.parse(JSON.stringify(spLogo[newIndex]));
              spLogo[newIndex] = JSON.parse(JSON.stringify(spLogo[oldIndex]));
              for (let i = newIndex + 1; i < oldIndex + 1; i++) {
                const logo = JSON.parse(JSON.stringify(spLogo[i]));
                spLogo[i] = tmpStorage;
                tmpStorage = logo;
              }
            } else {
              //order from higher to lower
              tmpStorage = JSON.parse(JSON.stringify(spLogo[oldIndex]));
              for (let i = oldIndex; i < newIndex; i++) {
                const logo = JSON.parse(JSON.stringify(spLogo[i + 1]));
                spLogo[i] = logo;
              }
              spLogo[newIndex] = tmpStorage;
            }
            const clone = vm.cloneSponsorLogo(spLogo);
            vm.setSponsorLogos([]);
            setTimeout(() => {
              vm.setSponsorLogos(clone);
              vm.$store.dispatch("EditEvent/changeIsDifferentValues", true);
            }, 0.01);
          }
        }
      });
    }

    if (this.parent == "organiser") {
      vm.organiser_logos = vm.fillOrganiserLogos(vm.current_organiser_logos);
      vm.clone_organiser_logos = vm.cloneOrgainserLogo(vm.organiser_logos);
      const el = document.getElementById("organiserOrder");
      vm.sortable = Sortable.create(el, {
        animation: 150,
        onEnd: evt => {
          if (evt.oldIndex != evt.newIndex) {
            const oldIndex = evt.oldIndex - 1;
            const newIndex = evt.newIndex - 1;
            var tmpStorage = {};
            const spLogo = vm.getOrganiserLogos();
            if (oldIndex > newIndex) {
              //order from lower to higher
              tmpStorage = JSON.parse(JSON.stringify(spLogo[newIndex]));
              spLogo[newIndex] = JSON.parse(JSON.stringify(spLogo[oldIndex]));
              for (let i = newIndex + 1; i < oldIndex + 1; i++) {
                const logo = JSON.parse(JSON.stringify(spLogo[i]));
                spLogo[i] = tmpStorage;
                tmpStorage = logo;
              }
            } else {
              //order from higher to lower
              tmpStorage = JSON.parse(JSON.stringify(spLogo[oldIndex]));
              for (let i = oldIndex; i < newIndex; i++) {
                const logo = JSON.parse(JSON.stringify(spLogo[i + 1]));
                spLogo[i] = logo;
              }
              spLogo[newIndex] = tmpStorage;
            }
            const clone = vm.cloneOrgainserLogo(spLogo);
            vm.setOrganiserLogos([]);
            setTimeout(() => {
              vm.setOrganiserLogos(clone);
              vm.$store.dispatch("EditEvent/changeIsDifferentValues", true);
            }, 0.01);
          }
        }
      });
    }
    
    if(this.parent == 'vips') {
      $('#vue-image-upload-area').addClass('upload-image-box')
      vm.vips_detail = vm.fillVipsDetail(vm.current_vips_detail)
      vm.clone_vips_detail = vm.cloneVipsDetail(vm.vips_detail)
      const el = document.getElementById('vipsOrder')
      /* vm.sortable = Sortable.create(el, {
        animation: 150,
        onEnd: evt => {
          if (evt.oldIndex != evt.newIndex) {
            const oldIndex = evt.oldIndex - 1;
            const newIndex = evt.newIndex - 1;
            var tmpStorage = {};
            const spLogo = vm.getVipsDetail();
            if (oldIndex > newIndex) {
              //order from lower to higher
              tmpStorage = JSON.parse(JSON.stringify(spLogo[newIndex]));
              spLogo[newIndex] = JSON.parse(JSON.stringify(spLogo[oldIndex]));
              for (let i = newIndex + 1; i < oldIndex + 1; i++) {
                const detail = JSON.parse(JSON.stringify(spLogo[i]));
                spLogo[i] = tmpStorage;
                tmpStorage = detail;
              }
            } else {
              //order from higher to lower
              tmpStorage = JSON.parse(JSON.stringify(spLogo[oldIndex]));
              for (let i = oldIndex; i < newIndex; i++) {
                const detail = JSON.parse(JSON.stringify(spLogo[i + 1]));
                spLogo[i] = detail;
              }
              spLogo[newIndex] = tmpStorage;
            }
            const clone = vm.cloneVipsDetail(spLogo);
            vm.setVipsDetail([]);
            setTimeout(() => {
              vm.setVipsDetail(clone);
              vm.$store.dispatch("EditEvent/changeIsDifferentValues", true);
            }, 0.01);
          }
        }
      });*/
    }

    if (vm.$refs.myVueDropzone) {
      EventBus.$on("image-upload-component", payload => {
        if (vm.$refs.myVueDropzone.dropzone)
          vm.$refs.myVueDropzone.dropzone.processQueue();
      });
    }

    EventBus.$on("overlay-changed", payload => {
      if (
        vm.parent == "left" ||
        vm.parent == "right" ||
        vm.parent == "center"
      ) {
        if (
          payload &&
          payload[vm.parent] &&
          payload[vm.parent].media_id != null
        ) {
          $(`.dz-details.${vm.parent} .img-preview img`).attr(
            "src",
            `${process.env.S3_IMAGE_URL}/${payload[vm.parent].url}`
          );
        }
      }
    });

    EventBus.$on("undo-image-overlay", parent => {
      if (vm.parent == parent) {
        $(`.dz-details.${vm.parent} .img-preview`).addClass("show");
        $(`.dz-details.${vm.parent} .image-upload-area-inner`).addClass("hide");
      }
    });

    EventBus.$on("change-add-overlay", add_overlay => {
      vm.add_overlay = add_overlay;
    });

    EventBus.$on("show-img-preview", payload => {
      if (vm.parent == payload.parent) {
        if (
          !payload.url.includes("blank.png") &&
          payload.url != undefined &&
          payload.url != null &&
          payload.url != ""
        ) {
          $(`.dz-details.${vm.parent} .img-preview img`).attr(
            "src",
            `${process.env.S3_IMAGE_URL}/${payload.url}`
          );
          $(`.dz-details.${vm.parent} .img-preview`).addClass("show");
          $(`.dz-details.${vm.parent} .image-upload-area-inner`).addClass("hide");
        } else {
          EventBus.$emit("remove-img-preview", payload);
        }
      } 
    });

    EventBus.$on("remove-img-preview", payload => {
      if (vm.parent == payload.parent) {
        $(`.dz-details.${vm.parent} .img-preview img`).attr("src", ``)
        $(`.dz-details.${vm.parent} .img-preview`).removeClass("show")
        $(`.dz-details.${vm.parent} .image-upload-area-inner`).removeClass("hide")
        if (vm && vm.$refs && vm.$refs.myVueDropzone) {
          vm.$refs.myVueDropzone.removeAllFiles();
        }
      }
    });

    EventBus.$on("upload-image-save", parent => {
      EventBus.$emit("change-loader-state", true);
      vm.isUploading = true
      if (vm.parent == "sponsor") {
        if (
          vm.$refs.myVueDropzone &&
          vm.$refs.myVueDropzone.dropzone.files.length == 0
        ) {
          const setting = {};
          setting["sponsor_logos"] = vm.convertLogoData(
            vm.sponsor_logos
          );
          vm.current_sponsor_logos = setting["sponsor_logos"];
          setEventSetting(this.getSelectedEvent.event_id, setting);
          vm.$store.dispatch("EditEvent/changeIsDifferentValues", false);
          EventBus.$emit("change-loader-state", false);
          setTimeout(() => {
            EventBus.$emit("refresh-overview-iframe");
          }, 1500);
        }
      }
      if (vm.parent == 'organiser') {
        if (vm.$refs.myVueDropzone && vm.$refs.myVueDropzone.dropzone.files.length == 0) {
          const setting = {}
          setting['organiser_logos'] = vm.convertLogoData(vm.organiser_logos)
          vm.current_organiser_logos = setting['organiser_logos']
          // console.log('onsaveorganiser: ', setting)
          setEventSetting(this.getSelectedEvent.event_id, setting)
          vm.$store.dispatch('EditEvent/changeIsDifferentValues', false)
          EventBus.$emit('change-loader-state', false)
          setTimeout(()=> {
            EventBus.$emit('refresh-overview-iframe')
          }, 1500)
        }
      }
      if (vm.parent == 'stickers') {
        // console.log('upload-image-save - stickers')
        // console.log(`upload-image-save - ${this.stickers_to_remove.length}`)
        // console.log(`upload-image-save - ${this.stickers_to_update.length}`)
        let success = false
        if (vm.$refs.myVueDropzone && vm.$refs.myVueDropzone.dropzone.files.length == 0) {
          if(this.stickers_to_remove.length > 0) {
            // check sticker is not removed
            this.stickers_to_remove.forEach(mediaId => {
              getEventStickers(this.$store.getters['Events/getSelectedEvent'].event_id).then(response => {
                const stickerList = response.data.stickers
                stickerList.find(sticker => {
                  if(sticker.media_id == mediaId) {
                    removeEventSticker(this.$store.getters['Events/getSelectedEvent'].event_id, sticker.sticker_id).then(response => {
                      success = response.data.success
                      if(success) {
                        this.stickers_to_remove.shift()
                        this.stickers = _.remove(this.stickers, (n) => {
                          return n.media_id != mediaId
                        })
                      }
                    })
                  }
                })
              })
            })
            vm.$store.dispatch('EditEvent/changeIsDifferentValues', false)
            EventBus.$emit('change-loader-state', false)
            setTimeout(()=> {
              EventBus.$emit('refresh-overview-iframe')
            }, 1500)
          }
    
          if(this.stickers_to_update.length > 0) {
            this.stickers_to_update.forEach(data => {
              // check sticker is not removed
              getEventStickers(this.$store.getters['Events/getSelectedEvent'].event_id).then(response => {
                const stickerList = response.data.stickers
                stickerList.find(sticker => {
                  if(sticker.media_id == data.media_id) {
                    const setting = {
                      sticker_type: data.sticker_type,
                      width: data.width,
                      height: data.height,
                      fit: data.fit
                    }
                    // const arr = [setting]

                    updateEventSticker(this.$store.getters['Events/getSelectedEvent'].event_id, sticker.sticker_id, setting).then(response => {
                      success = response.data.success
                      if(success) {
                        this.stickers_to_update.shift()
                      }
                    })
                  }
                })
              })
            })
            vm.$store.dispatch('EditEvent/changeIsDifferentValues', false) 
            EventBus.$emit('change-loader-state', false)
            setTimeout(()=> {
              EventBus.$emit('refresh-overview-iframe')
            }, 1500)
          }

          // const setting = {}
          // setting['stickers'] = vm.convertStickers(vm.stickers)
          // vm.current_stickers = setting['stickers']
          // setEventSetting(this.getSelectedEvent.event_id, setting)
        }
        // vm.$store.dispatch('EditEvent/changeIsDifferentValues', false)
        // EventBus.$emit('change-loader-state', false)
        // setTimeout(()=> {
        //   EventBus.$emit('refresh-overview-iframe')
        // }, 1500)
      }

      if (parent == 'vips') {
        console.log('VIPs')
        if (vm.$refs.myVueDropzone && vm.$refs.myVueDropzone.dropzone.files.length == 0) {
          const setting = {}
          setting['vips_detail'] = vm.convertVipsDetailsData(vm.vips_detail)
          vm.current_vips_detail = setting['vips_detail']
          setEventSetting(this.getSelectedEvent.event_id, setting)
          vm.$store.dispatch('EditEvent/changeIsDifferentValues', false)
          EventBus.$emit('change-loader-state', false)
          setTimeout(()=> {
            EventBus.$emit('refresh-overview-iframe')
          }, 1500)
        }
      }
      if (vm.$refs.myVueDropzone && vm.$refs.myVueDropzone.dropzone) {
        if (
          vm.parent == parent &&
          vm.$refs.myVueDropzone.dropzone.files.length > 0
        ) {
          vm.$refs.myVueDropzone.dropzone.processQueue();
        } else {
          EventBus.$emit("change-loader-state", false);
        }
      }
    });

    // EventBus.$on('show-img-preview', ({parent, url}) => {
    //   if(this.parent == parent) {
    //     this.previewPath = `${process.env.S3_IMAGE_URL}/IMAGES/THUMBNAIL_300/${url}`
    //     this.showPreview = true
    //   }
    // })

    // manually add a file on page load
    //     var file = { size: 123, name: "Icon" };
    // var url = "https://myvizo.com/img/logo_sm.png";
    // this.$refs.myVueDropzone.manuallyAddFile(file, url);
  }
};
</script>

<style lang="scss" scoped>
.vips-card {
  position:relative;
  width: 20em;
  border: thin solid black;
  padding: 1em;
  margin: 1em;
  border-radius: 0.5rem;
  background: rgba(244, 248, 249, 1.0) ;
  .vips-image img {
    object-fit: contain;
    height: 10em;
    width: 10em;
  }
}
.image-upload-component {
  width: 100%;
  height: 100%;
  padding: 0;
}

#image-upload-area {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  background: none;
  border: none;
  margin: auto 0;
  font-family: Roboto;
  color: #979797;
  font-size: 14px;
  line-height: 1.4;
}
.overlay-preview-img {
  width: 200px;
  height: 100px;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

.overlay-preview-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.overlay-preview-img.hidden {
  display: none;
}

#image-upload-area:hover {
  cursor: pointer;
}

#image-upload-area .choose-file {
  padding: 0.5em 0.2em;
  border: 1px solid #979797;
  display: block;
  width: 100px;
  margin: 0.5em auto;
}

.removeOverlay {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
}

.removeOverlayActive {
  height: 100%;
  width: 100%;
  background: rgba(74, 74, 74, 0.6);
  bottom: 100%;
  z-index: 1001;
  display: inherit;
  opacity: 0;
}

.removeOverlayActive:hover {
  cursor: pointer;
  opacity: 1;
}

.confirmOverlay {
  position: relative;
  height: 100%;
  width: 100%;
  background: rgba(74, 74, 74, 0.6);
  bottom: 100%;
  z-index: 1001;
  opacity: 1;
  cursor: pointer;
  display: inherit;
}

.remove-file {
  text-align: center;
  vertical-align: middle;
  position: relative;
  top: 25%;
  font-weight: bold;
  color: #fff;
  font-size: 16px;
}

.trash-can {
  font-size: 24px;
}

.cancel-remove {
  opacity: 0.75;
  border: 1px solid #9fa9ba;
  font-size: 12px;
  color: #4a4a4a;
  text-align: center;
  padding: 0.5em 1em;
}

.cancel-remove:hover {
  cursor: pointer;
}

.dropzone .dz-message {
  margin: 0;
}

.dropzone .dz-preview.dz-error .dz-error-mark {
  display: none;
}

.dropzone .dz-preview.dz-image-preview {
  background: transparent;
}

.vue-dropzone .dz-preview .dz-image {
  height: 100px;
  margin: 0 auto;
}

.vue-dropzone .dz-preview .dz-image img {
  width: 100%;
  object-fit: contain;
}

.image-upload-component {
  text-align: center;
}

.image-upload-component .dropzone .dz-preview .dz-progress {
  display: none;
}

.image-upload-component .dropzone .dz-filename {
  margin-top: -15px;
}

.image-upload-component .dropzone .dz-size {
  display: none;
}

.image-upload-component .dropzone .dz-preview .dz-remove {
  padding: 5px 10px;
  border-radius: 5px;
  display: none;
}

.image-upload-component .dropzone .dz-preview:hover .dz-remove {
  display: block;
}

.image-upload-component.logo {
  margin-bottom: 0;
}

.image-upload-component.logo #image-upload-area {
  padding: 0px 20px;
}

.image-upload-component.logo
  #image-upload-area.dropzone
  .dz-default.dz-message {
  margin: 0;
}

#sponsorOrder .drag-prompt, #organiserOrder .drag-prompt, #stickersOrder .drag-prompt {
  visibility: hidden;
  background-color: rgba(74,74,74,0.60);
  color: #fff;
  width: 100%;
  text-align: center;
  border-radius: 6px;
  padding: 5px 15px;

  /* Position the tooltip */
  position: absolute;
  margin-top: -35px;
  left:0;
  z-index: 1;
  transition: opacity 1s;
}

  #sponsorOrder:hover .drag-prompt, #organiserOrder:hover .drag-prompt, #stickersOrder:hover .drag-prompt {
  visibility: visible;
}

.dz-details.right,
.dz-details.left,
.dz-details.center,
.dz-details.logo {
  cursor: pointer;
  width: 60%;
  margin-left: 20%;
  margin-top: 0.5em;
}

.sponsor-logo-element, .organiser-logo-element {
// .sponsor-logo-element, .organiser-logo-element, .stickers-element, .vips-detail-element {
  position: relative;
  padding: 6px 15px;
  cursor: move;
}

.sponsor-logo-element .no-padding, .organiser-logo-element .no-padding, .stickers-element .no-padding {
  padding: 0px;
}

.sponsor-logo-element .no-padding,
.organiser-logo-element .no-padding,
.vips-detail-element .no-padding {
  padding: 0px;
}


.sponsor-logo-element i.fas,
.organiser-logo-element i.fas,
.vips-detail-element i.fas {
  vertical-align: middle;
  margin-top: 12px;
}

.sponsor-logo-element img,
.organiser-logo-element img {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: inline-block;
}

.sponsor-logo-element span.sponsor-text-outer,
.organiser-logo-element span.organiser-text-outer,
span.vips-text-outer {
  display: inline-block;
  text-align: left;
  font-size: small;
}

.sponsor-logo-element span.sponsor-text-outer span,
.organiser-logo-element span.organiser-text-outer span,
.vips-detail-element span.vips-text-outer span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-height: 19px; /* fallback */
  max-height: 19px; /* fallback */
}

.sponsor-logo-element .fa-times,
.organiser-logo-element .fa-times,
.vips-detail-element .fa-times {
  cursor: pointer;
}


.hover-black:hover {
  color: black;
  
}
div.vips-detail-confirm {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: rgba(74, 74, 74, 0.6);
}

.sponsor-logo-element .sponsor-logo-confirm,
.organiser-logo-element .organiser-logo-confirm {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(74, 74, 74, 0.6);
}


.sponsor-logo-element .sponsor-logo-confirm button,
.organiser-logo-element .organiser-logo-confirm button,
.vips-detail-confirm button {
  cursor: pointer;
  border: 2px solid #ffffff;
  background-color: transparent;
  border-radius: 5px;
  color: #ffffff;
  padding: 3px 10px;
  margin: 15px 0px;
}

.dz-details {
  min-height: 121px;
}

.image-upload-area-inner.hide {
  display: none;
}

.img-preview {
  display: none;
  position: relative;
  width: 100%;
  margin: 0px;
}

.logo .img-preview.show,
.left .img-preview.show,
.center .img-preview.show,
.right .img-preview.show {
  display: inline-block;
}

.logo .img-preview.show:hover div,
.left .img-preview.show:hover div,
.center .img-preview.show:hover div,
.right .img-preview.show:hover div {
  display: none;
  transition: opacity 0.25s ease-in-out;
}

.img-preview div {
  // position: absolute;
  // left: -100px;
  width: 200px;
  height: 150px;
}

.img-preview div img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo .img-preview-hover-text,
.left .img-preview-hover-text,
.center .img-preview-hover-text,
.right .img-preview-hover-text {
  display: none;
}

.logo .img-preview.show:hover .img-preview-hover-text,
.left .img-preview.show:hover .img-preview-hover-text,
.center .img-preview.show:hover .img-preview-hover-text,
.right .img-preview.show:hover .img-preview-hover-text {
  width: 100%;
  min-height: 165px;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  padding-top: 50px;
  transition: opacity 0.25s ease-in-out;
}

.img-preview-hover-text span {
  padding: 5px 10px;
  border: 1px solid #979797;
  border-radius: 2px;
}

#image-upload-area.vue-dropzone.dropzone.dz-clickable.dz-drag-hover {
  background-color: #dddddd;
}

.sponsor-link-input,
.organiser-link-input,
.vips-link-input {
  border: none;
  border-bottom: 1px solid #cdd0d5;
  color: var(--input-text-color);
  outline: none;
  background: white;
  margin-left: 1em;
}

// .vue-dropzone.dropzone.dz-clickable #image-upload-area-inner {
//   display: block;
// }

// .vue-dropzone.dropzone.dz-clickable.dz-drag-hover #image-upload-area-inner {
//   display: none;
// }

// .vue-dropzone.dropzone.dz-clickable .drop-here-hover {
//   display: none;
//   width: 100%;
//   height: 121px;
//   padding: 5px;
//   border: 5px dashed rgba(74,74,74,0.60);
//   text-align: center;
// }

// .drop-here-hover p {
//   vertical-align: middle;
//   font-family: Roboto;
//   color: #979797;
//   font-size: 14px;
//   font-weight: bold;
//   line-height: 1.4;
// }

// .vue-dropzone.dropzone.dz-clickable.dz-drag-hover .drop-here-hover {
//   display: block;
// }

.image-upload-component.sponsor .dropzone.dz-started .dz-message,
.image-upload-component.organiser .dropzone.dz-started .dz-message {
  display: block;
}

.image-upload-component.sponsor .dropzone .dz-preview.dz-image-preview,
.image-upload-component.organiser .dropzone .dz-preview.dz-image-preview {
  display: none;
}

.upload-image-box {
  background: #f4f8f9;
  padding: 0;
  margin: 0.5em;
}
.position-dropdown-menu {
  position: relative;
  left: 40px;
  width: 80%;
  font-size: 14px;
  color: #9FA9BA;
  text-align: center;
  border: 1px solid;
}

.position-dropdown {
  width: 100%;
  padding-top: 0.7em;
  border: none;
  background: none;
}

.selected-position {
  float: left;
  color: #9FA9BA;
  padding: 0 1em;
  font-size: 18px;
  width: 100%;
}

.dropdown-item {
  min-width: 100%;
  padding: 0em 1em;
  font-size: 18px;
  display: inline-block;
  color: #9FA9BA;
}

.dropdown-toggle::after {
  float: right;
  position: relative;
  top: -15px;
  color: #d8d8d8;
  font-size: 20px;
  right: 5px;
}

.dropdown-toggle[aria-expanded="true"]::after {
  transform: rotate(180deg);
}

.ghost {
  background: rgba(220, 220, 240, 1.0) ;
}
.dragging {
  border: none;
  opacity: 0.2;
  height: 100%;
  .vips-form {
    display: none;
  }
  span {
    display: none;
  }
}
.handle {
  cursor: move;
}

</style>


<style lang="scss">
.img-preview div img {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 500px;
}
</style>
