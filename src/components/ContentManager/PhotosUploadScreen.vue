<template lang="html">
	<div class="w-100">
		<div class="photos-upload-screen" :class="{isUploading: getIsUploading}">
			<vue-dropzone
				ref="DropzonePhotosUpload"
				id="upload-dropzone"
				class="px-0 py-0"
				:options="dropzoneOptions"
				name="photos-upload-dropzone"
				@vdropzone-file-added="fileAdded"
				@vdropzone-files-added="filesAdded"
				:class="{isUploading: getIsUploading}"
				@vdropzone-success="photoUploaded"
				@vdropzone-error="photoFailed"
        @vdropzone-canceled="photoCanceled"
				@vdropzone-queue-complete="queueComplete"
				@vdropzone-sending="sending"
				@vdropzone-processing="processing"
				>
			</vue-dropzone>
		</div>
    <div class="session-details" v-if="freeupload">
      <h2>Session Details</h2>
      Uploaded Ok : {{ this.filesUploaded }}
      <br>Duplicated : {{ this.filesDuplicated }}
      <br>Connection Errors : {{ this.filesConnnectionError }}
    </div>
    <photos-upload-checkpoint-modal />
    <div v-if="!freeupload">
      <b-modal
        ref="overlayConfirmModal"
        id="overlay-confirm-modal"
        body-class="body px-0 py-0"
        no-close-on-backdrop
        no-close-on-esc
        hide-footer
        centered
        style="border:0"
      >
        <template #modal-header>
          Let me remind you
        </template>
        <b-container fluid>
          <b-row>
            <b-col cols="12" class="modal-body">
              <p>You didn't set any overlay for this event</p>
            </b-col>
          </b-row>
          <b-row class="buttons-grid">
            <button type="button" class="global-button" @click="goonuploading($refs.DropzonePhotosUpload.dropzone.getQueuedFiles())">
              Go on Uploading
            </button>
            <button
              type="button"
              class="btn-primary global-button global-submit-button"
              @click="setoverlaynow"
            >
              Set Overlay now
            </button>
          </b-row>
        </b-container>
      </b-modal>
    </div>
	</div>
</template>

<script>
import EventBus from "../../event-bus";
import vue2Dropzone from "vue2-dropzone";
import { mapGetters } from "vuex";
import store from "../../store";
import storage from "@/utils/storage";
import { AUTH_TOKENS_STORAGE_KEY } from "@/constants";
// import UploadLogsModal from "../UploadLogsModal";
import { postPresignedURL } from "../../api";
import is from "is_js";
import _ from "lodash";
import { setTimeout } from "timers";
import Events from "../../store/modules/Events";
import PhotosUploadCheckpointModal from "./PhotosUploadCheckpointModal"
import { MAX_PHOTO_UPLOAD_SIZE } from '@/constants'

