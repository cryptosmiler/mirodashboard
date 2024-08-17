import axios from 'axios'

import { AUTH_TOKENS_STORAGE_KEY } from '@/constants'
import store from '@/store'
import storage from '@/utils/storage'
import * as urls from './urls'
import ConcurrencyManager from './ConcurrencyManager'
import platformHelper from '@/utils/platformHelper'

const default_body = {
  'platform_id': platformHelper.platform(),
  // 0= unconfirmed,
  // 2= MYLAPS,
  // 1= RT Client,
  // 3= myrace.photo,
  // 4= CPS
}

const axiosClient = axios.create({
  baseURL: "https://65os8plujb.execute-api.ap-southeast-1.amazonaws.com/prod/v1/",
  headers: {
    'Content-Type': 'application/json'
  },
  // timeout: 30000,
  transformRequest: [function (data, headers) {
    // console.log({
    //   headers,
    //   ...default_body,
    //   ...data,
    //   payload: data
    // })
    return {
      ...default_body,
      ...data,
      payload: data
    }
  },
  ...axios.defaults.transformRequest],
})
const CancelToken = axios.CancelToken
let cancelOverlayPreview
let cancelFinishTimeOverlayPreview

/**
 * Include auth token in header if exists
 */

const customRequestHandler = (config => {
  const { url } = config
  // console.log('customRequestHandler')
  // Exclude SignUp, SignIn, RefreshAuth requests from sending token
  if (![urls.SIGN_UP, urls.SIGN_IN, urls.REFRESH_AUTH].includes(url)) {
    const tokens = storage.load(AUTH_TOKENS_STORAGE_KEY)

    if (tokens) {
      config.headers.Authorization = `Bearer ${tokens.AccessToken}`
    }
  }

  return config
})

/**
 * Refresh token when response status code is 401.
 * It tries to refresh token just once.
 *
 * The flow of refreshing token is as follows:
 *  1. Intercept the failed response
 *  2. Check if status code is 401.
 *    2.1. If not 401, simply reject with current error.
 *    2.2. If 401, check if token refreshing api call is pending
 *      2.2.1. If pending, go to 2.3
 *      2.2.2. If not, dispatch token refreshing api call
 *    2.3. Add the caught request to the subscription list of token refreshing request.
 *  3. When token is refreshed, that is, refreshing api call is fulfilled,
 *    3.1. Retry the subscribed requests with new token
 *    3.2. Remove the fulfilled requests from subscription list
 */

let isRefreshingToken = false
let subscribers = []

const onRefreshedToken = tokens => {
  // Mark refreshing complete
  isRefreshingToken = false

  console.log(subscribers)

  // Persist new tokens to store
  store.dispatch('Auth/updateTokens', tokens)

  // Retry pending requests
  subscribers.forEach(callback => callback(tokens.AccessToken))

  // Clear pending requests
  subscribers = []
}

const addSubscriber = callback => {
  subscribers.push(callback)
}

const customResponseHandler = (error => {
  console.log(`error custom - responseHandler ${JSON.stringify(error)}`)
  if (!error) {
    return Promise.reject(error)
  }

  const {
    config: originalRequest,
    response: { status }
  } = error

  // console.log(`error custom - responseHandler ${status}`)
  if (status === 401) {
    if (!isRefreshingToken) {
      const tokens = storage.load(AUTH_TOKENS_STORAGE_KEY)

      if (!tokens || !tokens.RefreshToken) {
        return Promise.reject(error)
      }

      isRefreshingToken = true

      refreshAuth({
        refreshToken: tokens.RefreshToken
      }).then(resp => {
        const {
          result: { AccessToken }
        } = resp.data

        onRefreshedToken({
          AccessToken,
          RefreshToken: tokens.RefreshToken // Save the refresh token again
        })
      }).catch(e => {
        isRefreshingToken = false
        // If refresh token fails, force sign out
        store.dispatch('Auth/forceSignOut')
      })
    }

    const retryOriginalRequest = new Promise(resolve => {
      addSubscriber(accessToken => {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        resolve(axios(originalRequest))
      })
    })

    return retryOriginalRequest
  }

  return Promise.reject(error)
})

