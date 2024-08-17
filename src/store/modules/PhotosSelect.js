import EventBus from '@/event-bus'

const PhotosAllSelect = {
  state: {
    selectMode: false,
    selectedCount: 0,
    selectedImages: [],
    selectedImage: {},
    selectedImageIndex: 0,
    selectedImagesObjects: [],
    selectedPage: [],
    allPhoto: [],
  },
  getters: {
    getSelectMode: state => state.selectMode,
    getSelectedCount: state => state.selectedCount,
    getSelectedImages: state => state.selectedImages,
    getSelectedImage: state => state.selectedImage,
    getSelectedImageIndex: state => state.selectedImageIndex,
    getSelectedImagesObjects: state => state.selectedImagesObjects,
    getAllPhoto: state => state.allPhoto
  },
  mutations: {
    mutateSelectMode: (state, payload) => {
      // on each select or deselect, checks length to see if any are selected
      state.selectedCount = payload.length
      payload.length > 0 ? state.selectMode = true : state.selectMode = false

      // save all selectedImages
      state.selectedImages = payload
    },

    mutateSelectAll: (state) => {
      EventBus.$emit('select-all-images')
    },

    mutateSelecVisible: (state) => {
      EventBus.$emit('select-visible-images')
    },

    mutateSelectedImage: (state, {image, index}) => {
      state.selectedImage = image
      state.selectedImageIndex = index
    },

    mutateSelectedImagesObjects: (state, payload) => {
      state.selectedImagesObjects = payload
    },

    mutateAllPhoto: (state, payload) => {
      state.allPhoto = payload
    },
  },
  actions: {
    changeSelectMode: ({commit}, payload) => {
      commit('mutateSelectMode', payload)
    },
    changeSelectAll: ({commit}) => {
      commit('mutateSelectAll')
    },
    changeSelectVisible: ({commit}) => {
      commit('mutateSelecVisible')
    },
    changeSelectedImage: ({commit}, payload) => {
      commit('mutateSelectedImage', payload)
    },
    changeSelectedImagesObjects: ({commit}, payload) => {
      commit('mutateSelectedImagesObjects', payload)
    },
    changeAllPhotos:({commit}, payload) => {
      commit('mutateAllPhoto', payload)
    }
  }
}

export default PhotosAllSelect
