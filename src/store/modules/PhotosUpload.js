const PhotosUpload = {
  state: {
    isUploading: false,
    isPaused: false,
    totalPhotosCount: 0,
    setTotalPhotosCount: 0,
    photosSuccessfullyUploaded: 0,
    photosProcessed: 0,
    recentImagesUploaded: 0,
    failedUploads: []
  },
  getters: {
    getIsUploading: state => state.isUploading,
    getPaused: state => state.isPaused,
    getTotalPhotosCount: state => state.totalPhotosCount,
    getSetTotalPhotosCount: state => state.setTotalPhotosCount,
    getSuccessfulUploadsCount: state => state.photosSuccessfullyUploaded,
    getPhotosProcessedCount: state => state.photosProcessed,
    getRecentImagesUploaded: state => state.recentImagesUploaded,
    getFailedUploads: state => state.failedUploads
  },
  mutations: {
    mutatePhotosAdded: (state, payload) => {
      console.log(`mutatePhotosAdded ${payload}, ${payload.length}`)
      if (payload.length > 0) {
        state.isUploading = true
        // totalPhotosCount decrements with each deleted or successful upload
        state.totalPhotosCount += payload.length
        // setTotalPhotosCount decrements only on deleted uploads
        state.setTotalPhotosCount += payload.length
      }
    },
    mutatePause: (state, payload) => {
      state.isPaused = payload
    },
    mutateCompletedUploads: (state) => {
      state.photosSuccessfullyUploaded += 1
      state.recentImagesUploaded += 1
      // state.totalPhotosCount -= 1
      state.totalPhotosCount > 0 ? state.totalPhotosCount -= 1 : state.totalPhotosCount = 0
    },
    mutateProcessed: (state) => {
      state.photosProcessed += 1
    },
    finishedUploading: (state) => {
      // reset dropzone stats
      state.isUploading = false
      state.totalPhotosCount = 0
      state.photosSuccessfullyUploaded = 0
      state.photosProcessed = 0
      state.setTotalPhotosCount = 0
      state.failedUploads = []
    },
    deleteUploadingPhoto: (state) => {
      // decrement number on each delete
      state.totalPhotosCount > 0 ? state.totalPhotosCount -= 1 : state.totalPhotosCount = 0
      state.setTotalPhotosCount > 0 ? state.setTotalPhotosCount -= 1 : state.setTotalPhotosCount = 0
    },
    mutateFailedUploads: (state, payload) => {
        state.failedUploads.push(payload)
    },
    mutateRecentImage: (state, payload) => {
      state.recentImagesUploaded = payload
    },
  },
  actions: {
    photosAddedToUpload: ({commit}, payload) => {
      commit('mutatePhotosAdded', payload)
    },
    pausePhotosUploads: ({commit}, payload) => {
      commit('mutatePause', payload)
    },
    photoSuccessfullyUploaded: ({commit}, payload) => {
      commit('mutateCompletedUploads', payload)
    },
    photoProcessed: ({commit}, payload) => {
      commit('mutateProcessed', payload)
    },

    photosFinishedUploading: ({commit, dispatch}, payload = null) => {
      commit('finishedUploading')
      if (payload) {
        dispatch('Events/getEventContent', {checkpoint: payload}, {root: true})
      }
    },
    deleteUploadingPhoto: ({commit}) => {
      commit('deleteUploadingPhoto')
    },
    failedUploads: ({commit}, payload) => {
      commit('mutateFailedUploads', payload)
    },
    resetRecentImage: ({commit}, payload) => {
      commit('mutateRecentImage', payload)
    },
  }
}

export default PhotosUpload