// a concurrency parameter of 1 makes all api requests secuential
const MAX_CONCURRENT_REQUESTS = 5
let manager = ConcurrencyManager(axiosClient, MAX_CONCURRENT_REQUESTS, customRequestHandler, customResponseHandler)


// //////////// //
//     AUTH     //
// //////////// //

/**
 * Sign up
 *
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.pasword
 * @param {string} payload.firstName
 * @param {string} payload.lastName
 *
 * @return Axios promise
 */
export const signUp = ({ email, password, firstName, lastName, company, company_url }) =>
  axiosClient.post(urls.SIGN_UP, {
    email,
    password,
    company,
    company_url,
    first_name: firstName,
    last_name: lastName
  })

/**
 * Sign up Sub Account
 *
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.pasword
 * @param {string} payload.firstName
 * @param {string} payload.lastName
 *
 * @return Axios promise
 */
export const signUpSubAccount = ({ email, password, firstName, lastName, role, company, company_url }) => {
  return axiosClient.post(urls.SIGN_UP_SUB, {
    email,
    password,
    role,
    company,
    company_url,
    first_name: firstName,
    last_name: lastName
  })
  .catch(error => {
    // Handle error response
    throw new Error(error);
  });
}

/**
 * Sign in
 *
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.pasword
 *
 * @return Axios promise
 */
export const signIn = ({ email, password, platform_id }) =>
  axiosClient.post(urls.SIGN_IN, {
    email,
    password,
    platform_id
  })

/**
 * Sign in
 *
 * @param {object} payload
 * @param {string} payload.TOTP
 * @param {string} payload.Session
 * @param {string} payload.Email
 *
 * @return Axios promise
 */
  export const sendTOTP = ({ TOTP, Session, Email, Password }) =>
  axiosClient.post(urls.SEND_TOTP, {
    TOTP,
    Session,
    Email,
    Password
  })
  
/**
 * Get MFA enabled
 *
 * @param {object} payload
 *
 * @return Axios promise
 */
export const getMfaEnabled = () => axiosClient.get(urls.GET_MFA_ENABLED)

/**
 * Disable MFA 
 *
 * @param {object} payload
 *
 * @return Axios promise
 */
export const disableMfa = () => axiosClient.post(urls.DISABLE_MFA)

/**
 * Refreshes the token
 *
 * @param {object} payload
 * @param {string} payload.refreshToken
 *
 * @return Axios promise
 */
export const refreshAuth = ({ refreshToken }) =>
  axiosClient.post(urls.REFRESH_AUTH, { refreshToken })

// //////////// //
//     USER     //
// //////////// //

/**
 * Get profile
 *
 * @return Axios promise
 */
export const getProfile = () => axiosClient.get(urls.USER_PROFILE)

/**
 * Put profile
 *
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.first_name
 * @param {string} payload.last_name
 * @param {string} payload.account_name
 * @param {string} payload.stripe_tenant_id
 * @param {string} payload.stripe_subscription_id
 *
 * @return Axios promise
 */
// eslint-disable-next-line
export const putProfile = ({ email, first_name, last_name, company, company_url, stripe_tenant_id, stripe_subscription_id }) => {
  return axiosClient.put(`${urls.USER_PROFILE}`, {
    email,
    first_name,
    last_name,
    company,
    company_url,
    stripe_tenant_id,
    stripe_subscription_id
  })
}


/**
 * Put profile
 *
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.first_name
 * @param {string} payload.last_name
 * @param {string} payload.account_name
 * @param {string} payload.stripe_tenant_id
 * @param {string} payload.stripe_subscription_id
 *
 * @return Axios promise
 */
