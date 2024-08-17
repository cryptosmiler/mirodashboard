<template lang="html">
  <b-container fluid>
      <!-- <b-row class="preview-header" no-gutters>
        <b-col cols="12" class="preview-header-title">
          <p>{{ getSelectedEvent.setting.title }}</p>
        </b-col>

        <b-col md="7" lg="7" class="preview-header-desc">
          <p v-html="">{{ this.eventDate() }}</p>
        </b-col>

        <b-col class="preview-type" md="4" lg="4">
          <image-preview-type-selection />
        </b-col>
      </b-row> -->
      <b-row v-if="this.$route.name != 'EventGalleryOverlay'">
        <image-preview-type-selection />
      </b-row>
      <b-row class="some-margin-top">
        <b-col>
          <image-preview-main/>
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import ImagePreviewTypeSelection from './ImagePreviewTypeSelection'
import ImagePreviewMain from './ImagePreviewMain'
import { mapGetters } from 'vuex'

export default {
  name: 'edit-event-preview',
  data () {
    return {
      headerTitle: 'Barack Obama BBQ Carnival',
      headerDesc: `Name, describe and configure your event's links and social media`
    }
  },
  computed: {
    ...mapGetters('Events', ['getSelectedEvent'])
  },
  components: {
    ImagePreviewTypeSelection,
    ImagePreviewMain
  },
  methods: {
    eventDate() {
      let date = new Date(this.getSelectedEvent.event_date)
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    }
  }
}
</script>

<style lang="css" scoped>

  .some-margin-top{
    margin-top: 3px; 
  }
  .preview-header {
    height: 11em;
    background: var(--main-theme);
    margin: 1em 0 1.5em 0;
    color: #fff;
  }

  .preview-header-title {
    font-size: 30px;
    padding: 1em 1em 0em 1em;
    height: 1.5em;
    position: relative;
  }

  .preview-header-title p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-height: 1.5em;        /* fallback */
    max-height: 1.5em;       /* fallback */
  }

  .preview-header-desc {
    font-size: 16px;
    padding-left: 2em;
  }

  .preview-header-desc > p, .preview-header-desc > p > p{
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
