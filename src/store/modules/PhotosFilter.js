const PhotosFilter = {
  state: {
    currentFilter: 'All',
    // max photos controls offset of getContent requests
    maxPhotosPerPage: 24,
    paginationValue: 1
  },
  getters: {
    getCurrentFilter: state => state.currentFilter,
    getMaxPhotosPerPage: state => state.maxPhotosPerPage,
    getPaginationValue: state => state.paginationValue
  },
  mutations: {
    mutateCurrentFilter: (state, payload) => {
      // Filter = All, Visible, Hidden, Uploading
      state.currentFilter = payload
    },
    mutatePaginationValue: (state, payload) => {
      // state.paginationValue = Math.ceil((payload / state.maxPhotosPerPage) + 1)
      state.paginationValue = payload
    }
  },
  actions: {
    changeCurrentFilter: ({commit}, payload) => {
      commit('mutateCurrentFilter', payload)
    },
    changePaginationValue: ({commit}, payload) => {
      commit('mutatePaginationValue', payload)
    }
  },
  namespaced: true
}

export default PhotosFilter
