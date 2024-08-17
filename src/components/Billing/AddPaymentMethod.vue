<template lang="html">
  <div class="account-billing-payment-method">
    <div class="payment-method-billing-address d-flex flex-row justify-content-between">
      <div class="title">
      Add New Payment Method
      </div>
      <div class="px-sm-3 d-inline-block text-right">
        <b-img class="small-thumbnail" src="../../assets/visa.png" />
        <b-img class="small-thumbnail" src="../../assets/master.png" />
        <b-img class="small-thumbnail" src="../../assets/ae.png" />
      </div>
    </div>
    <b-container class="add-payment-methods" fluid>
      <b-row>
        <b-col cols="12">
          <p class="row-titles">Credit Card Information</p>
        </b-col>
      </b-row>
      <b-row class="stripe-card credit-card-inputs mx-3" :class='{ complete }'>
        <b-col cols="12" md="6">
          <card-number class='stripe-element card-number'
            ref='cardNumber'
            :stripe='returnStripeKey'
            :options='stripeOptions'
            @change='number = $event.complete'
          />
        </b-col>
        <b-col cols="6" md="3">
          <card-expiry class='stripe-element card-expiry'
            ref='cardExpiry'
            :stripe='returnStripeKey'
            :options='stripeOptions'
            @change='expiry = $event.complete'
          />
        </b-col>
        <b-col cols="6" md="3">
          <card-cvc class='stripe-element card-cvc'
            ref='cardCvc'
            :stripe='returnStripeKey'
            :options='stripeOptions'
            @change='cvc = $event.complete'
          />
        </b-col>
      </b-row>
      <b-row  class="">
        <b-col cols="12">
          <p class="row-titles billing-address">Billing Address</p>
        </b-col>
      </b-row>
        <b-form class="address">
          <b-row class="mx-3">
            <b-col cols="12">
              <b-form-group label="CardHolder Name"
                            label-for="cardHolderName"
                            class="grey">
                <b-form-input id="cardHolderName"
                              type="text"
                              v-model="cardHolderName"
                              class="border-control"
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group label="Line 1"
                            label-for="line1"
                            breakpoint="md"
                            class="grey">
                <b-form-input id="line1"
                              type="text"
                              v-model="form.line1"
                              :placeholder="form.line1"
                              class="border-control"
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group label="City"
                            label-for="city"
                            breakpoint="md"
                            class="grey">
                <b-form-input id="city"
                              type="text"
                              v-model="form.city"
                              :placeholder="form.city"
                              class="border-control"
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <label for="state">States</label>
              <div class="state">
                <button type="button" class="dropdown-toggle border-control states" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="dropdown-button-text">{{form.state}}</span>
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="states-dropdown">
                    <button type="button" class="dropdown-item" v-for="(state, index) in returnStates" :key="index" @click="form.state = state">
                      {{state}}
                    </button>
                </div>
              </div>
            </b-col>
            <b-col cols="12" md="9">
              <label for="country">Country</label>
              <div class="country">
                <button type="button" class="dropdown-toggle border-control countries" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="dropdown-button-text">{{form.country.name}}</span>
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="countries-dropdown">
                    <button type="button" class="dropdown-item" v-for="(country, index) in returnCountries" :key="index" @click="form.country = country">{{country.name}}</button>
                </div>
              </div>
            </b-col>
            <b-col cols="12" md="3" class="postal-row">
              <b-form-group label="Postal"
                            label-for="postal"
                            breakpoint="md"
                            class="grey">
                <b-form-input id="postal"
                              type="text"
                              v-model="form.postal_code"
                              class="border-control"
                              required >
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      <b-row class="mx-3">
          <b-col cols="12">
            <button class='pay-with-stripe save-button mb-2 mt-4' @click='save' :disabled='!isSavable()' v-bind:class="{ savable: isSavable()}">SAVE</button>
          </b-col>
      </b-row>
      <!-- <button @click='getInvoices'>test</button> -->
      <!-- <p>{{this.invoices}}</p> -->
    </b-container>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import {
  CardNumber,
  CardExpiry,
  CardCvc,
  createToken,
  instance
} from "vue-stripe-elements";

import { states, countries, isoCountries } from "./states_countries";
import axios from "axios";
import EventBus from "../../event-bus";
import { addPaymentMethod, initNewPaymentMethod } from "../../api";
import { inspect } from "util";
import is from "is_js";