// eslint-disable-next-line
export const putTenantProfile = ({ account_id, account_name, account_url, currency, timezone, language, watermark_overlay_id, client_brand_image_id }) => {
  return axiosClient.put(`${urls.USER_TENANT_PROFILE}`, {
    account_id,
    account_name,
    account_url,
    currency,
    timezone,
    language,
    watermark_overlay_id,
    client_brand_image_id,
  })
}

/**
 * get watermark overlay
 *
 * @param {object} payload
 *
 * @return Axios promise
 */
export const getWatermarkOverlay = ({ media_key }) =>
  axiosClient.post(urls.GET_WATERMARK_OVERLAY_TENANT, {
    media_key,
  })

  
/**
 * enable mfa
 *
 * @param {object} payload
 *
 * @return Axios promise
 */
export const enableMfa = ({ user_id }) =>
axiosClient.post(urls.ENABLE_MFA, {
  user_id,
})


export const verifyInitialPasscode = ({ initialpasscode }) =>
axiosClient.post(urls.VERIFY_INITIAL_PASSCODE, {
  initialpasscode,
})

/**
 * Put profile
 *
 * @param {object} payload
 *
 * @return Axios promise
 */

/**
 * Get all sub account
 *
 * @return Axios promise
 */
export const getAllSubAccount = () => axiosClient.get(`${urls.ALL_SUB_ACCOUNT}`)

/**
 * update sub account status
 *
 * @return Axios promise
 */
export const updateSubAccountStatus = ({ userId, status }) =>
  axiosClient.put(urls.UPDATE_SUB_ACCOUNT_STATE, {
    userId,
    status
  })

/**
 * remove sub account status
 *
 * @return Axios promise
 */
export const removeSubAccount = ({ userId }) =>
axiosClient.put(urls.REMOVE_SUB_ACCOUNT, {
  userId
})

/**
 * change sub account role
 *
 * @return Axios promise
 */
export const changeRole = ({ userId, role, tenant_id }) =>
axiosClient.put(urls.CHANGE_ROLE, {
  userId,
  role,
  tenant_id
})


/**
 * change sub account role
 *
 * @return Axios promise
 */
export const createUploadLink = ({ eventid, date_from, date_to, password, _passwordShow, _checkpoint_id }) =>
axiosClient.post(urls.CREATE_UPLOAD_LINK, {
  eventid,
  date_from,
  date_to,
  password,
  _passwordShow,
  _checkpoint_id
})

/**
 * change sub account role
 *
 * @return Axios promise
 */
export const shareUploadLink = ({ link_name, emails}) =>
axiosClient.post(urls.SHARE_UPLOAD_LINK, {
  link_name,
  emails
})

/**
 * change sub account role
 *
 * @return Axios promise
 */
export const updateUploadLink = ({ link_id, event_id, date_from, date_to, password, _passwordShow, _checkpoint_id }) =>
axiosClient.post(urls.UPDATE_UPLOAD_LINK, {
  link_id,
  event_id,
  date_from,
  date_to,
  password,
  _passwordShow,
  _checkpoint_id
})

/**
 * change sub account role
 *
 * @return Axios promise
 */
export const _getUploadLinkList = ({eventId}) => axiosClient.post(urls.GET_UPLOAD_LINK_LIST, {eventId})

/**
 * change sub account role
 *
 * @return Axios promise
 */
export const _getUploadLinkContent = ({_link}) => axiosClient.post(urls.GET_UPLOAD_LINK_CONTENT, {_link})


/**
 * Reset password
 *
 * @param {string} payload
 *
 * @return Axios promise
 *
 */
export const _changeUploadLinkStatus = ({status, link_id}) => axiosClient.post(`${urls.CHANGE_UPLOAD_LINK_STATUS}`, {status, link_id})


/**
 * Reset password
 *
 * @param {string} payload
 *
 * @return Axios promise
 *
 */
export const resetPassword = email => axiosClient.post(`${urls.RESET_PASSWORD}`, email)

/**
 * Reset password confirm
 *
 * @param {object} payload
 * @param {string} payload.email
 * @param {number} payload.code
 * @param {string} payload.password
 *
 * @return Axios promise
 *
 */
