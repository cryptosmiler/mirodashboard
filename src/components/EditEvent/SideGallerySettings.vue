<template lang="html">
  <div class="">
    <edit-event-side-component header-text="LANGUAGE SETTINGS" :icon = "'fas fa-globe'">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-form-select
            input_title="Default Language"
            icon_class="fas fa-globe"
          >
            <b-form-select style="box-shadow: none;" v-model="form.locale" :options="languages" @input="inputChange('locale')"></b-form-select>
          </edit-event-side-component-form-select>
          <b-row>
            <b-col cols="2" md="1"></b-col>
            <b-col cols="8" md="9">
              <label for="">Allow user to switch language</label>
            </b-col>
            <b-col cols="2" md="1">
              <label class="switch text-left">
                <input type="checkbox" v-model="availableLocales.length" @change="showLocalesOptions">
                <span class="slider round"></span>
              </label>
            </b-col>
          </b-row>
          <b-row v-show="isShowingLocalesOptions">
            <b-col cols="12">
              <table id="checkpointtable" class="table table-bordered">
                <tbody>
                <!-- <b-col cols="9" md="11" offset='2' offset-md='1'> -->
                  <tr v-for="(selected, index) in availableLocales" >
                    <td><i @click="deleteLocale(selected)" class="fas fa-minus-square red"></i></td>
                    <td><b-form-select :value="selected" :options="languages" @input="addLocale($event, selected)"></b-form-select></td>
                  </tr>
                  <!-- <b-form-select style="box-shadow: none;" multiple v-model="form.locales" :options="languages" @change="inputChange('locales')"></b-form-select> -->
                <!-- </b-col> -->
                </tbody>
              </table>
            </b-col>
            <b-col cols="12">
              <button class="btn" id="add-language-btn" @click="addLocale()"><i class="fas fa-plus"></i> <span>Add Language</span></button>
            </b-col>
          </b-row>
        </b-container>
    </edit-event-side-component>
    <edit-event-side-component header-text="TRACKING SETTINGS (OPTIONAL)" :icon = "'fas fa-chart-bar'">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Google Analytics Tracking Code"
            icon_class="fas fa-chart-bar"
            >
            <input v-model="form.ga_id" placeholder="UA-" type="text" slot="input-slot" @input="checkUA">
          </edit-event-side-component-text-input>
        </b-container>
    </edit-event-side-component>

    <edit-event-side-component header-text="GALLERY URL SETTINGS" :required="true" :icon = "'fas fa-link'">
        <b-container class="basic-info-body nest-input" slot="body">
          <edit-event-side-component-text-input
            input_title="Gallery URL *"
            icon_class="fas fa-link"
            :required="true"
            :show_character_count="true"
            :character_count="form.subdomain.length"
            :character_limit="30"
            >
            <span slot="input-slot" class="gallery-url-container">
              <template v-if="platformHelper.platform() !=4">
                <input
                  @click="setFocus"
                  @keydown="changed"
                  v-model="form.subdomain"
                  ref="galleryText"
                  :readonly="isLocked"
                  type="text"
                  slot="input-slot"
                  maxlength="30"
                  >
                  <span contenteditable="false" class="miroio-text">
                    {{getDomainName()}}
                  </span>
              </template>
              <template v-else>
                <div>
                  <span contenteditable="false" class="miroio-text">
                    {{ getDomainName() }}/
                  </span>
                  <input
                    @click="setFocus"
                    @keydown="changed"
                    v-model="form.subdomain"
                    :readonly="isLocked"
                    type="text"
                    slot="input-slot"
                    maxlength="30"
                  />
              </div>
              </template>
              <span class="lock-icon" @click="changeLock">
                <i :class="[isLocked ? 'fas fa-lock' : 'fas fa-unlock']"></i>
              </span>
            </span>
          </edit-event-side-component-text-input>
          <p class="change-url-note mb-3">{{errorMessage}}</p>
          <p class="change-url-note">Note: Changing the URL of a public gallery will result in any previous URLs not linking correctly.</p>
        </b-container>
    </edit-event-side-component>

    <edit-event-side-component header-text="PHOTO PURCHASE SETTINGS" :required="false" v-if="platformHelper.hasPurchase()" :icon = "'fas fa-shopping-cart'">
      <b-container class="info-body" slot="body">
        <b-row>
          <b-col cols="10">
            <label for="">Allow Photo Purchase</label>
          </b-col>
          <b-col cols="2">
            <label class="switch">
              <input type="checkbox" v-model="form.photos_purchase" @change="purchaseChange()">
              <span class="slider round"></span>
            </label>
          </b-col>
        </b-row>

        <b-row :class="{ disabled : !form.photos_purchase }">
          <b-col cols="12">
            <label for="">Currency</label>
          </b-col>
          <b-col cols="12">
            <b-form-select
              @change="currencyChange($event)"
              :disabled="!form.photos_purchase" v-model="form.purchase_currency" :options="getCurrencies" size="sm" class="mb-1"></b-form-select>
          </b-col>
        </b-row>

        <b-row :class="{ disabled : !form.photos_purchase }">
          <b-col cols="8">
            <label for="">Price for Single Photo</label>
          </b-col>
          <b-col cols="4">
            <b-form-select 
              @input="priceChange($event, 'single')" 
              :disabled="!form.photos_purchase" 
              v-model="form.purchase_single_price" 
              :options="getPricesForCurrencyCodeAndType(form.purchase_currency, 'single')" 
              size="sm" 
              class="mb-1">
            </b-form-select>
          </b-col>
        </b-row>

        <b-row :class="{ disabled : !form.photos_purchase }">
          <b-col cols="8">
            <label for="">Price for Batch Photo</label>
          </b-col>
          <b-col cols="4">
            <b-form-select 
              @input="priceChange($event, 'batch')" 
              :disabled="!form.photos_purchase" 
              v-model="form.purchase_batch_price" 
              :options="getPricesForCurrencyCodeAndType(form.purchase_currency, 'batch')" 
              size="sm" 
              class="mb-1"
            >

            </b-form-select>
          </b-col>
        </b-row>

        <b-row class="mt-3" :class="{ disabled : !form.photos_purchase }">
          <b-col cols="10">
            <label for="">APPLY WATERMARK</label>
          </b-col>
          <b-col cols="2">
            <label class="switch">
              <input type="checkbox" 
                v-model="form.watermark_enabled"
                :disabled="!form.photos_purchase"
                @change="watermarkChange()"
              >
              <span class="slider round"></span>
            </label>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols class="note font-italic">
            <p v-html="$t(`event.settings.purchase.purchase-setting-notes`)"></p>
          </b-col>
        </b-row>
      </b-container>
    </edit-event-side-component>

    <edit-event-side-component header-text="DOWNLOAD &amp; SHARING" :required="false" :icon = "'fas fa-download'">
      <b-container class="info-body" :class="{ disabled : form.photos_purchase}" slot="body">
        <b-row>
          <b-col cols="10">
            <label for="">Allow Photo Downloads</label>
          </b-col>
          <b-col cols="2">
            <label class="switch">
              <input type="checkbox" v-model="form.download_enabled" @change="sharingChange('download_enabled')">
              <span class="slider round"></span>
            </label>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="10">
            <label for="">Allow Photo Sharing</label>
          </b-col>
          <b-col cols="2">
            <label class="switch">
              <input type="checkbox" v-model="form.sharing_enabled" @change="sharingChange('sharing_enabled')">
              <span class="slider round"></span>
            </label>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="10">
            <label for="">Allow Runners to Upload Photos</label>
          </b-col>
          <b-col cols="2">
            <label class="switch">
              <input type="checkbox" v-model="form.allow_upload" @change="sharingChange('allow_upload')">
              <span class="slider round"></span>
            </label>
          </b-col>
        </b-row>
      </b-container>
  </edit-event-side-component>
  <!--
    HIDE ALL THE PHOTO SHARING TEXT OPTIONS

  <edit-event-side-component :required="false" header-text="FACEBOOK PHOTO SHARING" v-show="form.sharing_enabled" :icon = "$t('fab fa-facebook')">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Facebook Share Title"
            icon_class="fab fa-facebook"
            :show_character_count="true"
            :character_count="form.share_setting.facebook.title.length"
            :character_limit="100"
            >
            <input
              v-model="form.share_setting.facebook.title"
              placeholder="This event is the best ever"
              type="text"
              slot="input-slot"
              maxlength="100"
              @input="sharingChange('share_setting')"
              >
          </edit-event-side-component-text-input>

          <edit-event-side-component-text-input
            :show_character_count="true"
            input_title="Facebook Share Text"
            icon_class=""
            :character_count="form.share_setting.facebook.text.length"
            :character_limit="133"
            >
            <textarea
              v-model="form.share_setting.facebook.text"
              placeholder="This event is the best ever with #hashtag"
              maxlength="133"
              slot="input-slot"
              @input="sharingChange('share_setting')"
              ></textarea>
          </edit-event-side-component-text-input>
        </b-container>
    </edit-event-side-component>

    <edit-event-side-component :required="false" header-text="TWITTER PHOTO SHARING" v-show="form.sharing_enabled" :icon = "$t('fab fa-twitter-square')">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Twitter Share Text"
            icon_class="fab fa-twitter-square"
            :show_character_count="true"
            :character_count="form.share_setting.twitter.length"
            :character_limit="280"
            >
            <textarea
              v-model="form.share_setting.twitter"
              placeholder="This event is the best ever with #hashtag"
              maxlength="280"
              slot="input-slot"
              @input="sharingChange('share_setting')"
              ></textarea>
          </edit-event-side-component-text-input>
        </b-container>
    </edit-event-side-component>

    <edit-event-side-component :required="false" header-text="EMAIL PHOTO SHARING" v-show="form.sharing_enabled" :icon = "$t('fas fa-envelope')">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Email Share Title"
            icon_class="fas fa-envelope"
            :show_character_count="true"
            :character_count="form.share_setting.email.title.length"
            :character_limit="100"
            >
            <input
              v-model="form.share_setting.email.title"
              placeholder="This event is the best ever"
              type="text"
              slot="input-slot"
              maxlength="100"
              @input="sharingChange('share_setting')"
              >
          </edit-event-side-component-text-input>

          <edit-event-side-component-text-input
            :show_character_count="true"
            input_title="Email Share Text"
            icon_class=""
            :character_count="form.share_setting.email.text.length"
            :character_limit="133"
            @input="sharingChange"
            >
            <textarea
              v-model="form.share_setting.email.text"
              placeholder="This event is the best ever with #hashtag"
              maxlength="133"
              slot="input-slot"
              @input="sharingChange(`share_setting`)"
              ></textarea>
          </edit-event-side-component-text-input>
        </b-container>
    </edit-event-side-component>
  -->

    <edit-event-side-component header-text="EVENT STICKERS" v-show="form.allow_upload" icon="fas fa-image">
      <template #tooltip>
        <div>
          <p><b>Stickers are a fun way for runners to customise their photos.</b></p>
          <hr />
          <p style="text-align: left;">Q: What image formats are acceptable?<br />
          A. Only PNG and SVG files are supported. PNG files should use a transparent alpha channel to let the image behind show through.</p>

          <p style="text-align: left;">Q: What is the maximum image size and file size for a sticker file?<br />
          A. Each sticker can be no larger than 100Kb.
          The maximum image size is 2500x2500px and the minimum image size is 100x100px.</p>

          <p style="text-align: left;">Q. What are the different types of stickers? <br />
          A. Most stickers should use the DEFAULT layout. This will let the user place the sticker onto their image and resize it to fit.
          For BANNER stickers - set the type to WIDE. The sticker will be presented as full width. Banner stickers that are too tall will be rejected. (You can always use the DEFAULT layout)
          For FULL HEIGHT stickers - set the type to TALL. The sticker will be presented full height. Full height stickers that are too wide will be rejected. (You can always use the DEFAULT layout). The user will be able to reposition and scale the sticker as they like.</p>
        </div>
      </template>
      <template v-slot:body>
        <b-container class="basic-info-body">
          <b-row class="row-margin-bottom">
            <b-col cols="12">
              <label for="" class="input-label"
                >ADD STICKERS THAT CAN BE ADDED TO UPLOADED PHOTOS</label
              >
            </b-col>

            <b-col>
              <b-row
                align-v="center"
                class="upload-image-box stickers"
                align-h="center"
              >
                <image-upload-component
                  parent="stickers"
                  :dropzoneOpts="dropzoneOpts"
                />
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </edit-event-side-component>
    <b-modal 
      id="edit-gallery-url"
      title="Unlock Gallery URL"
    >
      <div>
        <p class="description">
          Are you sure you want to change the destination URL for your gallery site?
        </p>
      </div>
      <template #modal-ok>Yes</template>
      <template #modal-cancel>No</template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import EventBus from "../../event-bus.js"
