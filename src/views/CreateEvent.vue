<template>
  <div class="create-wizard-view">
    <create-event-modal
      ref="create-event-modal"
      class="create-event"
      :step="1"
      header-title="Describe your event"
      header-description="Fill in some information about your event"
      :bottom-left-button="{
        text: 'BACK',
        router: 'back',
        purpleButton: false,
      }"
      :bottom-right-button="{
        text: 'CUSTOMIZE EVENT',
        router: 'submit',
        purpleButton: true,
      }"
    >
      <template class="create-event-step-2" v-slot:wizard-body>
        <b-row>
          <b-col cols="12" class="text-right">* required fields</b-col>
        </b-row>
        <edit-event-side-component-radio-button
          input_title="Event Type (Event type cannot be update once set up) *"
          icon_class="far fa-check-square"
          :required="true"
        >
          <div slot="input-slot">
            <div class="d-flex">
              <b-form-group class="flex-grow-1">
                <b-form-radio-group
                  id="event-type-radio-group"
                  v-model="event_type"
                  :options="options"
                  name="event-type-radios"
                  class="text-dark"
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group class="ml-auto">
                <!-- <b-form-checkbox switch v-model="selfie_search">SELFIE SEARCH</b-form-checkbox> -->
              </b-form-group>
            </div> 
            <div>
              Event Type: <strong>{{ options[event_type - 1 ].text }}</strong><br><br>
            </div>
          </div>
        </edit-event-side-component-radio-button>
        <edit-event-side-component-text-input
          input_title="Event Title *"
          icon_class="fas fa-font text-right"
          :required="true"
          :show_character_count="true"
          :character_count="title.length"
          :character_limit="133"
        >
          <input
            v-model="title"
            placeholder="Your Event Title Goes Here"
            type="text"
            slot="input-slot"
            maxlength="40"
          />
        </edit-event-side-component-text-input>

        <!-- <edit-event-side-component-text-input
          input_title="Event Description"
          icon_class="fas fa-font"
          :required="false"
          :show_character_count="false"
          >
          <input
            v-model="description"
            placeholder="Your Event Description Goes Here"
            type="text"
            slot="input-slot"
            maxlength="133"
          >
        </edit-event-side-component-text-input> -->

        <!-- <b-row>
          <b-col cols="2" md="1"> </b-col>
          <b-col cols="9" md="11">
            <label for="" class="input-label" :class="{ requiredBlue: true }">{{
              `Description2`
            }}</label>
          </b-col>
          <b-col cols="2" md="1" class="icons text-right">
            <i :class="`fas fa-file-alt`"></i>
          </b-col>
          <b-col cols="9" md="11">
            <vue-editor
              v-model="description"
              :editorToolbar="customToolbar"
              style="color: var(--input-text-color)"
            ></vue-editor>
          </b-col>
        </b-row> -->

        <b-row style="padding: 15px 0px">
          <b-col cols="2" md="1"> </b-col>
          <b-col cols="9" md="11">
            <label for="" class="input-label" :class="{ requiredBlue: true }">{{
              `Event Date *`
            }}</label>
          </b-col>
          <b-col cols="2" md="1" class="icons text-right">
            <i :class="`fas fa-calendar`"></i>
          </b-col>
          <b-col cols="9" md="11">
            <datepicker
              v-model="event_date"
              input-class="date-input"
              calendar-class="calendar-input"
            ></datepicker>
          </b-col>
        </b-row>

        <!-- <edit-event-side-component-text-input
          input_title="Event Website *"
          icon_class="fas fa-home text-right"
          :required="true"
          :show_character_count="true"
          :character_count="description.length"
          :character_limit="133"
        >
          <input
            v-model="description"
            placeholder="Your Event Website Here"
            type="text"
            slot="input-slot"
            maxlength="40"
          />
        </edit-event-side-component-text-input> -->

        <edit-event-side-component-text-input
          :show_character_count="true"
          input_title="Event Website"
          icon_class="fas fa-home"
          :character_count="campaignUrl.length"
          :character_limit="128"
          >
          <span slot="input-slot" class="gallery-url-container" @click="setFocus2">
            <span contenteditable="false" class="miroio-text">{{ protocol }}</span>
            <span
              spellcheck="false"
              :contenteditable="true"
              class="gallery-url-text"
              maxlength="150"
              @keydown="changedCampaignUrl"
              ref="campaignUrl"
              @click="setFocus2"
            >
            </span>
          </span>
        </edit-event-side-component-text-input>

        <edit-event-side-component-text-input
          input_title="Gallery URL *"
          icon_class="fas fa-globe"
          :required="true"
          :show_character_count="true"
          :character_count="gallery_url.length"
          :character_limit="30"
        >
          <span
            slot="input-slot"
            class="gallery-url-container"
            @click="setFocus"
          >
            <template v-if="platformHelper.platform() != 4">
              <span
                spellcheck="false"
                contenteditable="true"
                class="gallery-url-text"
                maxlength="30"
                @keydown="changed"
                ref="galleryURL"
                @click="setFocus"
              >
              </span>
              <span contenteditable="false" class="miroio-text">
                .{{ domain }}
              </span>
            </template>
            <template v-else>
              <span contenteditable="false" class="miroio-text">
                {{ domain }}/
              </span>
              <span
                spellcheck="false"
                contenteditable="true"
                class="gallery-url-text"
                maxlength="30"
                @keydown="changed"
                ref="galleryURL"
                @click="setFocus"
              >
              </span>
            </template>
          </span>
        </edit-event-side-component-text-input>
        <p v-show="errorMessage" class="error-message">{{ errorMessage }}</p>
      </template>
    </create-event-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Datepicker from "vuejs-datepicker"
