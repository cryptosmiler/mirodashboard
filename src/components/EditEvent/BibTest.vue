<template lang="html">
  <div class="photos-upload-screen container" :class="{isUploading: getIsUploading}">
    <b-row>
      <b-col xs="12">
          <span>You can either upload your photo or choose these demo photos to test the bib search:</span>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="4" class="demo-img-list" v-for="(imageKey, index) in bib_demo" :key="index" @click="readyToPoll(imageKey, 0)">
          <img class="demo-img" :src="getImage(imageKey)"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs="12">
        <div :class="{hidden: showLoading || showResult}">
          <vue-dropzone
            ref="DropzonePhotosUpload"
            id="upload-dropzone"
            :options="dropzoneOptions"
            name="photos-upload-dropzone"
            @vdropzone-files-added="filesAdded"
            :class="{isUploading: getIsUploading}"
            @vdropzone-success="photoUploaded"
            @vdropzone-queue-complete="queueComplete"
            >
          </vue-dropzone>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs="12" class="add-padding">
        <div id="result-container" ref="result_container" :class="{hidden: !showResult}">
          <canvas id="demoCanvas" ref="demoCanvas"></canvas>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs="12" class="add-padding">
        <div :class="{hidden: !showLoading}">
          <img class="preview-img" :src="imageUrl">
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs="12">
        <div :class="{hidden: !showLoading}">
          <div id="progress-text" class="alert alert-info" role="alert" ref="progress_text">
              {{current_loading_states}}
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs="12">
        <div id="results-pane" ref="results_pane" :class="{hidden: !showResult}">
          <div class="results text-center">
            Runners Found: <span id="runners-found" ref="runners_found" v-html="runner_found_html"></span>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs="12">
        <button class="btn btn-info" v-on:click="reloadBibPage">Reset</button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import EventBus from '../../event-bus'
import vue2Dropzone from 'vue2-dropzone'
import { mapGetters } from 'vuex'
import store from '../../store'
import storage from '@/utils/storage'
import { AUTH_TOKENS_STORAGE_KEY } from '@/constants'
import axios from 'axios'
import JQuery from 'jquery'
// import JCanvas from 'jcanvas'

