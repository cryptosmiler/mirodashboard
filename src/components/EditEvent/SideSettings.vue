<template lang="html">
  <div style="width:100%;">
    <edit-event-side-component :required="true" header-text="BASIC INFO">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Event Title*"
            icon_class="fas fa-font"
            :show_character_count="true"
            :character_count="form.title.length"
            :character_limit="40"
            :required="true"
            >
            <input v-model="form.title" placeholder="Event Title goes here" type="text" maxlength="40" slot="input-slot" @input="inputChange('title')">
          </edit-event-side-component-text-input>

          <edit-event-side-component-text-input
            :show_character_count="true"
            input_title="Event Website"
            icon_class="fas fa-home"
            :character_count="form.campaign_url.length"
            :character_limit="150"
            >
            <span slot="input-slot" class="gallery-url-container" @click="setFocus">
              <span contenteditable="false" class="miroio-text">>{{ protocol }}</span>
              <span
                spellcheck="false"
                :contenteditable="true"
                class="gallery-url-text"
                maxlength="150"
                @keydown="changedCampaignUrl"
                ref="campaignUrl"
                @click="setFocus"
              >
              </span>
            </span>
          </edit-event-side-component-text-input>

          <b-row>
            <b-col cols="2" md="1">
            </b-col>
            <b-col cols="9" md="11">
              <label for="" class="input-label" :class="{ requiredBlue: true }">Language</label>
            </b-col>
            <b-col cols="2" md="1" class="icons">
              <i class="fas fa-language"></i>
            </b-col>
            <b-col cols="9" md="11">
                <b-form-select style="box-shadow: none;" v-model="form.locale" :options="languages" @input="inputChange('locale')"></b-form-select>
            </b-col>
          </b-row>


          <b-row>
            <b-col cols="2" md="1">
            </b-col>
            <b-col cols="9" md="11">
              <label for="" class="input-label" :class="{ requiredBlue: true }">{{`Event Date *`}}</label>
            </b-col>
            <b-col cols="2" md="1" class="icons">
              <i :class="`fas fa-calendar`"></i>
            </b-col>
            <b-col cols="9" md="11">
              <datepicker v-model="form.event_date" input-class="date-input" calendar-class="calendar-input" @input="inputChange('event_date')"></datepicker>
            </b-col>
          </b-row>

        </b-container>
    </edit-event-side-component>


    <edit-event-side-component :required="false" header-text="COMPANY INFO">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Company Name"
            icon_class="fas fa-building"
            :show_character_count="true"
            :character_count="form.company_name.length"
            :character_limit="100"
            >
            <input v-model="form.company_name" placeholder="Your client or company name" type="text" slot="input-slot" maxlength="100" @input="inputChange('company_name')">
          </edit-event-side-component-text-input>

          <edit-event-side-component-text-input
            input_title="Company Homepage"
            icon_class="fas fa-globe"
            :show_character_count="true"
            :character_count="form.company_url.length"
            :character_limit="100"
            >
            <input v-model="form.company_url" placeholder="Your client or company URL" type="text" slot="input-slot" maxlength="100" @input="inputChange('company_url')">
          </edit-event-side-component-text-input>

          <edit-event-side-component-text-input
            input_title="Company Twitter"
            icon_class="fab fa-twitter-square"
            :show_character_count="true"
            :character_count="form.company_twitter.length"
            :character_limit="100"
            >
            <input v-model="form.company_twitter" placeholder="www.twitter.com/" type="text" slot="input-slot" maxlength="100" @input="inputChange('company_twitter')">
          </edit-event-side-component-text-input>

          <edit-event-side-component-text-input
            input_title="Company Facebook"
            icon_class="fab fa-facebook"
            :show_character_count="true"
            :character_count="form.company_facebook.length"
            :character_limit="100"
            >
            <input v-model="form.company_facebook" placeholder="www.facebook.com/" type="text" slot="input-slot" maxlength="100" @input="inputChange('company_facebook')">
          </edit-event-side-component-text-input>

        </b-container>
    </edit-event-side-component>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Datepicker from "vuejs-datepicker"
// import { VueEditor } from 'vue2-editor'
import { VueEditor, Quill } from "vue2-editor"

var Block = Quill.import("blots/block")
Block.tagName = "h5"
Quill.register(Block, true)

import EventBus from "../../event-bus.js"
import is from "is_js"
import _ from "lodash"

