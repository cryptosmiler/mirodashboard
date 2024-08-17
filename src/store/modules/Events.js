import {
  loadEvents,
  loadEvent,
  createEvent,
  deleteEvent,
  setEventDomain,
  setEventState,
  setEventSetting,
  getEventContent,
  getEventContentSummary,
  deleteEventContent,
  setEventContentState,
  getEventStats,
  setEventOverlay,
  getEventOverlay,
  setOverlayByCheckpoint,
  getOverlayByCheckpoint,
  setRunner,
  addRunner,
  deleteRunner,
  getOverlayPreview,
  cancelOverlayPreviewCall,
  cancelFinishTimeOverlayPreviewCall,
  getFinishTimeOverlayPreview,
  getCheckpoint,
  setCheckpoint,
  setImagesCheckpoint,
  getMedia,
  postEventMedia,
  sendReviewLinkEmail,
  duplicateEvent,
  sendEnquiryEmail,
  getSales,
} from '@/api'

import * as mutationTypes from '../mutationTypes'
import router from '@/router'
import EventBus from '../../event-bus.js'
import Vue from 'vue'
import _ from 'lodash'
import { EVENT_FILTERS, EVENT_FILTER_FUNCS } from '@/constants'

const defaultOverlayObj = {
  mask: {
    opacity: 0.5,
    color: '#CCCCCC',
    position: 4
  },
  mask_enabled: true,
  position: 4,
  margin: 40,
  left: {
    media_id: null,
    url: '',
    position: 4
  },
  center: {
    media_id: null,
    url: '',
    position: 4
  },
  right: {
    media_id: null,
    url: '',
    position: 4
  }
}
const state = {
  loading: false, // Show loading icon if TRUE
  error: null, // Show error in events page if error

  events: [],
  selectedEvent: {},
  eventContent: [],
  eventContentSettings: {},

  eventContentSummary: {},
  galleryUrlLocked: true,
  eventStats: {},
  eventOverlay: {},
  media: [],
  sales: {}
}

const getters = {
  getEvents: state => state.events,
  getSelectedEvent: state => state.selectedEvent,

  // State 1 means `public`, 0 means `private`
  getPublicEvents: state => state.events.filter(EVENT_FILTER_FUNCS['E_PUBLIC']),
  getPrivateEvents: state => state.events.filter(EVENT_FILTER_FUNCS['E_PRIVATE']),
  getEventContent: state => state.eventContent,
  getEventContentSummary: state => state.eventContentSummary,
  getEventContentSettings: state => state.eventContentSettings,
  getGalleryUrlLocked: state => state.galleryUrlLocked,
  getEventStats: state => state.eventStats,
  getEventOverlay: state => state.eventOverlay,
  getEventStickers: state => state.selectedEvent.stickers,
  getMedia: state => state.media,
  getSales: state => state.sales
}

