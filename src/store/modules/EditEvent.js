import EventBus from '../../event-bus.js'

const state = {
  disabled: false,
  selectedEventForm: {},
  originalForm: {},
  isDifferentValues: false,
  modifiedCheckpointOverlay: false,
  notSubdomain: false,
  requestObject: {},
  subDomain: '',
  prices: []
}

const getters = {
  getEventSettings: state => state.selectedEventForm,
  getIsDifferent: state => state.isDifferentValues,
  getModifiedCheckpointOverlay: state => state.modifiedCheckpointOverlay,
  getEventSettingsRequestObject: state => state.requestObject,
  getOriginalForm: state => state.originalForm,
  getIsNotSubdomainDifferent: state => state.notSubdomain,
  getSubDomain: state => state.subDomain,
}

const mutations = {
  MUTATE_SET_SELECTED_EVENT: (state, payload) => {
    state.isDifferentValues = false
    state.modifiedCheckpointOverlay = false
    function removeNull (obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') removeNull(obj[key])
        else if (obj[key] == null) { obj[key] = '' }
      })

      return obj
    }

    const cleaned = removeNull(payload)
    const checkIfNull = (socialMedia, key) => {
      if (!cleaned.setting.share_setting[socialMedia]) {
        return ''
      } else if (socialMedia === 'twitter') {
        return cleaned.setting.share_setting[socialMedia]
      } else {
        return cleaned.setting.share_setting[socialMedia][key]
      }
    }
    state.subDomain = cleaned.subdomain || state.subDomain
    state.selectedEventForm = {
      subdomain: cleaned.subdomain || state.originalForm.subdomain,
      domain: cleaned.domain || state.originalForm.domain,
      url: cleaned.url || state.originalForm.url,
      title: cleaned.setting.title,
      description: cleaned.setting.description,
      campaign_url: cleaned.setting.contact.campaign_url,
      sharing_enabled: cleaned.setting.sharing_enabled,
      services: cleaned.setting.services,
      download_enabled: cleaned.setting.download_enabled,
      allow_upload: cleaned.setting.allow_upload,
      finish_time_overlay_enabled: cleaned.finish_time_overlay_enabled,
      theme_id: cleaned.setting.theme_id,
      colors: cleaned.setting.colors,
      company_name: cleaned.setting.contact.name,
      company_url: cleaned.setting.contact.url,
      company_twitter: cleaned.setting.contact.twitter,
      company_facebook: cleaned.setting.contact.facebook,
      logo: cleaned.setting.logo,
      logo_url: cleaned.setting.logo_url,
      ga_id: cleaned.setting.ga,
      pin: cleaned.setting.pin,
      photos_purchase: cleaned.setting.photos_purchase,
      watermark_enabled: cleaned.setting.watermark_enabled,
      purchase_currency: cleaned.setting.prices.length?cleaned.setting.prices[0].currency:null,
      purchase_single_price: cleaned.setting.prices.length?cleaned.setting.prices.find(({type})=> type === 'single').ext_price_id:null,
      purchase_batch_price: cleaned.setting.prices.length?cleaned.setting.prices.find(({type})=> type === 'batch').ext_price_id:null,
      locale: cleaned.setting.locale,
      locales: cleaned.setting.locales,
      share_setting: {
        facebook: {
          title: checkIfNull('facebook', 'title'),
          text: checkIfNull('facebook', 'text')
        },
        twitter: checkIfNull('twitter'),
        email: {
          title: checkIfNull('email', 'title'),
          text: checkIfNull('email', 'text')
        }
      },
      checkpoints: cleaned.checkpoints,
      rt_brand: cleaned.setting.rt_brand,
      rt_brand_option: cleaned.setting.rt_brand_option,
      client_brand_image_id: cleaned.setting.client_brand_image_id,
      client_brand_image: cleaned.setting.client_brand_image,
      client_brand_url: cleaned.setting.client_brand_url,
      vip_button_text: cleaned.setting.vip_button_text,
      stickers: cleaned.setting.stickers,
      prices: cleaned.setting.prices,
    }
    state.originalForm = JSON.parse(JSON.stringify(state.selectedEventForm))
    state.requestObject = {
    }

    EventBus.$emit('change-loader-state', false)
    EventBus.$emit('set-event-setting-success')
  },

  MUTATE_EVENT_VALUES: (state, {fieldName, fieldValue, color = false}) => {
    if (fieldName != undefined && fieldValue != undefined) {
      if (color) {
        if (state.requestObject.colors) {
          state.requestObject.colors[fieldName] = fieldValue
        } else {
          state.requestObject.colors = {}
          state.requestObject.colors[fieldName] = fieldValue
        }
        state.isDifferentValues = true
      } else if (state.originalForm[fieldName] === fieldValue || (state.originalForm[fieldName] === undefined && fieldValue === false)) {
        // state.isDifferentValues = false
        state.notSubdomain = false
        state.requestObject[fieldName] = fieldValue
      } else {
        state.isDifferentValues = true
        if (fieldName !== 'subdomain') {
          state.notSubdomain = true
        }
        state.requestObject[fieldName] = fieldValue
      }
    }
  },

  MUTATE_IS_DIFFERENT_VALUES: (state, payload) => {
    state.isDifferentValues = payload
  },
  MUTATE_IS_MODIFIED_CHECKPOINT_OVERLAY: (state, payload) => {
    state.modifiedCheckpointOverlay = payload
  },
  MUTATE_IS_BRAND_VALUES: (state, payload) => {
    state.originalForm.rt_brand = payload
  },
}

const actions = {
  setEvent ({commit}, payload) {
    commit('MUTATE_SET_SELECTED_EVENT', payload)
    return true
  },
  changeEventValues ({commit}, payload) {
    console.log(`changeEventValues - ${JSON.stringify(payload)}`)
    commit('MUTATE_EVENT_VALUES', payload)
  },
  changeIsDifferentValues ({commit}, payload) {
    console.log(`changeisdifferentvalues - ${JSON.stringify(payload)}`)
    commit('MUTATE_IS_DIFFERENT_VALUES', payload)
  },
  changeBrandValue ({commit}, payload) {
    commit('MUTATE_IS_BRAND_VALUES', payload)
  },
  changeIsModifiedCheckpointOverlay ({commit}, payload) {
    console.log(`changeIsModifiedCheckpointOverlay - ${JSON.stringify(payload)}`)
    commit('MUTATE_IS_MODIFIED_CHECKPOINT_OVERLAY', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