export const confirmResetPassword = ({ email, code, password }) =>
  axiosClient.post(
    `${urls.CONFIRM_RESET_PASSWORD}`,
    {
      email,
      code,
      password
    }
  )

/**
 * Change password
 *
 * @param {object} payload
 * @param {string} payload.old_password
 * @param {string} payload.new_password
 *
 * @return Axios promise
 *
 */

export const changePassword = ({ oldPassword, newPassword }) =>
  axiosClient.post(`${urls.CHANGE_PASSWORD}`, {
    old_password: oldPassword,
    new_password: newPassword
  })


/** Send Password Set Request for the new user created by admin
 * @param {object} payload
 * @param {string} payload.old_password
 * @param {string} payload.new_password
 * @param {string} payload.email
 */

export const __sendPasswordSetRequest = ({oldPassword, newPassword, email}) =>
  axiosClient.post(`${urls.SEND_PASSWORD_SET_REQUEST}`, {
    old_password: oldPassword,
    new_password: newPassword,
    _email: email
  })


/** Send Password Verify Request for the new user created by admin
 * @param {object} payload
 * @param {string} payload.old_password
 * @param {string} payload.email
 */

export const __sendPasswordVerifyRequest = ({oldPassword, email, platform_id}) =>
  axiosClient.post(`${urls.SEND_PASSWORD_VERIFY_REQUEST}`, {
    old_password: oldPassword,
    _email: email,
    _platform_id: platform_id
  })


/**
 * Send verification code
 *
 * @return Axios promise
 */
export const sendVerificationCode = () => axiosClient.post(urls.SEND_VERIFICATION_CODE)

/**
 * Send code with Access Token
 *
 * @param {object} payload
 * @param {string} payload.code
 *
 * @return Axios promise
 */

export const verifyEmail = (payload) => axiosClient.post(`${urls.VERIFY_EMAIL}`, { code: payload.code })

/**
 * Sign out
 *
 * @return Axios promise
 */
export const signOut = () => axiosClient.post(urls.SIGN_OUT)

// ////////////// //
//     EVENTS     //
// ////////////// //

/**
 * Load events
 *
 * @param {object} params
 * @param {boolean} params.setting  Optional. If TRUE, include settings in event response
 *
 * @return Axios promise
 */
export const loadEvents = params => axiosClient.get(urls.EVENTS, { params: params })

/**
 * Load single event
 *
 * @param {object} payload
 * @param {number} payload.id
 * @param {object} payload.params
 */

export const loadEvent = ({ id, params }) => axiosClient.get(`${urls.EVENTS}/${id}`, { params: params })

/**
 * Create an event
 *
 * @param {object} payload
 * @param {string} payload.domain
 * @param {string} payload.subdomain
 * @param {object} payload.setting
 * @param {number} payload.setting.theme_id ID of predefined theme to use
 * @param {string} payload.setting.title
 * @param {string} payload.setting.description
 * @param {string} payload.platform_id
 *
 * @return Axios promise
 */ 
export const createEvent = ({ domain, subdomain, setting, event_date, event_type, platform_id }) =>
  axiosClient.post(urls.EVENTS, {
    domain,
    subdomain,
    setting,
    event_date,
    event_type,
    platform_id
  })

/**
* Duplicate an event
*
* @param {number} eventId
*/

export const duplicateEvent = (payload) => axiosClient.post(`${urls.EVENTS}/duplicate`, payload)


/**
 * Set settings of event
 *
 * @param {number} eventId
 * @param {object} eventSetting
 */

export const setEventSetting = (eventId, eventSetting) => axiosClient.put(`${urls.EVENTS}/${eventId}/setting`, eventSetting)

/**
 * Set stickers
 *
 * @param {number} eventId
 * @param {object} stickerSetting
 */

export const setEventStickers = (eventId, stickerSetting) => axiosClient.post(`${urls.EVENTS}/${eventId}/${urls.STICKERS}`, stickerSetting)