export default {
  name: "account-billing-payment-method",
  data() {
    return {
      complete: false,
      number: false,
      expiry: false,
      cvc: false,
      stripeOptions: {
        // hideIcon: false
      },
      cardHolderName: "",
      form: {
        line1: "2300 Jackson Street",
        city: "Los Angeles",
        state: "California",
        country: {
          code: "US",
          name: "United States"
        },
        postal_code: "90210"
      },
      invoices: ""
    };
  },
  components: { CardNumber, CardExpiry, CardCvc },
  methods: {
    close() {
      // destroy the vue listeners, etc
      this.$destroy();

      // remove the element from the DOM
      this.$el.parentNode.removeChild(this.$el);
    },
    reset() {
      this.$refs.cardExpiry.clear();
      this.$refs.cardNumber.clear();
      this.$refs.cardCvc.clear();

    },
    update() {
      this.complete = this.number && this.expiry && this.cvc;

      // field completed, find field to focus next
      if (this.number) {
        if (!this.expiry) {
          this.$refs.cardExpiry.focus();
        } else if (!this.cvc) {
          this.$refs.cardCvc.focus();
        }
      } else if (this.expiry) {
        if (!this.cvc) {
          this.$refs.cardCvc.focus();
        } else if (!this.number) {
          this.$refs.cardNumber.focus();
        }
      }
      // no focus magic for the CVC field as it gets complete with three
      // numbers, but can also have four
    },
    isSavable() {
      return (
        this.complete &&
        is.not.empty(this.cardHolderName) &&
        is.not.empty(this.form)
      );
    },
    billingAddress(stripe) {
      let address = { ...this.form };
      if (stripe) {
        address.country = address.country.code;
      } else {
        address.country = address.country.name;
      }
      console.log(`form - ${JSON.stringify(this.form)}`);
      console.log(`address - ${JSON.stringify(address)}`);
      return address;
    },
    async save() {
      try {
        EventBus.$emit("change-loader-state", true);
        let stripeObj = instance;
        // console.log(self.$refs.cardNumber.$refs.element)
        let initNewPaymentMethodResponse = await initNewPaymentMethod();
        let clientSecret = initNewPaymentMethodResponse.data.client_secret;
        let handleCardSetupResponse = await stripeObj.handleCardSetup(
          clientSecret,
          this.$refs.cardNumber.$refs.element._element,
          {
            payment_method_data: {
              billing_details: {
                name: this.cardHolderName,
                address: this.billingAddress(true)
              }
            }
          }
        )

        if (handleCardSetupResponse.error) {
          throw handleCardSetupResponse.error;
        } else {
          let addPaymentMethodResponse = await addPaymentMethod({
            intent: handleCardSetupResponse,
            address: this.billingAddress(false)
          });

          this.customer = addPaymentMethodResponse.data.customer;

          this.$toasted.global.adding_payment_method_success();
          EventBus.$emit("update-payment-methods-list");
          EventBus.$emit("change-loader-state", false);
          this.reset()
        }
      } catch (err) {
        EventBus.$emit("change-loader-state", false);
        let errMsg = err && err.message ? err.message : "setup card error";
        this.$toasted.global.payment_method_error();
      }
    }
  },
  watch: {
    number() {
      this.update();
    },
    expiry() {
      this.update();
    },
    cvc() {
      this.update();
    }
  },
  computed: {
    ...mapGetters("Auth", ["profile"]),
    returnStates() {
      return states;
    },
    returnCountries() {
      // return countries;
      return isoCountries;
    },
    returnStripeKey() {
      return process.env.STRIPE_KEY;
    }
  },
};
</script>

<style lang="css" scoped>
.account-billing-payment-method {
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(204, 204, 204, 1);
  margin-bottom: 5em;
  padding: 0;
  padding-bottom: 3em;
}

.payment-method-billing-address {
  font-size: 20px;
  padding: 1.5em 2em;
  color: #a0a9b8;
  margin: 0;
  font-weight: 500;
  border-bottom: 1px solid #ccd0d8;
}

.row-titles {
  font-size: 16px;
  padding: 1.5em;
  color: #a0a9b8;
  margin: 0;
  font-weight: 500;
  padding-left: 1.5em;
}

.billing-address {
  margin-top: 2.5em;
}

.body-padding {
  padding: 0 15px;
}

#states-dropdown,
#countries-dropdown {
  border: none;
  font-size: 16px;
  color: #ffffff;
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

.stripe-card {
  /* width: 95%; */
  /* float: left; */
  /* margin-left: 1.5em; */
  border: none;
  color: #ccd0d8;
}

.stripe-card > div > div {
  border-bottom: 1px solid #ccd0d8;
}

.credit-card-inputs.complete {
  border: 2px solid green;
}

.Input {
  border-bottom: 1px solid #ccd0d8;
}

.address {
  /* padding: 0 2em 2em 2.5em; */
}

.state {
  position: relative;
  top: 6px;
}

.country {
  position: relative;
  top: 6px;
}

.countries {
  width: 100%;
  padding-bottom: 8px;
}

.states {
  padding-bottom: 8px;
  width: 100%;
}

.dropdown-menu {
  height: 200px;
  overflow: auto;
}

.dropdown-button-text {
  float: left;
}

.dropdown-toggle::after {
  float: right;
  position: relative;
  top: 10px;
}

.dropdown-item:hover {
  cursor: pointer;
}

.border-control {
  border: none;
  border-bottom: 1px solid #ccd0d8;
  color: #a0a9b8;
  border-radius: 0;
  padding-left: 0;
  background: none;
}

.border-control:focus {
  box-shadow: none;
}

.form-control:invalid {
  background-image: none;
}

label,
.grey {
  color: #b1b9c5;
}

.CardField-child {
  border-bottom: 1px solid black;
}

@media only screen and (max-width: 768px) {
  .postal-row {
    margin-top: 1.5em;
  }

  .stripe-card {
    width: 88%;
  }

  .card-number {
    margin-bottom: 1em;
  }
}

.savable {
  background: var(--main-theme) !important;
}

.small-thumbnail {
  max-width: 50px;
}
</style>
