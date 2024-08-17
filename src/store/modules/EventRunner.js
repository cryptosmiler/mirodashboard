import EventBus from '../../event-bus.js'
import store from '../../store'
import Vue from 'vue'
import uuid from 'uuid/v1'

const state = {
  loading: false, 
  error: null, 
  runnerList: [],
  totalRunner: [],
  addedRunner: [],
  changedRunner: [],
  isDifferentValues: false
}

const getters = {
  getRunners: state => state.runnerList,
  getTotalRunners: state => state.totalRunner,
  getAddedRunners: state => state.addedRunner,
  getChanged: state => state.isDifferentValues,
}

const mutations = {
  MUTATE_SET_RUNNERLIST: (state, payload) => {
    state.runnerList = []
    for (let index = 0; index < payload.length; index++) {
      const runner = payload[index]
      if(!runner.lock) runner.lock = true
      state.runnerList.push(runner)
    }
    state.changedRunner = []
    state.isDifferentValues = false
  },

  MUTATE_SET_TOTAL_RUNNER: (state, payload) => {
    state.totalRunner = payload
  },

  MUTATE_SAVE_RUNNER: (state, dispatch) => {
    //update runner row
    const tmpdata = []
    for (let i = 0; i < state.changedRunner.length; i++) {
      const runnerId = state.changedRunner[i]
      for (const key in state.runnerList) {
        if (state.runnerList.hasOwnProperty(key)) {
          const runner = state.runnerList[key];
          if(runner.runner_id == runnerId) {
            if(isNaN(runner.age) || runner.age == '') {
              runner.age = 0
            }
            if(/^([0-5][0-9]):([0-5][0-9])$/.test(runner.finish_time)) {
              runner.finish_time = '00:' + runner.finish_time
            }
            if(!/^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/.test(runner.finish_time)) {
              runner.finish_time = null
            }
            tmpdata.push(runner)
            break
          }
        }
      }
    }
    if(tmpdata.length > 0) dispatch('Events/setRunner', tmpdata, {root: true})

    //save new runner
    const tmpdata2 = []
    for (let i = 0; i < state.addedRunner.length; i++) {
      if(isNaN(state.addedRunner[i].age) || state.addedRunner[i].age == '') {
        state.addedRunner[i].age = 0
      }
      if(state.addedRunner[i].registration_id == '' && state.addedRunner[i].category == '' && 
        state.addedRunner[i].first_name == '' && state.addedRunner[i].last_name == '' && 
        state.addedRunner[i].gender == '' && state.addedRunner[i].corral == '' && 
        state.addedRunner[i].bib_number == '' && state.addedRunner[i].age == 0 && state.addedRunner[i].finish_time == '') {} else {
          tmpdata2.push(state.addedRunner[i])
      }
    }
    if(tmpdata2.length > 0) dispatch('Events/addRunner', tmpdata2, {root: true})

    //reset changes
    state.changedRunner = []
    state.addedRunner = []
    state.isDifferentValues = false
    EventBus.$emit('refresh-runner')
  },

  MUTATE_TOGGLE_LOCK: (state, payload) => {
    for (const key in state.runnerList) {
      if (state.runnerList.hasOwnProperty(key)) {
        const element = state.runnerList[key];
        if(element.runner_id == payload) {
          state.isDifferentValues = true
          if(state.changedRunner.indexOf(payload) === -1) {
            state.changedRunner.push(payload)
          }
          const tmp = JSON.parse(JSON.stringify(element))
          tmp.lock = !tmp.lock
          Vue.set(state.runnerList, key, tmp)
          break
        }
      }
    }
  },

  MUTATE_IS_DIFFERENT_VALUES: (state, payload) => {
    state.isDifferentValues = payload
  },

  MUTATE_ADD_RUNNER: (state, payload) => {
    state.addedRunner.push({
      runner_id: uuid(),
      registration_id: '',
      category: '',
      first_name: '',
      last_name: '',
      gender: '',
      corral: '',
      bib_number: '',
      age: 0,
      finish_time: '',
    })
    state.isDifferentValues = true
  },

  MUTATE_DELETE_ADDED_RUNNER: (state, payload) => {
    const runner_id = payload
    for (const key in state.addedRunner) {
      if (state.addedRunner.hasOwnProperty(key)) {
        const runner = state.addedRunner[key];
        if(runner.runner_id == runner_id) {
          state.addedRunner.splice(key, 1);
        }
      }
    }
  },
}

const actions = {
  setRunner ({commit}, payload) {
    commit('MUTATE_SET_RUNNERLIST', payload)
  },
  setTotalRunner ({commit}, payload) {
    commit('MUTATE_SET_TOTAL_RUNNER', payload)
  },
  saveRunner ({dispatch, commit}, payload) {
    commit('MUTATE_SAVE_RUNNER', dispatch)
  },
  toogleRunnerLock ({commit}, payload) {
    commit('MUTATE_TOGGLE_LOCK', payload)
  },
  changeIsDifferentValues ({commit}, payload) {
    commit('MUTATE_IS_DIFFERENT_VALUES', payload)
  },
  addRunner ({commit}, payload) {
    commit('MUTATE_ADD_RUNNER', payload)
  },
  deleteAddedRunner ({commit}, payload) {
    commit('MUTATE_DELETE_ADDED_RUNNER', payload)
  },
  deleteRunner({dispatch, commit}, runner_id) {
    dispatch('Events/deleteRunner', runner_id, {root: true})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}