// import { VueEditor } from "vue2-editor";
import { VueEditor, Quill } from "vue2-editor"

var Block = Quill.import("blots/block")
Block.tagName = "h5"
Quill.register(Block, true)

import EventBus from "../event-bus"
import platformHelper from "@/utils/platformHelper"

export default {
  name: "create-event",
  data() {
    return {
      event: 1,
      title: "",
      campaignUrl: "",
      description: "",
      gallery_url: "",
      domain: platformHelper.defaultDomain(),
      event_date: new Date(),
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "link", "header", "clean"],
      ],
      errorMessage: "",
      alphaNumRegEx: /^[a-z0-9-]+$/i,
      event_type: 3,
      selfie_search: false,
      options: [
        { text: "Face", value: "1" },
        { text: "Bib", value: "2" },
        { text: "Face + Bib", value: "3" },
      ],
      platformHelper,
      protocol: "https://",
    }
  },
  components: {
    Datepicker,
    VueEditor,
  },
  methods: {
    setFocus(e) {
      this.$refs.galleryURL.focus()
    },
    changed(event) {
      let vm = this
      if (event.keyCode) {
        if (event.keyCode !== 13) {
          setTimeout(() => {
            vm.gallery_url = event.target.innerText
            vm.checkValid()
            if (
              event.target.innerText.length < 1 ||
              event.target.innerText.length > 31 ||
              !event.target.innerText.match(this.alphaNumRegEx)
            ) {
              // prevent character length over 31, keycodes that are not alphanumeric
              this.errorMessage =
                "URL prefix must be between 1 and 31 alphanumeric characters"
              event.preventDefault()
              event.stopPropagation()
            } else {
              this.errorMessage = ""
            }
          }, 100)
        } else {
          event.returnValue = false
        }
      }
    },
    checkValid() {
      if (
        this.gallery_url.length > 0 &&
        this.gallery_url.length <= 30 &&
        this.title.length > 0 &&
        this.gallery_url.match(this.alphaNumRegEx)
      ) {
        this.$refs["create-event-modal"].setDisabled(false)
      } else {
        this.$refs["create-event-modal"].setDisabled(true)
      }
    },
    getDomainName() {
      return platformHelper.defaultDomain()
      // return (
      //   (platformHelper.platform() != 4 ? "." : "") +
      //   this.getEventSettings.domain
      // )
    },
    changedCampaignUrl(event) {
      if (event.keyCode) {
        if (event.keyCode !== 13) {
          setTimeout(() => {
            if (event.target.innerText == "") {
              this.campaignUrl = ""
            } else {
              if (!/^https?:\/\//.test(event.target.innerText)) {
                this.campaignUrl = "http://" + event.target.innerText
              }
              this.campaignUrl = event.target.innerText
            }
            // this.inputChange("campaign_url")
          }, 100)
        } else {
          event.returnValue = false
        }
      }
    },
    setFocus2(e) {
      this.$refs.campaignUrl.focus()
    },
  },
  computed: {
    ...mapGetters(["getEventType", "getEventStep"]),
  },
  watch: {
    event(newVal) {
      this.$store.dispatch("changeEventType", newVal)
    },
    title(newVal) {
      this.checkValid()
    },
    description(newVal) {
      this.checkValid()
    },
    event_date(newVal) {
      this.checkValid()
    },
    event_type(newVal) {
      if(newVal == 4){
        this.selfie_search = true
      }else{
        this.selfie_search = false
      }
    }
  },
  mounted() {
    EventBus.$on("create-event", () => {
      if (this.gallery_url.length < 1) {
        event.preventDefault()
        event.stopPropagation()
        this.errorMessage = "Please specify URL prefix"
      } else if (this.gallery_url.length > 0) {
        this.$store.dispatch("Events/createEvent", {
          setting: {
            theme_id: 2,
            title: this.title,
            description: this.description,
            campaign_url: this.campaignUrl,
            colors: {
              link: "#FFFFFF",
              text: "#4A4A4A",
              accent: "#EC1C24",
              background: "#FFFFFF",
            },
            share_setting: {
              facebook: {
                title: `I ran the ${this.title}`,
                text: "Please see my photos here.",
              },
              twitter: `I ran the ${this.title}`,
              email: {
                title: `My photo from the ${this.title}!`,
                text: `See my photo from the ${this.title}.`,
              },
            },
          },
          subdomain: this.gallery_url,
          domain: process.env.DOMAIN ? process.env.DOMAIN : this.domain,
          event_date: this.event_date,
          event_type: this.event_type,
          platform_id: platformHelper.platform(),
        })
      }
    })
  },
  beforeDestroy() {
    EventBus.$off("create-event")
  },
}
</script>

