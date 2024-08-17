<template lang="html">
  <b-container fluid>
    <section>
      <b-row class="preview-header">
        <b-col cols="12" class="preview-header-title">
          <p>{{ getSelectedEvent.setting.title }}</p>
        </b-col>

        <b-col md="7" class="preview-header-desc">
          <p v-html="">{{ this.eventDate() }}</p>
        </b-col>

      </b-row>
    </section>


    <section class="section">
      <edit-event-side-component header-text="Define your VIPs">
        <b-container fluid class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Your VIPs are:"
            icon_class="fas fa-user-ninja"
            :show_character_count="true"
            :character_count="form.vips_text_length"
            :character_limit="20"
            >
            <input v-model="form.vip_button_text" placeholder="" type="text" slot="input-slot" maxlength="20" @input="updateVIPs">
          </edit-event-side-component-text-input>
        </b-container>
      </edit-event-side-component>      
    </section>

    <section class="section">
      <b-row class="header" align-v="center" align-h="between">
        <b-col>
          <p class="label">UPLOAD VIP HEADSHOTS</p>
        </b-col>
      </b-row>
      <b-container fluid class="basic-info-body">
          <b-row class="mb-0">
            <b-col class="mb-0">
              <b-row  align-v="center" class="mb-0" align-h="center">
                <image-upload-component parent="vips"/>
              </b-row>
            </b-col>
          </b-row>
      </b-container>
    </section>

    <section class="vips-part">
      <b-row class="undo-save-buttons" align-h="center">
        <!-- <b-col class="col-undo-save">
          <button name="button" class="undo-save purple" :class="{disabled: !hasChanges}" :disabled="!hasChanges" @click="undoChanges">UNDO</button>
        </b-col> -->
        <b-col class="col-undo-save">
          <button name="button" class="undo-save purple" @click="saveEdit" :class="{disabled: !hasChanges}" :disabled="!hasChanges">SAVE</button>
        </b-col>
      </b-row>
    </section>

  </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EventBus from "../../event-bus.js";
import { setEventSetting } from "@/api";

export default {
  name: "vips-edit",

  components: {},

  data() {
    return {
      form: {}
    };
  },

  computed: {
    ...mapGetters("EditEvent", ["getEventSettings", "getOriginalForm"]),
    ...mapGetters("Events", ["getSelectedEvent"]),
    getEventSetting() {
      return this.getEventSettings;
    },
    hasChanges() {
      return this.$store.getters["EditEvent/getIsDifferent"];
    }
  },

  methods: {
    ...mapActions("EditEvent", ["changeEventValues"]),
    updateVIPs() {
      // console.log("this.form.vips_text:", this.form.vips_text);
      this.form.vips_text_length = this.form.vip_button_text.length;
      setTimeout(() => {
        this.$store.dispatch("EditEvent/changeIsDifferentValues", true);
      }, 100);
    },
    eventDate() {
      let date = new Date(this.getSelectedEvent.event_date);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    },

    saveEdit() {
      let setting = {};
      setting["vip_button_text"] = this.form.vip_button_text;

      this.$store.dispatch("Events/setEventSetting");
      EventBus.$emit("upload-image-save", "vips");
      setEventSetting(this.getSelectedEvent.event_id, setting);
      setTimeout(() => {
        this.$toasted.show("Your changes have been updated.", {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
      }, 500);
    }
  },

  created() {
    console.log(`created`);
  },

  mounted() {
    // console.log(this.getSelectedEvent);
    let vm = this;
    this.form = this.getEventSettings;
    this.form.vip_button_text = this.form.vip_button_text;
    this.form.vips_text_length = this.form.vip_button_text.length;
  },

  watch: {
    getEventSetting(newVal, oldVal) {
      this.form.vip_button_text = newVal.vip_button_text;
      this.form.vips_text_length = newVal.vip_button_text.length;
    }
  }
};
</script>

<style lang="css" scoped>
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
  line-height: 1.5em; /* fallback */
  max-height: 1.5em; /* fallback */
}

.preview-header-desc {
  font-size: 16px;
  padding-left: 2em;
}

.preview-header-desc > p,
.preview-header-desc > p > p {
  margin-top: 5px;
  margin-bottom: 5px;
}

.vips-part {
  background: #eeeff3;
  color: #a8afb8;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  margin-bottom: 1.5em;
  margin-left: 15px;
  margin-right: 15px;
  padding: 0;
  /* padding-bottom: 15px; */
}

.basic-info-header {
  height: 2em;
  padding: 1em;
}

.basic-info-header-text {
  position: relative;
  margin-bottom: 0;
  bottom: 10px;
  height: 100%;
}

.basic-info-body {
  background: #fff;
  padding-top: 1em;
  padding-bottom: 1em;
}

input,
textarea {
  border: none;
  border-bottom: 1px solid #cdd0d5;
  width: 100%;
  padding-bottom: 0.5em;
  resize: none;
}

textarea {
  height: 6em;
  overflow: hidden;
}

input::placeholder,
textarea::placeholder {
  color: #cdd0d5;
}

input:focus,
textarea:focus {
  outline: none;
}

.word-count {
  float: right;
  font-size: 12px;
}

.row-margin-bottom {
  margin-bottom: 1em;
}

.icons {
  font-size: 1.5em;
  color: #9fa9ba;
}

.undo-save-buttons {
  background: var(--main-theme);
  border: 1px solid rgba(151, 151, 151, 0.24);
  display: flex;
  flex-wrap: wrap;
}

.undo-save {
  background: var(--main-theme);
  box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  font-size: 15px;
  color: #ffffff;
  width: 100%;
  padding: 1em;
  border: none;
  font-weight: 500;
}

.undo-save:hover {
  background: #9fa9ba;
  cursor: pointer;
}

.undo-save.disabled {
  opacity: 0.5;
  background: var(--main-theme);
}

.col-undo-save {
  padding: 1em;
}

@media only screen and (max-width: 768px) {
  .undo-save-buttons {
    max-width: 540px;
  }
}
</style>

