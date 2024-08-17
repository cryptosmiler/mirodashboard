<template lang="html">
  <div class="">
    <edit-event-side-component header-text="TRACKING SETTINGS (OPTIONAL)">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Google Analytics Tracking Code"
            icon_class="fas fa-chart-bar"
            >
            <input v-model="form.ga_id" placeholder="UA-" type="text" slot="input-slot" @input="checkUA">
          </edit-event-side-component-text-input>
        </b-container>
    </edit-event-side-component>

    <edit-event-side-component header-text="GALLERY SETTINGS" :required="true">
        <b-container class="basic-info-body" slot="body">
          <edit-event-side-component-text-input
            input_title="Gallery URL *"
            icon_class="fas fa-globe"
            :required="true"
            :show_character_count="true"
            :character_count="form.subdomain.length"
            :character_limit="30"
            >
            <span slot="input-slot" class="gallery-url-container">
              <!-- <span
                spellcheck="false"
                :contenteditable="!$store.getters['Events/getGalleryUrlLocked']"
                class="gallery-url-text"
                maxlength="30"
                @keydown="changed"
                ref="galleryText"
                @click="setFocus"
              >
              {{form.subdomain}}
              </span> -->
            <input
              @click="setFocus"
              @keydown="changed"
              v-model="form.subdomain"
              :readonly="$store.getters['Events/getGalleryUrlLocked']"
              type="text"
              slot="input-slot"
              maxlength="30"
              >
              <span contenteditable="false" class="miroio-text">
                {{getDomainName()}}
              </span>
              <span class="lock-icon" @click="changeLock">
                <i :class="[$store.getters['Events/getGalleryUrlLocked'] ? 'fas fa-lock' : 'fas fa-unlock']"></i>
              </span>
            </span>
          </edit-event-side-component-text-input>
          <p class="change-url-note mb-3">{{errorMessage}}</p>
          <p class="change-url-note">Note: Changing the URL of a public gallery will result in any previous URLs not linking correctly.</p>
        </b-container>
    </edit-event-side-component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EventBus from "../../event-bus.js";

export default {
  name: "edit-event-side-advanced",
  data() {
    return {
      form: {},
      // subdomain: '',
      errorMessage: '',
      alphaNumRegEx: /^[a-z0-9-]+$/i,
      isLocked: true
    };
  },
  computed: {
    ...mapGetters("EditEvent", ["getEventSettings", "getOriginalForm"])
  },
  watch: {
    getEventSettings(newVal, oldVal) {
      console.log(newVal);
      this.form = newVal;
      // this.$refs.galleryText.innerText = this.form.subdomain
    }
  },
  methods: {
    ...mapActions("EditEvent", ["changeEventValues"]),
    checkUA(e) {
      if (this.form.ga_id.length === 0) {
        this.form.ga_id = "";
      } else if (
        this.form.ga_id[0] !== "U" ||
        (this.form.ga_id.length === 2 && this.form.ga_id[1] !== "A") ||
        (this.form.ga_id.length === 3 && this.form.ga_id[2] !== "-")
      ) {
        this.form.ga_id = `UA-${e.data}`;
        this.form.ga_id =
          this.form.ga_id === `UA-null` ? `UA-` : this.form.ga_id;
      }
      this.updateInfo("ga_id", this.form.ga_id);
    },
    addMiro($event) {
      let currentDomain = ".miro.io";
      this.withOutMiro = $event.target.value.split(currentDomain)[0];
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
                "URL prefix must be between 1 and 30 alphanumeric characters";
              event.preventDefault();
              event.stopPropagation();
              this.$store.dispatch("EditEvent/changeIsDifferentValues", false);
            } else {
              this.errorMessage = "";
              if (event.keyCode === 8 || event.keyCode === 189) {
                // this.subdomain = event.target.innerText
                // this.form.subdomain = event.target.innerText;
                this.updateInfo("subdomain", this.form.subdomain);
              } else if (
                this.form.subdomain.length === 31 ||
                event.keyCode >= 105 ||
                event.keyCode === 32
              ) {
                event.preventDefault();
                event.stopPropagation();
                this.$store.dispatch("EditEvent/changeIsDifferentValues", false);
              } else {
                // this.subdomain = event.target.innerText
                // this.form.subdomain = event.target.innerText;
                this.updateInfo("subdomain", this.form.subdomain);
              }
            }
          }, 100);
        } else {
          event.returnValue = false;
        }
      }
    },
    setFocus(e) {
      if (this.$store.getters["Events/getGalleryUrlLocked"]) {
        this.changeLock();
      } else {
        // this.$refs.galleryText.focus();
      }
    },
    updateInfo(fieldName, fieldValue) {
      this.$store.dispatch("EditEvent/changeEventValues", {
        fieldName,
        fieldValue
      });
    },
    changeLock() {
      if (this.$store.getters["Events/getGalleryUrlLocked"]) {
        EventBus.$emit("edit-gallery-url-modal-state", {
          status: "show"
        });
      } else {
        this.$store.dispatch("Events/changeGalleryUrlLockState", true);
      }
    },
    getDomainName() {
      return "." + this.getEventSettings.domain;
    }
  },
  mounted() {
    // this.$refs.galleryText.innerText = this.$store.getters['EditEvent/getSubDomain']
    console.log(` this.form.subdomain - ${this.form.subdomain}`);
    this.$store.dispatch("Events/changeGalleryUrlLockState", true);
    // this.$refs.galleryText.innerText = this.form.subdomain
  },
  created() {
    this.form = this.getEventSettings;

    EventBus.$on("reset-form", () => {
      this.form = JSON.parse(JSON.stringify(this.getOriginalForm));
      // this.$refs.galleryText.innerText = this.$store.getters['EditEvent/getSubDomain']
      // this.$refs.galleryText.innerText = this.form.subdomain
    });
  }
};
</script>

<style lang="css" scoped>
.basic-info-body {
  background: #fff;
  padding-top: 1em;
  padding-bottom: 1em;
}

.lock-icon {
  /* position: absolute; */
  /* right: 20px; */
  margin-left: 20px;
}

.lock-icon:hover {
  cursor: pointer;
}

.change-url-note {
  /* padding-left: 35px; */
  font-size: 12px;
}

.input-slot {
  width: 200px;
}
input{
  border-bottom: 0px !important;
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

@media only screen and (max-width: 768px) {
  .change-url-note {
    padding-left: 60px;
  }
}
</style>
