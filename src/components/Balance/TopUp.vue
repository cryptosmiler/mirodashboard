<template lang="html">
  <b-container class="">
    <p class="profile-settings">{{ $t('balance.top-up-column-title') }}</p>
    <div class="account-top-up-container">
      <b-container class="account-top-up py-3 px-3">
        <b-row class="mb-3">
          <b-col cols="12">
            <p class="row-titles">{{ $t('balance.select-package') }}</p>
          </b-col>
        </b-row>
        <b-row class="pb-4 ">
          <b-col cols="auto" class="d-flex">
              <b-form-radio-group id="radio-group-2" v-model="selected" name="top-up-radio-button" buttons class="d-flex flex-row flex-wrap justify-content-between">
                <b-form-radio v-for="(item, index) in getPriceTable" :key="index" :value="item" type="radio" :id="'item-' + index" autocomplete="off" class="btn btn-outline-custom mr-2 mb-4">
                  <div>{{ item.value | formatNumber }}</div>
                  <div class = "float">{{ item.discountText }}</div>
                </b-form-radio>
              </b-form-radio-group>
          </b-col>
        </b-row>
        <b-row class="d-flex justify-content-end" v-if="selected">
          <b-col cols="8" md="6" align-self="end">
            <b-row align-h="between" class="no-gutters">
              <b-col cols="6" md="5" class="text-right">{{ $t('balance.invoicing-credits') }}:</b-col>
              <b-col cols="4" class="text-right">{{ formatter.formatNumber(selected.value) }}</b-col>
            </b-row>
            <b-row align-h="between" class="no-gutters">
              <b-col cols="6" md="5" class="text-right">{{ $t('balance.invoicing-total-due') }}:</b-col>
              <b-col cols="4" class="text-right">{{ formatter.usdFormat(selected.price) }}</b-col>
            </b-row>
            <b-row align-h="end" class="no-gutters">
              <b-button
                  v-on:click="confirm()"
                  class="savable save-button mb-2 mt-4"
                >{{ $t('balance.buy-now')}}</b-button>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
       <purchase-confirm-modal
      ref="purchaseModal"/>
      <no-payment-modal
      ref="noPMModal"/>
    </div>
  </b-container>
  
</template>

<script>
import EventBus from "../../event-bus";
import _ from "lodash";
import { mapGetters } from "vuex";
import PurchaseConfirmModal from "./PurchaseConfirmModal";
import NoPaymentModal from "./NoPaymentModal";
import formatter from "@/utils/formatter";
import {
  listPaymentMethods
} from "../../api";

/* eslint-disable */
export default {
  name: "account-top-up",
  data() {
    return {
      formatter,
      selected: 0,
      has_pm: false
    };
  },
  methods: {
    purchase() {
      console.log(`purchase - ${JSON.stringify(this.getPriceSelected)}`);
      this.$store.dispatch("Billing/purchase", { plan_id: this.getPriceSelected.planId });
    },
    confirm() {
      //check if payment has been setup
      if (this.has_pm){
        //show modal 
        // alert()
        EventBus.$emit("show-purchase-confirm-modal", { plan: this.getPriceSelected });
      }else{
        //no pm 
        console.log('no pm')
        EventBus.$emit("show-no-payment-modal", {});
      }
    }
  },
  mounted() {
    let self = this
    listPaymentMethods().then(pm =>{
      console.log(pm)
      pm = pm.data
      if(pm && pm.payment_methods.data.length > 0){
        self.has_pm = true
      }
    })
   
  },
  components: {
    PurchaseConfirmModal,
    NoPaymentModal
  },
  watch: {
    selected(newVal, oldVal) {
      this.$store.dispatch("Billing/setPriceSelected", newVal);
    }
  },
  computed: {
    ...mapGetters("Auth", ["profile"]),
    ...mapGetters("Billing", ["getPriceSelected", "getPriceTable"])
  }
};
</script>

<style lang="css" scoped>
.profile-settings {
  color: #aeb4c3;
  font-size: 24px;
}

.account-top-up-container {
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
}

.account-top-up-title {
  font-size: 20px;
  padding: 1.5em 2em;
  color: #a0a9b8;
  margin: 0;
  font-weight: 500;
  border-bottom: 1px solid #ccd0d8;
}

.account-top-up {
  color: #a0a9b8 !important;
}

.invoice-row {
  padding-bottom: 0.25em;
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

.btn.btn-outline-custom,
.btn-outline-custom.custom-file-control::before {
  border-color: var(--main-theme);
  border-style: solid;
  border-width: 1px;
  color: var(--main-theme);
  background-color: transparent;
  border-color: var(--main-theme);
  border-radius: 0.3rem !important;
}
.btn .float{
  position: absolute;
  color: var(--main-theme);
  top: 40px;
  font-size: 12px;
  text-transform: lowercase;
  left: 0px;
  width: 100%;
  margin: 0 auto;
}

.btn.btn-outline-custom.active {
  background: var(--main-theme) !important;
  color: white;
  background-color: transparent;
  border-color: transparent;
}

.savable {
  background: var(--main-theme) !important;
  color: white;
  background-color: transparent;
  border-color: transparent;
}
</style>
