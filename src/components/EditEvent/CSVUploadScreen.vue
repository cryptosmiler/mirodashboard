<template lang="html">
  <div>
    <div class="photos-upload-screen" :class="{isUploading: getIsUploading}">
      <vue-dropzone
        ref="DropzoneCsvUpload"
        id="upload-dropzone"
        :options="dropzoneOptions"
        name="photos-upload-dropzone"
        @vdropzone-files-added="filesAdded"
        :class="{isUploading: getIsUploading}"
        @vdropzone-success="csvUploaded"
        @vdropzone-error="csvUploadFail"
        @vdropzone-queue-complete="queueComplete"
        >
      </vue-dropzone>
      <div class="text-center download-btn-container">
        <a class="btn-primary download-btn" :href="sampleCSVUrl">Download Sample CSV</a>
      </div>
    </div>
    <div class="datatable-container container">
      <div class="hidden last-upload"> 
        <span><span>Uploaded file: </span> <span id="last-upload-name"></span></span> <span> , </span> <span><span>Uploaded date: </span> <span id="last-upload-date"></span></span> <span> , </span> <span>Total Runners: <span v-text="totalRunner"></span></span>
      </div>
      <div class="text-right" v-if="getRunners && getRunners.length > 0"> 
        <button class="csv-btn" @click="downloadCSV()">Download the runner list</button>
        <div class="d-none">
          <download-csv :data="getExportCsv" >
            <button class="csv-btn" ref="downloadCSVBtn">Download the runner list</button>
          </download-csv>
        </div>
      </div>
      <div class="datatable-save" v-if="profile.role!==1">
        <button :disabled="!getChanged" @click="saveRunner()">Save Runner List</button>
      </div>
      <table id="datatable" class="table table-striped table-bordered" v-show="getRunners.length > 0 || getAddedRunners.length > 0">
        <thead>
          <tr>
            <th v-for="(field, index) in runnerFieldNames">{{field}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(runner, index) in getRunners">
            <td>{{index + 1}}</td>
            <td>
              <i v-show="!runner.lock" @click="toggleLock(runner.runner_id)" class="fas fa-lock-open"></i>
              <i v-show="!runner.lock" @click="deleteRunnerModal(runner.runner_id)" class="fas fa-trash-alt red"></i>
              <i v-show="runner.lock" @click="toggleLock(runner.runner_id)" class="fas fa-lock"></i>
            </td>
            <td><input v-show="!runner.lock" type="text" v-model="runner.bib_number"/><span v-show="runner.lock">{{runner.bib_number ? runner.bib_number : '-'}}</span></td>
            <td><input v-show="!runner.lock" type="text" v-model="runner.registration_id"/><span v-show="runner.lock">{{runner.registration_id ? runner.registration_id : '-'}}</span></td>
            <td><input v-show="!runner.lock" type="text" v-model="runner.category"/><span v-show="runner.lock">{{runner.category ? runner.category : '-'}}</span></td>
            <td><input v-show="!runner.lock" type="text" v-model="runner.first_name"/><span v-show="runner.lock">{{runner.first_name ? runner.first_name : '-'}}</span></td>
            <td><input v-show="!runner.lock" type="text" v-model="runner.last_name"/><span v-show="runner.lock">{{runner.last_name ? runner.last_name : '-'}}</span></td>
            <td><input v-show="!runner.lock" type="text" v-model="runner.gender"/><span v-show="runner.lock">{{runner.gender ? runner.gender : '-'}}</span></td>
            <td><input v-show="!runner.lock" type="text" v-model="runner.corral"/><span v-show="runner.lock">{{runner.corral ? runner.corral : '-'}}</span></td>
            <td><input v-show="!runner.lock" type="number" v-model="runner.age" onkeydown="return !isNaN(Number(event.key) || event.keyCode == 8)"/><span v-show="runner.lock">{{runner.age ? runner.age : '-'}}</span></td>
            <td><input v-show="!runner.lock" type="text" v-model="runner.finish_time"/><span v-show="runner.lock">{{runner.finish_time ? runner.finish_time : '-'}}</span></td>
          </tr>
          <tr v-for="(runner, index) in getAddedRunners">
            <td>{{getRunners.length + index + 1}}</td>
            <td><i @click="deleteAddedRunner(runner.runner_id)" class="fas fa-minus-square red"></i></td>
            <td><input type="text" v-model="runner.bib_number"/></td>
            <td><input type="text" v-model="runner.registration_id"/></td>
            <td><input type="text" v-model="runner.category"/></td>
            <td><input type="text" v-model="runner.first_name"/></td>
            <td><input type="text" v-model="runner.last_name"/></td>
            <td><input type="text" v-model="runner.gender"/></td>
            <td><input type="text" v-model="runner.corral"/></td>
            <td><input type="number" v-model="runner.age" onkeydown="return !isNaN(Number(event.key) || event.keyCode == 8)"/></td>
            <td><input type="text" v-model="runner.finish_time"/></td>
          </tr>
        </tbody>
      </table>
      <div class="add-button" v-if="profile.role!==1"><button @click="addNewRunner()"><i class="fas fa-plus"></i> <span>Add a new runner</span></button></div>
    </div>
    <runner-footer v-show="getRunners.length > 0"/>
    <div class="modal" tabindex="-1" role="dialog" id="delete-runner-modal">
      <delete-runner-modal></delete-runner-modal>
    </div>
  </div>
</template>

<script>
import EventBus from '../../event-bus'
import vue2Dropzone from 'vue2-dropzone'
import runnerFooter from './RunnerFooter.vue'
import deleteRunnerModal from './DeleteRunnerModal.vue'
import { mapGetters, mapActions } from 'vuex'
import store from '../../store'
import storage from '@/utils/storage'
import { AUTH_TOKENS_STORAGE_KEY } from '@/constants'
import axios from 'axios'
import JQuery from 'jquery'
import JsonCSV from 'vue-json-csv'

const $ = JQuery

export default {
  name: 'CSV-upload-screen',
  data () {
    return {
      maxFilesAllowed: 1,
      sampleCSVUrl: `${process.env.API_BASE_URL}sample/sample-csv`,
      runnerFieldNames: ['','','bib number','registration id','category','first name','last name','gender','corral','age', 'finish time (hh:mm:ss)'],
      page: 1,
      axiosClient: null,
      selectedDeleteRunnerId: 0,
      totalRunner: 0,
      runnersToBeExported : [],
      disableErrorToast: false,
      dropzoneOptions: {
        url: `${process.env.API_BASE_URL}events/${store.getters['Events/getSelectedEvent'].event_id}/runners`,
        maxFilesize: 5,
        maxFiles: 1,
        paramName: 'file',
        acceptedFiles: '.csv',
        headers: {'Authorization': `Bearer ${storage.load(AUTH_TOKENS_STORAGE_KEY).AccessToken}`},
        createImageThumbnails: false,
        previewTemplate: this.template(),
        autoProcessQueue: false,
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
          <span>Drag files here to begin uploading</span>
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
          <span>Files must be less than 10MB in size</span>
        </div>
        `,
        init () {
          const vm = this
          this.on('addedfile', function (file) {
            // Create the remove button
            let removeButton = document.createElement('button')
            let t = document.createTextNode('remove')
            removeButton.style.cssText = 'height:50px, width:75px'
            removeButton.className = 'remove-button'

            removeButton.appendChild(t)

            // Capture the Dropzone instance as closure.
            let _this = this

            // Listen to the click event
            removeButton.addEventListener('click', function (e) {
              // Make sure the button click doesn't submit the form:
              e.preventDefault()
              e.stopPropagation()

              // Remove the file preview.
              _this.removeFile(file)
              // If you want to the delete the file on the server as well,
              // you can do the AJAX request here.

              store.dispatch('deleteUploadingPhoto')
            })

            // Add the button to the file preview element.
            file.previewElement.appendChild(removeButton)
          })

          this.on('error', function (file, errorMessage) {
            let refreshIcon = `<div style="transform: scaleX(-1); position:relative; color: #fff; z-index:9999"><i class="fas fa-redo"></i></div>`
            let refreshButton = document.createElement('button')
            refreshButton.innerHTML = refreshIcon
            refreshButton.className = 'refresh-button'

            file.previewElement.appendChild(refreshButton)

            refreshButton.addEventListener('click', function (e) {
              e.preventDefault()
              e.stopPropagation()

              vm.previewsContainer.dropzone.enqueueFile(file)
            })
          })
        }
      }
    }
  },
  methods: {
    downloadCSV() {
      EventBus.$emit('change-loader-state', true);
      this.axiosClient.get(`${process.env.API_BASE_URL}events/${store.getters['Events/getSelectedEvent'].event_id}/runners?limit=0`).then(resp => {
        const response = resp.data
        if (response.success && response.success == true) {
          this.runnersToBeExported = response.event.runners 
        }
        setTimeout(() => this.$refs.downloadCSVBtn.click(), 1000);
        EventBus.$emit('change-loader-state', false)
      }).catch(error => {
        console.log('downloadCSV error: ', error);
        EventBus.$emit('change-loader-state', false);
      });
      
      
      
    },
    isLessThanMaxFiles (filesLength) {
      return this.maxFilesAllowed >= filesLength
    },
    filesAdded (files) {
      let vm = this
      this.disableErrorToast = false;

      if (!this.isLessThanMaxFiles(files.length)) {
        for (let i = 0; i < files.length; i++) {
          setTimeout(() => {
            vm.$refs.DropzoneCsvUpload.dropzone.removeFile(files[i])
          }, 500)
        }
        this.disableErrorToast = true;
        EventBus.$emit('image-uploads-max-exceeded', {
          max: this.maxFilesAllowed,
          status: 'show'
        })
      } else {
        //  After adding files, if not paused, upload photos in queue
        if (!this.getPaused) {
          setTimeout(() => {
            vm.$refs.DropzoneCsvUpload.dropzone.processQueue()
          }, 500)
        }

        //  Set state.isUploading to true. Removes dropzone overlay and switches 'Uploading' text to 'Uploading...'
        this.$store.dispatch('photosAddedToUpload', files)
      }
    },
    csvUploaded (file, response) {
      //  remove preview node from dropzone
      file.previewElement.parentNode.removeChild(file.previewElement)

      //  dispatch to store successfully uploaded file
      this.$store.dispatch('photoSuccessfullyUploaded', file)

      //  if user has not paused uploads, process next in queue
      if (!this.getPaused) {
        this.$refs.DropzoneCsvUpload.dropzone.processQueue()
      }
      if(response.type == 'success') {
        this.$toasted.global.csv_uploaded()
        $('#last-upload-name').text(response.filename)
        $('#last-upload-date').text(response.updateDate)
        this.totalRunner = response.count ? response.count : 0 
        $('.last-upload').removeClass('hidden')
        if(response.filename == '' && response.updateDate == '') {
          $('.last-upload').addClass('hidden')
        }
        this.$store.dispatch('EventRunner/setRunner', response.data)
      } else {
        this.$toasted.global.csv_upload_failed()
      }
    },
    csvUploadFail (file, message) {
      if(message.message == 'no record') {
        this.$toasted.show(`CSV file is empty, please upload another CSV with runners record. `, {
          duration: 5000,
          fullWidth: true,
          theme: 'bubble',
          className: 'verify-email',
          position: 'bottom-center'
        })
      } else {
        if(!this.disableErrorToast) {
          this.$toasted.global.csv_wrong_file_type()
        }
      }
      
    },
    retryFailed () {
      this.$refs.DropzoneCsvUpload.dropzone.processQueue()
    },
    queueComplete (file, xhr, formData) {
      if (this.$refs.DropzoneCsvUpload.dropzone.getQueuedFiles().length === 0) {
        this.$store.dispatch('photosFinishedUploading')

        this.$refs.DropzoneCsvUpload.dropzone.removeAllFiles()
      }
    },
    loadRunnerPage(page) {
      EventBus.$emit('change-loader-state', true)
      this.$store.dispatch('EventRunner/setRunner', [])
      setTimeout(()=> {
        this.axiosClient.get(`${process.env.API_BASE_URL}events/${store.getters['Events/getSelectedEvent'].event_id}/runners/${page}`).then(resp => {
          const response = resp.data
          if(response.success && response.success == true) {
            this.$store.dispatch('EventRunner/setRunner', response.data)
            this.totalRunner = response.count
            EventBus.$emit('reset-pagination-runner', {totalPage: response.total, page: this.page})
            EventBus.$emit('change-loader-state', false)
          }
        })
      }, 2000)
    },
    toggleLock(id) {
      this.$store.dispatch('EventRunner/toogleRunnerLock', id)
    },
    deleteRunner(id) {
      this.$store.dispatch('EventRunner/deleteRunner', id)
    },
    deleteRunnerModal(id) {
      $('#delete-runner-modal').modal('show')
      this.selectedDeleteRunnerId = id
    },
    saveRunner() {
      this.$store.dispatch('EventRunner/saveRunner')
    },
    addNewRunner() {
      this.$store.dispatch('EventRunner/addRunner')
    },
    deleteAddedRunner(id) {
      this.$store.dispatch('EventRunner/deleteAddedRunner', id)
    },
    template () {
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
    }
  },
  components: {
    vueDropzone: vue2Dropzone,
    runnerFooter: runnerFooter,
    deleteRunnerModal: deleteRunnerModal,
    'downloadCsv': JsonCSV
  },
  computed: {
    ...mapGetters([
      'getIsUploading',
      'getPaused'
    ]),
    ...mapGetters('EventRunner', [
      'getRunners',
      'getChanged',
      'getAddedRunners',
      'getTotalRunners'
    ]),
    ...mapGetters("Auth", ["profile"]), 
    getExportCsv() {
      return JSON.parse(JSON.stringify(this.runnersToBeExported)).map(i => {
        return {
          'bib number': i.bib_number ? i.bib_number : '-',
          'registration id': i.registration_id ? i.registration_id : '-',
          'category': i.category ? i.category : '-',
          'first name': i.first_name ? i.first_name : '-',
          'last name': i.last_name ? i.last_name : '-',
          'gender': i.gender ? i.gender : '-',
          'corral': i.corral ? i.corral : '-',
          'age': i.age ? i.age : '-',
          'finish time': i.finish_time ? i.finish_time : '-',
        }
      })
    },
  },
  mounted () {

    EventBus.$on('delete-runner-modal', (deleteRunner) => {
      $('#delete-runner-modal').modal('hide')
      if(deleteRunner && this.selectedDeleteRunnerId != 0) {
        this.deleteRunner(this.selectedDeleteRunnerId)
        this.selectedDeleteRunnerId = 0
      }
    })

    EventBus.$on('retry-failed-uploads', (payload) => {
      this.retryFailed()
    })

    EventBus.$on('dropzone-clear-queue', () => {
      if(this.$refs.DropzoneCsvUpload && this.$refs.DropzoneCsvUpload.dropzone) this.$refs.DropzoneCsvUpload.dropzone.removeAllFiles()
    })

    EventBus.$on('change-page-runner', page => {
      this.page = page
      this.loadRunnerPage(page)
    })

    EventBus.$on('refresh-runner', () => {
      this.loadRunnerPage(this.page)
    })

    this.axiosClient = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storage.load(AUTH_TOKENS_STORAGE_KEY).AccessToken}`
      }
    })
    this.axiosClient.get(`${process.env.API_BASE_URL}events/${store.getters['Events/getSelectedEvent'].event_id}/runners/endpoint`).then(resp => {
      const response = resp.data
      if(response.filename && response.updateDate && response.filename != '' && response.updateDate != '') {
        $('#last-upload-name').text(response.filename)
        $('#last-upload-date').text(response.updateDate)
        $('.last-upload').removeClass('hidden')
      }
    })
    this.loadRunnerPage(1)

  }
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
    padding: 10px;
    background: #f4f8f9;
  }

  #file-upload-area {
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
  }

  #file-upload-area:hover {
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
    box-shadow: 0px 4px 10px 1px rgba(204,204,204,1);

  }

  .dz-image img {
    width: 100%;
    height: 100%;
  }

  .dropzone .dz-preview {
    width: 100%;
    margin: 2px 0;
    min-height: 55px;
    transition: opacity .25s ease-in-out;
    background: #CBD0D9;
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
    background: #CBD0D9;
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
    background: #F04B72;
    animation: none;
  }

  .dz-error > .dz-progress.photo-upload > .dz-upload {
    background: #F04B72 !important;
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

  .remove-button:hover, .refresh-button:hover {
    cursor: pointer;
  }

  .photos-upload-screen .download-btn {
    padding: 10px 15px;
    margin: 15px auto;
    background: var(--main-theme);
    box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    cursor: pointer;
    border-radius: 5px;
    font-family: Roboto;
    font-size: 14px;
    text-decoration: none;
  }

  .download-btn-container {
    margin-top: 50px;
  }

  .last-upload {
    width: 100%;
    margin-bottom: 10px;
  }

  .last-upload.hidden {
    display: none;
  }

  .last-upload span {
    display: inline-block;
    padding: 5px 0px;
    font-family: Roboto;
    color: #979797;
    font-size: 14px;
  }

  .datatable-container {
    margin-top: 50px;
    margin-bottom: 100px;
    overflow-x: scroll;
  }

  #datatable i.fas {
    cursor: pointer;    
    min-width: 18px;
  }

  #datatable i.fas.red {
    color: red;
  }

  #datatable input {
    width: 100%;
    min-width: 45px;
    padding: 0px 10px;
    border: none;
    border-bottom: 1px solid #cdd0d5;
    width: 100%;
    resize: none;
    color: var(--input-text-color);
    outline: none;
    background: transparent;
  }

  #datatable input[type=number]::-webkit-outer-spin-button,
  #datatable input[type=number]::-webkit-inner-spin-button,
  #datatable input[type=time]::-webkit-outer-spin-button,
  #datatable input[type=time]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  #datatable input[type="number"], #datatable input[type="time"] {
    -moz-appearance: textfield;
  }

  .datatable-container .datatable-save {
    position: relative;
    text-align: right;
    width: 100%;
    min-height: 50px;
  }

  .datatable-container .add-button button {
    position: fixed;
    bottom: 60px;
    left: 32px;
    color: #FFF;
    padding: 5px 15px;
    margin: 15px auto;
    background: var(--main-theme);
    -webkit-box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    cursor: pointer;
    border: none;
    border-radius: 5px;
    font-family: Roboto;
    font-size: 14px;
    text-decoration: none;
  }

  .datatable-container .datatable-save button {
    position: fixed;
    bottom: 60px;
    right: 32px;
    color: #FFF;
    padding: 5px 15px;
    margin: 15px auto;
    background: var(--main-theme);
    -webkit-box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    cursor: pointer;
    border: none;
    border-radius: 5px;
    font-family: Roboto;
    font-size: 14px;
    text-decoration: none;
  }

  .datatable-container .datatable-save button:disabled {
    cursor: default;
    background: #f4f4f4;;
    color: #979797;
  }

  .csv-btn {
    color: #FFF;
    padding: 5px 15px;
    margin: 15px auto;
    background: var(--main-theme);
    -webkit-box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    box-shadow: 0px 3px 10px 1px rgba(204,204,204,0.4);
    cursor: pointer;
    border: none;
    border-radius: 5px;
    font-family: Roboto;
    font-size: 14px;
    text-decoration: none;
  }

</style>
