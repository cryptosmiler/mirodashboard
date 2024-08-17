<template lang="html">
  <div class="all-sub-account-contain">
    <p class="profile-settings"></p>
    <b-row>
      <b-col cols="12" xl="6" v-for="(account, index) in allSubAccount" v-bind:key="account.user_id">
        <div class="user-board d-flex flex-row flex-nowrap justify-content-between align-items-center">
          <div class="user-avatar-outer">
            <div class="user-avatar">
              {{account.first_name[0].toUpperCase()}}
            </div>
          </div>
          <div class="user-name-outer flex-grow-1">
            <div class="user-name">
              {{ account.first_name }} {{ account.last_name}}
            </div>
            <div class="user-email overflow-auto text-nowrap text-truncate">
              {{account.email}}
            </div>
          </div>
          <div class="user-action">
            <div class="delete-ban" v-if="account.user_id == account.tenant.owner"></div>
            <div class="delete" v-else @click="removeAccount(index)"></div>
            </div>
            <div class="user-role text-right mr-2">
              <div v-if="account.user_id == account.tenant.owner" class="owner-button">
                Owner
              </div>
              <select v-else v-model="account.role" class="select-theme" @change="changeRole(account.role, index)">
                <option value="2" v-bind:selected="account.role === '2'" v-show="user_role == 'owner'">Owner</option>
                <option value="0" v-bind:selected="account.role === '0'">Admin</option>
                <option value="1" v-bind:selected="account.role === '1'">User</option>
              </select>
            </div>
          </div>
      </b-col>
    </b-row>
  </div>
</template>
  
  <script>
  import { mapGetters, mapActions } from "vuex";
  import EventBus from "../../event-bus";
  
  /* eslint-disable */
  export default {
    name: "all-sub-account",
    data() {
      return {
        items: [],
        options: [{ text: "Enable", value: 1 }, { text: "Disable", value: 0 }],
      };
    },
    computed: {
      ...mapGetters("Auth", ["profile"]),
      ...mapGetters("Auth", ["allSubAccount"]),
      
      user_role() {
        return this.profile.role == 1? "user": this.profile.role == 0 && this.profile.user_id == this.profile.account.owner?"owner":"admin";
      },
      user_tenant_id(){
        return this.profile.account.account_id;
      },
      getAllSubAccount() {
        return this.allSubAccount ? this.allSubAccount : [];
      }
    },
    methods: {
      formatDate(date) {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        let d = new Date(date),
          month = monthNames[d.getMonth()],
          day = "" + d.getDate(),
          year = d.getFullYear();
  
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
  
        return `${day} ${month}, ${year}`;
      },
      changeStatus(value, index) {
        this.$store.dispatch("Auth/updateSubAccountStatus", {userId:this.allSubAccount[index].user_id, status:value});
      },
      removeAccount(index) {
        if (confirm("Are you sure you want to delete this user?")) {
          this.$store.dispatch("Auth/removeSubAccount", {userId:this.allSubAccount[index].user_id});
        }
      },
      changeRole(value, index){
        if(value == 2){ // when owner make the other user or admin owner, owner loose the owner role and the token need to be refreshed
          // this.$store.dispatch("Auth/changeRoleAndOut", {userId:this.allSubAccount[index].user_id, role: value, tenant_id: this.profile.account.account_id}); 
          this.$store.dispatch("Auth/changeRole", {userId:this.allSubAccount[index].user_id, role: value, tenant_id: this.profile.account.account_id});  
          // this.$store.dispatch("Auth/manuallyRefreshToken")
        }
        else{
          this.$store.dispatch("Auth/changeRole", {userId:this.allSubAccount[index].user_id, role: value, tenant_id: this.profile.account.account_id});  
        }
      }
    },
    mounted() {
      this.$store.dispatch("Auth/loadAllSubAccount");
    },
    watch: {
      getAllSubAccount(newValue, oldValue) {
        this.items = this.allSubAccount;
      }
    }
  };

  window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    // console.log('Window size: ' + width + 'px x ' + height + 'px');
  });

  </script>
  
  <style lang="scss" scoped>
  .all-sub-account-contain {
    margin-bottom: 2em;
  }
  
  .profile-settings {
    color: #aeb4c3;
    font-size: 24px;
  }
  
  .all-sub-account-title {
    font-size: 20px;
    padding: 1.5em 2em;
    color: #a0a9b8;
    margin: 0;
    font-weight: 500;
    border-bottom: 1px solid #ccd0d8;
  }
  
  .all-sub-account {
    padding: 2em 1em 2em 1em;
    /* margin-bottom: 2em; */
    color: #a0a9b8 !important;
    background-color: white;
    box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
  }
  
  .note.text-body {
    color: #a0a9b8 !important;
    white-space: pre-wrap;
  }
  
  .sub-account-button {
    padding-top: 0;
    padding-bottom: 0;
  }
  
  #radio-group-one-sub {
    width: 100%;
    margin: 0;
  }
  
  .text-status {
    padding-left: 4.5rem;
  }
  
  @media only screen and (max-width: 768px) {
    .download-text {
      display: none;
    }
  }
  
  .btn.btn-outline-custom,
  .btn-outline-custom.custom-file-control::before {
    border-style: solid;
    border-width: 1px;
    background-color: transparent;
    border-color: transparent;
    border-radius: 0.3rem !important;
  }
  .btn .float{
    left: 0px;
    width: 100%;
    margin: 0 auto;
  }

  .concept-background{
    background-color: var(--main-theme);
    color: white;
    padding: 4px 13px 4px 13px;
    box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
  }
  .float-left{
    float: left;
  }

  .float-right{
    float: right;
  }

  .owner-button{
    background-color: #E61547;
    color: white;
    border: 1px solid #E61547;
    border-radius: 5px;
    padding: 7px 35px 7px 10px;
  }

  .user-board{
    background-color: white;
    border: 1px solid #a0a9b8;
    padding: 10px 10px 10px 15px;
    margin-bottom: 10px;
    min-width: 30rem; 
    width: 100%;
    /* height: 90px; */
    gap: 1rem;
  }
  .user-avatar{
    border-radius: 60px;
    background-color: var(--main-theme);
    height: 60px;
    width: 60px;
    font-size: 35px;
    padding-top: 5px;
    font-weight: bold;
    color: white;
    text-align: center;
  }

  .user-avatar-outer{
    border-radius: 68px;
    border: 1px solid #a0a9b8;
    height: 68px;
    width: 68px;
    text-align: center;
    padding: 3px;
  }
  .user-name-outer{
    line-height: 1.5em;
  }
  .user-name{
    font-size: 25px;
    color: #b81a44;
    font-weight: bold;
  }

  .user-email{
    font-size: 15px;
    color: #3c94dc;
    font-weight: bold;
    max-width: 14rem;
    text-overflow: ellipsis;
    overflow-x:hidden !important;

  }

  .user-role{
    width: 5em;
  }

  .user-action{
    float: right;
  }

  .delete{
    width: 30px;
    height: 30px;
    cursor: pointer;
    background-size: cover;
    background-image: url("../../assets/delete.png");
    transition: background-image 0.3s ease;
  }

  .delete-ban{
    width: 30px;
    height: 30px;
    margin-top: 20px;
    background-size: cover;
    background-image: url("../../assets/delete-ban.png");
  }

  .delete:hover{
    background-image: url("../../assets/delete-hover.png");
  }

  .select-theme{
    border: 1px solid #E61547;
    border-radius: 5px;
    padding: 7px 15px 7px 6px;
  }

  </style>
  