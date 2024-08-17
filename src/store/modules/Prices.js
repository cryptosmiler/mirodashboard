import {
  getPrices
} from '@/api'
import * as mutationTypes from '../mutationTypes'

const state = {
  prices: [],
  currencies: []
}

const getters = {
  getPricesForCurrencyCodeAndType: (state) => (code, type) => {
    if (!state.prices[code])
     return []
    let filteredPrices = state.prices[code].filter((e) => e.type == type)
    return filteredPrices.map((e) => {
      return {
        value: e.ext_price_id,
        text: e.price
      }
    })
  },
  getCurrencies: state => state.currencies,
  getPricesForCurrencyCode: (state) => (code) => {
    return state.prices[code]
  }
}

const mutations = {
  [mutationTypes.GET_PRICES_SUCCESS](state, payload) {
    console.log(`PRICES UPDATED`)
    state.prices = payload
    state.currencies = [{ value: "null", text: "Please select a currency to use", disabled: true }]
    for (const key in payload) {
      state.currencies.push({ value: key, text:  `${payload[key][0].currency_description} (${key})`})
    }
  }
}


const actions = {
  async loadPrices({commit})  {
    try {
      const resp = await getPrices()

      commit(mutationTypes.GET_PRICES_SUCCESS, resp.data.prices)
    } catch (err) {
      commit(mutationTypes.GET_PRICES_ERROR, err)
      console.log(err)
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
