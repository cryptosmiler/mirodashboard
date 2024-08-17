import EventBus from '../../event-bus.js';
import {
  initNewPayment,
  getTenantInvoices,
  listPaymentMethods,
  setDefaultPaymentMethod,
  payInvoice
} from '@/api';
import is from 'is_js';
import Vue from 'vue';
// import { payInvoice } from '../../api/index.js';

var stripe = Stripe(process.env.STRIPE_KEY);

const state = {
  selected: {},
  priceTable: [{
      value: 5000,
      price: 25000,
      planId: 1,
      discountText: ""
    },
    {
      value: 10000,
      price: 50000,
      planId: 2,
      discountText: ""
    },
    {
      value: 25000,
      price: 118750,
      planId: 3,
      discountText: "save 5%"
    },
    {
      value: 50000,
      price: 225000,
      planId: 4,
      discountText: "save 10%"
    },
    {
      value: 100000,
      price: 425000,
      planId: 5,
      discountText: "save 15%"
    },
    {
      value: 250000,
      price: 1000000,
      planId: 6,
      discountText: "save 20%"
    }
  ],
  invoices: [],
  paymentMethods: null,
  defaultPaymentMethod: null
}


const getters = {
  getPriceSelected: state => state.selected,
  getPriceTable: state => state.priceTable,
  getTenantInvoices: state => state.invoices,
  getPaymentMethods: state => state.paymentMethods,
  getDefaultPaymentMethod: state => state.defaultPaymentMethod
}

const mutations = {
  MUTATE_SET_PRICE_TABLE: (state, payload) => {
    state.priceTable = payload
  },
  MUTATE_SET_SELECTED: (state, payload) => {
    state.selected = payload
  },
  MUTATE_SET_INVOICES: (state, payload) => {
    state.invoices = payload
  },
  MUTATE_SET_PAYMENT_METHODS: (state, payload) => {
    state.paymentMethods = payload
  },
  MUTATE_SET_DEFAULT_PAYMENT_METHOD: (state, payload) => {
    state.defaultPaymentMethod = payload
  },
}

const actions = {
  setPriceTable({
    commit
  }, payload) {
    commit('MUTATE_SET_PRICE_TABLE', payload)
    return true
  },
  setPriceSelected({
    commit
  }, payload) {
    commit('MUTATE_SET_SELECTED', payload)
    return true
  },
  async toPayInvoice({commit,dispatch},payload){
    try {
      EventBus.$emit("change-loader-state", true)
      let initPaymentIntentResp = await payInvoice(payload)
      let clientSecret = initPaymentIntentResp.data.client_secret
      console.log(clientSecret)
      let fetchDefaultPaymentMethod = await listPaymentMethods()
      const defaultPaymentMethod = fetchDefaultPaymentMethod.data.default_payment_method
      if (is.not.empty(defaultPaymentMethod)) {
        console.log(defaultPaymentMethod)
        console.log(stripe)
        let confirmResult = await stripe.handleCardPayment(clientSecret, {
          payment_method: defaultPaymentMethod
        })
        console.log(confirmResult)
        if(confirmResult.error){
         // Vue.toasted.global.perform_payment_failed()
         throw confirmResult.error
        }else{
          Vue.toasted.global.perform_payment_success()
        }
        
      } else {
        Vue.toasted.global.perform_payment_failed()
      }
      
      EventBus.$emit("change-loader-state", false)
    } catch (err) {
      console.log(err)
      Vue.toasted.global.perform_payment_failed()
      EventBus.$emit("change-loader-state", false)
    }
    dispatch('fetchTenantInvoices', {})
    dispatch('Auth/getProfile', {}, { root: true })
  },
  async purchase({
    commit, dispatch
  }, payload) {
    try {
      EventBus.$emit("change-loader-state", true)
      let initPaymentIntentResp = await initNewPayment(payload)
      let clientSecret = initPaymentIntentResp.data.client_secret
      console.log(clientSecret)
      let fetchDefaultPaymentMethod = await listPaymentMethods()
      const defaultPaymentMethod = fetchDefaultPaymentMethod.data.default_payment_method
      if (is.not.empty(defaultPaymentMethod)) {
        console.log(defaultPaymentMethod)
        console.log(stripe)
        let confirmResult = await stripe.handleCardPayment(clientSecret, {
          payment_method: defaultPaymentMethod
        })
        console.log(confirmResult)
        if(confirmResult.error){
         // Vue.toasted.global.perform_payment_failed()
         throw confirmResult.error
        }else{
          Vue.toasted.global.perform_payment_success()
        }
        
      } else {
        Vue.toasted.global.perform_payment_failed()
      }
      
      EventBus.$emit("change-loader-state", false)
    } catch (err) {
      console.log(err)
      Vue.toasted.global.perform_payment_failed()
      EventBus.$emit("change-loader-state", false)
    }
    dispatch('fetchTenantInvoices', {})
    dispatch('Auth/getProfile', {}, { root: true })
  },
  async fetchTenantInvoices({
    commit
  }, payload) {
    try {
      EventBus.$emit('change-loader-state', true)
      const resp = await getTenantInvoices(payload)
      console.log(resp.data.invoices.data)
      commit('MUTATE_SET_INVOICES', resp.data.invoices.data)
      EventBus.$emit('change-loader-state', false)
    } catch (err) {
      console.log(err)
      EventBus.$emit('change-loader-state', false)
    }
  },
  async loadPaymentMethods({
    commit
  }, payload) {
    try {
      const resp = await listPaymentMethods(payload)
      console.log(resp)
      commit('MUTATE_SET_PAYMENT_METHODS', resp.data.payment_methods.data)
      if (resp.data.default_payment_method)
        commit('MUTATE_SET_DEFAULT_PAYMENT_METHOD', resp.data.default_payment_method)
    } catch (err) {
      console.log(err)
    }
  },
  async setDefaultCard({commit}, payload) {
    try {
      const resp = await setDefaultPaymentMethod(payload)
      commit('MUTATE_SET_DEFAULT_PAYMENT_METHOD', payload.payment_method_id)
      return resp
    } catch (err) {
      console.error(err)
      throw(err)
    } 
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