const $ = JQuery

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  name: 'bib-test',
  data () {
    return {
      maxFilesAllowed: 1,
      maxIter: 10,
      showResult: false,
      showLoading: false,
      analyseIndex: 0,
      bib_demo: ['10113_1751641_MzZgvyTWk8TBzuXd.jpg','10113_1751642_c3iWkzcaKg1ql4eE.jpg','10113_1751643_9KayPw0M5PJqZsBJ.jpg'],
      bibs: [],
      bib_result: [],
      bib_text_size: 80,
      imageUrl: '',
      loading_states: ['Importing...', 'Indexing...', 'Analysing...', 'Decoding...', 'Processing...'],
      current_loading_states: 'Uploading...',
      runner_found_html: 'Searching...',
      image: {},
      dropzoneOptions: {
        url: 'https://osxfo057h1.execute-api.ap-southeast-1.amazonaws.com/int/demo?race_id=10113&user_id=19&checkpoint_id=159',
        maxFilesize: 3,
        paramName: 'file',
        acceptedFiles: 'image/jpeg',
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
          <span>Find race bibs in an image.</span>
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
          <p>Files must be less than 3MB in size</p>
          <p>Files must be in .jpg format.</p>
        </div>
        `,
        init () {
          const vm = this
          this.on('addedfile', function (file) {
            // Create the remove button
            // let removeButton = document.createElement('button')
            // let t = document.createTextNode('remove')
            // removeButton.style.cssText = 'height:50px, width:75px'
            // removeButton.className = 'remove-button'

            // removeButton.appendChild(t)

            // Capture the Dropzone instance as closure.
            // let _this = this

            // Listen to the click event
            // removeButton.addEventListener('click', function (e) {
            //   // Make sure the button click doesn't submit the form:
            //   e.preventDefault()
            //   e.stopPropagation()

            //   // Remove the file preview.
            //   // _this.removeFile(file)
            //   // If you want to the delete the file on the server as well,
            //   // you can do the AJAX request here.

            //   store.dispatch('deleteUploadingPhoto')
            // })

            // Add the button to the file preview element.
            // file.previewElement.appendChild(removeButton)
          })

          this.on('error', function (file, errorMessage) {
            console.log(`error: ${errorMessage}`)
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
    reloadBibPage () {
      this.current_loading_states = 'Uploading...'
      this.runner_found_html = 'Searching...'
      this.imageUrl = ''
      this.image = {}
      this.bibs = []
      this.bib_result = []
      this.showResult = false
      this.showLoading = false
    },
    isLessThanMaxFiles (filesLength) {
      return this.maxFilesAllowed >= filesLength
    },
    filesAdded (files) {
      let vm = this

      if (!this.isLessThanMaxFiles(files.length)) {
        for (let i = 0; i < files.length; i++) {
          setTimeout(() => {
            vm.$refs.DropzonePhotosUpload.dropzone.removeFile(files[i])
          }, 500)
        }

        EventBus.$emit('image-uploads-max-exceeded', {
          max: this.maxFilesAllowed,
          status: 'show'
        })
      } else {
        //  After adding files, if not paused, upload photos in queue
        if (!this.getPaused) {
          setTimeout(() => {
            vm.$refs.DropzonePhotosUpload.dropzone.processQueue()
          }, 500)
        }

        //  Set state.isUploading to true. Removes dropzone overlay and switches 'Uploading' text to 'Uploading...'
        this.$store.dispatch('photosAddedToUpload', files)
      }
    },
    addToCanvas (width, height, image_url) {
      const canvas = this.$refs.demoCanvas
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d');
      var image = new Image();
      image.src = image_url;
      image.addEventListener("load",function(){
        ctx.drawImage(image,0,0);
      },false);
    },
    drawBibs (bib, colour, ocr_result) {

      if(ocr_result != '') {
        // Rectangle around bib
        const canvas = this.$refs.demoCanvas
        const ctx = canvas.getContext('2d')

        ctx.font = this.bib_text_size+"px monospace"
        const box_sizing = ctx.measureText(ocr_result)

        ctx.fillStyle = '#ccc'
        ctx.lineJoin = "round"
        ctx.shadowBlur = 0
        ctx.fillRect((bib.x + (bib.width/2 - box_sizing.width/2)) - 10, bib.y - this.bib_text_size*2 + 10, box_sizing.width + 20, this.bib_text_size + 10 )

        ctx.font = this.bib_text_size+"px monospace"
        ctx.fillStyle = 'red'
        ctx.fillText(ocr_result, (bib.x + (bib.width/2 - box_sizing.width/2)) , bib.y - this.bib_text_size)

        ctx.beginPath()
        ctx.lineWidth = "10"
        ctx.lineJoin = "round"
        ctx.strokeStyle = ""+colour
        ctx.shadowColor = "black"
        ctx.shadowBlur = 10
        ctx.rect(bib.x, bib.y, bib.width, bib.height)
        ctx.stroke()
      }
    },
    updateBibs (bibs) {
      const vm = this
      this.runner_found_html = ''
      bibs.forEach(function(bib){
        if(bib.result_type === 8) {
          vm.drawBibs(bib, 'yellow', "")
        } else if(bib.result_type === 5 || bib.result_type === 2 || bib.result_type === 13 ) {
          if(!vm.bib_result.includes(bib.ocr_result)) {
            vm.drawBibs(bib, 'green', bib.ocr_result)
            vm.bib_result.push(bib.ocr_result)
          }
          const htmlText = vm.runner_found_html
          vm.runner_found_html += ("<div class='bib'><div class='bib-number'>" + bib.ocr_result + "</div></div>")
        }
      })
    },
    pollBibsByImageKey (imageKey, iter, timeout, currentIndex) {
      if(currentIndex == this.analyseIndex - 1) {
        const vm = this
        axiosClient.get(`https://osxfo057h1.execute-api.ap-southeast-1.amazonaws.com/int/demo?imageKey=${imageKey}`).then(resp => {
          const response = resp.data

          for (var n = 0; n < response.bibs.length; n++) {
            const bib = response.bibs[n]
            if(bib.result_type === 5 || bib.result_type === 2 || bib.result_type === 13 ) {
              vm.bibs[n] = bib
            }
            // vm.bibs[n] = bib
          }
          if (iter < vm.maxIter) {
            setTimeout(function() { vm.pollBibsByImageKey(imageKey, ++iter, timeout <= 3000 ? 3000 : timeout - 500, currentIndex) }, timeout)
          }
          vm.updateBibs(vm.bibs);
        })
      }
    },
    readyToPoll (imageKey, iter) {
      this.reloadBibPage()
      const currentIndex = this.analyseIndex
      this.analyseIndex++
      this.pollImageKey (imageKey, iter, currentIndex)
    },
    pollImageKey (imageKey, iter, currentIndex) {
      if(currentIndex == this.analyseIndex - 1) {
        const vm = this
        vm.showLoading = true
        axiosClient.get(`https://osxfo057h1.execute-api.ap-southeast-1.amazonaws.com/int/demo?imageKey=${imageKey}`).then(resp => {
          const response = resp.data

          if(vm.imageUrl == '' && response.image_url) {
            vm.imageUrl = response.image_url
            vm.showLoading = true
          }

          if (response.image_url) {
            vm.image.url = response.image_url
            vm.addToCanvas(response.image.image_width, response.image.image_height, response.image_url)
          }
          if (response.bibs.length===0) {
            if (iter < vm.maxIter) {
              setTimeout(function() { vm.pollImageKey(imageKey, ++iter, currentIndex) }, 3500);
              if(iter <= 4) {
                vm.current_loading_states = vm.loading_states[iter]
              }
            }
          } else {
            vm.showResult = true
            vm.showLoading = false
            setTimeout(function() { vm.pollBibsByImageKey(imageKey, 0, 5000, currentIndex) }, 1000);
          }
        })
      }
    },
    photoUploaded (file, response) {
      //  remove preview node from dropzone
      file.previewElement.parentNode.removeChild(file.previewElement)

      //  dispatch to store successfully uploaded file
      this.$store.dispatch('photoSuccessfullyUploaded', file)

      //  if user has not paused uploads, process next in queue
      if (!this.getPaused) {
        this.$refs.DropzonePhotosUpload.dropzone.processQueue()
      }
      const imageKey = response.imageKey;
      if(imageKey) {
        this.$toasted.global.images_uploaded()
        this.reloadBibPage()
        const currentIndex = this.analyseIndex
        this.analyseIndex++
        this.pollImageKey(imageKey, 0, currentIndex)
      } else {
        this.$toasted.global.images_upload_fail()
      }
    },
    retryFailed () {
      this.$refs.DropzonePhotosUpload.dropzone.processQueue()
    },
    queueComplete (file, xhr, formData) {
      if (this.$refs.DropzonePhotosUpload.dropzone.getQueuedFiles().length === 0) {
        this.$store.dispatch('photosFinishedUploading')

        this.$refs.DropzonePhotosUpload.dropzone.removeAllFiles()
      }
    },
    getImage (imagekey) {
      return `https://img.runnertag.com/images/source/${imagekey}`
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
    vueDropzone: vue2Dropzone
  },
  computed: {
    ...mapGetters([
      'getIsUploading',
      'getPaused'
    ])
  },
  mounted () {
    EventBus.$on('retry-failed-uploads', (payload) => {
      this.retryFailed()
    })

    EventBus.$on('dropzone-clear-queue', () => {
      this.$refs.DropzonePhotosUpload.dropzone.removeAllFiles()
    })
  }
}
</script>