/**
 * Get stickers
 *
 * @param {number} eventId
 */

export const getEventStickers = (eventId) => axiosClient.get(`${urls.EVENTS}/${eventId}/${urls.STICKERS}`)

/**
 * Remove stickers
 *
 * @param {number} eventId
 */

export const removeEventSticker = (eventId, stickerId) => axiosClient.delete(`${urls.EVENTS}/${eventId}/${urls.STICKERS}/${stickerId}`)

/**
 * Update stickers
 *
 * @param {number} eventId
 */

export const updateEventSticker = (eventId, stickerId, stickerSetting) => axiosClient.put(`${urls.EVENTS}/${eventId}/${urls.STICKERS}/${stickerId}`, stickerSetting)

/**
 * Set domain of event
 *
 * @param {number} eventId
 * @param {object} payload
 * @param {string} payload.domain
 * @param {string} payload.subdomain
 *
 * @return Axios promise
 */
export const setEventDomain = (eventId, { domain = 'runnertag.com', subdomain }) =>
  axiosClient.post(`${urls.EVENTS}/${eventId}/set-domain`, {
    domain,
    subdomain
  })

/**
 * Set event state
 *
 * @param {number} eventId
 * @param {object} payload
 * @param {string} payload.state `public` or `private`
 *
 * @return Axios promise
 */
export const setEventState = (eventId, eventState) => axiosClient.post(`${urls.EVENTS}/${eventId}/set-state`, { state: eventState })

/**
 * Set event theme
 *
 * @param {number} eventId
 * @param {object} payload
 * @param {number} payload.theme_id
 *
 * @return Axios promise
 */
export const setEventTheme = (eventId, eventTheme) => axiosClient.post(`${urls.EVENTS}/${eventId}/set-theme`, { theme_id: eventTheme })

/**
 * Delete event
 *
 * @param {number} eventId
 *
 * @return Axios promise
 */
export const deleteEvent = eventId => axiosClient.delete(`${urls.EVENTS}/${eventId}`)

/**
 * Get event content
 *
 * @param {object} payload
 * @param {number} payload.id
 * @param {number} payload.start
 * @param {string} payload.state // ENUM(hidden, visible, all)
 * @param {number} payload.limit
 * @param {boolean} payload.recent
 * @param {boolean} payload.thumbnail
 * @param {string} payload.order // ENUM(asc, desc)
 * @param {number} payload.checkpoint
 */

export const getEventContent = ({ id, start, state, limit, recent, thumbnail, order, checkpoint }) => {
  return axiosClient.get(`${urls.EVENTS}/${id}/contents`, {
    params: {
      start,
      state,
      limit,
      recent,
      thumbnail,
      order,
      checkpoint
    }
  })
}

/**
 * Get event content summary
 * Shows Total objects, hidden, and visible
 *
 * @param {number} id
 * @param {number} checkpoint
 */

export const getEventContentSummary = ({ id, checkpoint }) => {

  return axiosClient.get(`${urls.EVENTS}/${id}/contents/summary`, {
    params: {
      checkpoint
    }
  })
}

/**
 * Delete event content (images)
 *
 * @param {object} payload
 * @param {number} payload.eventId
 * @param {array} payload.selectedImages
 */

export const deleteEventContent = ({ eventId, selectedImages }) => {
  // let promises = []
  console.log(eventId, selectedImages)
  let objectIds = _.map(selectedImages, 'object_id')
  return axiosClient.delete(`${urls.EVENTS}/${eventId}/contents/images`, {
    data: {
      imageIds: objectIds
    }
  })
  // selectedImages.forEach((image) => {
  //   promises.push(axiosClient.delete(`${urls.EVENTS}/${eventId}/contents/${image.object_id}?`))
  // })

  // return axios.all(promises)
}

/**
 * Set event content (image) state
 *
 * @param {object} payload
 * @param {number} payload.id
 * @param {string} payload.state //1,0
 * @param {array} payload.objects
 */

