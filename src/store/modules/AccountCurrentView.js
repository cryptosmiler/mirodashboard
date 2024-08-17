const AccountCurrentView = {
  state: {
    currentView: 'account-profile-settings'
  },
  mutations: {
    mutateCurrentView: (state, payload) => {
      state.currentView = payload
    }
  },
  getters: {
    getCurrentView: state => state.currentView
  },
  actions: {
    changeCurrentView: (context, payload) => {
      context.commit('mutateCurrentView', payload)
    }
  }
}

export default AccountCurrentView
