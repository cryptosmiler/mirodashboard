<template lang="html">
	<div class="w-100 stress tagWrapper3">
    <div class="tagWrapper">
    </div>
    <div class="emailLabel">
      Please type your friends' email addresses here
    </div>
    <b-form-group  label-for="tags-validation" :state="state" class="tagWrapper2">
      <b-form-tags input-id="tags-basic" class="tagInputLayout"
        placeholder= "Add email addresses.."
        v-model="emailTags" 
        :tag-validator="tagValidator"
        :state="state"
        separator=" "
        :input-attrs="{ 'aria-describedby': 'tags-validation-help' }"
        ></b-form-tags>
    </b-form-group>
    <button class="shareButton" @click="shareLink">Share Now <i class='fa fa-share-alt'></i></button>

	</div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import EventBus from "../../event-bus";

export default {
  name: "photos-upload-link-share",
  props: ['propsData'],
  data() {
      return {
        tags: [],
        dirty: false,
        emailTags: []
      }
    },
    created (){
      console.log("this.propsData  -----------> ", this.propsData)
    },
    computed: {
      ...mapGetters('EventCheckpoint', ['getCheckpoints', 'getCurrentCheckpoint']),
      state() {
        // Overall component validation state
        return this.dirty ? (this.tags.length > 2 && this.tags.length < 9) : null
      }
    },
    watch: {
      tags(newValue, oldValue) {
        // Set the dirty flag on first change to the tags array
        this.dirty = true
      }
    },
    methods: {
      ...mapActions("Auth", ["shareUploadLink"]),
      tagValidator(tag) {
        // Individual tag validator function
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag);
      },
      async shareLink() {
        console.log("link_name", this.propsData.link_name)
        console.log("emails", this.emailTags)
        const form = {
          link_name: this.propsData.link_name,
          emails: this.emailTags
        }
        EventBus.$emit("change-loader-state", true)
        await this.shareUploadLink(form)
        .then(resp => {
          EventBus.$emit("change-loader-state", false)
          this.$toasted.show("This link shared successfully!", {
            duration: 3000,
            fullWidth: true,
            theme: "bubble",
            className: "link-copied",
            position: "bottom-center"
          });
        })
      }
    }
}
</script>

<style lang="css">
.tagWrapper{
  margin: -25px 0px 0px 0px;
}

.tagWrapper3{
  margin: 0px 0px -30px 0px;
}

.tagInputLayout{
  border: 2px solid #fa8082;
  border-radius: 5px;
  border-style: dashed;
  padding: 7px 3px 3px 4px;
}

.tagWrapper2 .b-form-tag {
  background-color: #f75c5f; /* Customize the background color */
  border-radius: 5px;
  border: 1px solid #b11d1f;
  padding: 5px 10px 5px 10px;
  font-size: 15px;
  margin: 3px 5px 3px 3px;
  color: #4d0709; /* Customize the text color */
}

.shareButton{
  width: 100%;
  background-color: #d32427;
  border: 0px;
  font-size: 20px;
  padding: 5px;
  border-radius: 5px;
  color: white;
  transition: 0.2s;
  margin-top: -5px;
}

.shareButton:hover{
  background-color: var(--main-theme);
}

.emailLabel{
  font-size: 13px;
  color: #741012;
  text-align: center;
  margin-bottom: 5px;
}

</style>