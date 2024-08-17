<template lang="html">
  <div v-show="items.length > 0" class="payment-menthods-container">
    <p class="payment-methods-title">Payment Methods</p>
      <b-container class="payment-methods" fluid>
        <b-row>
          <b-col cols="12">
            <b-table responsive="true" 
                     borderless="true" 
                     small 
                     :fields="fields" 
                     :items="items" 
                     class="table-borderless" 
                     theadClass="text-center" 
                     tbodyClass="form-group text-center"
                     >
              <template slot="radio" slot-scope="data">
                <b-form-radio name="radios-btn-default" @change="handleClick(data.item.id)" v-model="setDefaultCard" :value="data.item.id"></b-form-radio>
              </template>
              <template slot="brand" slot-scope="data">
                <b-badge>{{ formatter.formatBrand(data.item.card.brand) }}</b-badge>
              </template>
              <template slot="last4" slot-scope="data">
                <span>{{ data.item.card.last4 }}</span>
              </template>
              <template slot="line1" slot-scope="data">
                <span>{{ data.item.billing_details.address.line1 }}</span>
              </template>
              <template slot="created" slot-scope="data">
                <span>{{ formatter.formatTime(data.item.created) }}</span>
              </template>
              <template slot="removal" slot-scope="data">
                <b-button
                  v-on:click="removeCard(data.item.id)"
                  v-if="defaultCard != data.item.id"
                  class="rounded py-0 my-0"
                  variant="outline-dark"
                >remove</b-button>
              </template>
            </b-table>
          </b-col>
        </b-row>
        <b-row class="mx-3">
          <b-col cols="12">
            <button class='save-button mb-2 mt-4' @click='updatePaymentMethod' :disabled='setDefaultCard == defaultCard' v-bind:class="{ savable: setDefaultCard.length > 0 && setDefaultCard != defaultCard}">SAVE</button>
          </b-col>
        </b-row>
    </b-container>
    <detach-confirm-modal
      ref="detachModal"/>
  </div>
</template>

<script>
import EventBus from "../../event-bus";
import _ from "lodash";
import { mapGetters } from 'vuex'
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
      defaultCard: "",
      setDefaultCard: "",
      fields: [
        {
          key: "radio",
          label: "Default"
        },
        { 
          key: "brand",
          label: "Card Type"
        },
        { 
          key: "last4",
          label: "Last 4 Digits"
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
    ...mapGetters("Billing", ["getPaymentMethods"]),
  },
  methods: {
    updatePaymentMethod() {
      let self = this;
      console.log(`${self.setDefaultCard}`);
      console.log(`${self.defaultCard}`);
      self.defaultCard = self.setDefaultCard;
      setDefaultPaymentMethod({
        payment_method_id: self.setDefaultCard
      })
        .then(response => {
          console.log(`${response}`);
          self.$toasted.global.payment_method_success()
          // self.$store.dispatch('Auth/getProfile', {}, { root: true })
        })
        .catch(err => {
          console.error(`${err.message}`);
          let errorMsg = "";
          self.$toasted.global.payment_method_error();
        });
    },
    removeCard(cardId) {
      let self = this;
      let card = _.find(self.items, o => {
        return o.id == cardId;
      });
      EventBus.$emit("show-detach-confirm-modal", card);
    },
    handleClick(cardId) {
      console.log(`${cardId}`);
      this.setDefaultCard = cardId;
    }
  },
  mounted() {
    let self = this;
    EventBus.$on("update-payment-methods-list", () => {
      listPaymentMethods()
        .then(response => {
          let items =  response.data.payment_methods.data
          items = items.map(i => Object.assign({},i,{cardExpiry: i.card.exp_month + "/"+ i.card.exp_year}))
          self.items = items
          self.defaultCard = response.data.default_payment_method;
          self.setDefaultCard = response.data.default_payment_method;
          // self.setDefaultCard = "";
          EventBus.$emit("change-loader-state", false);
        })
        .catch(err => {
          console.log(`err - ${err}`);
          EventBus.$emit("change-loader-state", false);
        });
    });
    EventBus.$emit("update-payment-methods-list");
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
