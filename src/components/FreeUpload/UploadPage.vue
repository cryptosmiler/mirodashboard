<template lang="html">
  <div class="uploadPageBoard">
    <div class="uploadBanner">{{ _content.event.tenant.tenant_name }} / {{ _content.event.eventSetting.title }} ({{ _content.event.event_date | formatDate }})</div>
    <upload-main-view :checkpoint = "_checkpoint" :content = "_content" :freeupload = "_freeupload" />
  </div>
</template>

<script>

import formatter from '../../utils/formatter'
import UploadMainView from '../Upload/UploadMainView.vue'
import { mapGetters, mapActions } from 'vuex'


export default {
  name: 'stressUploadPage',
  data(){
    return {

    }
  },
  props: ['_checkpoint', '_content', '_freeupload'],
  components: {
    UploadMainView,
  },
  created(){
  },
  methods: {
    ...mapActions('Auth', ['signOut']),
    logout () {
      this.signOut()
    },
  },
}
</script>

<style lang="css" scoped>
.uploadPageBoard{
  text-align: center;
}

.uploadBanner{
  font-size: xx-large;
  font-weight: bold;
  color: rgb(173, 30, 78);
  margin-top: 35px;
}
</style>