export default {
  name: "photos-upload-screen",
  props: ['content', 'checkpoint', 'freeupload'],
  data() {
    return {
      filesUploaded: 0,
      filesDuplicated: 0,
      filesConnnectionError: 0,
      maxFilesAllowed: 5000,
      disableShowToast: false,
      refreshingToken: false,
      overlaySettingFlag: true,
      purchaseConfirmModalFlag: false,
      tempfiles:[],
      dropzoneOptions: {
        url: "/",
        method: "put",
        maxFilesize: 256,
        parallelUploads: 1,
        uploadMultiple: false,
        paramName: "image",
        createImageThumbnails: false,
        previewTemplate: this.template(),
        autoProcessQueue: false,
        destroyDropzone: false,
        timeout: 180000,
        acceptedFiles: "image/jpeg",
        dictDefaultMessage: `
				<div id="file-upload-area" class="dz-details">
					<div
						style="
							font-size: 50px;
							height: 50px;"
							>
						<i class="fas fa-upload"></i>
					</div>
					<br>
					<span>Drop files here to begin uploading</span>
					<br>
					<span>OR</span>
					<br>
					<span>browse files from your device</span>
					<span class="choose-file"
						style="
							display: block;
							width: 150px;
							padding: 5px 0px;
							margin: 5px auto;
							color: #979797;
							background: #f4f4f4;
							box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);"
							>
						<i class="material-icons"
							style="font-size: 18px;
								position: relative;
								top: 4px;
								"
								>
							file_upload
							</i> CHOOSE FILE
					</span>
					<span>Files must be less than ${MAX_PHOTO_UPLOAD_SIZE} MB in size</span>
				</div>
        `,
        dictResponseError: "connection error",
        init() {
          const vm = this;

          var uploadInProgress = _.debounce(() => {
            console.log(`upload in progress throttled`);
            EventBus.$emit("upload-in-progress", true);
          }, 1000);

          vm.on("addedfiles", function() {
            console.log(`upload in progress addedfiles`);
            vm.removeEventListeners();
            vm.element.removeEventListener("drop", uploadInProgress);
            vm.element.addEventListener("drop", uploadInProgress);
          });

          vm.on("queuecomplete", function() {
            console.log(`queuecomplete`);
            vm.element.removeEventListener("drop", uploadInProgress);
            vm.setupEventListeners();
          });

          this.on("addedfile", function(file) {
            // Create the remove button
            let removeButton = document.createElement("button");
            let t = document.createTextNode("remove");
            removeButton.style.cssText = "height:50px, width:75px";
            removeButton.className = "remove-button";

            removeButton.appendChild(t);

            // Capture the Dropzone instance as closure.
            let _this = this;

            // Listen to the click event
            removeButton.addEventListener("click", function(e) {
              // Make sure the button click doesn't submit the form:
              e.preventDefault();
              e.stopPropagation();

              // Remove the file preview.
              _this.removeFile(file);
              // If you want to the delete the file on the server as well,
              // you can do the AJAX request here.

              store.dispatch("deleteUploadingPhoto");
            });

            // Add the button to the file preview element.
            file.previewElement.appendChild(removeButton);
          });

          this.on("error", function(file, errorMessage) {
            console.error(errorMessage)
            // hide reset button for now 20190423
            // let refreshIcon = `<div style="transform: scaleX(-1); position:relative; color: #fff; z-index:9999"><i class="fas fa-redo"></i></div>`
            // let refreshButton = document.createElement('button')
            // refreshButton.innerHTML = refreshIcon
            // refreshButton.className = 'refresh-button'
            // file.previewElement.appendChild(refreshButton)
            // refreshButton.addEventListener('click', function (e) {
            //   e.preventDefault()
            //   e.stopPropagation()
            //   console.log(`${vm.Dropzone}`)
            //   // console.log(`${vm}`)
            //   // file.status = vue2Dropzone.dropzone.QUEUED
            //   // vm.previewsContainer.dropzone.enqueueFile(file)
            // })
          })
        },
      },
      queue: [],
      parallelUploads: 5,
    }
  },
  methods: {
    goonuploading(files){
      this.overlaySettingFlag = true
      this.$bvModal.hide('overlay-confirm-modal')
      
      setTimeout(() => {
          EventBus.$emit("change-loader-state", false)
        }, 1000)
        this.disableShowToast = false
        let vm = this
        if (vm.getCurrentCheckpoint == 0 && vm.getCheckpoints.length > 1) {
          // vm.$refs.DropzonePhotosUpload.dropzone.removeAllFiles()
          // this.queue = []
          vm.$toasted.show(`Please select a checkpoint to upload.`, {
            duration: 5000,
            fullWidth: true,
            theme: "bubble",
            className: "verify-email",
            position: "bottom-center",
          })
          setTimeout(() => {
            console.log("filesAdded - open-checkpoint-dropdown call")
            //   EventBus.$emit("open-checkpoint-dropdown");
            EventBus.$emit("open-photos-upload-checkpoint-modal")
            EventBus.$on(
              "upload-selected-checkpoint",
              ({ id, confirmToProcess }) => {
                console.log(
                  `upload-selected-checkpoint - confirmToProcess: ${confirmToProcess}`
                )
                console.log(`upload-selected-checkpoint - vm: ${vm}`)
                console.log(vm)
                console.log(`upload-selected-checkpoint - files: ${files.length}`)
                if (confirmToProcess) {
                  vm.filesAdded(files)
                } else {
                  vm.$refs.DropzonePhotosUpload.dropzone.removeAllFiles()
                  vm.queue = []
                  EventBus.$emit("dropzone-clear-queue")
                }
                EventBus.$off("upload-selected-checkpoint")
              }
            )
          }, 500)
        } else if (!vm.isLessThanMaxFiles(files.length)) {
          setTimeout(() => {
            EventBus.$emit("dropzone-clear-queue")
          }, 500)
          EventBus.$emit("image-uploads-max-exceeded", {
            max: vm.maxFilesAllowed,
            status: "show",
          })
        } else {
          //  Set state.isUploading to true. Removes dropzone overlay and switches 'Uploading' text to 'Uploading...'
          this.$store.dispatch("photosAddedToUpload", files)

          //  After adding files, if not paused, upload photos in queue
          console.log(
            `filesAdded - getCurrentCheckpoint - ${vm.getCurrentCheckpoint}`
          )
          // if (vm.getCheckpoints.length == 1) {
          //   vm.changeUploadUrl(vm.getCheckpoints[0].checkpoint_id)
          // }
          const fileLength = files.length
          var checkMaxSizeLength = 0
          var checkMaxSize = false
          var checkImageTypeLength = 0
          var checkImageType = false
          for (const key in files) {
            const file = files[key]
            if (file.size > 10000000) {
              console.log("file size > limit")
              vm.$refs.DropzonePhotosUpload.dropzone.removeFile(file)
              checkMaxSize = true
              checkMaxSizeLength++
              const errorM = `file size exceed the limit - ${file.size}`
              vm.$store.dispatch("photoProcessed")
              vm.$store.dispatch("failedUploads", {
                msg: errorM,
                fileName: file.name,
              })
            } else if (file.type != undefined && file.type != "image/jpeg") {
              vm.$refs.DropzonePhotosUpload.dropzone.removeFile(file)
              checkImageType = true
              checkImageTypeLength++
              const errorM = `file type is not allowed - ${file.type}`
              vm.$store.dispatch("photoProcessed")
              vm.$store.dispatch("failedUploads", {
                msg: errorM,
                fileName: file.name,
              })
            }
          }

          console.log(`filesAdded - fileLength - ${fileLength}`)
          console.log(`filesAdded - checkMaxSizeLength - ${checkMaxSizeLength}`)
          console.log(
            `filesAdded - checkImageTypeLength - ${checkImageTypeLength}`
          )
          if (checkMaxSize) {
            console.log("checkMaxSize!")
            vm.$toasted.show(
              this.$tc('event.uploader.toast.file-size',  checkMaxSizeLength, { MAX_PHOTO_UPLOAD_SIZE }),
              {
                duration: 5000,
                fullWidth: true,
                theme: "bubble",
                className: "verify-email",
                position: "bottom-center",
              }
            )
          } else if (checkImageType) {
            console.log("checkImageType!")
            vm.$toasted.show(
              `Only PNG/JPEG type images can be uploaded. ${checkImageTypeLength} file(s) not matching the file type.`,
              {
                duration: 5000,
                fullWidth: true,
                theme: "bubble",
                className: "verify-email",
                position: "bottom-center",
              }
            )
          }
          if (
            fileLength == checkMaxSizeLength ||
            fileLength == checkImageTypeLength ||
            fileLength == checkMaxSizeLength + checkImageTypeLength
          ) {
            console.log("Hey here!")
            this.queueComplete()
          } else if (!this.getPaused) {
            console.log("before manualProcess!")
            // this.$refs.DropzonePhotosUpload.dropzone.processQueue();
            setTimeout(() => {
              this.manualProcess()
            }, 500)
          }
        }
    },
    setoverlaynow(){
      this.overlaySettingFlag = false
      
      console.log("redirecting to the overlay page")
      this.$router.push('/events/' + this.getSelectedEvent.event_id + '/overlay')
    },
    getInstance() {
      console.log("getInstance")
      return this
    },
    isLessThanMaxFiles(filesLength) {
      console.log("isLessThanMaxFiles")
      return this.maxFilesAllowed >= filesLength
    },
    processing(file) {
      console.log("processing")
      this.$refs.DropzonePhotosUpload.setOption("url", file.uploadURL)
    },
    sending(file, xhr, formData) {
      console.log("sending")
      let vm = this
      // console.log(`sending xhr - ${JSON.stringify(xhr)}`);
      // console.log(`sending formData - ${JSON.stringify(formData)}`);
      // console.log(`sending - ${JSON.stringify(file)}`);
      console.log(`@sending We can send this!! ${file.name}`)
      console.log("@sending", file.uploadURL)
      xhr.ontimeout = (e) => {
        console.error("Timeout!!")
        console.log(
          `Timeout!!, ${JSON.stringify(e, [
            "message",
            "arguments",
            "type",
            "name",
          ])}`
        )
        vm.$refs.DropzonePhotosUpload.dropzone._errorProcessing(
          [file],
          "connection error - timeout",
          null
        )
      }
      let _send = xhr.send
      xhr.send = () => {
        _send.call(xhr, file)
      }
    },
    fileAdded(file) {
      console.log("fileAdded")
      //EventBus.$emit("change-loader-state", true)
    },
    filesAdded(files) {
      if(!this.freeupload){
        console.log("filesAdded!!!!!")
        console.log(this.getEventOverlay.overlay)
        console.log(this.getSelectedEvent)
        if(
          this.getEventOverlay.overlay.center.media_id==null &&
          this.getEventOverlay.overlay.left.media_id==null &&
          this.getEventOverlay.overlay.right.media_id==null
        ){
          this.tempfiles = files
          EventBus.$emit("change-loader-state", false)
          this.$bvModal.show('overlay-confirm-modal')
        }
        else{
          if(this.overlaySettingFlag){
            this.goonuploading(files)
          }else{
            this.setoverlaynow()
          }
        }
      }
      else{
        setTimeout(() => {
          EventBus.$emit("change-loader-state", false)
        }, 1000)
        this.disableShowToast = false
        let vm = this
        if (vm.getCurrentCheckpoint == 0 && vm.getCheckpoints.length > 1) {
          // vm.$refs.DropzonePhotosUpload.dropzone.removeAllFiles()
          // this.queue = []
          vm.$toasted.show(`Please select a checkpoint to upload.`, {
            duration: 5000,
            fullWidth: true,
            theme: "bubble",
            className: "verify-email",
            position: "bottom-center",
          })
          setTimeout(() => {
            console.log("filesAdded - open-checkpoint-dropdown call")
            //   EventBus.$emit("open-checkpoint-dropdown");
            EventBus.$emit("open-photos-upload-checkpoint-modal")
            EventBus.$on(
              "upload-selected-checkpoint",
              ({ id, confirmToProcess }) => {
                console.log(
                  `upload-selected-checkpoint - confirmToProcess: ${confirmToProcess}`
                )
                console.log(`upload-selected-checkpoint - vm: ${vm}`)
                console.log(vm)
                console.log(`upload-selected-checkpoint - files: ${files.length}`)
                if (confirmToProcess) {
                  vm.filesAdded(files)
                } else {
                  vm.$refs.DropzonePhotosUpload.dropzone.removeAllFiles()
                  vm.queue = []
                  EventBus.$emit("dropzone-clear-queue")
                }
                EventBus.$off("upload-selected-checkpoint")
              }
            )
          }, 500)
        } else if (!vm.isLessThanMaxFiles(files.length)) {
          setTimeout(() => {
            EventBus.$emit("dropzone-clear-queue")
          }, 500)
          EventBus.$emit("image-uploads-max-exceeded", {
            max: vm.maxFilesAllowed,
            status: "show",
          })
        } else {
          //  Set state.isUploading to true. Removes dropzone overlay and switches 'Uploading' text to 'Uploading...'
          this.$store.dispatch("photosAddedToUpload", files)

          //  After adding files, if not paused, upload photos in queue
          console.log(
            `filesAdded - getCurrentCheckpoint - ${vm.getCurrentCheckpoint}`
          )
          // if (vm.getCheckpoints.length == 1) {
          //   vm.changeUploadUrl(vm.getCheckpoints[0].checkpoint_id)
          // }
          const fileLength = files.length
          var checkMaxSizeLength = 0
          var checkMaxSize = false
          var checkImageTypeLength = 0
          var checkImageType = false
          for (const key in files) {
            const file = files[key]
            if (file.size > 10000000) {
              console.log("file size > limit")
              vm.$refs.DropzonePhotosUpload.dropzone.removeFile(file)
              checkMaxSize = true
              checkMaxSizeLength++
              const errorM = `file size exceed the limit - ${file.size}`
              vm.$store.dispatch("photoProcessed")
              vm.$store.dispatch("failedUploads", {
                msg: errorM,
                fileName: file.name,
              })
            } else if (file.type != undefined && file.type != "image/jpeg") {
              vm.$refs.DropzonePhotosUpload.dropzone.removeFile(file)
              checkImageType = true
              checkImageTypeLength++
              const errorM = `file type is not allowed - ${file.type}`
              vm.$store.dispatch("photoProcessed")
              vm.$store.dispatch("failedUploads", {
                msg: errorM,
                fileName: file.name,
              })
            }
          }

          console.log(`filesAdded - fileLength - ${fileLength}`)
          console.log(`filesAdded - checkMaxSizeLength - ${checkMaxSizeLength}`)
          console.log(
            `filesAdded - checkImageTypeLength - ${checkImageTypeLength}`
          )
          if (checkMaxSize) {
            console.log("checkMaxSize!")
            vm.$toasted.show(
              this.$tc('event.uploader.toast.file-size',  checkMaxSizeLength, { MAX_PHOTO_UPLOAD_SIZE }),
              {
                duration: 5000,
                fullWidth: true,
                theme: "bubble",
                className: "verify-email",
                position: "bottom-center",
              }
            )
          } else if (checkImageType) {
            console.log("checkImageType!")
            vm.$toasted.show(
              `Only PNG/JPEG type images can be uploaded. ${checkImageTypeLength} file(s) not matching the file type.`,
              {
                duration: 5000,
                fullWidth: true,
                theme: "bubble",
                className: "verify-email",
                position: "bottom-center",
              }
            )
          }
          if (
            fileLength == checkMaxSizeLength ||
            fileLength == checkImageTypeLength ||
            fileLength == checkMaxSizeLength + checkImageTypeLength
          ) {
            console.log("Hey here!")
            this.queueComplete()
          } else if (!this.getPaused) {
            // this.$refs.DropzonePhotosUpload.dropzone.processQueue();
            setTimeout(() => {
              this.manualProcess()
            }, 500)
          }
        }
      }
    },
    photoUploaded(file, response) {
      console.log("photoUploaded")
      //  remove preview node from dropzone
      if (file.previewElement.parentNode && file.previewElement) {
        file.previewElement.parentNode.removeChild(file.previewElement)
      }

      //  dispatch to store successfully uploaded file
      this.$store.dispatch("photoProcessed", file)
      this.$store.dispatch("photoSuccessfullyUploaded", file)

      //  if user has not paused uploads, process next in qsueue
      if (!this.getPaused) {
        // this.$refs.DropzonePhotosUpload.dropzone.processQueue();
        setTimeout(() => {
          this.manualProcess()
          // this.manualUpload();
        }, 500)
      }
    },
    showErrorToast(message) {
      console.log("showErrorToast")
      this.$toasted.show(message, {
        duration: 3000,
        fullWidth: true,
        theme: "bubble",
        className: "verify-email",
        position: "bottom-center",
      })
    },
    retryFailedPhotos(records) {
      console.log("retryFailedPhotos")
      let vm = this
      console.log(`retryFailedPhotos - ${JSON.stringify(records)}`)
      if (
        vm.$refs.DropzonePhotosUpload &&
        vm.$refs.DropzonePhotosUpload.dropzone
      ) {
        let acceptedFiles =
          vm.$refs.DropzonePhotosUpload.dropzone.getAcceptedFiles()
        EventBus.$emit("dropzone-clear-queue")
        setTimeout(() => {
          _.forEach(records, function (record) {
            console.log(record.fileName)
            let file = _.find(acceptedFiles, { name: record.fileName })
            if (file) {
              file.status = "added"
              vm.$refs.DropzonePhotosUpload.dropzone.addFile(file)
            }
          })
          vm.filesAdded(vm.$refs.DropzonePhotosUpload.dropzone.getQueuedFiles())
        }, 2000)
      }
    },
    photoCanceled(file) {
      console.log("photoCanceled")
      console.log(`photoCanceled - ${file.name}`)
      this.photoFailed(file, "connection error")
    },
    photoFailed(file, message, xhr) {
      console.log("photoFailed")
      console.log(`photoFailed file - ${file.name}`)
      // console.log(`photoFailed message - ${JSON.stringify(message)}`);
      // console.log(`photoFailed xhr - ${JSON.stringify(xhr)}`);
      if (xhr && xhr.status == 401) {
        if (!this.refreshingToken) {
          this.refreshingToken = true
          this.getPaused = true
          this.$store.dispatch("Auth/manuallyRefreshToken")
          this.refreshingToken = false
          this.getPaused = false
          // setTimeout(() => {
          //   this.retryFailed();
          // }, 1000);x
        }
        const errorM = `Upload failed, please try again.`
        file.previewElement.querySelector("[data-dz-errormessage]").innerHTML =
          errorM
        this.$store.dispatch("photoProcessed")
        this.$store.dispatch("failedUploads", {
          msg: errorM,
          fileName: file.name,
        })
      } else {
        let errorMsg =
          message && message.error && message.error.message
            ? message.error.message
            : message
            ? message
            : "unknown error"
        console.log(`message - ${errorMsg}`)
        if(errorMsg.indexOf("duplicated") !== -1){
          this.filesDuplicated ++;
        }
        if (xhr && (xhr.status == 500 || xhr.status == 403)) {
          errorMsg = "connection error - 1"
          this.filesConnnectionError ++;
        }
        file.previewElement.querySelector(
          "[data-dz-errormessage]"
        ).innerHTML = `${errorMsg}`

        this.$store.dispatch("photoProcessed")
        this.$store.dispatch("failedUploads", {
          msg: errorMsg,
          fileName: file.name,
        })

        if (!this.getPaused) {
          setTimeout(() => {
            this.manualProcess()
            // this.manualUpload();
          }, 500)
        }
      }
    },
    queueComplete(file, xhr, formData) {
      console.log("queueComplete")
      setTimeout(()=>{
        EventBus.$emit("dropzone-clear-queue");
      }, 1500)
      this.filesUploaded += this.getSuccessfulUploadsCount
      console.log(`getSetTotalPhotosCount - ${this.getSetTotalPhotosCount}`)
      console.log(
        `getSuccessfulUploadsCount - ${this.getSuccessfulUploadsCount}`
      )
      if (
        this.getSetTotalPhotosCount == this.getSuccessfulUploadsCount &&
        this.getSetTotalPhotosCount != 0
      ) {
        // all uploaded, no error
        setTimeout(() => {
          if (!this.disableShowToast) {
            this.disableShowToast = true
            this.$toasted.global.images_uploaded()
          }
        }, 3000)
        setTimeout(() => {
          // this.$refs.DropzonePhotosUpload.dropzone.removeAllFiles();
          EventBus.$emit("dropzone-clear-queue")
        }, 4000)
        setTimeout(() => {
          EventBus.$emit("finished-image-upload")
        }, 6000)
      } else {
        // some errors, should show the modal
        let logs = _.uniqWith(this.getFailedUploads, _.isEqual)
        if (!this.disableShowToast) {
          this.disableShowToast = true
          if (this.getSetTotalPhotosCount != 0) {
            this.$toasted.global.images_processed()
          }
        }
        if (logs.length != 0 && this.getSetTotalPhotosCount != 0) {
          let payload = {
            logs,
            total: this.getSetTotalPhotosCount,
            failed:
              this.getSetTotalPhotosCount - this.getSuccessfulUploadsCount,
            succeeded: this.getSuccessfulUploadsCount,
          }
          setTimeout(() => {
            EventBus.$emit("open-upload-error-logs-modal", payload)
          }, 3000)
        }
      }
    },
    manualProcess() {
      console.log("manualProcess")
      if (this.getPaused) {
        return
      }
      let vm = this
      if (
        is.not.undefined(this.$refs) &&
        is.not.undefined(this.$refs.DropzonePhotosUpload) &&
        is.not.undefined(this.$refs.DropzonePhotosUpload.dropzone)
      ) {
        let uploadingLength =
          this.$refs.DropzonePhotosUpload.dropzone.getUploadingFiles().length
        let queuedLength =
          this.$refs.DropzonePhotosUpload.dropzone.getQueuedFiles().length
        let rejectedLength =
          this.$refs.DropzonePhotosUpload.dropzone.getRejectedFiles().length
        let acceptedLength =
          this.$refs.DropzonePhotosUpload.dropzone.getAcceptedFiles().length
        // console.log(`manualProcess - acceptedLength ${acceptedLength}`);
        // console.log(`manualProcess - rejectedLength ${rejectedLength}`);
        // console.log(`manualProcess - queuedLength ${queuedLength}`);
        // console.log(`manualProcess - uploadingLength ${uploadingLength}`);
        // console.log(`manualProcess - this.queue.length ${this.queue.length}`);
        if (uploadingLength == 0 && queuedLength == 0) {
          _.debounce(this.queueComplete, 2000)
        }

        let checkpointId
        let id
        if(!this.freeupload){
          checkpointId = `${store.getters["EventCheckpoint/getCurrentCheckpoint"]}`
          id = `${store.getters["Events/getSelectedEvent"].event_id}`
        }
        else{
          checkpointId = this.checkpoint.checkpoint_id!=null?this.checkpoint.checkpoint_id:this.content.checkpoint_id
          id = this.content.event_id
        }
        
        if (checkpointId != 0 && checkpointId != undefined) {
          let files = this.$refs.DropzonePhotosUpload.dropzone.getQueuedFiles()
          let length =
            files.length > this.parallelUploads
              ? this.parallelUploads
              : files.length
          for (let i = 0; i < length; i++) {
            let file =
              this.$refs.DropzonePhotosUpload.dropzone.getQueuedFiles()[i]
            if (file == undefined || this.queue.includes(file.name)) {
              this.manualUpload(file)
              return
            }
            EventBus.$emit("add-file-to-queue", file)

            let payload = {
              checkpoint_id: checkpointId,
              original_name: file.upload.filename,
              file_content_length: file.upload.total,
            }
            console.log(`manualProcess payload - ${JSON.stringify(payload)}`)
            // console.log("manualProcess before");
            let response = postPresignedURL({
              id,
              checkpointId: payload.checkpoint_id,
              payload,
            })
              .then((response) => {
                // console.log("manualProcess response", response);
                let url = response.data.presignedURL
                file.uploadURL = url
                console.log("manualProcess after obtain presignurl")
                this.manualUpload(file)
              })
              .catch((err) => {
                let msg =
                  is.not.undefined(err) &&
                  is.not.undefined(err.response) &&
                  is.not.undefined(err.response.data) &&
                  is.not.undefined(err.response.data.error) &&
                  is.not.undefined(err.response.data.error.message)
                    ? err.response.data.error.message
                    : "connection error"

                console.log(`postPresignedURL err - ${msg}`)
                vm.$refs.DropzonePhotosUpload.dropzone._errorProcessing(
                  [file],
                  msg,
                  null
                )
              })
          }
        }
      }
    },
    manualUpload(file) {
      console.log("manualUpload")
      let queued = this.$refs.DropzonePhotosUpload.dropzone.getQueuedFiles()
      if (!queued.length) {
        return
      }
      let uploading =
        this.$refs.DropzonePhotosUpload.dropzone.getUploadingFiles().length
      while (uploading < this.parallelUploads) {
        if (!queued) {
          return
        } // Nothing left to process
        let file = queued.shift()
        if (file && file.uploadURL) {
          this.$refs.DropzonePhotosUpload.dropzone.processFile(file)
        }
        uploading++
      }
    },
    template() {
      return `
				<div class="dz-preview dz-file-preview">
					<div class="dz-progress photo-upload">
						<span class="dz-upload" data-dz-uploadprogress>
								<a class="dz-remove" data-dz-remove><i class="fas fa-trash"></i></a>
							<div class="dz-filename"
								style="
									min-width: 220px;
									max-width: 220px;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								">
								<span data-dz-name></span>
							</div>
							<div class="dz-size"
								style="
									min-width: 100px;
									max-width: 100px;
								">
								<span style="display: inline-flex; "data-dz-size>
								</span>
							</div>
							<span data-dz-errormessage style="min-width:400px"></span>
						</span>
					</div>
				</div>
				`
    },
  },
  components: {
    vueDropzone: vue2Dropzone,
    PhotosUploadCheckpointModal,
    // UploadLogsModal
  },
  computed: {
    ...mapGetters([
      "getIsUploading",
      "getPaused",
      "getSetTotalPhotosCount",
      "getSuccessfulUploadsCount",
      "getFailedUploads",
      "getPhotosProcessedCount",
    ]),
    ...mapGetters("Events", [
      "getEventOverlay",
      "getSelectedEvent"
    ]),
    ...mapGetters("EventCheckpoint", [
      "getCurrentCheckpoint",
      "getCheckpoints",
    ]),
    getCheckpointId() {
      return this.getCurrentCheckpoint
    },
  },
  watch: {
    getPaused(newVal, oldVal) {
      console.log(`getPaused - newVal - ${newVal}`)
      console.log(`getPaused - oldVal - ${oldVal}`)
      if (!newVal) {
        this.manualProcess()
      }
    },
    processed(newVal, oldVal) {
      console.log(`processed - newVal - ${newVal}`)
      console.log(`getSetTotalPhotosCount - ${this.getSetTotalPhotosCount}`)
      // console.log(`getFailedUploads - ${this.getFailedUploads}`);
      console.log(`getPhotosProcessedCount - ${this.getPhotosProcessedCount}`)
      if (newVal == 0 && this.getSetTotalPhotosCount == 0) {
        EventBus.$emit("dropzone-clear-queue")
      }
    },
  },
  destroyed() {
    console.log("destroyed")
    EventBus.$off("upload-in-progress")
    EventBus.$off("retry-failed-uploads")
    EventBus.$off("dropzone-clear-queue")
    EventBus.$off("add-file-to-queue")
  },
  mounted() {
    let vm = this
    EventBus.$on("image-duplicated", payload => {
      filesDuplicated += payload
    })

    EventBus.$on("image-connection-error", payload => {
      filesConnnectionError += payload
    })

    EventBus.$on("upload-in-progress", (processing) => {
      if (processing) {
        this.$toasted.global.upload_in_progress()
      }
    })

    EventBus.$on("retry-failed-uploads", (payload) => {
      this.retryFailedPhotos(payload)
    })

    EventBus.$on("resume-photos-uploads", (resume) => {
      if (resume) {
        this.manualProcess()
      }
    })

    EventBus.$on("dropzone-clear-queue", () => {
      this.queue = []
      this.processed = 0
      this.$store.dispatch("photosFinishedUploading")

      if (
        this.$refs.DropzonePhotosUpload &&
        this.$refs.DropzonePhotosUpload.dropzone
      ) {
        setTimeout(() => {
          this.$refs.DropzonePhotosUpload.dropzone.removeAllFiles(true)
          this.$refs.DropzonePhotosUpload.dropzone.setupEventListeners()
        }, 500)
      }
    })

    EventBus.$on("add-file-to-queue", (file) => {
      this.queue.push(file.name)
    })
  },
}
</script>