import is from "is_js"

import EditEventSideComponentFormSelect from "./EditEventSideComponentFormSelect"
import platformHelper from "@/utils/platformHelper"
import { throws } from "assert"

export default {
  name: "side-gallery-settings",
  components: {
    EditEventSideComponentFormSelect
  },
  data() {
    return {
      form: {},
      // subdomain: '',
      errorMessage: "",
      alphaNumRegEx: /^[a-z0-9-]+$/i,
      isLocked: true,
      dropzoneOpts: {
        acceptedFiles: "image/svg+xml, image/png",
      },
      languages: [
        { value: "null", text: "Please select a language", disabled: true },
        { value: "en", text: "English (Default)", disabled: false },
        { value: "fr", text: "Français (French)", disabled: false },
        { value: "kr", text: "한국어 (Korean)", disabled: false },
        { value: "sk", text: "Slovenčina (Slovak)", disabled: false },
        { value: "nl", text: "Nederlands (Dutch)", disabled: false },
        { value: "de", text: "Deutsch (German)", disabled: false },
        { value: "el", text: "Ελληνικά (Greek)", disabled: false },
        { value: "es", text: "Español (Spanish)", disabled: false },
      ],
      currencies: [
        { value: "null", text: "Please select a currency to use", disabled: true },
      ],
      isShowingLocalesOptions: false,
      hackingComputed: 0,
      platformHelper,
    }
  },
  computed: {
    ...mapGetters("EditEvent", ["getEventSettings", "getOriginalForm"]),
    ...mapGetters("Prices", ["getPricesForCurrencyCodeAndType", "getCurrencies","getPricesForCurrencyCode"]),
    availableLocales() {
      // minus the default
      this.hackingComputed
      const filteredLocales = _.without(this.form.locales, this.form.locale)
      console.log("filteredLocales", filteredLocales)

      return filteredLocales
    }
  },
  watch: {
    getEventSettings(newVal, oldVal) {
      console.log(newVal)
      this.form = newVal
      this.setDefaultForm()
      // this.$refs.galleryText.innerText = this.form.subdomain
    },
    form(newVal, oldVal) {
      if (oldVal.locales) {
        oldVal.locales.map(o => {
          this.resetOption(o, false)
        })
      }
      if (newVal.locales) {
        newVal.locales.map(o => {
          this.resetOption(o, true)
        })
      }
    },
  },
  methods: {
    ...mapActions("EditEvent", ["changeEventValues"]),
    checkUA(e) {
      if (this.form.ga_id.length === 0) {
        this.form.ga_id = ""
      } else if (
        this.form.ga_id[0] !== "U" ||
        (this.form.ga_id.length === 2 && this.form.ga_id[1] !== "A") ||
        (this.form.ga_id.length === 3 && this.form.ga_id[2] !== "-")
      ) {
        this.form.ga_id = `UA-${e.data}`
        this.form.ga_id =
          this.form.ga_id === `UA-null` ? `UA-` : this.form.ga_id
      }
      this.updateInfo("ga_id", this.form.ga_id)
    },
    inputChange(fieldName) {
      var fieldValue = this.form[fieldName]
      if (is.string(fieldValue)) {
        fieldValue = this.uglifyURL(fieldValue)
      }
      // when updating locale, have to update the locales list as well
      if (fieldName == "locale") {
        this.form.locales[0] = fieldValue
        this.inputChange("locales")
      }

      this.changeEventValues({
        fieldName,
        fieldValue: fieldValue,
      })
    },
    currencyChange(currency) {
      console.log(`Currency Change`, currency)
      console.log(
        this.getPricesForCurrencyCodeAndType(currency, 'batch') 
      )
      this.form.purchase_batch_price = this.getPricesForCurrencyCodeAndType(currency, 'batch').reduce((a,e) =>  parseFloat(a.text) > parseFloat(e.text)?e:a).value
      this.form.purchase_single_price = this.getPricesForCurrencyCodeAndType(currency, 'single').reduce((a,e) =>  parseFloat(a.text) > parseFloat(e.text)?e:a).value
      console.log(this.getPricesForCurrencyCodeAndType(currency, 'single'))
      this.inputChange('purchase_currency')
      /* this.inputChange('purchase_batch_price')
      this.inputChange('purchase_single_price') */
    },
    purchaseChange() {
      // Disable sharing, download & upload if purchase is enabled
      if (this.form.photos_purchase) {
        this.form['sharing_enabled'] = false
        this.form['download_enabled'] = false
        this.form['allow_upload'] = false
        this.form['watermark_enabled'] = true
        this.sharingChange("sharing_enabled")
        this.sharingChange("share_setting")
        this.sharingChange("download_enabled")
        this.sharingChange("allow_upload")
      } else {
        this.form['watermark_enabled'] = false
      }
      this.sharingChange("watermark_enabled")
      this.sharingChange("photos_purchase")
    },
    watermarkChange() {
      this.sharingChange("watermark_enabled")
    },
    priceChange(ext_price_id, type) {
      this.sharingChange(`purchase_${type}_price`)
    },
    sharingChange(fieldName) {
      this.changeEventValues({
        fieldName,
        fieldValue: this.form[fieldName],
      })
      if (fieldName == "sharing_enabled" && this.form[fieldName] == true) {
        this.sharingChange("share_setting")
      }
    },
    uglifyURL(text) {
      let vm = this
      var urlRegex = /href=[\'|\"]([^[\'|\"]*)/gi
      return text.replace(urlRegex, function(urlComponent) {
        let url = urlComponent.split('href="')[1]
        console.log(`url ${url} - isURL - ${is.url(url)}`)
        if (is.not.url(url) || is.not.include(url, "https://")) {
          url = "https://" + url
        }
        return `href="${url}"`
      })
    },
    addMiro($event) {
      let currentDomain = ".miro.io"
      this.withOutMiro = $event.target.value.split(currentDomain)[0]
    },
    changed(event) {
      if (event.keyCode) {
        if (event.keyCode !== 13) {
          setTimeout(() => {
            if (
              this.form.subdomain.length < 1 ||
              this.form.subdomain.length > 30 ||
              !this.form.subdomain.match(this.alphaNumRegEx)
            ) {
              this.errorMessage =
                "URL prefix must be between 1 and 30 alphanumeric characters"
              event.preventDefault()
              event.stopPropagation()
              this.$store.dispatch("EditEvent/changeIsDifferentValues", false)
            } else {
              this.errorMessage = ""
              if (event.keyCode === 8 || event.keyCode === 189) {
                // this.subdomain = event.target.innerText
                // this.form.subdomain = event.target.innerText;
                this.updateInfo("subdomain", this.form.subdomain)
              } else if (
                this.form.subdomain.length === 31 ||
                event.keyCode >= 105 ||
                event.keyCode === 32
              ) {
                event.preventDefault()
                event.stopPropagation()
                this.$store.dispatch("EditEvent/changeIsDifferentValues", false)
              } else {
                // this.subdomain = event.target.innerText
                // this.form.subdomain = event.target.innerText;
                this.updateInfo("subdomain", this.form.subdomain)
              }
            }
          }, 100)
        } else {
          event.returnValue = false
        }
      }
    },
    setFocus(e) {
      if (this.isLocked) {
        this.changeLock()
      } else {
        this.$refs.galleryText.focus();
      }
    },
    updateInfo(fieldName, fieldValue) {
      this.$store.dispatch("EditEvent/changeEventValues", {
        fieldName,
        fieldValue,
      })
    },
    changeLock(e) {
      if (this.isLocked) {
        this.$bvModal.msgBoxConfirm('Are you sure you want to change the destination URL for your gallery site?', {
          title: 'Unlock Gallery URL',
          size: 'md',
          buttonSize: 'md',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        }).then((result) => {
          if(result) { 
            this.isLocked = false
            this.setFocus()
          }
        })
      } else {
        this.isLocked=true
      }
    },
    getDomainName() {
      return (
        (platformHelper.platform() != 4 ? "." : "") +
        this.getEventSettings.domain
      )
    },
    setDefaultForm() {
      if (this.form.share_setting.facebook.title == "") {
        this.form.share_setting.facebook.title = `I ran the ${
          this.getEventSettings.title
        }`
      }
      if (this.form.share_setting.facebook.text == "") {
        this.form.share_setting.facebook.text = `Please see my photos here.`
      }
      if (this.form.share_setting.twitter == "") {
        this.form.share_setting.twitter = `I ran the ${
          this.getEventSettings.title
        }`
      }
      if (this.form.share_setting.email.title == "") {
        this.form.share_setting.email.title = `My photo from the ${
          this.getEventSettings.title
        }!`
      }
      if (this.form.share_setting.email.text == "") {
        this.form.share_setting.email.text = `See my photo from the ${
          this.getEventSettings.title
        }.`
      }
      if (this.form.locales.length > 1) {
        this.isShowingLocalesOptions = true
      } else {
        this.isShowingLocalesOptions = false
      }
    },
    showLocalesOptions(event) {
      console.log("showLocalesOptions", event.target.checked)
      // cancel locales
      // reset it
      // const oriForm =  JSON.parse(JSON.stringify(this.getOriginalForm))
      this.form.locales = [this.form.locale]
      this.languages.map(o => {
        console.log(
          `${o.value} - index: ${_.indexOf(this.form.locales, o.value)}`
        )
        if (_.indexOf(this.form.locales, o.value) != -1 || o.value == "null") {
          o.disabled = true
        } else {
          o.disabled = false
        }
      })
      this.inputChange("locales")
      this.isShowingLocalesOptions = event.target.checked
    },
    addLocale(newVal, oldVal) {
      console.log(`addLocale ${newVal} with old ${oldVal}`)
      if (newVal) {
        if (oldVal && oldVal != "null") {
          // updating existig input
          let oldIndex = _.indexOf(this.form.locales, oldVal)
          if (oldIndex != -1) {
            this.form.locales[oldIndex] = newVal
            this.resetOption(oldVal, false)
          }
        } else {
          this.form.locales.push(newVal)
        }

        // dropping a dummy locales
        this.deleteLocale("null")
        this.form.locales = _.uniq(this.form.locales)
        this.resetOption(newVal, true)
        return
      }
      // for the add language button
      // adding a dummy locales
      this.form.locales.push("null")
    },
    deleteLocale(selected) {
      console.log("deleteLocale", selected)
      _.pull(this.form.locales, selected)
      if (selected != "null") {
        this.resetOption(selected, false)
      }
      if (this.form.locales.length <= 1) {
        this.isShowingLocalesOptions = false
      }
      this.inputChange("locales")
    },
    resetOption(val, disabled) {
      this.hackingComputed++
      let index = _.indexOf(this.languages.map(x => x.value), val)
      this.languages[index].disabled = disabled
    },
  },
  created() {
    this.$store.dispatch("Prices/loadPrices")
    this.form = this.getEventSettings
    this.setDefaultForm()
    EventBus.$on("reset-form", () => {
      this.form = JSON.parse(JSON.stringify(this.getOriginalForm))
      this.setDefaultForm()
    })
  },
}
</script>

<style lang="css" scoped>
.basic-info-body {
  background: #fff;
  padding-top: 1em;
  padding-bottom: 1em;
}

.note {
  font-size: small;
}

.disabled {
  transition: opacity 0.5s;
  opacity: 0.1;
}

.lock-icon {
  /* position: absolute; */
  /* right: 20px; */
  margin-left: 20px;
}

.lock-icon:hover {
  cursor: pointer;
}

.basic-info-body div {
  margin-bottom: 1em;
}

.info-body {
  background: #fff;
  padding: 2em 2em 1em 2em;
}

.row-margin-bottom {
  margin-bottom: 1em;
}

.icons {
  font-size: 1.5em;
  color: #9fa9ba;
}

.change-url-note {
  /* padding-left: 35px; */
  font-size: 12px;
}

.input-slot {
  width: 200px;
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

.nest-input .gallery-url-container {
  border: none;
}

.upload-image-box {
  background: #f4f8f9;
  padding: 0;
  margin: 0.5em;
}

@media only screen and (max-width: 768px) {
  .change-url-note {
    padding-left: 60px;
  }
}

.custom-select {
  border: none;
  border-radius: 0px;
  border-bottom: 1px solid #cdd0d5;
  padding-bottom: 0.5em;
  padding-left: 0;
}

.red {
  margin-top: 8px;
  color: red;
}

#add-language-btn {
  color: #fff;
  padding: 10px 15px;
  background: var(--main-theme);
  -webkit-box-shadow: 0px 3px 10px 1px rgba(204, 204, 204, 0.4);
  box-shadow: 0px 3px 10px 1px rgba(204, 204, 204, 0.4);
  cursor: pointer;
  border: none;
  border-radius: 5px;
}
</style>
