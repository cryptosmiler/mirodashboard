<template lang="html">
  <div class="payment-menthods-container">
    <p class="payment-methods-title">Payment Methods</p>
      <b-container class="payment-methods" fluid>
        <b-row>
          <b-col cols="12">
            <b-table responsive="true" 
                     :busy="!getPaymentMethods" 
                     small 
                     :fields="fields" 
                     :items="getPaymentMethods" 
                     class="table-borderless" 
                     theadClass="text-center" 
                     tbodyClass="form-group text-center"
                     >
              <template #cell(radio)="data">
                <b-form-radio name="radios-btn-default" @change="handleClick(data.item.id)" v-model="setDefaultCard" :value="data.item.id"></b-form-radio>
              </template>
              <template #cell(card.brand)="data" class="text-right">
                <font-awesome-icon :icon='brands[data.item.card.brand]' size="lg"  v-if="`${data.item.card.brand}` in brands"/>
                <b-badge v-else >{{ formatter.formatBrand(data.item.card.brand) }}</b-badge>
              </template>
              <template #cell(cardExpiry)="data">
                {{ data.item.card.exp_month }}/{{  data.item.card.exp_year }}
              </template>
              <template #cell(created)="data">
                <span>{{ formatter.formatTime(data.item.created) }}</span>
              </template>
              <template #cell(removal)="data">
                <b-button
                  v-on:click="removeCard(data.item.id)"
                  v-if="getDefaultPaymentMethod != data.item.id"
                  class="rounded py-0 my-0"
                  variant="outline-dark"
                >remove</b-button>
              </template>
              <template #table-busy>
                <div class="text-center text-danger my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>
            </b-table>
          </b-col>
        </b-row>
        <b-row class="mx-3">
          <b-col cols="12">
            <button class='save-button mb-2 mt-4' @click='updatePaymentMethod' :disabled='setDefaultCard == getDefaultPaymentMethod' v-bind:class="{ savable: setDefaultCard != '' && setDefaultCard != getDefaultPaymentMethod}">SAVE</button>
          </b-col>
        </b-row>
    </b-container>
    <detach-confirm-modal
      ref="detachModal"/>
  </div>
</template>

<script>
import EventBus from "../../event-bus";
import { mapGetters } from 'vuex'
import _ from "lodash";
import {
  setDefaultPaymentMethod,
  listPaymentMethods,
  getCustomerDefaultPaymentMethod
} from "../../api";
import DetachConfirmModal from "./DetachConfirmModal";
import formatter from "@/utils/formatter";


/* eslint-disable */
export default {
  name: "account-payment-methods",
  data() {
    return {
      items: [],
      setDefaultCard: "",
      brands: {
        "visa": {
          prefix: "fab", iconName: "cc-visa"
        },
        "mastercard": {
          prefix: "fab", iconName: "cc-mastercard"

        },
        "amex": {
          prefix: "fab", iconName: "cc-amex"
        },
        "jcb" : {
          prefix: "fab", iconName: "cc-jcb"
        }
      },
      fields: [
        {
          key: "radio",
          label: "Default"
        },
        {
          key: "billing_details.name",
          label: "Name"
        },
        {
          key: "card.brand",
          label: "Card",
          thClass: 'text-right',
          tdClass: 'text-right'
        },
        { 
          key: "card.last4",
          label: "Details",
          tdClass: "px-0"
        },
        { 
          key: "cardExpiry",
          label: "Expiry Date"
        },
        {
          key: "removal",
          label: " "
        }
      ],
      formatter
    };
  },
  components: {
    DetachConfirmModal
  },
  watch: {},
  computed: {
    ...mapGetters("Billing", ["getPaymentMethods", "getDefaultPaymentMethod"]),
  },
  methods: {
    updatePaymentMethod() {
      let self = this;
      console.log(`${self.setDefaultCard}`);
      self.$store.dispatch('Billing/setDefaultCard', { payment_method_id : this.setDefaultCard })
        .then(response => {
          console.log(response);
          self.$toasted.global.payment_method_success()
          self.$store.dispatch('Auth/getProfile', {}, { root: true })
          //self.$store.dispatch('Billing/loadPaymentMethods')
        })
        .catch(err => {
          console.error(`${err.message}`);
          let errorMsg = "";
          self.$toasted.global.payment_method_error();
        });
    },
    removeCard(cardId) {
      let self = this;
      let card = _.find(self.getPaymentMethods, o => {
        return o.id == cardId;
      });
      console.log(card)
      EventBus.$emit("show-detach-confirm-modal", { card: card, brands: self.brands });
      this.$store.dispatch('Auth/getProfile', {}, { root: true })
    },
    handleClick(cardId) {
      console.log(`${cardId}`);
      this.setDefaultCard = cardId;
    }
  },
  watch: {
    getDefaultPaymentMethod(card) {
      console.log(`Payment method updated`, card)
      this.setDefaultCard = card
    }
  },
  created() {
    this.setDefaultCard = this.getDefaultPaymentMethod
  },
  mounted() {
    this.$store.dispatch("Billing/loadPaymentMethods")
  }
};
</script>

<style lang="css" scoped>
.payment-menthods-container {
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
}

.payment-methods-title {
  font-size: 20px;
  padding: 1.5em 2em;
  color: #a0a9b8;
  margin: 0;
  font-weight: 500;
  border-bottom: 1px solid #ccd0d8;
}

.payment-methods {
  padding: 3em 1em 5em 1em;
  margin-bottom: 2em;
  color: #a0a9b8 !important;
}

@media only screen and (max-width: 768px) {
  .download-text {
    display: none;
  }
}

.savable {
  background: var(--main-theme) !important;
}

.save-button {
  border: none;
  background: #afb7c3;
  color: #fff;
  padding: 1em 2em;
  float: right;
  border-radius: 5px;
  font-weight: 400;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
  position: relative;
  /* top: -2em; */
  /* right: 2em; */
}

</style>
