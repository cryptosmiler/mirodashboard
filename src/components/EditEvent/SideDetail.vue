<template lang="html">
  <div style="width:100%;">
    <edit-event-side-component :header-text="$t('event.settings.details.event-logo.heading')" :icon = "$t('fas fa-heart')">
      <b-container class="basic-info-body" slot="body">
          <b-row class="mb-0">
            <b-col class="mb-0">
              <b-row  align-v="center" class="upload-image-box mb-0" align-h="center">
                <image-upload-component parent="logo"/>
              </b-row>
            </b-col>
          </b-row>
      </b-container>
    </edit-event-side-component>
 
    <edit-event-side-component :required="true" :header-text="$t('event.settings.details.basic-info.heading')" :icon = "$t('fas fa-address-card')">
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

          <!-- 
            Hidden as now this is on the main page
            <b-row>
              <b-col cols="2" md="1">
              </b-col>
              <b-col cols="9" md="11">
                <label for="" class="input-label" :class="{ requiredBlue: true }">{{`Information`}}</label>
              </b-col>
              <b-col cols="2" md="1" class="icons">
                <i :class="`fas fa-file-alt`"></i>
              </b-col>
              <b-col cols="9" md="11">
                <vue-editor v-model="form.description" :editorToolbar="customToolbar" @input="inputChange('description')"></vue-editor>
              </b-col>
            </b-row>
          -->

          <edit-event-side-component-text-input
            :show_character_count="true"
            input_title="Event Website"
            icon_class="fas fa-home"
            :character_count="form.campaign_url.length"
            :character_limit="150"
            >
            <span slot="input-slot" class="gallery-url-container" @click="setFocus">
              <span contenteditable="false" class="miroio-text" v-show="!urlFocused" >{{ protocol }}</span>
              <span
                spellcheck="false"
                :contenteditable="true"
                class="gallery-url-text"
                maxlength="150"
                @keydown="changedCampaignUrl"
                ref="campaignUrl"
                @click="setFocus"
                @focus="urlFocused = true"
                @blur="urlFocused = false"
              >
              </span>
            </span>
          </edit-event-side-component-text-input>


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

    <edit-event-side-component :required="true" :header-text="$t('event.settings.details.checkpoints.heading')" :icon = "$t('fas fa-map-marker')">
        <b-container class="basic-info-body" slot="body">
          <b-row>
            <b-col cols="12">
              <label class="checkpoint-header-label">Create different checkpoints to better organize your photos (Optional)</label>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12">
              <table id="checkpointtable" class="table table-bordered">
                <tbody>
                  <tr v-for="(checkpoint, index) in getCheckpointList" v-show="!checkpoint.delete">
                    <td>
                      <i v-show="index != 0" @click="deleteCheckpointModal(checkpoint.checkpoint_id)" class="fas fa-minus-square red"></i>
                      <i v-show="index == 0" class="default-text">Default</i>
                    </td>
                    <td>
                      <input type="text" v-model="checkpoint.checkpoint_label" @keydown="changed"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12">
              <button class="btn btn-primary" @click="addCheckpoint()">
                <i class="fas fa-plus"></i>&nbsp;<span>Add Checkpoint</span>
              </button>
            </b-col>
          </b-row>
        </b-container>
    </edit-event-side-component>

    <div class="modal" tabindex="-1" role="dialog" id="delete-checkpoint-modal">
      <delete-checkpoint-modal></delete-checkpoint-modal>
    </div>
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
import deleteCheckpointModal from "./DeleteCheckpointModal.vue"
import is from "is_js"
import $ from "jquery"