const mutations = {
  [mutationTypes.LOAD_EVENTS_REQUEST](state) {
    EventBus.$emit('change-loader-state', true)
    state.loading = true
    state.error = null
  },

  [mutationTypes.LOAD_EVENTS_SUCCESS](state, payload) {
    state.loading = false
    state.events = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.LOAD_EVENTS_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.LOAD_EVENT_REQUEST](state) {
    EventBus.$emit('change-loader-state', true)
    state.loading = true
    state.error = null
  },

  [mutationTypes.LOAD_EVENT_SUCCESS](state, payload) {
    state.loading = false
    state.selectedEvent = payload
  },

  [mutationTypes.LOAD_EVENT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SELECT_EVENT](state, payload) {
    state.selectedEvent = payload
  },

  [mutationTypes.CHANGE_GALLERY_URL_LOCK_STATE](state, payload) {
    state.galleryUrlLocked = payload
  },

  [mutationTypes.CREATE_EVENT_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.CREATE_EVENT_SUCCESS](state, payload) {
    state.loading = false
    state.selectedEvent = payload
    router.push({ name: 'EventSettings', params: { id: payload.event_id } })
  },

  [mutationTypes.CREATE_EVENT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.LOAD_EVENTS_STATS_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.LOAD_EVENTS_STATS_SUCCESS](state, payload) {
    state.loading = false
    state.eventStats = payload
  },

  [mutationTypes.LOAD_EVENTS_STATS_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.DELETE_EVENT_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.DELETE_EVENT_SUCCESS](state, eventId) {
    state.loading = false
    state.events = state.events.filter((event) => {
      return event.event_id !== eventId
    })

    Vue.toasted.global.information_updated()
  },

  [mutationTypes.DELETE_EVENT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.SET_EVENT_SETTING_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SET_EVENT_SETTING_SUCCESS](state, payload) {
    state.selectedEvent = payload.data
    state.selectedEvent.event_id = payload.data.setting.event_id
    this.dispatch('Events/loadEvent', state.selectedEvent.event_id, { root: true })

    Vue.toasted.global.information_updated()
    state.loading = false
    EventBus.$emit('change-loader-state', false)
    EventBus.$emit('refresh-overview-iframe')
  },

  [mutationTypes.SET_EVENT_SETTING_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('change-loader-state', false)
    EventBus.$emit('refresh-overview-iframe')
  },

  [mutationTypes.SET_EVENT_COLOR_SCHEME](state, payload) {
    state.selectedEvent.colors = payload.data.setting.colors
    state.selectedEvent.event_id = payload.data.setting.event_id
    state.selectedEvent.setting.rt_brand = payload.data.setting.rt_brand
    this.dispatch('EditEvent/changeBrandValue', payload.data.setting.rt_brand)
    state.loading = false
    Vue.toasted.global.information_updated()
    // this.dispatch('Events/loadEvent', state.selectedEvent.event_id, {root: true})

    EventBus.$emit('change-loader-state', false)
    EventBus.$emit('refresh-overview-iframe')
  },

  [mutationTypes.SET_EVENT_STICKERS_REQUEST](state) {
    state.loading = true
    state.error = null
    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SET_EVENT_STICKERS](state, payload) {
    state.eventStickers = payload.data.setting
    state.loading = false
    Vue.toasted.global.information_updated()
    // this.dispatch('Events/loadEvent', state.selectedEvent.event_id, {root: true})
  },

  [mutationTypes.SET_EVENT_STATE_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SET_EVENT_DOMAIN_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SET_EVENT_DOMAIN_SUCCESS](state, payload) {
    state.loading = false
    let vm = this
    setTimeout(() => {
      vm.state.EditEvent.originalForm.subdomain = payload.data.event.subdomain
      vm.state.EditEvent.selectedEventForm.subdomain = payload.data.event.subdomain
      vm.state.EditEvent.selectedEventForm.domain = payload.data.event.domain

      vm.state.EditEvent.subDomain = payload.data.event.subdomain
      vm.dispatch('EditEvent/setEvent', vm.state.EditEvent.selectedEventForm, { root: true })
    }, 2000)

    vm.state['EditEvent']['isDifferentValues'] = false
    Vue.toasted.global.information_updated()
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SET_EVENT_DOMAIN_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SET_EVENT_STATE_REQUEST](state) {
    EventBus.$emit('change-loader-state', true)
    state.loading = true
    state.error = null
  },

  [mutationTypes.SET_EVENT_STATE_SUCCESS](state, { id, eventState }) {
    EventBus.$emit('change-loader-state', false)
    Vue.toasted.global.information_updated()

    //  Update the event's state. Don't have to request the events object
    state.events.map((event) => {
      if (event.event_id === id) {
        event.state = eventState === 'public' ? 1 : 0
      }
    })
    state.loading = false
  },

  [mutationTypes.SET_EVENT_STATE_ERROR](state, payload) {
    EventBus.$emit('change-loader-state', false)
    state.loading = false
    state.error = payload
  },

  [mutationTypes.LOAD_EVENT_CONTENT_REQUEST](state, payload) {
    state.loading = true
    state.error = null
    state.eventContentSettings = payload
    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.LOAD_EVENT_CONTENT_SUCCESS](state, payload) {
    state.loading = false
    state.eventContent = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.LOAD_EVENT_CONTENT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.LOAD_EVENT_CONTENT_SUMMARY_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.LOAD_EVENT_CONTENT_SUMMARY_SUCCESS](state, payload) {
    state.loading = true
    state.error = null
    if (payload.data.summary.length > 0) {
      state.eventContentSummary = payload.data.summary[0]
    } else {
      state.eventContentSummary = []
    }
  },

  [mutationTypes.LOAD_EVENT_CONTENT_SUMMARY_ERROR](state, payload) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.SET_EVENT_CONTENT_STATE_REQUEST](state) {
    state.loading = true

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SET_EVENT_CONTENT_STATE_SUCCESS](state, payload) {
    state.loading = false
    state.error = null

    this.dispatch('changeSelectMode', [])
    this.dispatch('changeSelectedImagesObjects', [])
    Vue.toasted.global.information_updated()

    EventBus.$emit('empty-selected-images-array')
  },

  [mutationTypes.SET_EVENT_CONTENT_STATE_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.DELETE_EVENT_CONTENT_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.DELETE_EVENT_CONTENT_SUCCESS](state, payload) {
    let selectedIndex
    state.loading = false

    let objectIds = payload.selectedImages.map(object => object.object_id)

    state.eventContent = state.eventContent.filter((content, index) => {
      if (!objectIds.includes(content.object_id)) {
        return true
      }

      selectedIndex = index
    })
    if (payload.singleImage) {
      this.dispatch('changeSelectedImage', {
        image: state.eventContent[selectedIndex],
        index: selectedIndex
      })
    }

    this.dispatch('changeSelectMode', [])
    this.dispatch('changeSelectedImagesObjects', [])

    EventBus.$emit('empty-selected-images-array')
    EventBus.$emit('change-loader-state', false)
    EventBus.$emit('deleted-bib-search-photo')
    Vue.toasted.global.information_updated()
  },

  [mutationTypes.SET_EVENT_OVERLAY_MEDIA_REQUEST](state) {
    state.loading = true
    state.error = null
    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SET_EVENT_OVERLAY_MEDIA_SUCCESS](state, { resp, dispatch }) {
    state.loading = false
    state.error = null
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SET_EVENT_OVERLAY_MEDIA_SUCCESS](state, { resp, dispatch }) {
    state.loading = false
    state.error = null
    EventBus.$emit('change-loader-state', false)

    if (_.filter(state.selectedEvent.checkpoints, (o) => { return o.checkpoint_overlay_id > 0 }).length === 0 && resp.data.success === state.selectedEvent.overlay_id) {
      getEventOverlay(state.selectedEvent.event_id, state.selectedEvent.overlay_id).then(response => {
        response.data.event.enabled = state.eventOverlay.enabled != null && state.eventOverlay.enabled !== undefined ? state.eventOverlay.enabled : true
        response.data.event.finish_time_overlay_enabled = state.eventOverlay.finish_time_overlay_enabled != null && state.eventOverlay.finish_time_overlay_enabled !== undefined ? state.eventOverlay.finish_time_overlay_enabled : false
        return response
      }).then(response => {
        console.log('getOverlayByCheckpoint', response)
        state.eventOverlay = response.data.event
        if (_.isEmpty(response.data.event.overlay)) {
          state.eventOverlay.overlay = defaultOverlayObj
        }
      })
    } else {
      const selectedCheckpoint = this.getters['EventCheckpoint/getSelectedCheckpointInOverlay']
      getOverlayByCheckpoint(state.selectedEvent.event_id, selectedCheckpoint).then(response => {
        console.log('getOverlayByCheckpoint', response)

        state.eventOverlay = response.data.overlayData
        if (_.isEmpty(response.data.overlayData.overlay)) {
          state.eventOverlay.overlay = defaultOverlayObj
        }
      })
    }

    EventBus.$emit('overlay-changed', resp.data.overlayData)

    dispatch('EditEvent/changeIsModifiedCheckpointOverlay', false, { root: true })
    dispatch('EditEvent/changeIsDifferentValues', false, { root: true })

    Vue.toasted.global.information_updated()
  },

  [mutationTypes.SET_EVENT_OVERLAY_MEDIA_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.DELETE_EVENT_CONTENT_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SET_RUNNER_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.SET_RUNNER_SUCCESS](state, payload) {
    state.loading = false
    state.error = null
    Vue.toasted.global.information_updated()
  },

  [mutationTypes.SET_RUNNER_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    Vue.toasted.global.information_updated_error()
  },

  [mutationTypes.ADD_RUNNER_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.ADD_RUNNER_SUCCESS](state, payload) {
    state.loading = false
    state.error = null
    Vue.toasted.global.runner_added()
  },

  [mutationTypes.ADD_RUNNER_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    Vue.toasted.global.runner_added_error()
  },

  [mutationTypes.DELETE_RUNNER_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.DELETE_RUNNER_SUCCESS](state, payload) {
    state.loading = false
    state.error = null
    Vue.toasted.global.information_updated()
  },

  [mutationTypes.DELETE_RUNNER_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    Vue.toasted.global.information_updated_error()
  },

  [mutationTypes.SET_CHECKPOINT_REQUEST](state) {
    EventBus.$emit('change-loader-state', true)
    state.loading = true
    state.error = null
  },

  [mutationTypes.SET_CHECKPOINT_SUCCESS](state, payload) {
    EventBus.$emit('change-loader-state', false)
    state.loading = false
    state.error = null
    Vue.toasted.global.information_updated()
  },

  [mutationTypes.SET_CHECKPOINT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    Vue.toasted.global.information_updated_error()
  },

  [mutationTypes.SHARE_REVIEW_LINK_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.SHARE_REVIEW_LINK_SUCCESS](state, payload) {
    state.loading = false
    state.error = null
    Vue.toasted.global.share_review_link()
    EventBus.$emit('close-share-review-link-modal')
  },

  [mutationTypes.SHARE_REVIEW_LINK_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    Vue.toasted.global.share_review_link_error()
  },

  // [mutationTypes.LOAD_EVENT_MEDIA] (state, payload) {
  //   state.loading = false
  //   console.log(payload)
  //   if (state.media != payload){

  //   }
  // },

  [mutationTypes.LOAD_EVENT_MEDIA](state, payload) {
    state.loading = false
    console.log(payload)
    if (state.media != payload) {
    }
  }
}