export const setEventContentState = ({ id, state, objects }) => {
  axiosClient.post(`${urls.EVENTS}/${id}/contents/set-state`, {
    state,
    objects
  })
}

/**
 * Get event statistics
 *
 * @param {number} id
 */

export const getEventStats = id => axiosClient.get(`${urls.STATS}/${id}`)

// /**
//  * Put event media_id
//  *
//  * @param {object} payload
//  * @param {number} payload.id
//  * @param {object} payload.setting
//  */

export const setEventOverlay = ({ eventId, overlayRequest }) => {
  console.log(overlayRequest)
  return axiosClient.put(`${urls.EVENTS}/${eventId}/overlay/`, overlayRequest)
}

// /**
//  * Get event overlay
//  *
//  * @param {number} id
//  */

export const getEventOverlay = (eventId) => axiosClient.get(`${urls.EVENTS}/${eventId}/overlay/`)

/**
 * Put event media_id
 *
 * @param {object} payload
 * @param {number} payload.id
 * @param {object} payload.setting
 */

export const setOverlayByCheckpoint = ({ id, checkpointId, overlayRequest }) => {
  return axiosClient.put(`${urls.EVENTS}/${id}/checkpoints/${checkpointId}/overlay`, overlayRequest)
}

/**
 * Get checkpoint overlay
 *
 * @param {number} eventId
 * @param {number} checkpointId
 */

export const getOverlayByCheckpoint = (eventId, checkpointId) => {
  return axiosClient.get(`${urls.EVENTS}/${eventId}/checkpoints/${checkpointId}`)
}

/**
 * Set runner
 *
 * @param {number} id
 * @param {object} runnerRequest
 */

export const setRunner = ({ id, runnerRequest }) => axiosClient.put(`${urls.EVENTS}/${id}/runners`, runnerRequest)

/**
 * Set runner
 *
 * @param {number} id
 * @param {object} runnerRequest
 */

export const addRunner = ({ id, runnerRequest }) => axiosClient.post(`${urls.EVENTS}/${id}/runners/add`, runnerRequest)


/**
 * Delete runner
 *
 * @param {number} id
 * @param {number} runnerId
 */

export const deleteRunner = ({ id, runnerId }) => axiosClient.delete(`${urls.EVENTS}/${id}/runners/${runnerId}`)

/**
 * Get overlay preview
 *
 * @param {number} id
 */

export const getOverlayPreview = ({ id }) => axiosClient.get(`${urls.OVERLAY}/${id}`, {
  cancelToken: new CancelToken(function executor(c) {
    cancelOverlayPreview = c
  })
}).catch((err) => {
  if (axios.isCancel(err)) {
    console.log(err.message)
  } else {
    console.log(err)
  }
})

export const cancelOverlayPreviewCall = () => {
  console.log('cancelOverlayPreview', cancelOverlayPreview)
  cancelOverlayPreview && cancelOverlayPreview('cancelOverlayPreview')
  return 1
}

/**
 * Get finish time overlay preview
 *
 *
 */

export const getFinishTimeOverlayPreview = ({ image }) => axiosClient.get(`${urls.OVERLAY_PREVIEW}&image_key=${image}`, {
  cancelToken: new CancelToken(function executor(c) {
    cancelFinishTimeOverlayPreview = c
  })
}).catch((err) => {
  if (axios.isCancel(err)) {
    console.log(err.message)
  } else {
    console.log(err)
  }
})

export const cancelFinishTimeOverlayPreviewCall = () => {
  console.log('cancelFinishTimeOverlayPreview', cancelFinishTimeOverlayPreview)
  cancelFinishTimeOverlayPreview && cancelFinishTimeOverlayPreview('cancelFinishTimeOverlayPreview')
  return 1
}

/**
 * get checkpoints
 *
 * @param {number} id
 */

export const getCheckpoint = ({ id }) => axiosClient.get(`${urls.EVENTS}/${id}/checkpoints`)

