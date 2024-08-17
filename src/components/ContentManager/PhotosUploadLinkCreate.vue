<template lang="html">
	<div class="w-100 stress">
    <div>
      <div class="input-wrapper">
        <div class="input-label">Start Date</div>
        <b-form-datepicker id="date_from" placeholder="date_from" v-model="date_from" :class="dateValid == -1 ? 'custom-calendar bad-date' : 'custom-calendar'" format="YYYY-MM-DD" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
      </div>
      <div class="input-wrapper">
        <div class="input-label">End Date</div>
        <b-form-datepicker id="date_to" placeholder="date_to" v-model="date_to" :class="dateValid == -2 ? 'custom-calendar bad-date' : 'custom-calendar'" format="YYYY-MM-DD" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
      </div>
    </div>
    <div class="checkpoint-wrapper">
      <button v-if="getCheckpoints.length <= 1" class="select-button-disabled">{{getCheckpoints[0].checkpoint_label}}</button>
      <select v-else class="select-button" v-model="checkpoint_id">
        <option value="0">All Checkpoints</option>
        <option v-for="(checkpoint, index) in getCheckpoints" v-bind:value="checkpoint.checkpoint_id" >{{ checkpoint.checkpoint_label.charAt(0).toUpperCase() + checkpoint.checkpoint_label.slice(1) }}</option>
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
      <b-button class="custom-submit" variant="danger" disabled v-if="(passwordShow == 1 && password !==confirm_password && !eyeShow) || dateValid < 1">CREATE</b-button>
      <b-button class="custom-submit" variant="danger" @click="_createUploadLink" v-else>CREATE</b-button>
    </div>
	</div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import EventBus from "../../event-bus";

export default {
  name: "photos-upload-link-create",
  data() {
    return {
      eventid: this.$route.params.id,
      date_from: new Date().toISOString().slice(0, 10),
      date_to: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10),
      password: '',
      confirm_password: '',
      passwordShow: 0,
      checkpoint_id: 0,
      eyeShow: 0,
      dateValid: 1
    }
  },
  watch: {
    passwordShow(newPasswordShow, oldPasswordShow){
      if(newPasswordShow){
        this.password = ''
        this.confirm_password = ''
        this.checkpoint_id = 0
      }
    },
    date_from(newDateFrom, oldDateFrom) {
      if(new Date(newDateFrom) > new Date(this.date_to)){
        this.dateValid = -1
        this.$toasted.show("The start date should be earlier than the end date!", {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
      }
      else if (this.date_from === this.date_to){
        this.dateValid = -1
        this.$toasted.show("The start date shouldn't be same as the end date!", {
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
        this.dateValid = -2
        this.$toasted.show("The end date should be later than the start date!", {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
      }
      else if (this.date_from === this.date_to){
        this.dateValid = -2
        this.$toasted.show("The end date shouldn't be same as the start date!", {
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
  methods: {
    ...mapActions("Auth", ["createUploadLink"]),
    toggleEye(){
      this.eyeShow = !this.eyeShow
    },
    async _createUploadLink(){
      
      EventBus.$emit("change-loader-state", true)
      const form = {
        eventid: this.eventid,
        date_from: this.date_from,
        date_to: this.date_to,
        password: this.passwordShow?this.password:'',
        _passwordShow: this.passwordShow,
        _checkpoint_id: this.checkpoint_id
      }
      await this.createUploadLink(form)
      .then(resp=>{
        EventBus.$emit("change-loader-state", false)
        this.$toasted.show("Photo upload link created -> " + resp.link_name, {
          duration: 3000,
          fullWidth: true,
          theme: "bubble",
          className: "link-copied",
          position: "bottom-center"
        });
        const links = resp.links;
        EventBus.$emit("upload-link-created", links)

        this.date_from = new Date().toISOString().slice(0, 10),
        this.date_to = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10),
        this.password = ''
        this.confirm_password = ''
        this.checkpoint_id = 0

        this.$emit('closeModal');
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
  },
}
</script>

<style lang="css">
.custom-calendar{
  background-color: white;
  width: 200px !important;
  height: 60px !important;
  border-radius: 5px;
  border-style: dashed !important;
  border: 1px solid rgb(148, 148, 148);
  font-size: 20px;
  padding: 12px 10px 8px 10px !important;
  display: flex;
  align-items: center;
  color: red;
}

.bad-date label{
  color: red;
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
.select-button-disabled{
  padding: 5px 10px 5px 10px;
  height: 40px;
  font-size: 20px;
  border-radius: 5px;
  border-style: dashed;
  border: 0px;
  width: 100%;
  text-align: center;
  background-color: rgb(238, 238, 238);
}
.divider{
  color: var(--main-theme);
}
</style>
