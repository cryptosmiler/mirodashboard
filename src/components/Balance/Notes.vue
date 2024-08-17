<template lang="html">
  <b-container class="">
    <p class="profile-settings">{{ $t("balance.note-title") }}</p>
    <div class="account-balance-container">
      <b-container class="account-balance" fluid>
        <b-row>
            <b-col cols="auto">
                <p class="note text-body">
                  <ul>
                    <i18n v-for="(item,index) in $t('balance.notes')" :key="index" :path="`balance.notes[${index}]`" tag="li" />
                  </ul>
              </p>
            </b-col>
        </b-row>
      </b-container>
    </div>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

/* eslint-disable */
export default {
  name: "account-balance",
  data() {
    return {
      items: []
    };
  },
  computed: {
  },
  methods: {},
  mounted() {},

  components: {
  }
};
</script>

<style lang="css" scoped>
.profile-settings {
  color: #aeb4c3;
  font-size: 24px;
}

.account-balance-container {
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
}

.account-balance-title {
  font-size: 20px;
  padding: 1.5em 2em;
  color: #a0a9b8;
  margin: 0;
  font-weight: 500;
  border-bottom: 1px solid #ccd0d8;
}

.account-balance {
  padding: 2em 1em 2em 1em;
  /* margin-bottom: 2em; */
  color: #a0a9b8 !important;
}

.invoice-row {
  padding-bottom: 0.25em;
}
.note.text-body{
    color: #a0a9b8 !important;
    white-space: pre-wrap;
}
.see-more {
  border: none;
  background: #afb7c3;
  color: #fff;
  padding: 1em 2em;
  float: right;
  border-radius: 5px;
  font-weight: 400;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
  position: relative;
  right: 1em;
}

.blue-text {
  color: #6ec2e3;
}

.orange-icon {
  color: #fa8a5c;
  position: relative;
  top: 5px;
}

.top-5 {
  position: relative;
  top: -5px;
}

@media only screen and (max-width: 768px) {
  .download-text {
    display: none;
  }
}
</style>
