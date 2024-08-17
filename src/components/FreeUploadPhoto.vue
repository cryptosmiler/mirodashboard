<template lang="html">
  <div>
    <stressBlankPage v-if="showBlankPage" />
    <stressExpiredPage v-if="showExpiredPage" />
    <stressPasswordPage v-if="showPasswordPage" :_password="content.password" />
    <stressCheckpointPage v-if="showCheckpointPage" :_checkpoint_array = "content.checkpoint_array" />
    <stressUploadPage v-if="showUploadPage" :_checkpoint = "checkpoint" :_content = "content" :_freeupload = "1" />
    <stressRestrictedPage v-if="showRestrictedPage" />
  </div>
</template>

<script>

import platformHelper from "@/utils/platformHelper"
import EventBus from '../event-bus'

import { mapActions } from "vuex"

import stressBlankPage from './FreeUpload/BlankPage.vue'
import stressExpiredPage from './FreeUpload/ExpiredPage.vue'
import stressPasswordPage from './FreeUpload/PasswordPage.vue'
import stressCheckpointPage from './FreeUpload/CheckpointPage.vue'
import stressUploadPage from './FreeUpload/UploadPage.vue'
import stressRestrictedPage from './FreeUpload/RestrictedPage.vue'


export default {
  name: 'free-upload-photo',
  props: {
    link: '',
  },
  data(){
    return{
      content: {},
      showBlankPage: 0,
      showExpiredPage: 0,
      showPasswordPage: 0,
      showCheckpointPage: 0,
      showUploadPage: 0,
      showRestrictedPage: 0,
      checkpoint: {},
      form: {
        email: process.env.UPLOAD_USER,
        password: process.env.UPLOAD_PASSWORD,
        platform_id: platformHelper.platform(),
      },
    }
  },
  components: {
    stressBlankPage,
    stressExpiredPage,
    stressPasswordPage,
    stressCheckpointPage,
    stressUploadPage,
    stressRestrictedPage,
  },
  async created() {
    // this.loadUploadLinkContent()
    EventBus.$emit("change-loader-state", true)
    await this.signIn(this.form).then(() =>
      EventBus.$emit("change-loader-state", true)
    )
    this.loadUploadLinkContent()
  },
  mounted () {
    EventBus.$on("password-correct", ()=>{
      if(this.content.checkpoint_id ==0){
        this.formatAll()
        this.showCheckpointPage = 1
      }
      else{
        this.formatAll()
        this.showUploadPage = 1
      }
    })

    EventBus.$on("checkpoint-selected", (payload)=>{
      this.checkpoint = payload
      this.formatAll()
      this.showUploadPage = 1
    })
  },
  watch: {
    
  },
  methods: {
    ...mapActions('Auth', ['getUploadLinkContent', 'signIn']),
    async loadUploadLinkContent(){
      const data = {_link: this.link}
      EventBus.$emit("change-loader-state", true)
      const res = await this.getUploadLinkContent(data)
      this.content = res.link
      // console.log("content -> ", this.content)
      if(!res.success)
      {
        if(res.reason === "expired"){
          this.formatAll()
          this.showExpiredPage = 1
        }
        else if(res.reason === "not found"){
          this.formatAll()
          this.showBlankPage = 1
        }
        else if(res.reason === "restricted"){
          this.formatAll()
          this.showRestrictedPage = 1
        }
      }
      else{
        if(res.link.password_show){
          this.formatAll()
          this.showPasswordPage = 1
        }
        else if(res.link.checkpoint_id == 0){
          this.formatAll()
          this.showCheckpointPage = 1
        }
        else{
          this.formatAll()
          this.showUploadPage = 1
        }
      }

      EventBus.$emit("change-loader-state", false)
    },
    formatAll(){
      this.showBlankPage = 0,
      this.showExpiredPage = 0
      this.showPasswordPage = 0
      this.showCheckpointPage = 0
      this.showUploadPage = 0
    },
  },
  computed: {
    
  }
}
</script>

<style lang="css" scoped>

</style>