const actions = {
  async loadEvents({ commit }, params = { setting: true }) {
    try {
      commit(mutationTypes.LOAD_EVENTS_REQUEST)
      const resp = await loadEvents(params)

      commit(mutationTypes.LOAD_EVENTS_SUCCESS, resp.data.events)
    } catch (err) {
      commit(mutationTypes.LOAD_EVENTS_ERROR, err)
      console.log(err)
    }
  },

  async loadEvent({ dispatch, commit }, { params = { setting: true }, id }) {
    if (!id) {
      id = state.selectedEvent.event_id
    }

    let payload = {
      id,
      params
    }
    try {
      commit(mutationTypes.LOAD_EVENT_REQUEST)
      const resp = await loadEvent(payload)
      const event = resp.data.event
      event.checkpoints = resp.data.checkpoint
      event.stickers = resp.data.stickers

      // EventBus.$emit('change-loader-state', false)
      if (_.filter(event.checkpoints, (o) => { return o.checkpoint_overlay_id > 0 }).length === 0) {
        getEventOverlay(event.event_id, event.overlay_id).then(resp => {
          state.eventOverlay = resp.data.event
          if (_.isEmpty(resp.data.event.overlay)) {
            state.eventOverlay.overlay = defaultOverlayObj
          }
        })
      } else {
        getOverlayByCheckpoint(event.event_id, event.checkpoints[0].checkpoint_id).then(resp => {
          console.log('loadEvent', resp)
          state.eventOverlay = resp.data.overlayData
          if (_.isEmpty(resp.data.overlayData.overlay)) {
            state.eventOverlay.overlay = defaultOverlayObj
          }
        })
      }

      dispatch('Events/selectEvent', event, { root: true })
      dispatch('EventCheckpoint/setCheckpoint', resp.data.checkpoint, { root: true })
      dispatch('EventRunner/setTotalRunner', resp.data.runner, { root: true })
      dispatch('EventCheckpoint/changeSelectedCheckpointInOverlay', event.checkpoints[0].checkpoint_id, { root: true })
      dispatch('EventCheckpoint/setOverlayId', event.checkpoints[0].checkpoint_overlay_id, { root: true })

      commit(mutationTypes.LOAD_EVENT_SUCCESS, event)
    } catch (err) {
      commit(mutationTypes.LOAD_EVENT_ERROR, err)
      console.log(err)
    }
  },

  selectEvent({ dispatch, commit }, payload) {
    commit(mutationTypes.SELECT_EVENT, payload)
    dispatch('EditEvent/setEvent', payload, { root: true })
  },

  // TODO: Update as above approach
  async createEvent({ dispatch, commit }, payload) {
    try {
      commit(mutationTypes.CREATE_EVENT_REQUEST)

      const resp = await createEvent(payload)

      dispatch('Events/loadEvents', { setting: true }, { root: true }).then(() => {
        const tempEvent = resp.data.event
        tempEvent.checkpoints = resp.data.checkpoint
        commit(mutationTypes.CREATE_EVENT_SUCCESS, tempEvent)
        // dispatch('EditEvent/setEvent', tempEvent, { root: true })
        // dispatch('EventCheckpoint/setCheckpoint', resp.data.checkpoint, { root: true })
        // dispatch('EventRunner/setTotalRunner', resp.data.runner, { root: true })
      })

    } catch (err) {
      console.log('error', err.response)
      commit(mutationTypes.CREATE_EVENT_ERROR, err)

      if (err.response.status === 409) {
        Vue.toasted.global.subdomain_not_available()
      }
      EventBus.$emit('start-create-event')
    }
  },
  async duplicateEvent({ dispatch, commit }, payload) {
    try {
      EventBus.$emit('change-loader-state', true)
      commit(mutationTypes.CREATE_EVENT_REQUEST)

      const resp = await duplicateEvent(payload)

      dispatch('Events/loadEvents', { setting: true }, { root: true }).then(() => {
        const tempEvent = resp.data.event
        tempEvent.checkpoints = resp.data.checkpoint
        commit(mutationTypes.CREATE_EVENT_SUCCESS, tempEvent)
        // dispatch('EditEvent/setEvent', tempEvent, { root: true })
        // dispatch('EventCheckpoint/setCheckpoint', resp.data.checkpoint, { root: true })
        // dispatch('EventRunner/setTotalRunner', resp.data.runner, { root: true })
        EventBus.$emit('change-loader-state', false)
      })

    } catch (err) {
      console.log('error', err.response)
      commit(mutationTypes.CREATE_EVENT_ERROR, err)

      if (err.response.status === 409) {
        Vue.toasted.global.subdomain_not_available()
      }
      EventBus.$emit('start-create-event')
      EventBus.$emit('change-loader-state', false)
    }
  },

  async deleteEvent({ commit }, payload) {
    try {
      commit(mutationTypes.DELETE_EVENT_REQUEST)
      await deleteEvent(payload)

      commit(mutationTypes.DELETE_EVENT_SUCCESS, payload)

      router.push({ name: 'Dashboard' })
    } catch (err) {
      commit(mutationTypes.DELETE_EVENT_ERROR)
    }
  },

  async setEventDomain({ commit, state }, payload) {
    try {
      commit(mutationTypes.SET_EVENT_DOMAIN_REQUEST)
      const resp = await setEventDomain(state.selectedEvent.event_id, payload)
      commit(mutationTypes.SET_EVENT_DOMAIN_SUCCESS, resp)
    } catch (err) {
      commit(mutationTypes.SET_EVENT_DOMAIN_ERROR, err)

      if (err.response.status === 409) {
        Vue.toasted.global.subdomain_not_available()
      }
    }
  },

  async setEventState({ commit, state }, { eventId, eventState }) {
    let id = eventId || state.selectedEvent.event_id
    try {
      commit(mutationTypes.SET_EVENT_STATE_REQUEST)
      await setEventState(id, eventState)

      commit(mutationTypes.SET_EVENT_STATE_SUCCESS, {
        id,
        eventState
      })
    } catch (err) {
      commit(mutationTypes.SET_EVENT_STATE_ERROR, err)
    }
  },

  async setEventSetting({ commit, state }) {
    const changedSettings = this.getters['EditEvent/getEventSettingsRequestObject']

    let images = ['logo', 'right', 'left', 'center', 'sponsor', 'stickers']
    let hasImageUploads = Object.keys(changedSettings).some(setting => {
      return images.includes(setting)
    })
    try {
      if (hasImageUploads) {
        EventBus.$emit('image-upload-component')
      }

      commit(mutationTypes.SET_EVENT_SETTING_REQUEST)
      const resp = await setEventSetting(state.selectedEvent.event_id, changedSettings)
      console.log('resp: ', resp)
      // resp.data.setting.stickers = "hehehe"
      console.log('changedSettings: ', changedSettings)
      commit(mutationTypes.SET_EVENT_SETTING_SUCCESS, resp)
    } catch (err) {
      commit(mutationTypes.SET_EVENT_SETTING_ERROR, err)
    }
  },

  async setEventColorScheme({ commit, state }) {
    const changedSettings = this.getters['EditEvent/getEventSettingsRequestObject']
    try {
      commit(mutationTypes.SET_EVENT_SETTING_REQUEST)
      const resp = await setEventSetting(state.selectedEvent.event_id, changedSettings)
      commit(mutationTypes.SET_EVENT_COLOR_SCHEME, resp)
    } catch (err) {
      commit(mutationTypes.SET_EVENT_SETTING_ERROR, err)
    }
  },

  async setEventStickers({ commit, state }, payload) {
    console.log(`setEventStickers ${payload}`)
    try {
      commit(mutationTypes.SET_EVENT_STICKERS_REQUEST)
      const resp = await setEventStickers(state.selectedEvent.event_id, payload)
      commit(mutationTypes.SET_EVENT_STICKERS, resp)
    } catch (err) {
      commit(mutationTypes.SET_EVENT_SETTING_ERROR, err)
    }
    state.eventStickers[key] = value
    dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
  },

  async getEventContent({ commit, state, dispatch }, {
    eventId,
    recent = false,
    thumbnail = true,
    start = 1,
    limit = this.getters['PhotosFilter/getMaxPhotosPerPage'],
    order = 'desc',
    status = 'all',
    checkpoint = this.getters['EventCheckpoint/getCurrentCheckpoint'] || 0,
  }) {
    let id = eventId || state.selectedEvent.event_id
    try {
      const respC = await getCheckpoint({ id })
      dispatch('EventCheckpoint/setCheckpoint', respC.data.checkpoints, { root: true })

      commit(mutationTypes.LOAD_EVENT_CONTENT_REQUEST, { id, recent, thumbnail, start, limit, order, state: status, checkpoint })
      const resp = await getEventContent({ id, recent, thumbnail, start, limit, order, state: status, checkpoint })
      dispatch('Events/getEventContentSummary', { id, checkpoint }, { root: true })
      commit(mutationTypes.LOAD_EVENT_CONTENT_SUCCESS, resp.data.event.contents)

      start = 1
      limit = 100000
      status = 'all'
      checkpoint = 0
      const allResp = await getEventContent({id, recent, thumbnail, start, limit, order, state: status, checkpoint})
      dispatch('changeAllPhotos', allResp.data.event.contents, { root: true })
      // dispatch('EventCheckpoint/updateCheckpointFilter', allResp.data.event.contents , {root: true})
    } catch (err) {
      console.log(err)
    }
  },

  async getEventContentSummary({ commit, state, dispatch }, {
    eventId, checkpoint
  }) {
    let id = eventId || state.selectedEvent.event_id
    try {
      commit(mutationTypes.LOAD_EVENT_CONTENT_SUMMARY_REQUEST)

      const resp = await getEventContentSummary({ id, checkpoint })

      commit(mutationTypes.LOAD_EVENT_CONTENT_SUMMARY_SUCCESS, resp)
      dispatch('resetRecentImage', resp.data.summary.length > 0 ? resp.data.summary[0].recent || 0 : 0, { root: true })
    } catch (err) {
      console.log(err)
    }
  },

  async deleteEventContent({ dispatch, commit, state }, { eventId, objectId, singleImage = false }) {
    let selectedImages = objectId || this.getters.getSelectedImagesObjects
    try {
      commit(mutationTypes.DELETE_EVENT_CONTENT_REQUEST)
      await deleteEventContent({
        eventId,
        selectedImages
      })
      commit(mutationTypes.DELETE_EVENT_CONTENT_SUCCESS, { selectedImages, singleImage })

      dispatch('Events/getEventContent', {
        eventId: eventId,
        recent: state.eventContentSettings.recent,
        thumbnail: state.eventContentSettings.thumbnail,
        start: state.eventContentSettings.start,
        offset: state.eventContentSettings.offset,
        order: state.eventContentSettings.order,
        status: state.eventContentSettings.state
      }, { root: true })

    } catch (err) {
      commit(mutationTypes.DELETE_EVENT_CONTENT_ERROR)
      console.log(err)
    }
  },

  async setEventContentState({ dispatch, commit, state }, payload) {
    try {
      commit(mutationTypes.SET_EVENT_CONTENT_STATE_REQUEST)
      const resp = await setEventContentState({
        id: payload.id,
        state: payload.state,
        objects: payload.objectId || this.getters.getSelectedImagesObjects.map(object => object.object_id)
      })

      commit(mutationTypes.SET_EVENT_CONTENT_STATE_SUCCESS, resp)
      dispatch('Events/getEventContent', {
        eventId: payload.id,
        recent: state.eventContentSettings.recent,
        thumbnail: state.eventContentSettings.thumbnail,
        start: state.eventContentSettings.start,
        offset: state.eventContentSettings.offset,
        order: state.eventContentSettings.order,
        status: state.eventContentSettings.state
      }, { root: true })
      return resp
    } catch (err) {
      console.log(err)

      commit(mutationTypes.SET_EVENT_CONTENT_STATE_ERROR)
    }
  },

  async getEventStats({ commit, state }, payload) {
    let id = payload || state.selectedEvent.event_id
    try {
      commit(mutationTypes.LOAD_EVENTS_STATS_REQUEST)

      const resp = await getEventStats(id)

      commit(mutationTypes.LOAD_EVENTS_STATS_SUCCESS, resp.data.data)
    } catch (err) {
      console.log(err)
      commit(mutationTypes.LOAD_EVENTS_STATS_ERROR, err)
    }
  },

  async setEventFinishTimeOverlay({ state, dispatch }, { key, value }) {
    console.log('setEventFinishTimeOverlay', key, value)
    state.selectedEvent.finish_time_overlay_enabled = value

    dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
    dispatch('EditEvent/changeEventValues', {
      fieldName: 'finish_time_overlay_enabled',
      fieldValue: value
    }, { root: true })
  },

  async setEventSameOverlay({ state, dispatch }, { key, value }) {
    console.log('setEventSameOverlay', key, value)
    state.selectedEvent.finish_time_overlay_enabled = value

    dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
    dispatch('EditEvent/changeEventValues', {
      fieldName: 'same_overlay',
      fieldValue: value
    }, { root: true })
  },

  async setEventOverlayValue({ state, dispatch }, { key, value }) {
    console.log('setEventOverlayValue', key, value)
    switch (key) {
      case 'enabled':
        state.eventOverlay[key] = value
        dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
        break;
      case 'left':
        state.eventOverlay.overlay[key].position = value
        dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
        break;
      case 'right':
        state.eventOverlay.overlay[key].position = value
        dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
        break;
      case 'center':
        state.eventOverlay.overlay[key].position = value
        dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
        break;
      case 'margin':
      case 'position':
        state.eventOverlay.overlay[key] = value
        dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
        break;
      case 'mask_enabled':
        state.eventOverlay.overlay[key] = value
        dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
        break;
      case 'color':
      case 'opacity':
        state.eventOverlay.overlay.mask[key] = value
        dispatch('EditEvent/changeIsDifferentValues', true, { root: true })
        break;
      default:
        break;
    }
  },

  async resetEventOverlayValue({ state }) {
    if (this.getters['EditEvent/getEventSettingsRequestObject'].same_overlay) {
      getEventOverlay(state.selectedEvent.event_id, state.selectedEvent.overlay_id).then(resp => {
        resp.data.event.enabled = state.eventOverlay.enabled != null && state.eventOverlay.enabled !== undefined ? state.eventOverlay.enabled : true
        resp.data.event.finish_time_overlay_enabled = state.eventOverlay.finish_time_overlay_enabled != null && state.eventOverlay.finish_time_overlay_enabled !== undefined ? state.eventOverlay.finish_time_overlay_enabled : false
        return resp
      }).then(resp => {
        state.eventOverlay = resp.data.event
        if (_.isEmpty(resp.data.event.overlay)) {
          state.eventOverlay.overlay = defaultOverlayObj
        }
      })
    } else {
      const selectedCheckpoint = this.getters['EventCheckpoint/getSelectedCheckpointInOverlay']
      await getOverlayByCheckpoint(state.selectedEvent.event_id, selectedCheckpoint).then(resp => {
        console.log('resetEventOverlayValue', resp)
        state.eventOverlay = resp.data.overlayData
        if (_.isEmpty(resp.data.overlayData.overlay)) {
          state.eventOverlay.overlay = defaultOverlayObj
        }
      })
    }
  },

  async getEventOverlayWhenSelectCheckpoint({ state }) {
    const selectedCheckpoint = this.getters['EventCheckpoint/getSelectedCheckpointInOverlay']

    await getOverlayByCheckpoint(state.selectedEvent.event_id, selectedCheckpoint).then(resp => {
      console.log('getEventOverlayWhenSelectCheckpoint', resp)
      resp.data.overlayData.enabled = state.eventOverlay.enabled != null && state.eventOverlay.enabled !== undefined ? state.eventOverlay.enabled : true
      resp.data.overlayData.finish_time_overlay_enabled = state.eventOverlay.finish_time_overlay_enabled != null && state.eventOverlay.finish_time_overlay_enabled !== undefined ? state.eventOverlay.finish_time_overlay_enabled : false
      return resp
    }).then(resp => {
      state.eventOverlay = resp.data.overlayData
      console.log('getEventOverlayWhenSelectCheckpoint', resp)
      if (_.isEmpty(resp.data.overlayData.overlay)) {
        state.eventOverlay.overlay = defaultOverlayObj
      }
    })
  },

  async getOverlayByEvent({ state }) {

    await getEventOverlay(state.selectedEvent.event_id, state.selectedEvent.overlay_id).then(resp => {
      resp.data.event.enabled = state.eventOverlay.enabled ? state.eventOverlay.enabled : true
      resp.data.event.finish_time_overlay_enabled = state.eventOverlay.finish_time_overlay_enabled ? state.eventOverlay.finish_time_overlay_enabled : false
      return resp
    }).then(resp => {
      state.eventOverlay = resp.data.event
      if (_.isEmpty(resp.data.event.overlay)) {
        state.eventOverlay.overlay = defaultOverlayObj
      }
    })
  },

  async setEventOverlay({ commit, state, dispatch }, { overlayRequest, emit = false }) {
    try {
      let id = state.selectedEvent.event_id
      let checkpointId = this.getters['EventCheckpoint/getSelectedCheckpointInOverlay']
      console.log(`setEventOverlay - ${id}, checkpoint: ${checkpointId}`)
      if (checkpointId) {
        commit(mutationTypes.SET_EVENT_OVERLAY_MEDIA_REQUEST)
        const resp = await setOverlayByCheckpoint({ overlayRequest, id, checkpointId })
        if (resp.data.success) {
          dispatch('Events/getCheckpoint', dispatch, { root: true })
        }
        if (emit) {
          commit(mutationTypes.SET_EVENT_OVERLAY_MEDIA_SUCCESS, { resp, dispatch })
        }
        return resp.data.success
      }
    } catch (err) {
      console.log(err)
      commit(mutationTypes.SET_EVENT_OVERLAY_MEDIA_ERROR)
    }
  },

  async getMedia({ commit, state, dispatch }, eventId) {
    let id = eventId || state.selectedEvent.event_id
    try {
      const resp = await getMedia(id)
      EventBus.$emit('loadEvent(' + eventId + ')Media', resp.data.media)
    } catch (err) {
      console.log(err)
    }
  },
  async getSales({ commit, state, dispatch }, eventId) {
    let id = eventId || state.selectedEvent.event_id
    try {
      const resp = await getSales(id)
      EventBus.$emit('loadEvent(' + eventId + ')Sales', resp.data)
    } catch (err) {
      console.log(err)
    }
  },
  async setRunner({ commit, state }, runnerRequest) {
    let id = state.selectedEvent.event_id
    try {
      commit(mutationTypes.SET_RUNNER_REQUEST)
      await setRunner({ runnerRequest, id })
      commit(mutationTypes.SET_RUNNER_SUCCESS)
    } catch (err) {
      console.log(err)
      commit(mutationTypes.SET_RUNNER_ERROR)
    }
  },

  async addRunner({ commit, state }, runnerRequest) {
    let id = state.selectedEvent.event_id
    try {
      commit(mutationTypes.ADD_RUNNER_REQUEST)
      const resp = await addRunner({ runnerRequest, id })
      EventBus.$emit('refresh-runner')
      commit(mutationTypes.ADD_RUNNER_SUCCESS)
    } catch (err) {
      console.log(err)
      commit(mutationTypes.ADD_RUNNER_ERROR)
    }
  },

  async deleteRunner({ commit, state }, runnerId) {
    let id = state.selectedEvent.event_id
    try {
      commit(mutationTypes.DELETE_RUNNER_REQUEST)
      const resp = await deleteRunner({ id, runnerId })
      EventBus.$emit('refresh-runner')
      commit(mutationTypes.DELETE_RUNNER_SUCCESS)
    } catch (err) {
      console.log(err)
      commit(mutationTypes.DELETE_RUNNER_ERROR)
    }
  },

  // async cancelPreviewRequest({ commit, state }) {
  //   let resp = await cancelOverlayPreviewCall()
  //   resp += await cancelFinishTimeOverlayPreviewCall()
  //   return resp
  // },

  async getOverlayPreview({ commit, state }) {
    try {
      let resp = await cancelOverlayPreviewCall()
      resp += await cancelFinishTimeOverlayPreviewCall()
      const id = this.getters['EventCheckpoint/getOverlayId'] ? this.getters['EventCheckpoint/getOverlayId'] : -1
      await Promise.all([getOverlayPreview({ id }), getFinishTimeOverlayPreview({ image: 'horizontal.jpg' }), getFinishTimeOverlayPreview({ image: 'vertical.jpg' })].map(p => p.catch(e => e)))
        .then(results => {
          console.log("results------------->", results)
          console.log(`id: ${id}`)
          let overlay = results && results[0] && results[0].data && results[0].data.images ? results[0].data.images : null
          let horizontalImage = results[1] && results[1].data ? results[1].data.data.result.image_url : null
          let verticalImage = results[2] && results[2].data ? results[2].data.data.result.image_url : null
          if (!overlay || !horizontalImage || !verticalImage) {
            EventBus.$emit('get-overlay-preview-failed')
          } else {
            EventBus.$emit('get-overlay-preview', {
              overlay,
              finishTimeOverlay: [horizontalImage, verticalImage]
            })
          }
        })

      // const resp = await getOverlayPreview({id})
      // const finishTimeOverlayResp = await getFinishTimeOverlayPreview({image: 'horizontal.jpg'})
      // const finishTimeOverlayResp2 = await getFinishTimeOverlayPreview({image: 'vertical.jpg'})
      // EventBus.$emit('get-overlay-preview', {
      // overlay: resp.data.images,
      // finishTimeOverlay: [finishTimeOverlayResp.data.data.result.image_url, finishTimeOverlayResp2.data.data.result.image_url]
      // })
    } catch (err) {
      console.log(err)
      EventBus.$emit('get-overlay-preview-failed')
    }
  },

  async getCheckpoint({ commit, state, dispatch }) {
    EventBus.$emit('change-loader-state', true)
    try {
      let id = state.selectedEvent.event_id
      const resp = await getCheckpoint({ id })
      dispatch('EventCheckpoint/setCheckpoint', resp.data.checkpoints, { root: true })
      EventBus.$emit('change-loader-state', false)
    } catch (err) {
      EventBus.$emit('change-loader-state', false)
    }
  },

  async setCheckpoint({ commit, state, dispatch }, checkpointRequest) {
    let id = state.selectedEvent.event_id
    try {
      commit(mutationTypes.SET_CHECKPOINT_REQUEST)
      const resp = await setCheckpoint({ checkpointRequest, id })
      commit(mutationTypes.SET_CHECKPOINT_SUCCESS)
      dispatch('getEventContent', {
        eventId: id
      })
    } catch (err) {
      console.log(err)
      commit(mutationTypes.SET_CHECKPOINT_ERROR)
    }
  },

  async setImagesCheckpoint({ commit, state, dispatch }, checkpointId) {
    let id = state.selectedEvent.event_id
    let imageIdArray = this.getters.getSelectedImagesObjects.map(item => item.object_id)
    try {
      commit(mutationTypes.SET_CHECKPOINT_REQUEST)
      const resp = await setImagesCheckpoint({ id, checkpointId, imageIdArray })
      commit(mutationTypes.SET_CHECKPOINT_SUCCESS)
      EventBus.$emit('exit-select-mode')
      dispatch('getEventContent', {
        eventId: id
      })
      // dispatch('EventCheckpoint/setCheckpoint', resp.data.checkpoints, {root: true})
    } catch (err) {
      console.log(err)
      commit(mutationTypes.SET_CHECKPOINT_ERROR)
    }
  },

  async sendReviewLinkEmail({ commit, state, dispatch }, payload) {
    let id = state.selectedEvent.event_id
    try {
      commit(mutationTypes.SHARE_REVIEW_LINK_REQUEST)
      const resp = await sendReviewLinkEmail({ id, payload })
      commit(mutationTypes.SHARE_REVIEW_LINK_SUCCESS)
    } catch (err) {
      console.log(err)
      commit(mutationTypes.SHARE_REVIEW_LINK_ERROR)
    }
  },

  async sendEnquiryEmail({ commit, state }, payload) {
    const resp = await sendEnquiryEmail(payload)
  },

  changeGalleryUrlLockState({ commit }, payload) {
    commit(mutationTypes.CHANGE_GALLERY_URL_LOCK_STATE, payload)
  },

  setEventContent({ state }, payload) {
    state.eventContent = payload
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