/**
 * Set checkpoints
 *
 * @param {number} id
 * @param {object} checkpointRequest
 */

export const setCheckpoint = ({ id, checkpointRequest }) => axiosClient.put(`${urls.EVENTS}/${id}/checkpoints`, checkpointRequest)

/**
 * Set Images' checkpoint
 *
 * @param {number} id
 * @param {number} checkpointId
 * @param {object} imageIdArray
 */

export const setImagesCheckpoint = ({ id, checkpointId, imageIdArray }) => axiosClient.put(`${urls.EVENTS}/${id}/checkpoints/${checkpointId}`, imageIdArray)

/**
 * Get Media
 *
 * @param {number} id
 */

export const getMedia = id => axiosClient.get(`/events/${id}/media/`)

/**
 * Post Media
 *
 * @param {number} id
 */

export const postEventMedia = (id, mediaSetting) => axiosClient.post(`/events/${id}/media/`)

/**
 * Send Share Email Link
 *
 * @param {number} id
 * @param {object} payload
 */

export const sendReviewLinkEmail = ({ id, payload }) => axiosClient.post(`${urls.EVENTS}/${id}/share-review-link`, payload)

/**
 * Request Presigned URL
 *
 * @param {number} id
 * @param {object} payload
 */

export const postPresignedURL = ({ id, checkpointId, payload }) => axiosClient.post(`${urls.MEDIA}/${id}/${checkpointId}/0`, payload)


/**
 * Create Stripe PaymentMethod
 * add tokenised card to customer
 * @param {object} req
 */
export const addPaymentMethod = req => axiosClient.post(`/billing`, req)

/**
 * get Stripe PaymentMethods list
 *
 * @param {object} req
 */
export const listPaymentMethods = () => axiosClient.get(`/billing/payment-methods`)

/**
 * init a Stripe PaymentMethod
 *
 * @param {object} req
 */
export const initNewPaymentMethod = () => axiosClient.get(`/billing/init-new-payment-method`)

/**
 * Update Stripe Default PaymentMethod
 *
 * @param {object} req
 */
export const setDefaultPaymentMethod = req => axiosClient.post(`/billing/default-payment-method`, req)


/**
 * Pay for an open invoice
 *
 * @param {object} req
 */
export const payInvoice = req => axiosClient.post(`/billing/pay-invoice`, req)


/**
 * getCustomerDefaultPaymentMethod
 *
 * @param {object} req
 */
export const getCustomerDefaultPaymentMethod = () => axiosClient.get(`/billing/get-customer`)

/**
 * detachPaymentMethod
 *
 * @param {object} req
 */
export const detachPaymentMethod = (req) => axiosClient.post(`/billing/detach-payment-method`, req)

/**
 * initNewPayment
 *
 * @param {object} req
 */
export const initNewPayment = (req) => axiosClient.post(`/billing/init-new-payment`, req)

/**
 * getTenantInvoices
 *
 * @param {object} req
 */
export const getTenantInvoices = (req) => axiosClient.get(`/billing/invoices`, req)


/**
 * send email
 *
 * @param {object} req
 */
export const sendEnquiryEmail = (req) => axiosClient.post(`/events/mail/send`, req)

/**
 * get sales
 *
 * @param {object} id
 */
export const getSales = (id) => axiosClient.get(`${urls.EVENTS}/${id}/sales`)

/**
 * get possible prices
 *
 */
export const getPrices = () => axiosClient.get(`${urls.PRICES}`)

/**
 * 
 * @param {* eventId} id 
 * @param {* reportType: 'transaction' | 'sales'} reportType 
 * @param {* reportName: 'All' | 'Month Year'} reportName 
 * @returns 
 */
export const getReport = (id, reportType, reportName) =>
         axiosClient.get(
           `${urls.EVENTS}/${id}/reports/${reportType}/${reportName}`,
           { 
            'Content-Type': 'text/csv',
            responseType: "blob" 
          }
         )
