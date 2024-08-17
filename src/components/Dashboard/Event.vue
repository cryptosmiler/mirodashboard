<template lang="html">
  <b-container>
    
    <b-row class="event-name-upload-button" align-h="end">
      <b-link class="pdf-link" @click="downloadPdf">Please download image requirements and share with your photographers</b-link>
    </b-row>

    <b-row class="mb-4">
      <b-col>
        <event-main-card/>
      </b-col>
    </b-row>
    <mini-menu />
    <event-statistics/>
    <b-row>
      <b-col cols="12">
        <event-main-card-active-switch/>
      </b-col>
    </b-row>
    <share-site-modal :event="getSelectedEvent" :state="getSelectedEvent.state"/>
  </b-container>
</template>

<script>
import EventMainCard from './EventMainCard'
import EventMainCardActiveSwitch from './EventMainCardActiveSwitch'
import EventStatistics from './EventStatistics'
import ShareSiteModal from './ShareSiteModal'
import { mapGetters } from 'vuex'
import * as clipboard from "clipboard-polyfill"
import EventBus from '../../event-bus.js'
import { AUTH_TOKENS_STORAGE_KEY } from '@/constants'
import axios from 'axios'

import MiniMenu from './MiniMenu.vue'


export default {
  name: 'dashboard-manage-event',
  data () {
    return {
      site_name: 'Event Site',
      company_name: 'Running Company, Inc',
      pdflink: process.env.S3_IMAGE_URL+'/IMAGES/MEDIA/RunnerTag_Best_Practices.pdf'
    }
  },
  methods: {
    goUpload () {
      this.$router.push(`/events/${this.getSelectedEvent.event_id}/upload`)
      this.$store.dispatch('PhotosFilter/changeCurrentFilter', 'Uploading')
    },
    copyLink () {
      clipboard.writeText(this.getSelectedEvent.url)

      this.$toasted.global.link_copied()
    },
    openShareModal() {
      EventBus.$emit("open-share-review-link-modal")
    },
    downloadPdf() {
      // window.open(this.pdflink, "_blank");
      axios.get(this.pdflink, { responseType: 'blob' }).then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = "RunnerTag_Best_Practices"
        link.click()
        URL.revokeObjectURL(link.href)
      }).catch(console.error)
    }
  },
  computed: {
    ...mapGetters('Events', ['getSelectedEvent'])
  },
  components: {
    EventMainCard,
    EventMainCardActiveSwitch,
    EventStatistics,
    ShareSiteModal,
    MiniMenu,

  }
}
</script>

<style lang="css" scoped>
  .event-name-upload-button {
    margin-top: 0em;
  }

  .create-event-button {
    background: var(--main-theme);
    box-shadow: 0 10px 29px 0 rgba(0,0,0,0.24);
    border-radius: 2.93px;
    font-size: 12px;
    padding: 0.5em 1em;
    color: #FFF;
    border: none;
    float: right;
    padding-top: 12px;
  }

  .pdf-link {
    font-size: 12px;
    padding: 0.5em 1.5em;
  }

  .upload-images-text {
    top: -4px;
    position: relative;
    font-weight: 500;
    font-size: 16px;
  }

  .material-icons.file-upload {
    font-size: 20px;
  }

  .block {
    background: blue;
    height: 12em;
    margin: 1em 0;
  }

  .orange {
    background: #fa8a5c;
  }

  .purple {
    background: #5c358f;
  }

  .pink {
    background: #f54972;
  }

  .share-site-card {
    background: var(--dark-blue);
    height: 5em;
    display: grid;
    grid-template-columns: auto 100px 200px;
    grid-gap: 20px;
    color: #fff;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    padding: 0 3em;
  }

  .share-site-card-new{
    background: var(--dark-blue);
    color: #fff;
    padding: 1em 1em 1em 2em;
    font-weight: bold;
    font-size: 16px;
    height: 5em;
    position: sticky;
  }

  .span_2{
    font-size: 20px;
    margin-right: 50px;
  }
  .share-invite,
  .share-invite:hover {
    background: none;
    border: 2px solid #fff;
    display: inline-flex;
    color:#fff;
    font-size: 14px;
    font-weight: bold;
  }

  .copy-url {
    display: inline-flex;
    background: none;
    border: none;
    color: #9FA9BA;
    justify-self: end;
    margin-right: 5px;
    margin-top: 2px;
  }

  button:hover {
    cursor: pointer;
  }

  .copy-link-text {
    align-self: center;
  }

  @media only screen and (max-width: 768px) {
    .event-name-upload-button {
      margin-top: 2em;
    }

    .share-site-card {
      height: 100%;
      padding: 1em 2em;
      grid-template-columns: auto;
      text-align: center;
    }

    .copy-url {
      justify-self: center;
    }

    .share-invite {
      justify-self: center;
      padding: 0.5em 3em;
    }
  }
</style>