<style scoped lang="css">
.create-wizard-view {
  display: grid;
  grid-template-columns: 27% auto 27%;
  /* grid-template-rows: 15% auto 25%; */
  width: 100vw;
  min-height: 100vh;
  background: white;
  padding: 10% 0px;
}

.create-event {
  grid-column: 2 / 3;
  grid-row: 2/3;
}

.create-event-step-1 {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  background: #fff;
  padding-top: 2em;
}

.event {
  display: grid;
  place-items: center center;
  color: var(--miro-grey);
}

.event-label {
  display: grid;
  place-items: center center;
}

.event-label > img {
  width: 200px;
}

.selectedEvent {
  outline: 2px solid var(--main-theme);
}

#running-event,
#standard-event {
  margin-top: 1em;
}
/*
input[type="radio"]:after {
  width: 16px;
  height: 16px;
  border-radius: 15px;
  top: 1px;
  left: -1px;
  position: relative;
  background-color: #fff;
  content: "";
  display: inline-block;
  visibility: visible;
  border: 1px solid grey;
}

input[type="radio"]:checked:after {
  width: 16px;
  height: 16px;
  border-radius: 15px;
  top: 1px;
  left: -1px;
  position: relative;
  background-color: var(--main-theme);
  content: "";
  display: inline-block;
  visibility: visible;
  border: 3px solid #fff;
  box-shadow: 0 0 0 1pt var(--main-theme);
} */

/* START OF STEP 2 CSS */
.create-event-step-2 {
  display: grid;
  grid-template-rows: auto repeat(1, 1fr);
  background: #fff;
  color: var(--miro-grey);
  padding: 0.99em;
}

.event-input {
  display: grid;
  grid-template-columns: 10% auto;
}

.event-info {
  display: grid;
  grid-template-rows: 1fr 2fr 1fr;
}

.gallery-url-container {
  display: flex;
  border-bottom: 1px solid #cdd0d5;
  padding-bottom: 0.5em;
  cursor: text;
}

.gallery-url-text {
  color: var(--input-text-color);
}

.gallery-url-text:focus {
  outline: none;
}

.miroio-text {
  color: var(--main-theme);
}

.vdp-datepicker {
  width: 100%;
}

.date-input {
  border: none;
  border-bottom: 1px solid #cdd0d5;
  width: 100%;
  padding-bottom: 0.5em;
  resize: none;
  color: var(--input-text-color);
}

.vdp-datepicker__calendar {
  color: var(--input-text-color);
}

.requiredBlue {
  color: var(--main-theme);
}

.icons {
  font-size: 1.5em;
  color: #9fa9ba;
}

@media only screen and (max-width: 768px) {
  .create-wizard-view {
    grid-template-columns: 5% 1fr 5%;
    grid-template-rows: repeat(3, minmax(0, auto));
  }

  .event-label > img {
    width: 120px;
  }
}

.custom-control-input {
  opacity: 1 !important;
}

.custom-control-description {
  padding-left: 30px;
}
</style>
<style lang="css">
#event-type-radio-group .custom-control-label > span {
  position: relative;
  top: 3px;
}
</style>
