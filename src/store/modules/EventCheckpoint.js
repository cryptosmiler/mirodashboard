import EventBus from '../../event-bus.js'
import store from '../../store'
import Vue from 'vue'
import uuid from 'uuid/v1'

const state = {
  checkpointList: [],
  isDifferentValues: false,
  checkpointFilter: [],
  currentCheckpoint: 0,
  selectedCheckpointInOverlay: '',
  overlayId: ''
}

const getters = {
  getCheckpoints: state => state.checkpointList,
  getIsDifferentValues: state => state.isDifferentValues,
  getCurrentCheckpoint: state => state.currentCheckpoint,
  getSelectedCheckpointInOverlay: state => state.selectedCheckpointInOverlay,
  getOverlayId: state => state.overlayId
}

const mutations = {
  MUTATE_SET_CHECKPOINT_LIST: (state, payload) => {
    state.checkpointList = JSON.parse(JSON.stringify(payload))
    state.changedRunner = []
    state.isDifferentValues = false
    if (state.checkpointList && state.checkpointList.length == 1) {
      state.currentCheckpoint = state.checkpointList[0].checkpoint_id
    }
  },

  MUTATE_SET_DIFFERENT_VALUE: (state, payload) => {
    state.isDifferentValues = payload
  },

  MUTATE_ADD_CHECKPOINT: (state, payload) => {
    state.checkpointList.push({
      checkpoint_id: uuid(),
      checkpoint_label: '',
      new: true,
      images: 0
    })
    state.isDifferentValues = true
  },

  MUTATE_DELETE_CHECKPOINT: (state, checkpoint_id) => {
    const tmpList = []
    for (let index = 0; index < state.checkpointList.length; index++) {
      const checkpoint = state.checkpointList[index]
      if(checkpoint.checkpoint_id != checkpoint_id) {
        tmpList.push(checkpoint)
      } else {
        if(checkpoint.new == undefined) {
          checkpoint.delete = true
          tmpList.push(checkpoint)
        }
      }
    }
    state.checkpointList = tmpList
    state.isDifferentValues = true
  },
  
  /*
  MUTATE_CHANGE_CHECKPOINT_FILTER: (state, images) => {
    state.checkpointFilter = []
    for (let index = 0; index < state.checkpointList.length; index++) {
      const checkpoint = state.checkpointList[index]
      const tmpFilterList = {}
      tmpFilterList.id = checkpoint.checkpoint_id
      tmpFilterList.name = checkpoint.checkpoint_label
      tmpFilterList.images = []
      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        if(image.checkpoint == checkpoint.checkpoint_id) {
          tmpFilterList.images.push(image)
        }
      }
      state.checkpointFilter.push(tmpFilterList)
    }
  },
  */
  MUTATE_SELECT_CHECKPOINT: (state, checkpoint_id) => {
    state.currentCheckpoint = checkpoint_id
  },

  MUTATE_SELECTED_CHECKPOINT_IN_OVERLAY: (state, checkpointId) => {
    state.selectedCheckpointInOverlay = checkpointId
  },

  MUTATE_SELECTED_OVERLAY_ID: (state, overlayId) => {
    state.overlayId = overlayId
  }
}

const actions = {
  setCheckpoint ({commit}, payload) {
    commit('MUTATE_SET_CHECKPOINT_LIST', payload)
  },

  setIsDifferentValues ({commit, dispatch}, payload) {
    commit('MUTATE_SET_DIFFERENT_VALUE', payload)
    dispatch('EditEvent/changeIsDifferentValues', payload, {root: true})
  },

  addCheckpoint ({commit, dispatch}, payload) {
    commit('MUTATE_ADD_CHECKPOINT', payload)
    dispatch('EditEvent/changeIsDifferentValues', true, {root: true})
  },

  deleteCheckpoint ({state, commit, dispatch}, payload) {
    commit('MUTATE_DELETE_CHECKPOINT', payload)
    dispatch('EditEvent/changeIsDifferentValues', true, {root: true})
  },

  saveCheckpoint ({state, dispatch}) {
    const checkpointToSave = []
    for (let index = 0; index < state.checkpointList.length; index++) {
      const checkpoint = state.checkpointList[index];
      if(checkpoint.checkpoint_label.trim() != '') {
        checkpointToSave.push(checkpoint)
      }
    }
    dispatch('Events/setCheckpoint', checkpointToSave, {root: true})
    dispatch('EditEvent/changeIsDifferentValues', false, {root: true})
  },

  /* updateCheckpointFilter ({state, commit, dispatch}, payload) {
    commit('MUTATE_CHANGE_CHECKPOINT_FILTER', payload)
  }, */

  selectCheckpoint ({commit}, payload) {
    commit('MUTATE_SELECT_CHECKPOINT', payload)
  },

  changeSelectedCheckpointInOverlay ({commit}, payload) {
    commit('MUTATE_SELECTED_CHECKPOINT_IN_OVERLAY', payload)
  },

  setOverlayId ({commit}, payload) {
    commit('MUTATE_SELECTED_OVERLAY_ID', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
