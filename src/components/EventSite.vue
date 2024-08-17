<template lang="html">
  <b-container class="active-site" fluid>
    <div class="active-site-header"
      v-bind:class="{active: !private}"
      :style="{background: backgroundColorValue}"
      >
      <b-row class="justify-content-between align-items-stretch flex-row flex-nowrap" no-gutters>
        <b-col col sm="auto" class="site-copy flex-grow-1 flex-shrink-1 text-truncate d-inline-block">
          <router-link class="site-title" tag="a" :to="{ name: 'Event', params: { id: this.event.event_id }}">
            <h5 class="">
              {{ event.setting.title }}
            </h5>
          </router-link>
          <p class="site-copy text-wrap" @click="copyLink">
            {{event.url}}
            <i class="material-icons content-copy">
              content_copy
            </i>
          </p>
          <p v-if="this.event.event_date">{{ eventDate() }}</p>
          <p v-if="this.event.event_type">{{ eventType() }}</p>
        </b-col>
        <b-col col sm="3" md="2" class="flex-grow-0" id="event-site-dropdown">
          <div class="d-flex flex-column flex-nowrap align-items-end">
            <div v-if="role === 0"  class="btn-group" style="right:-1em">
              <i class="material-icons more-vert" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">more_vert</i>
              <div class="dropdown-menu dropdown-menu-right">
                <button class="dropdown-item" type="button" @click="duplicateEvent">Duplicate</button>
                <!-- <button class="dropdown-item" type="button" @click="toggleState">{{hideOrPublic}}</button> -->
                <!-- <button class="dropdown-item" type="button" @click="goToPhotos">Upload Photos</button> -->
                <!-- <button class="dropdown-item remove" type="button" name="button" style="color: red;"  @click="removeEvent">Delete</button> -->
              </div>
            </div>
            <div class="counts">
              <p>{{event.objects}}&nbsp; <i class="fas fa-images"></i></p>
              <p>{{this.event.runners}}&nbsp; <i class="fas fa-running"></i></p>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>

    <div class="active-site-body d-flex flex-column flex-grow-1 px-3" @click="selectEvent">
      <router-link :to="{ name: 'Event', params: { id: event.event_id }}" class="d-flex flex-column align-items-between h-100">
      <b-row align-h="between" class="d-flex flex-row align-items-between flex-grow-1">
        <b-col class='preview-item pr-2'  cols="5">
          <img class="logo-url" :src="logo_url">
        </b-col>
        <b-col class='preview-item' cols="auto">
          <b-row>
            <!-- <b-col  class='pr-0 pl-0' cols="6" lg="6" md="12">
              <active-site-color-box
              :colors="event.setting.colors"
              />
            </b-col> -->
            <b-col class="text-center" cols="12" >
              <router-link v-if="role === 0" :to="{ name: 'Event', params: { id: event.event_id }}" class="edit-button">
                <b-button  class="preview-edit"> MANAGE </b-button>
              </router-link>
              <!-- <router-link :to="{ name: 'Event', params: { id: event.event_id }}" class="edit-button">
                <b-button class="preview-edit"> UPLOAD </b-button>
              </router-link> -->
              <b-button v-if="role === 0" class="preview-edit" @click="clickPreview">PREVIEW</b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row aligh-h="between" class="d-flex flex-grow-0">
        <b-col cols="12" class="d-flex flex-row justify-content-end">
          <div v-for="(color, index) in ['background', 'text','accent','link']" class="outer-color-box" :key="index" :title="$t(`event.dashboard.colors.${color}`)">
            <div class="color-box" :style="{backgroundColor: event.setting.colors[color]}"></div>
          </div>
        </b-col>
      </b-row>
      </router-link>
    </div>
  </b-container>
</template>

<script>
import ActiveSiteColorBox from './ActiveSiteColorBox'
import EventBus from '../event-bus'
import * as clipboard from "clipboard-polyfill"

import { AUTH_TOKENS_STORAGE_KEY } from '@/constants'
import storage from '@/utils/storage'
import { mapGetters } from "vuex";

import Axios from 'axios';

