const ImageUploadComponent = {
  namespaced: true,
  state: {
    logo: {
      fieldName: 'logo',
      name: 'logo',
      image: '',
      active: false
    },
    brand: {
      fieldName: 'brand',
      name: 'brand',
      image: '',
      active: false
    },
    left: {
      name: 'left',
      fieldName: 'left',
      image: '',
      active: false
    },
    center: {
      name: 'center',
      fieldName: 'center',
      image: '',
      active: false
    },
    right: {
      name: 'right',
      fieldName: 'right',
      image: '',
      active: false
    },
    sponsor: {
      name: 'sponsor',
      fieldName: 'sponsor',
      image: '',
      active: false
    },
    organiser: {
      name: 'organiser',
      fieldName: 'organiser',
      image: '',
      active: false
    },
    vips: {
      name: 'vips',
      fieldName: 'vips',
      image: '',
      active: false
    },
    stickers: {
      name: 'stickers',
      fieldName: 'stickers',
      image: '',
      active: false
    }

  },
  mutations: {
    mutateImageInfo: (state, {fieldName, fieldValue, active}) => {
      state[fieldName].image = fieldValue
      state[fieldName].active = active
    }
  },
  getters: {
    logo: state => state.logo,
    brand: state => state.brand,
    left: state => state.left,
    center: state => state.center,
    right: state => state.right,
    sponsor: state => state.sponsor,
    organiser: state => state.organiser,
    vips: state => state.vips,
    stickers: state => state.stickers
  },
  actions: {
    updateImageInfo: ({commit, dispatch}, payload) => {
      commit('mutateImageInfo', payload)
      // dispatch('EditEvent/changeEventValues', payload, {root: true})
      dispatch('EditEvent/changeIsDifferentValues', true, {root: true})
    }
  }
}

export default ImageUploadComponent