export default {
  name: "edit-event-side-settings",

  components: {
    Datepicker,
    VueEditor,
  },

  data() {
    return {
      form: {},
      alphaNumRegEx: /^[a-z0-9_-]+$/i,
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "link", "header", "clean"],
      ],
      // selectedLanguage: null,
      languages: [
        { value: "null", text: "Please select a language" },
        { value: "en", text: "English (Default)" },
        { value: "fr", text: "French" },
        { value: "kr", text: "Korean" },
        { value: "sk", text: "Slovenčina (Slovak)" },
        { value: "nl", text: "Nederlands (Dutch)" },
        { value: "de", text: "Deutsch (German)" },
        { value: "el", text: "Ελληνικά (Greek)" },
      ],
      protocol: "http://",
    }
  },

  computed: {
    ...mapGetters("EditEvent", ["getEventSettings", "getOriginalForm"]),
    ...mapGetters("Events", ["getSelectedEvent"]),
    getEventSetting() {
      return this.getEventSettings
    },
  },

  methods: {
    ...mapActions("EditEvent", ["changeEventValues"]),
    inputChange(fieldName) {
      var fieldValue = this.form[fieldName]
      if (is.string(fieldValue)) {
        fieldValue = this.uglifyURL(fieldValue)
      }

      this.changeEventValues({
        fieldName,
        fieldValue: fieldValue,
      })
    },
    uglifyURL(text) {
      let vm = this
      var urlRegex = /href=[\'|\"]([^[\'|\"]*)/gi
      return text.replace(urlRegex, function (urlComponent) {
        let url = urlComponent.split('href="')[1]
        console.log(`url ${url} - isURL - ${is.url(url)}`)
        if (is.not.url(url) || is.not.include(url, "https://")) {
          url = "https://" + url
        }
        return `href="${url}"`
      })
    },
    insertHTTPS(str, index) {
      return str.substr(0, index) + "https://" + str.substr(index)
    },

    is_url(str) {
      /* eslint-disable */
      var re =
        /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/
      console.log(re.test(str))
      return re.test(str)
    },

    changedCampaignUrl(event) {
      if (event.keyCode) {
        if (event.keyCode !== 13) {
          setTimeout(() => {
            if (event.target.innerText == "") {
              this.form["campaign_url"] = ""
            } else {
              if (!/^https?:\/\//.test(this.form.campaign_url)) {
                this.form["campaign_url"] = "http://" + event.target.innerText
              }
              this.form["campaign_url"] = event.target.innerText
            }
            this.inputChange("campaign_url")
          }, 100)
        } else {
          event.returnValue = false
        }
      }
    },

    setFocus(e) {
      this.$refs.campaignUrl.focus()
    },
  },

  created() {
    this.form = this.getEventSettings
    if (this.form.campaign_url == "" || this.form.campaign_url == "//") {
      this.form.campaign_url = ""
    } else {
      if (this.form.campaign_url.includes("http://")) {
        this.protocol = "http://"
        this.form.campaign_url = this.form.campaign_url.replace("http://", "")
      }
      if (this.form.campaign_url.includes("https://")) {
        this.protocol = "https://"
        this.form.campaign_url = this.form.campaign_url.replace("https://", "")
      }
    }
    this.form.event_date = this.getSelectedEvent.event_date

    EventBus.$on("reset-form", () => {
      this.form = JSON.parse(JSON.stringify(this.getOriginalForm))
      if (this.form.campaign_url == "" || this.form.campaign_url == "//") {
        this.form.campaign_url = ""
      } else {
        if (this.form.campaign_url.includes("http://")) {
          this.protocol = "http://"
          this.form.campaign_url = this.form.campaign_url.replace("http://", "")
        }
        if (this.form.campaign_url.includes("https://")) {
          this.protocol = "https://"
          this.form.campaign_url = this.form.campaign_url.replace(
            "https://",
            ""
          )
        }
      }
      this.$refs.campaignUrl.innerText = this.form.campaign_url

      this.form.event_date = this.getSelectedEvent.event_date
    })
  },

  mounted() {
    this.$refs.campaignUrl.innerText = this.form.campaign_url
  },

  watch: {
    getEventSetting(newVal, oldVal) {
      this.form = newVal
      if (this.form.campaign_url == "" || this.form.campaign_url == "//") {
        this.form.campaign_url = ""
      } else {
        // this.form.campaign_url = this.form.campaign_url.replace("http://", "")
        // this.form.campaign_url = this.form.campaign_url.replace("https://", "")
      }
      this.$refs.campaignUrl.innerText = this.form.campaign_url

      this.form.event_date = this.getSelectedEvent.event_date
    },
    form: {
      handler(val, old) {
        if (val && old) {
          if (val.campaign_url != old.campaign_url) {
            if (
              val.campaign_url.length < 1 ||
              val.campaign_url.length > 30 ||
              !val.campaign_url.match(this.alphaNumRegEx)
            ) {
              this.$store.dispatch("EditEvent/changeIsDifferentValues", false)
            } else {
              this.$store.dispatch("EditEvent/changeIsDifferentValues", true)
            }
          } else {
            this.$store.dispatch("EditEvent/changeIsDifferentValues", true)
          }
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="css" scoped>
.basic-info-body {
  background: #fff;
  padding-top: 1em;
  padding-bottom: 1em;
}

.basic-info-body div {
  margin-bottom: 1em;
}

.row-margin-bottom {
  margin-bottom: 1em;
}

.icons {
  font-size: 1.5em;
  color: #9fa9ba;
}

.gallery-url-text {
  color: var(--input-text-color);
}

.gallery-url-text:focus {
  outline: none;
}
</style>