export default {
  name: "edit-event-side-settings",

  components: {
    Datepicker,
    VueEditor,
    deleteCheckpointModal,
  },

  data() {
    return {
      form: {},
      alphaNumRegEx: /^[a-z0-9_-]+$/i,
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "link", "header", "clean"],
      ],
      selectedDeleteCheckpointId: 0,
      urlFocused: false,
      protocol: "http://",
    }
  },

  computed: {
    ...mapGetters("EventCheckpoint", ["getCheckpoints"]),
    ...mapGetters("EditEvent", ["getEventSettings", "getOriginalForm"]),
    ...mapGetters("Events", ["getSelectedEvent"]),
    getEventSetting() {
      return this.getEventSettings
    },
    getCheckpointList() {
      return this.getCheckpoints ? this.getCheckpoints : []
    },
    getLogoUrl() {
      return this.getEventSettings.logo
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
              this.protocol = "http://"
              this.form["campaign_url"] = ""
            } else {
              this.protocol = ""
              if (!this.form.campaign_url.startsWith("http")) {
                this.form["campaign_url"] = "http://" + event.target.innerText
              } else {
                this.form["campaign_url"] = event.target.innerText
              }
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
    deleteCheckpointModal(checkpoint_id) {
      $("#delete-checkpoint-modal").modal("show")
      this.selectedDeleteCheckpointId = checkpoint_id
    },
    addCheckpoint() {
      this.$store.dispatch("EventCheckpoint/addCheckpoint")
    },
    changed(event) {
      setTimeout(() => {
        this.$store.dispatch("EventCheckpoint/setIsDifferentValues", true)
      }, 100)
    },
    loadLogo() {
      setTimeout(() => {
        if (
          this.getEventSettings.logo &&
          this.getEventSettings.logo.url.indexOf("default-logo.png") < 0
        ) {
          EventBus.$emit("show-img-preview", {
            parent: "logo",
            url: this.getEventSettings.logo.url,
          })
        }
      }, 1000)
    },
    formHandler(val, old) {
      console.log(`FORM WATCH`)
      if (val && old) {
        if (val.campaign_url != old.campaign_url) {
          if (
            val.campaign_url.length < 1 ||
            val.campaign_url.length > 30 ||
            !val.campaign_url.match(this.alphaNumRegEx)
          ) {
            this.$store.dispatch("EditEvent/changeIsDifferentValues", false)
          } else {
            console.log(
              `update changeIsDifferentValues to true new campaign url`
            )
            this.$store.dispatch("EditEvent/changeIsDifferentValues", true)
          }
        } else {
          console.log(`update changeIsDifferentValues side details`, val, old)
          this.$store.dispatch("EditEvent/changeIsDifferentValues", true)
        }
      }
    }
  },

  created() {
    this.form = this.getEventSettings
    let unwatch = this.$watch('form',this.formHandler)
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
    let self = this

    EventBus.$on("reset-form", (self) => {
      console.log(`reset form`)
      console.log(unwatch)
      unwatch()
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

      unwatch = self.$watch('form', this.formHandler)
    })
  },

  mounted() {
    this.$refs.campaignUrl.innerText = this.form.campaign_url
    EventBus.$on("delete-checkpoint-modal", (deleteCheckpoint) => {
      if (deleteCheckpoint) {
        this.$store.dispatch(
          "EventCheckpoint/deleteCheckpoint",
          this.selectedDeleteCheckpointId
        )
      }
      $("#delete-checkpoint-modal").modal("hide")
    })

    this.loadLogo()
  },

  watch: {
    form: {
      handler: this.formHandler,
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

.gallery-url-container {
  display: flex;
  border-bottom: 1px solid #cdd0d5;
  padding-bottom: 0.5em;
  cursor: text;
}

.miroio-text {
  color: var(--main-theme);
}

#checkpointtable {
  -webkit-box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.15);
}

#checkpointtable input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #cdd0d5;
  width: 100%;
  resize: none;
  color: var(--input-text-color);
  outline: none;
  background: transparent;
}

#checkpointtable .default-text {
  font-style: normal;
  margin-top: 5px;
  display: inline-block;
}

#checkpointtable .fas.fa-minus-square.red {
  margin-top: 8px;
  color: red;
}

.checkpoint-header-label {
  font-style: italic;
  margin-bottom: 24px;
  cursor: pointer;
}

.checkpoint-btn {
  color: #fff;
  padding: 10px 15px;
  background: var(--main-theme);
  -webkit-box-shadow: 0px 3px 10px 1px rgba(204, 204, 204, 0.4);
  box-shadow: 0px 3px 10px 1px rgba(204, 204, 204, 0.4);
  cursor: pointer;
  border: none;
  border-radius: 0px;
}

.checkpoint-btn span {
  font-family: Roboto;
  font-size: 14px;
  text-decoration: none;
}
</style>

