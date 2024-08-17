import { LOCAL_STORAGE_KEY } from "@/constants"
import storage from '@/utils/storage'

const	state =  {
  filters : storage.load(LOCAL_STORAGE_KEY) || {
    timeFilter: 'T_ALL',
    eventFilter: 'E_ALL'
  }
}
const mutations = {
  MUTATE_SET_FILTERS: (state, payload) => {
    state.filters = { ...state.filters, ...payload }
    storage.save(LOCAL_STORAGE_KEY, state.filters)
  }
}
const getters = {
  getFilters: state => state.filters,
}

const actions = {
  setFilters ({
    commit
  }, payload) {
    commit('MUTATE_SET_FILTERS', payload)
    return true
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}