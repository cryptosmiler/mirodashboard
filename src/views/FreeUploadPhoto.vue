<template lang="html">
  <div>
    <free-upload-photo :link = "_link" :content = "content" />
  </div>
</template>

<script>
import EventBus from '../event-bus'
import { mapActions } from "vuex"
import FreeUploadPhoto from '../components/FreeUploadPhoto'
import platformHelper from "@/utils/platformHelper"

export default {
  name: 'free-upload-photo-view',
  data(){
    return {
      _link: "",
      content: {},
      form: {
        email: `${process.env.UPLOAD_USER}`,
        password: `${process.env.UPLOAD_PASSWORD}`,
        platform_id: platformHelper.platform(),
      },
    }
  },
  async created () {
    this._link = this.$route.params.link
    EventBus.$emit("change-loader-state", true)
    await this.signIn(this.form).then(() =>
      EventBus.$emit("change-loader-state", true)
    )
    this.loadUploadLinkContent()
  },
  components :{
    FreeUploadPhoto,
  },
  methods: {
    ...mapActions('Auth', ['getUploadLinkContent', 'signIn']),
    async loadUploadLinkContent() {
      try {
        const res = await this.getUploadLinkContent({_link: this._link})
        this.content = res.link
      } catch (error) {
        console.error("This is error --->", error)
        // handle the error as needed
      }
    }
  },
}
</script>