<style lang="css">
.photos-upload-screen {
  height: 100%;
  width: 100%;
  position: relative;
  display: grid;
  justify-items: center;
  align-items: center;
}

.vue-dropzone {
  height: 100%;
  width: 100%;
  border: none;
  color: var(--miro-grey);
  line-height: 2;
  /* padding: 10px; */
  background: #f4f8f9;
}

#file-upload-area {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  background: none;
  border: 5px solid rgb(172, 172, 172);
  /* border-width: 3px; */
  padding: 10px;
  border-style: dashed;
  border-radius: 1em;
  margin: auto 0;
  font-family: Roboto;
  color: #979797;
  font-size: 14px;
  transition: 0.5s;
}

#file-upload-area:hover {
  background-color: rgb(228, 228, 228);
  transform: translate(0px, -5px);
  border-color: rgb(114, 114, 114);
  cursor: pointer;
}

#file-upload-area.isUploading {
  display: none;
}

#file-upload-area .choose-file {
  padding: 0.5em 0.2em;
  display: block;
  width: 100px;
  margin: 0.5em auto;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
}

.dz-image img {
  width: 100%;
  height: 100%;
}

.dropzone .dz-preview {
  width: 100%;
  margin: 2px 0;
  min-height: 55px;
  transition: opacity 0.25s ease-in-out;
  background: #cbd0d9;
  color: #fff;
}