export default {
  name: 'event-site',
  data () {
    return {
      words_left: 180,
      site_url: `obamarace.com`,
      logo_url: '',
      runnerCount: 0,
      role: null,
      status: null,
    }
  },
  props: {
    private: {
      type: Boolean,
      required: false
    },
    event: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToEvent () {
      this.$router.push({name: 'EventDetails', params: { id: this.event.event_id }})
    },
    copyLink () {
      clipboard.writeText(this.event.url)

      this.$toasted.global.link_copied()
    },
    selectEvent () {
      this.$store.dispatch('Events/loadEvent', {id: this.event.event_id})
    },
    removeEvent () {
      EventBus.$emit('delete-event-modal-state', {
        selectedEvent: this.event,
        status: 'show'
      })
    },
    goToPhotos () {
      this.$router.push(`/events/${this.event.event_id}/photos`)
    },
    toggleState () {
      let eventState = this.event.state === 0 ? 'public' : 'private'
      this.$store.dispatch('Events/setEventState', {
        eventId: this.event.event_id,
        eventState
      })
    },
    clickPreview () {
      let url = this.event.url.replace('https://','//')
      if (this.event.state == 0) {
        url += `#/?pin=${this.event.setting.pin}`
      }
      var win = window.open(url, '_blank')
      win.focus()
    },
    duplicateEvent () {
      // duplicateEvent(this.event.event_id)
      this.$store.dispatch('Events/duplicateEvent', {
        eventId : this.event.event_id
      })
    },
    eventDate() {
      let date = new Date(this.event.event_date);
      // return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      return `${date.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)} ${date.getFullYear()}`;
    },
    eventType() {
      console.log("this.event==>", this.event)
      // 1 = face , 2 = bib, 3 = both
      // console.log(`event_type - ${this.event.event_type}`)
      switch (this.event.event_type) {
        case 2:
          if(this.event.setting.photos_purchase == 0){
            return `[ Bib Only | Free Downloads ]`;
          }
          else{
            return `[ Bib Only | Paid Downloads ]`;
          }
          break;
        case 1:
        if(this.event.setting.photos_purchase == 0){
            return `[ Face Only | Free Downloads ]`;
          }
          else{
            return `[ Face Only | Paid Downloads ]`;
          }
          break;
        case 3:
          if(this.event.setting.photos_purchase == 0){
            return `[ Face & Bib | Free Downloads ]`;
          }
          else{
            return `[ Face & Bib | Paid Downloads ]`;
          }
          break;
        case 4:
        if(this.event.setting.photos_purchase == 0){
            return `[ Other | Free Downloads ]`;
          }
          else{
            return `[ Other | Paid Downloads ]`;
          }
          break;
        default:
          return ``;
      }
    },
    getRole() {
      this.$nextTick(() => {
        this.role = this.profile.role
        this.status = this.profile.status
        console.log("role=======", this.role)
      });
    }
  },
  computed: {
    ...mapGetters("Auth", ["profile"]),
    hideOrPublic () {
      return this.event.state === 0 ? 'Publish' : 'Hide'
    },
    backgroundColorValue () {
      return (this.event.setting.colors.background === '#FFFFFF' || this.event.state === 0) ? '#9B9B9B' : this.event.setting.colors.background
    }
  },
  components: {
    'active-site-color-box': ActiveSiteColorBox
  },
  async mounted(){
    this.getRole()
    const logoMedia = await this.event.medias.find(
      media => media.media_id === this.event.setting.logo.media_id
    )

    if (logoMedia) {
      this.logo_url = `${process.env.S3_IMAGE_URL}/${logoMedia.media_key}`
    }
  }
}
</script>

<style lang="css" scoped>
.outer-color-box {
  border: thin solid white;
  border-radius: 2px;
}
.color-box {
  width: 1rem;
  height: 1rem;
  position:relative;
  display: inline-flex;
  border: thin solid black;
  border-radius: 2px;
}
.site-title {
  color: white;
}
.active-site {
  box-shadow: 1px 1px 10px #888888;
  padding-right: 0;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 8em;
  .active-site-body {
    padding: 0.5em;
    font-size: 12px;
    color: #a0abba;
    background: #fff;
    flex-grow: 1;
  }
  .active-site-body a {
    color: #a0abba;
  }
  .active-site-header {
    flex-grow: 0;
  }
}

.active-site-header {
  color: #fff;
  font-weight: bold;
  padding: 1em 1em 0 1em;
  line-height: 0.5em;
  background: var(--main-theme);
  /*height: 125px; */
}

.active {
  background: #161664;
}

.logo-url {
  max-width: 100%;
  /* max-width: 15em; */
  max-height: 11em;
}

.material-icons.more-vert {
  font-size: 30px;
  color: #fff;
  position: relative;
  top: -10px;
  right: 0px;
}

.material-icons.more-vert:hover {
  cursor: pointer;
}

.description-words-site-preview-box {
  margin-left: auto;
  margin-right: auto;
}

.dropdown-menu.dropdown-menu-right {
  top: 5px;
  right: 15px;
}

.dropdown-item {
  min-height: 2.5rem;
  font-size: 14px;
  color: #a0abba;
}

.dropdown-item:hover {
  cursor: pointer;
}

.material-icons.content-copy {
  font-size: 12px;
  position: relative;
  top: 2px;
}


.site-description {
  margin-bottom: 1em;
}

.preview-item {
  padding-top: 1em;
}
.site-copy {
  font-size: 12px;
  color: #fff;
}

.site-copy:hover {
  cursor: pointer;
}

.counts {
  font-size: 0.8em;
  text-align: right;
  min-width: 2.5em;
}

.preview-edit {
  background: #fff;
  color: #a0abba;
  border: none;
  box-shadow: 0 5px 14px 0 rgba(0, 0, 0, 0.15);
  border-radius: 0;
  font-size: 12px;
  padding: 0.5em 1em;
  margin-top: 5px;
  width: 75px;
}

.edit-button {
  color: #a0abba;
  display: block;
}
#event-site-dropdown {
  min-width: 5rem;
}

@media (min-width: 768px) {
}
.right-preview-items {
}

.fas {
  width: 1em;
}
</style>
