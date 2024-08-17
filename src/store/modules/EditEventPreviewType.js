const EditEventPreviewType = {
  state: {
    selectedType: 'desktop'
  },
  mutations: {
    mutateSelectedType: (state, payload) => {
      state.selectedType = payload
    }
  },
  getters: {
    getSelectedType: state => state.selectedType
  },
  actions: {
    changeSelectedType: (context, payload) => {
      context.commit('mutateSelectedType', payload)
    }
  }
}

export default EditEventPreviewType
