<template lang="html">
	<div class="w-100 list-board">
    <b-modal id="modal-edit" centered :title="editModalTitle" hide-footer @close="modalClosed">
      <p class="my-4">
        <photos-upload-link-edit @closeModifyModal="closeModal" :propsData = "dataToChild" />
      </p>
    </b-modal>

    <b-modal id="modal-share" centered :title="editModalTitle2" hide-footer>
      <p class="my-4">
        <photos-upload-link-share :propsData = "dataToChild2" />
      </p>
    </b-modal>
    
    <b-row class="one-row-header">
      <b-col cols="1">Link</b-col>
      <b-col cols="2">Start Date</b-col>
      <b-col cols="2">End Date</b-col>
      <b-col cols="1">CheckPoint</b-col>
      <b-col cols="1">Password</b-col>
      <b-col cols="3">Status</b-col>
      <b-col cols="2">Actions</b-col>
    </b-row>
		<b-row v-for="(link, index) in link_list" :key="index+1" class="one-row" >
      <b-col cols="1">
        {{ link.link_name }}
        
      </b-col>
      <b-col cols="2">{{ dateFormat(link.date_from) }}</b-col>
      <b-col cols="2">{{ dateFormat(link.date_to) }}</b-col>
      <b-col cols="1">{{link.checkpoint?link.checkpoint.checkpoint_label:'All'}}</b-col>
      <b-col cols="1">{{password_list[link.password_show]}}</b-col>
      <b-col cols="3">
        <div v-if="profile.role === 0">
          <button :class="{ 'enabledBtn': link.status === 1, 'disabledBtn': link.status === 0 }" @click="changeStatus(link.status, 1, link.link_id)">ENABLED</button>
          <button :class="{ 'enabledBtn': link.status === 0, 'disabledBtn': link.status === 1 }" @click="changeStatus(link.status, 0, link.link_id)">DISABLED</button>
        </div>
        <div v-else>
          <button disabled :class="{ 'enabledBtn': link.status === 1, 'disabledBtn': link.status === 0 }" >ENABLED</button>
          <button disabled :class="{ 'enabledBtn': link.status === 0, 'disabledBtn': link.status === 1 }" >DISABLED</button>
        </div>
      </b-col>
      <b-col cols="2">
        <button class="copy-button" v-b-tooltip.hover.topright title="Copy" @click = "toggleClipboard(link.link_name)" v-if="!copied">
          <i class="fa fa-copy"></i>
        </button>
        <button class="copy-button" v-b-tooltip.hover.right title="Copied to the clipboard!" v-else @mouseleave="toggleClipboard(link.link_name)">
          <i class="fa fa-copy"></i>
        </button>
        <button class="copy-button" @click="openModal(link)" v-b-modal.modal-edit v-b-tooltip.hover.topright title="Edit" v-if="profile.role === 0">
          <i class='fa fa-pen-alt'></i>
        </button>
        <button class="copy-button" @click="openModal2(link)" v-b-modal.modal-share v-b-tooltip.hover.topright title="Share">
          <i class='fa fa-share-alt'></i>
        </button>
      </b-col>
    </b-row>
	</div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import EventBus from "../../event-bus";
import * as clipboard from "clipboard-polyfill"

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenToSquare, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import PhotosUploadLinkEdit from "./PhotosUploadLinkEdit"
import PhotosUploadLinkShare from "./PhotosUploadLinkShare"

export default {
  name: "photos-upload-link-list",
  data() {
    return {
      link_list : [],
      copied : false,
      password_list : ["NO", "YES"],
      editModalTitle : '',
      editModalTitle2 : '',
      dataToChild : {},
      dataToChild2 : {},
    }
  },
  created() {
    this.loadUploadLinkList()
  },
  methods: {

    ...mapActions("Auth", ["getUploadLinkList", "changeUploadLinkStatus"]),
    
    openModal(link) {
      this.dataToChild = link
      this.editModalTitle = "Edit Upload Link - " + link.link_name
    },

    openModal2(link) {
      this.dataToChild2 = link
      // this.editModalTitle2 = "Share this Link - " + link.link_name + " with your friends.."
      this.editModalTitle2 = "Will you share this link with your friends?"
    },


    closeModal() {
      this.$bvModal.hide('modal-edit');
    },

    modalClosed() {
      // Do something when the modal is closed
    },

    async loadUploadLinkList(){
      const data = {eventId : this.$route.params.id}
      EventBus.$emit("change-loader-state", true)
      const res = await this.getUploadLinkList(data)
      this.link_list = res.links
      // console.log("this.link_list --------> ", this.link_list)
      EventBus.$emit("change-loader-state", false)
    },

    toggleClipboard(link_name){
      this.copied = !this.copied
      if(this.copied == true){
        clipboard.writeText(`${document.location.origin}/#/upload/${link_name}`)
      }
    },

    dateFormat(datetime){
      const date = new Date(datetime);
  
      const year = date.getFullYear().toString().slice(-4);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      
      // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return `${year}-${month}-${day}`;
    },
    async changeStatus(currentStatus, newStatus, link_id){
      if(currentStatus!==newStatus){
        const form = {
          link_id : link_id,
          status : newStatus
        }
        EventBus.$emit("change-loader-state", true)
        await this.changeUploadLinkStatus(form)
        .then(res => {
          this.link_list = res.links
          EventBus.$emit("change-loader-state", false)
        })
      }
    },
  },
  computed: {
    ...mapGetters("Auth", ["profile"]),
  },
  mounted() {
    this.tooltipContent = "Copy";
    EventBus.$on("upload-link-created", links => {
      this.link_list = links
    });
  },
  components:{
    PhotosUploadLinkEdit,
    PhotosUploadLinkShare
  }
}
</script>

<style lang="css">
.list-board{
  border-radius: 7px;
  padding: 10px 18px 10px 18px;
  margin: 30px 0px 50px 0px;
}

.one-row{
  height: 40px;
  font-size: 15px;
  transition: 0.3s;
}
/* .one-row:hover{
  font-weight: bold;
} */

.one-row-header{
  height: 30px;
  font-size: 15px;
  border-bottom: 1px solid rgb(212, 212, 212);
  padding-bottom: 25px;
  font-weight: bold;
  margin-bottom: 10px;
}

.copy-button{
  border: 0px;
  background-color: #F6F6F8;
  border-radius: 3px;
  margin-top: 3px;
  transition: 0.3s;
  color: rgb(204, 204, 204);
}

.copy-button:hover{
  color: rgb(121, 121, 121);
}

.copy-button:focus{
  color: rgb(82, 82, 82);
}

.enabledBtn{
  background-color: var(--main-theme) !important;
  color: white !important;
  margin: 2px -3px 0px -3px;
  border: 1px solid var(--main-theme);
  padding-left: 15px;
  padding-right: 15px;
}

.disabledBtn{
  background-color: white !important;
  color: var(--main-theme) !important;
  margin: 2px -3px 0px -3px;
  border: 1px solid var(--main-theme);
  padding-left: 15px;
  padding-right: 15px;
}
</style>
