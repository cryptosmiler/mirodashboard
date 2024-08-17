const CreateEvent = {
  state: {
    eventType: 'standard',
    currentStep: 1
  },
  mutations: {
    mutateEventType: (state, payload) => {
      state.eventType = payload
    },
    mutateStep: (state, payload) => {
      state.currentStep = payload
    }
  },
  getters: {
    getEventType: state => state.eventType,
    getEventStep: state => state.currentStep
  },
  actions: {
    changeEventType: (context, payload) => {
      context.commit('mutateEventType', payload)
    },
    changeStep: (context, payload) => {
      context.commit('mutateStep', payload)
    }
  }
}

export default CreateEvent