.vue-dropzone .dz-preview .dz-progress.photo-upload .dz-upload {
  background: var(--main-theme);
  display: inline-flex;
  align-items: center;
}

.dz-upload * {
  margin: 0 15px;
}

.dropzone .dz-preview .dz-progress.photo-upload {
  width: 100%;
  border-radius: 0;
  left: 0%;
  top: 0;
  height: 55px;
  opacity: 1;
  margin-left: 0;
  margin-top: 0;
  background: inherit;
}

.dropzone .dz-preview:not(.dz-processing) .dz-progress.photo-upload {
  background: #cbd0d9;
  animation: none;
}

.dropzone .dz-preview.dz-complete .dz-progress.photo-upload {
  opacity: 1;
  background: inherit;
}

.isUploading > .dropzone .dz-message {
  display: none;
}

.dz-preview.dz-file-preview.dz-error.dz-complete .dz-progress.photo-upload {
  background: #f04b72;
  animation: none;
}

.dz-error > .dz-progress.photo-upload > .dz-upload {
  background: #f04b72 !important;
}

.vue-dropzone .dz-preview .dz-remove {
  opacity: 1;
  border: none;
  position: relative;
  font-size: 16px;
  margin: 0;
}

.refresh-button {
  position: relative;
  float: right;
  top: 10px;
  right: 10px;
}

.remove-button {
  margin-left: 5px;
  margin-top: 5px;
}

.remove-button:hover,
.refresh-button:hover {
  cursor: pointer;
}

div.toasted.link-copied.bubble {
  background: #0193dc;
  justify-content: center;
}

div.toasted.verify-email.bubble {
  background: red;
  justify-content: center;
}

.action.ripple.icon {
  color: #fff;
}

.session-details{
  color: rgb(187, 64, 105);
  font-weight: bold;
  font-size: 19px;
}
</style>
