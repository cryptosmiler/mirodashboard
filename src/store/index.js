import Vue from 'vue'
import Vuex from 'vuex'

import Auth from './modules/Auth'
import AccountCurrentView from './modules/AccountCurrentView'
import CreateEvent from './modules/CreateEvent'
import EditEvent from './modules/EditEvent'
import EditEventSideMenuCurrentTab from './modules/EditEventSideMenuCurrentTab'
import EditEventPreviewType from './modules/EditEventPreviewType'
import Events from './modules/Events'
import ImageUploadComponent from './modules/ImageUploadComponent'
import PhotosFilter from './modules/PhotosFilter'
import PhotosSelect from './modules/PhotosSelect'
import PhotosUpload from './modules/PhotosUpload'
import EventRunner from './modules/EventRunner'
import EventCheckpoint from './modules/EventCheckpoint'
import Billing from './modules/Billing'
import Prices from './modules/Prices'
import LocalSettings from './modules/LocalSettings'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Auth,
    AccountCurrentView,
    CreateEvent,
    EditEvent,
    EditEventSideMenuCurrentTab,
    EditEventPreviewType,
    Events,
    ImageUploadComponent,
    PhotosFilter,
    PhotosSelect,
    PhotosUpload,
    EventRunner,
    EventCheckpoint,
    Billing,
    Prices,
    LocalSettings
  }
})
