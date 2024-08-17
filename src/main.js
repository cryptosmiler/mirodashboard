// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue'
import Toasted from 'vue-toasted'
import VuePassword from 'vue-password'
import './assets/custom.scss'
import { i18n } from './plugins/i18n'

import Filters from '@/utils/formatter'

import { sendVerificationCode } from '@/api'
import BootstrapMaterialDesign from 'bootstrap-material-design'
import router from './router'
import store from './store'
import SignInModal from './components/SignInModal'
import MenuBar from './components/MenuBar'
import SideBar from './components/SideBar'
import EditEventSideComponent from './components/EditEvent/EditEventSideComponent'
import EditEventSideComponentTextInput from './components/EditEvent/EditEventSideComponentTextInput'
import EditEventSideComponentRadioButton from './components/EditEvent/EditEventSideComponentRadioButton'
import PasswordHelp from './views/PasswordHelp'
import ColorPicker from './components/ColorPicker'
import ImagePreview from './components/EditEvent/ImagePreview'
import ImageUploadComponent from './components/ImageUploadComponent'
import CreateEventModal from './components/CreateEventModal'

/* Vue Font Awesome */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
// import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
// library.add(fad);
library.add(fab);

Vue.component("font-awesome-icon", FontAwesomeIcon);
config.styleDefault = "duotone";



Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(BootstrapMaterialDesign)
Vue.use(Toasted)

/* Register globals filters */ 
Vue.mixin({
  filters: Filters
});

Vue.toasted.register('event_not_found', 'Event Not Found', {
  duration: 3000,
  fullWidth: true,
  type: 'error',
  icon: 'error_outline',
  theme: 'bubble',
  className: 'event-not-found',
  position: 'bottom-center'
})

Vue.toasted.register('link_copied', 'URL Copied to Clipboard!', {
  duration: 3000,
  fullWidth: true,
  type: 'success',
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center'
})

Vue.toasted.register('logs_copied', 'Filename(s) Copied to Clipboard!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center'
})

Vue.toasted.register('email_not_verified', ' ', {
  duration: 20000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  action: [
    {
      text: 'Check your email to verify your account or click here to resend Verification Link',
      onClick: (e, toastObject) => {
        sendVerificationCode()
        Vue.toasted.global.check_email()
      }
    },
    {
      icon: 'close',
      onClick: (e, toastObject) => {
        toastObject.goAway(0)
      }
    }
  ]
})

Vue.toasted.register('email_verified', 'Email Verified!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center'
})

Vue.toasted.register('check_email', 'Check Your email for the code!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center'
})

Vue.toasted.register('password_reset', 'Your password has been successfully changed!', {
  duration: 10000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center'
})

Vue.toasted.register('password_reset_error', 'Please check your passwords and try again', {
  duration: 5000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center'
})

Vue.toasted.register('subdomain_not_available', 'Subdomain not available. Please try a different subdomain name', {
  duration: 5000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('information_updated', 'Your changes have been updated!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('user_removed', 'A user has been removed!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('role_changed', 'A user role has been changed!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('images_uploaded', 'Your images have been uploaded!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('images_processed', 'Your images have been processed!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('images_upload_fail', 'Failed to upload image', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('csv_uploaded', 'Your CSV have been uploaded!', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('csv_upload_failed', 'Failed to upload CSV', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('csv_wrong_file_type', 'Incorrect filetype, please upload a CSV type file', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('information_updated_error', 'There was an error updating. Please try again', {
  duration: 5000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('runner_added', 'New runners added successfully', {
  duration: 5000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('runner_added_error', 'Failed to add new runners. Please try again', {
  duration: 5000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('share_review_link', 'review link shared successfully', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('share_review_link_error', 'Failed to share review link, Please try again', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  singleton: true
})


Vue.toasted.register('upload_in_progress', 'Upload In Progress', {
  duration: 3000,
  fullWidth: true,
  type: 'error',
  icon: 'error_outline',
  theme: 'bubble',
  className: 'event-not-found',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('payment_method_error', 'There was an error. Please try again', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('payment_method_success', 'Payment Method updated', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('adding_payment_method_success', 'A Payment Method has been added', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('perform_payment_failed', 'There was an error. Please try again', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'verify-email',
  position: 'bottom-center',
  singleton: true
})

Vue.toasted.register('perform_payment_success', 'Process payment successfully', {
  duration: 3000,
  fullWidth: true,
  theme: 'bubble',
  className: 'link-copied',
  position: 'bottom-center',
  singleton: true
})
Vue.config.productionTip = false

// Components
Vue.component(VuePassword)
Vue.component('SignInModal', SignInModal)
Vue.component('PasswordHelp', PasswordHelp)
Vue.component('MenuBar', MenuBar)
Vue.component('SideBar', SideBar)
Vue.component('ColorPicker', ColorPicker)
Vue.component('EditEventSideComponent', EditEventSideComponent)
Vue.component('EditEventSideComponentTextInput', EditEventSideComponentTextInput)
Vue.component('EditEventSideComponentRadioButton', EditEventSideComponentRadioButton)
Vue.component('ImagePreview', ImagePreview)
Vue.component('ImageUploadComponent', ImageUploadComponent)
Vue.component('CreateEventModal', CreateEventModal)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: { App },
})
