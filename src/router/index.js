/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'
import multiguard from 'vue-router-multiguard'

import store from '@/store'

import Billing from '@/views/Billing'
import Balance from '@/views/Balance'
import Prepay from '@/views/Prepay'
import CreateEvent from '@/views/CreateEvent'
import Dashboard from '@/views/Dashboard'
import Events from '@/views/Events'
import EventSettings from '@/views/EventSettings'
import EventSharing from '@/views/EventSharing'
import EventPhotos from '@/views/EventPhotos'
import EventUpload from '@/views/EventUpload'
import EventRunners from '@/views/EventRunners'
import EventBib from '@/views/EventBib'
import EventDetails from '@/views/EventDetails'
import EventGallery from '@/views/EventGallery'
import EventGalleryOverlay from '@/views/EventGalleryOverlay'
import EventVips from '@/views/EventVips'
import EmailConfirm from '@/views/EmailConfirm'
import PasswordHelp from '@/views/PasswordHelp'
import Profile from '@/views/Profile'
import SubAccount from '@/views/SubAccount'
import SignIn from '@/views/SignIn'
import SignUp from '@/views/SignUp'
import InviteUser from '@/views/InviteUser'
import FreeUploadPhoto from '@/views/FreeUploadPhoto'

Vue.use(Router)

/**
 * @see https://router.vuejs.org/en/advanced/navigation-guards.html
 *
 * Redirect to dashboard if already authenticated.
 * Used to guard auth pages(ex. sign-up, sign-in) from authenticated users
 */
const redirectIfAuthenticated = async (to, from, next) => {
  if (store.getters['Auth/authenticated']) {
    if (store.getters['Auth/profile'].email === process.env.UPLOAD_USER){
      next()
      return
    }
    next({ name: 'Dashboard' })
    return
  }

  next()
}

/**
 * @see https://router.vuejs.org/en/advanced/navigation-guards.html
 *
 * Redirect to sign-in page if not authenticated.
 * Used to guard dashboard pages from unauthenticated users
 */
const redirectIfNotAuthenticated = async (to, from, next) => {
  if(store.getters['Auth/profile'].email === process.env.UPLOAD_USER){
    next({ name: 'SignIn' })
    return
  }
  if (!store.getters['Auth/authenticated']) {
    next({ name: 'SignIn' })
    return
  }
  next()
}

/**
 * Redirect to Dashboard if role === 1
 */
const checkRoleOutEvent = (to, from, next) => {
  if (store.getters['Auth/profile'].role === 0) {
    next()
    return
  }else{
    next({ name: 'Dashboard' })
    return
  }
}
/**
 * Redirect to EventPhotos if role === 1 in Event part
 */
const checkRoleInEvent = (to, from, next) => {
  if (store.getters['Auth/profile'].role === 0) {
    next()
    return
  }else if(store.getters['Auth/profile'].status === true) {
    next({ name: 'EventPhotos' , params: { id: to.params.id }})
    return
  }else{
    next({ name: 'Dashboard' })
    return
  }
}

/**
 * Redirect to dashboard if event id does not exist with user
 */

const validEventId = (to, from, next) => {
  const hasEventId = (event) => {
    if(event.event_id == to.params.id) {
      store.dispatch('Events/selectEvent', event)
      return true
    }
  }
  if(store.getters['Events/getEvents'].length === 0){
    store.dispatch('Events/loadEvents').then((resp) => {

      if (!store.getters['Events/getEvents'].some(hasEventId)) {
        Vue.toasted.global.event_not_found()

        next({name: 'Dashboard'})

      }
      store.dispatch('Events/loadEvent', {id:to.params.id})
      next()
    })
  } else if (!store.getters['Events/getEvents'].some(hasEventId)) {
    Vue.toasted.global.event_not_found()

    next({name: 'Dashboard'})
  } else {
    store.dispatch('Events/loadEvent', {id:to.params.id})
    next()
  }
}


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      beforeEnter: redirectIfAuthenticated
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: redirectIfAuthenticated
    },
    {
      path: '/passwordhelp',
      name: 'PasswordHelp',
      component: PasswordHelp,
      beforeEnter: redirectIfAuthenticated
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Events,
      beforeEnter: multiguard([redirectIfNotAuthenticated])
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: multiguard([redirectIfNotAuthenticated])
    },
    {
      path: '/billing',
      name: 'Billing',
      component: Billing,
      beforeEnter: multiguard([redirectIfNotAuthenticated, checkRoleOutEvent])
    },
    {
      path: '/balance',
      name: 'Balance',
      component: Balance,
      beforeEnter: multiguard([redirectIfNotAuthenticated, checkRoleOutEvent])
    },
    {
      path: '/subaccount',
      name: 'SubAccount',
      component: SubAccount,
      beforeEnter: multiguard([redirectIfNotAuthenticated, checkRoleOutEvent])
    },
    {
      path: '/prepay',
      name: 'Prepay',
      component: Prepay,
      beforeEnter: multiguard([redirectIfNotAuthenticated, checkRoleOutEvent])
    },
    {
      path: '/events/:id',
      name: 'Event',
      component: Dashboard,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId])
    },
    {
      path: '/events/:id/settings',
      name: 'EventSettings',
      component: EventSettings,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId])
    },
    // {
    //   path: '/events/:id/sharing',
    //   name: 'EventSharing',
    //   component: EventSharing,
    //   beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId])
    // },
    {
      path: '/events/:id/photos',
      name: 'EventPhotos',
      component: EventPhotos,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId])
    },
    {
      path: '/events/:id/upload',
      name: 'EventUpload',
      component: EventUpload,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId])
    },
    {
      path: '/events/:id/runners',
      name: 'EventRunners',
      component: EventRunners,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId])
    },
    {
      path: '/events/:id/bib',
      name: 'EventBib',
      component: EventBib,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId, checkRoleInEvent])
    },
    {
      path: '/events/:id/details',
      name: 'EventDetails',
      component: EventDetails,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId, checkRoleInEvent])
    },
    {
      path: '/events/:id/gallery',
      name: 'EventGallery',
      component: EventGallery,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId])
    },
    {
      path: '/events/:id/overlay',
      name: 'EventGalleryOverlay',
      component: EventGalleryOverlay,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId])
    },
    {
      path: '/events/:id/vips',
      name: 'EventVips',
      component: EventVips,
      beforeEnter: multiguard([redirectIfNotAuthenticated, validEventId, checkRoleInEvent])
    },
    {
      path: '/bib',
      name: 'BibTest',
      component: EventBib,
      beforeEnter: multiguard([redirectIfNotAuthenticated, checkRoleOutEvent])
    },
    {
      path: '/create',
      name: 'CreateEvent',
      component: CreateEvent,
      beforeEnter: multiguard([redirectIfNotAuthenticated, checkRoleOutEvent])
    },
    {
      path: '/confirmemail',
      name: 'EmailConfirm',
      component: EmailConfirm
    },
    {
      path: '/invite/:email/:password',
      name: 'InviteUser',
      component: InviteUser,
    },
    {
      path: '/upload/:link',
      name: 'FreeUploadPhoto',
      component: FreeUploadPhoto,
    }
  ]
})
