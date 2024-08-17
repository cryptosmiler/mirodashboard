<template>
    <div>
        <vue-dropzone
          id="uploadcomponent2"
          ref="myVueDropzone2"
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
    name: 'upload-component-watermark-overlay',
    components: {
        vueDropzone
    },
    data() {
        return {
            selectedImages: [],
            files: new FormData(),
            baseURL: "youApiUrl",
            dropOptions:{
                url: `${process.env.API_BASE_URL}user/tenant-watermark-overlay`,
                addRemoveLinks: true,
                autoProcessQueue: false,
                maxFilesize: 100,
                maxFiles: 1,
                thumbnailHeight: 200,
                thumbnailWidth: 200,
                paramName: "image",
                acceptedFiles: "image/png",
                headers: {
                    Authorization: `Bearer ${
                        storage.load(AUTH_TOKENS_STORAGE_KEY).AccessToken
                    }`
                },
                dictDefaultMessage: `
                <div class="dz-details">
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
                    <span>PNG files only less than 100kb. TRANSPARENT BACKGROUND (ALPHA CHANNEL) (2500 x 2500)</span>
                    <div class="overlay-preview-img hidden"><img class="img-fluid"/></div>
                </div>
                `
            }
        }
    },
    methods: {
        changeMake(file){
            var match = true
            var error = "Please try again : "

            if(file.size > 102400){
                match = false
                error += "File size should be less than 100KB. "
            }
            if(file.type != "image/png"){
                match = false
                error += "File type should be image/png. "
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const dataURL = event.target.result;
                const img = new Image();
                img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const hasAlphaChannel = imgData.data.some((_, index) => (index + 1) % 4 === 0 && imgData.data[index] !== 255);
                if(!hasAlphaChannel)
                {
                    match = false
                    error += "Watermark PNG file should have a alpha channel for the transparency. "
                }
                };
                img.src = dataURL;
            };
            reader.readAsDataURL(file);
            
            setTimeout(()=>{
                if(file.width!=2500 || file.height!=2500){
                    error += "File dimension should be 2500 x 2500px."
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
                    if (this.$refs.myVueDropzone2) {
                        // Check if there are any files in the dropzone
                        if (this.$refs.myVueDropzone2.getQueuedFiles().length > 0) {
                            // Dropzone is not empty, remove all files
                            this.$refs.myVueDropzone2.removeAllFiles();
                        }
                    }
                    return
                }
                EventBus.$emit('freeze2', true)
                EventBus.$emit("progressing")
            }, 200)
            // EventBus.$emit('freeze2', true)
        },
        handleResponse(file, response){
            EventBus.$emit("change-made")
            const payload = {
                images: response.images,
                overlay_id: response.overlay_id
            }
            EventBus.$emit("preview-ready", payload) 
            // this.$refs.myVueDropzone2.removeAllFiles();
        },
        handleFileRemoval(){
            EventBus.$emit('freeze2', false)
        },
    },
    computed:{
        ...mapGetters("Auth", ["profile"]),
    },
    mounted(){
        EventBus.$on("post-tenant-watermark-overlay", () => {
            if(this.$refs.myVueDropzone2.dropzone && this.$refs.myVueDropzone2.getQueuedFiles().length > 0) {
                this.$refs.myVueDropzone2.dropzone.processQueue();
            }
        })
        EventBus.$on("empty-dropzone", () => {
            if (this.$refs.myVueDropzone2) {
                // Check if there are any files in the dropzone
                if (this.$refs.myVueDropzone2.getQueuedFiles().length > 0) {
                    // Dropzone is not empty, remove all files
                    this.$refs.myVueDropzone2.removeAllFiles();
                }
            }
        })
    }
}
</script>
<style>
.dz-details{
    animation: fadeInAnime 1s;
}

@keyframes fadeInAnime {
    from { opacity: 0; }
    to { opacity: 1; }
}

</style>