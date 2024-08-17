<template lang="html">
  <div class="all-sub-account-contain">
    <p class="profile-settings"></p>
    <div class="all-sub-account-container">
      <b-container class="all-sub-account" fluid>
        <b-row>
          <b-col sm="12" md="6">
            <p class="note text-body">Email</p>
          </b-col>
          <b-col sm="6" md="3">
            <p class="note text-body">Create Date</p>
          </b-col>
          <b-col sm="6" md="3">
            <p class="note text-body text-status">Status</p>
          </b-col>
        </b-row>
        <b-row v-for="(account, index) in allSubAccount" v-bind:key="account.user_id">
          <b-col sm="12" md="6">
            <p class="note text-body">{{account.email}}</p>
          </b-col>
          <b-col sm="6" md="3">
            <p class="note text-body">{{formatDate(account.create_date) }}</p>
          </b-col>
          <b-col sm="6" md="3">
            <b-form-radio-group @change="changeStatus($event,index)" id="radio-group-one-sub" v-model="account.status" name="one-sub-account-radio" button-variant="outline-primary" buttons>
              <b-form-radio :value="true" class="btn btn-outline-custom sub-account-button col-6">
                <div class="float">{{ account.status?'Enabled':'Enable' }}</div>
              </b-form-radio>
              <b-form-radio :value="false"  class="btn btn-outline-custom sub-account-button col-6">
                <div class="float">{{ account.status?'Disable':'Disabled' }}</div>
              </b-form-radio>
            </b-form-radio-group>
          </b-col>
        </b-row>
      </b-container>
    </div>
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
      options: [{ text: "Enable", value: 1 }, { text: "Disable", value: 0 }]
    };
  },
  computed: {
    ...mapGetters("Auth", ["allSubAccount"]),
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
      this.$store.dispatch("Auth/updateSubAccountStatus",{userId:this.allSubAccount[index].user_id, status:value});
    },
  },
  mounted() {
    this.$store.dispatch("Auth/getAllSubAccount");
  },
  watch: {
    getAllSubAccount(newValue, oldValue) {
      this.items = this.allSubAccount;
    }
  }
};
</script>

<style lang="scss" scoped>
.all-sub-account-contain {
  margin-bottom: 2em;
}

.profile-settings {
  color: #aeb4c3;
  font-size: 24px;
}

.all-sub-account-container {
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
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
}

.note.text-body {
  color: #a0a9b8 !important;
  white-space: pre-wrap;
}

.sub-account-button {
  padding-top: 0;
  padding-bottom: 0;
  font-size: 12px;
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

.btn.btn-outline-custom {
  font-size: 10px;
  padding: 0.2em;
  .btn-outline-custom.custom-file-control::before {
    border-style: solid;
    border-width: 1px;
    background-color: transparent;
    border-color: transparent;
    border-radius: 0.3rem !important;
  }
}
.btn .float{
  left: 0px;
  width: 100%;
  margin: 0 auto;
}

</style>