<style lang="css">

  .photos-upload-screen {
    margin-top: 50px;
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

  .photos-upload-screen .hidden {
    display: none;
  }

  #logo{
    height: 1.5em;
  }

  #hero-logo{
    width: 100%;
    max-width: 600px;
  }

  .btn-file {
    position: relative;
    overflow: hidden;
  }
  .btn-file input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: white;
    cursor: inherit;
    display: block;
  }

  #img-upload{
    width: 100%;
  }

  .dropzone-inner.dz-clickable {
      cursor: pointer;
  }

  .drop-col{
    text-align: center;
    padding: 0;
  }

  footer{
    text-align: center;
  }

  .thumb{
    width:28em;
    display: none;
  }

  .dz-success-mark, .dz-error-mark{
    display:none
  }

  #spinner{
    margin-top: 20%;
  }

  .alert{
    text-align: center;
    font-size: 2em;
    /* display: none; */
    /* width: 50%; */
    margin: 1em auto;
  }

  canvas{
    width: 100%;
    left: 0;
    z-index: -10;
    background-color: transparent;
    pointer-events: none;
  }

  .results{
    font-size: 2em;
  }

  .badge {
    font-size: inherit !important;
    margin: 0 0.1em;
  }

  #runners-found {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .bib {
    width: 6em;
    height: 5em;
    background-color: rgba(210,54,50,0.81);
    position: relative;
    display: flex;
    /* align-items: center; */
    /* justify-content: center; */
    flex-direction: column;
    float: left;
    margin: 15px;
    border: 1px solid #333;
    background-image: url('../../assets/mylaps_logo_white.png');
    background-size: 3em;
    background-repeat: no-repeat;
    background-position: top;
    background-position-y: 5px;
  }

  .bib:before, .bib:after {
    content: "";
    position: absolute;
    height: 100%;
    width: 20px;
    top: 0px;
    background-image: radial-gradient(circle at center, white 4px, #333 1px, transparent 5px), radial-gradient(circle at center, white 4px, black 1px, transparent 5px);
    background-size: 20px 20px;
    background-position: top center, bottom center;
    background-repeat: no-repeat;
  }

  .bib:before {
    left: 0px;
  }
  .bib:after {
    right: 0px;
  }
  .demo-img {
    width: 100%;
    height: auto;
    max-height: 100px;
    object-fit: contain;
  }
  .demo-img-list {
    cursor: pointer;
    margin: 15px 0px 30px;
    text-align: center;
  }
  .bib-number {
    position: absolute;
    background: white;
    color: black;
    text-align:center;
    margin-top: 28%;
    max-height: 2em;
    width: 100%;
    font-family: 'Verdana', sans-serif;
    font-size: 150%;
  }

  .add-padding {
    padding: 0px 20%;
  }

  canvas, .preview-img {
    width: 100%;
    height: auto;
  }

  #result-container {
    max-width: 100%;
    height: auto;
  }

  .lds-dual-ring {
    display: inline-block;
    /* width: 128px;
    height: 128px; */
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 92px;
    height: 92px;
    margin: 1px;
    border-radius: 50%;
    border: 10px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  #progress-text {
    border-radius: 5px;
    padding: 10px 25px;
    color: gray;
    background-color: rgba(210, 45, 50, 0.43);
    /* opacity: ; */
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
