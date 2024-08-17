<template>
    <div>
        <vue-dropzone
          id="uploadcomponent"
          ref="myVueDropzone"
          :options="dropOptions"
          @vdropzone-file-added="changeMake"
          @vdropzone-success="handleResponse"
          @vdropzone-removed-file="handleFileRemoval"
        ></vue-dropzone>
    </div>
</template>

<script>
import vueDropzone from "vue2-dropzone";
import storage from '@/utils/storage'
import { AUTH_TOKENS_STORAGE_KEY } from '@/constants'
import { mapGetters} from 'vuex'
import store from '@/store'
import EventBus from "../../event-bus";

export default {
    name: 'upload-component',
    components: {
        vueDropzone
    },
    data() {
        return {
            eventBusEventRegistered: false,
            selectedImages: [],
            files: new FormData(),
            fileAdded : false,
            media_id: 0,
            baseURL: "youApiUrl",
            dropOptions:{
                url: `${process.env.API_BASE_URL}user/tenant-logo`,
                addRemoveLinks: true,
                autoProcessQueue: false,
                maxFilesize: 1,
                maxFiles: 1,
                thumbnailHeight: 200,
                thumbnailWidth: 200,
                resizeHeight: 400,
                resizeWidth: 100,
                paramName: "image",
                acceptedFiles: "image/jpeg, image/png",
                headers: {
                    Authorization: `Bearer ${
                        storage.load(AUTH_TOKENS_STORAGE_KEY).AccessToken
                    }`
                },
                dictDefaultMessage: 0?`<img src="https://d3pwihiolqj6py.cloudfront.net/IMAGES/MEDIA/63_101170_07Xw5x306in569mk.png" class = "mini">`:`
                <div class="dz-details">
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
                    
                    <span>Supports JPG or PNG files less than 1MB in size. Suggested dimensions (400px x 100px)</span>
                    
                    <div class="overlay-preview-img hidden"><img class="img-fluid"/></div>
                </div>
                </div>
                `
            }
        }
    },
    methods: {
        changeMake(file){
            var error = "Please try again : "
            var match = true

            console.log('file.size : ', file.size)
            console.log('file.type : ', file.type)
            if(file.size > 102400){
                match = false
                error += "File size should be less than 100KB. "
            }
            // console.log('file.type : ', file.type)
            if(file.type != "image/png" && file.type != "image/jpg" && file.type != "image/jpeg"){
                match = false
                error += "File type should be png or jpg/jpeg. "
            }

            setTimeout(()=>{
                console.log('file.width : ', file.width)
                console.log('file.height : ', file.height)
                if(file.width>800 || file.height>300){
                    error += "you current file dimension is " + file.width + " x " + file.height
                    error += ". it should be less than 800 x 300px."
                    match = false
                }

                if(!match){
                    this.$toasted.show(error, {
                        duration: 5000,
                        fullWidth: true,
                        theme: "bubble",
                        className: "link-copied",
                        position: "bottom-center"
                    });
                    this.$refs.myVueDropzone.removeAllFiles();
                    return
                }
                this.fileAdded = true
                EventBus.$emit('freeze1', true)
                EventBus.$emit("change-made0")
            }, 300)
        },
        handleFileRemoval(){
            EventBus.$emit('freeze1', false)
        },
        handleResponse(file, response){
            this.fileAdded = false
            this.media_id = response.media_id
            console.log("let me see ->", response);
            var param = {
                changed : true,
                media_id : this.media_id,
                flag : 1
            }
            console.log("here one")
            EventBus.$emit("go-on-updating-tenant", param)
            if (this.$refs.myVueDropzone) {
                // Check if there are any files in the dropzone
                if (this.$refs.myVueDropzone.getQueuedFiles().length > 0) {
                    // Dropzone is not empty, remove all files
                    this.$refs.myVueDropzone.removeAllFiles();
                }
            }
        }
    },
    computed:{
        ...mapGetters("Auth", ["profile"]),
    },
    mounted(){
        EventBus.$on("post-tenant-logo", payload => {
            if(!this.fileAdded){
                var param = {
                    changed : false,
                    media_id : 0,
                    flag : 2
                }
                EventBus.$emit("go-on-updating-tenant", param)
            }
            else{
                this.$refs.myVueDropzone.dropzone.processQueue()
            }
        })
    },
    destroyed(){
        EventBus.$off('post-tenant-logo');
    },
}
</script>

<style>
.mini{
    width: 100px;
    height: 100px;
}
</style>