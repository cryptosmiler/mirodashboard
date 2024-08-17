<template lang="html">
	<div class="w-100 stress">
    <div>
      <div class="input-wrapper">
        <div class="input-label">Start Date{{ propsData.password }}</div>
        <b-form-datepicker id="date_from" placeholder="date_from" v-model="date_from" class="custom-calendar" format="YYYY-MM-DD" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
      </div>
      <div class="input-wrapper">
        <div class="input-label">End Date</div>
        <b-form-datepicker id="date_to" placeholder="date_to" v-model="date_to" class="custom-calendar" format="YYYY-MM-DD" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
      </div>
    </div>
    <div class="checkpoint-wrapper">
      <button v-if="getCheckpoints.length <= 1" class="select-button">check points : All ({{ photosCount.objects || 0}})</button>
      <select v-else class="select-button" v-model="checkpoint_id">
        <option class="divider" v-bind:value="0">All Check Points ({{ photosCount.objects || 0}})</option>
        <option v-for="(checkpoint, index) in getCheckpoints" v-bind:value="checkpoint.checkpoint_id" >{{`${checkpoint.checkpoint_label} (${checkpoint.images})`}}</option>
      </select>
    </div>
    <div class="checkbox-wrapper">
      <input type="checkbox" v-model="passwordShow" class="bigger-checkbox" />
      <label v-if="passwordShow">I don't need password for this link</label>
      <label v-else>Set password for a upload link</label>
    </div>
    <div class="password-wrapper" v-show="passwordShow">
      <div v-if="!eyeShow">
        <b-input-group>
          <b-form-input placeholder="new password" type="password" v-model="password"></b-form-input>
          <b-input-group-prepend>
            <b-input-group-text><i class="fa fa-eye" @click="toggleEye"></i></b-input-group-text>
          </b-input-group-prepend>
        </b-input-group>
        <b-form-input class="custom-password" placeholder="confirm password" type="password" v-model="confirm_password"></b-form-input>
      </div>
      <div v-else>
        <b-input-group>
          <b-form-input placeholder="new password" type="text" v-model="password"></b-form-input>
          <b-input-group-prepend>
            <b-input-group-text><i class="fa fa-eye-slash" @click="toggleEye"></i></b-input-group-text>
          </b-input-group-prepend>
        </b-input-group>
      </div>
    </div>
    <div class="submit-wrapper">
      <b-button class="custom-submit" variant="danger" disabled v-if="(passwordShow == 1 && password !==confirm_password && !eyeShow) || !dateValid || !edited">Save Changes</b-button>
      <b-button class="custom-submit" variant="danger" @click="_updateUploadLink" v-else>Save Changes</b-button>
    </div>
	</div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import EventBus from "../../event-bus";

export default {
  name: "photos-upload-link-edit",
  props: ['propsData'],
  data() {
    return {
      eventid: this.$route.params.id,
      date_from: '2023-08-24',
      date_to: '2023-08-27',
      password: '',
      confirm_password: '',
      passwordShow: 0,
      checkpoint_id: 0,
      eyeShow: 1,
      dateValid: 1,
    }
  },
  watch: {
    date_from(newDateFrom, oldDateFrom) {
      if(new Date(newDateFrom) > new Date(this.date_to)){
        this.dateValid = 0
        this.$toasted.show("The start date should be earlier than the end date!", {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
      }
      else{
        this.dateValid = 1
      }
    },
    date_to(newDateTo, oldDateTo) {
      if(new Date(newDateTo) < new Date(this.date_from)){
        this.dateValid = 0
        this.$toasted.show("The end date should be later than the start date!", {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
      }
      else{
        this.dateValid = 1
      }
    },
  },
  created(){
    this.date_from = this.propsData.date_from
    this.date_to = this.propsData.date_to
    this.password = this.propsData.password
    this.passwordShow = this.propsData.password_show
    this.checkpoint_id = this.propsData.checkpoint_id
  },
  methods: {
    ...mapActions("Auth", ["createUploadLink", "updateUploadLink"]),
    toggleEye(){
      this.eyeShow = !this.eyeShow
    },
    async _updateUploadLink(){
      
      EventBus.$emit("change-loader-state", true)
      const form = {
        link_id: this.propsData.link_id,
        event_id: this.propsData.event_id,
        date_from: this.date_from,
        date_to: this.date_to,
        password: this.passwordShow?this.password:'',
        _passwordShow: this.passwordShow,
        _checkpoint_id: this.checkpoint_id
      }
      await this.updateUploadLink(form)
      .then(resp=>{
        EventBus.$emit("change-loader-state", false)
        this.$toasted.show("Photo upload link changed ", {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
        const links = resp.links;
        EventBus.$emit("upload-link-created", links)

        this.date_from = '2023-01-01'
        this.date_to = '2023-02-01'
        this.password = ''
        this.confirm_password = ''
        this.checkpoint_id = 0

        this.$emit('closeModifyModal');
      })
    },
    getCheckpointText() {
      return this.getCheckpoints.filter(e =>  e.checkpoint_id == this.getCurrentCheckpoint).reduce((a,e) => `${e.checkpoint_label} (${e.images})`, '') 
    },
  },
  computed: {
    ...mapGetters('EventCheckpoint', ['getCheckpoints', 'getCurrentCheckpoint']),
    photosCount () {
      return this.$store.getters['Events/getEventContentSummary']
    },
    edited () {
      if(this.date_from != this.propsData.date_from){return 1}
      if(this.date_from != this.propsData.date_from){return 1}
      if(this.date_to != this.propsData.date_to){return 1}
      if(this.passwordShow != this.propsData.password_show && this.passwordShow == 0){return 1}
      if(this.password != this.propsData.password){return 1}
      if(this.checkpoint_id != this.propsData.checkpoint_id){return 1}
      return 0
    }
  },
  // mounted(){
    
  // }
}
</script>

<style lang="css">
.custom-calendar{
  background-color: white;
  width: 200px !important;
  height: 60px !important;
  border-radius: 5px;
  border-style: dashed !important;
  border: 2px solid rgb(148, 148, 148);
  font-size: 20px;
  padding: 8px 10px 8px 10px !important;
}

.input-wrapper{
  float: left;
  margin: -15px 20px 10px 20px;
}

.input-label{
  margin-left: 5px;
  font-weight: bold;
}

.password-wrapper{
  margin: 0px 20px 10px 20px;
}

.custom-password{
  background-color: white;
  width: 100% !important;
  height: 40px !important;
  margin-top: 5px;
  margin-bottom: 10px;
}

.submit-wrapper{
  margin: 0px 20px 10px 20px;
}

.custom-submit{
  background-color: var(--main-theme);
  width: 100% !important;
  height: 40px !important;
}

.passwordCheckbox{
  font-size: 20px;
  cursor: pointer;
}

.checkbox-wrapper{
  margin: 0px 20px 10px 20px;
}

.bigger-checkbox{
  width: 20px;
  height: 20px;
  margin-top: 5px;
}

.bigger-checkbox + label {
  font-size: 15px;
  margin-left: 5px;
  transform: translate(0, -5px);
}

.checkpoint-wrapper{
  margin: 0px 20px 10px 20px;
}

.filter-buttons{
  border: 1px solid var(--main-theme);
  color: var(--main-theme);
}

.select-button{
  padding: 5px 10px 5px 10px;
  height: 40px;
  font-size: 20px;
  border-radius: 5px;
  border-style: dashed;
  width: 100%;
  text-align: center;
}
.divider{
  color: var(--main-theme);
}
</style>
