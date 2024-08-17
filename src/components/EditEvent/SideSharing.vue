<template lang="html">
  <div style="width:100%;">
    <edit-event-side-component :required="false" header-text="" :header-show="false">
        <b-container class="info-body" slot="body">
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
        </b-container>
    </edit-event-side-component>

    <edit-event-side-component :required="false" header-text="Facebook Photo Sharing" v-show="form.sharing_enabled">
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

    <edit-event-side-component :required="false" header-text="Twitter Photo Sharing" v-show="form.sharing_enabled">
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

    <edit-event-side-component :required="false" header-text="Email Photo Sharing" v-show="form.sharing_enabled">
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
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EventBus from '../../event-bus.js'

export default {
  name: 'edit-event-side-sharing',
  computed: {
    ...mapGetters('EditEvent', ['getEventSettings', 'getOriginalForm'])
  },
  data () {
    return {
      form: {
      }
    }
  },
  methods: {
    ...mapActions('EditEvent', ['changeEventValues']),
    sharingChange (fieldName) {
      this.changeEventValues({
        fieldName,
        fieldValue: this.form[fieldName]
      })
      if(fieldName == 'sharing_enabled' && this.form[fieldName] == true) {
        this.sharingChange('share_setting')
      }
    },
    setDefaultForm() {
      if(this.form.share_setting.facebook.title == '' ) {
        this.form.share_setting.facebook.title = `I ran the ${this.getEventSettings.title}`
      }
      if(this.form.share_setting.facebook.text == '' ) {
        this.form.share_setting.facebook.text = `Please see my photos here.`
      }
      if(this.form.share_setting.twitter == '' ) {
        this.form.share_setting.twitter = `I ran the ${this.getEventSettings.title}`
      }
      if(this.form.share_setting.email.title == '' ) {
        this.form.share_setting.email.title = `My photo from ${this.getEventSettings.title} ! `
      }
      if(this.form.share_setting.email.text == '' ) {
        this.form.share_setting.email.text = `See my photo from ${this.getEventSettings.title} .`
      }
    },
  },
  watch: {
    getEventSettings(newVal, oldVal) {
      console.log(newVal)
      this.form = newVal
      this.setDefaultForm()
    },
  },
  created () {
    this.form = this.getEventSettings
    this.setDefaultForm()
    EventBus.$on('reset-form', () => {
      this.form = JSON.parse(JSON.stringify(this.getOriginalForm))
      this.setDefaultForm()
    })
  }
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

  .info-body {
    background: #fff;
    padding: 2em 2em 1em 2em;
  }

  .row-margin-bottom {
    margin-bottom: 1em;
  }

  .icons {
    font-size:1.5em;
    color: #9FA9BA;
  }


</style>
