const EditEventSideMenuCurrentTab = {
  state: {
    currentTab: 'Settings'
  },
  mutations: {
    mutateCurrentTab: (state, payload) => {
      state.currentTab = payload
    }
  },
  getters: {
    getCurrentTab: state => state.currentTab
  },
  actions: {
    changeCurrentTab: (context, payload) => {
      context.commit('mutateCurrentTab', payload)
    }
  }
}

export default EditEventSideMenuCurrentTab
