import Vue from 'vue'
import router from '@/router'
import { AUTH_TOKENS_STORAGE_KEY, PROFILE_STORAGE_KEY } from '@/constants'
import storage from '@/utils/storage'
import {
  signIn,
  signOut,
  signUp,
  signUpSubAccount,
  resetPassword,
  confirmResetPassword,
  changePassword,
  getProfile,
  putProfile,
  putTenantProfile,
  getAllSubAccount,
  updateSubAccountStatus,
  getWatermarkOverlay,
  enableMfa,
  verifyInitialPasscode,
  sendTOTP,
  getMfaEnabled,
  disableMfa,
  removeSubAccount,
  changeRole,
  changeRoleAndOut,
  sendVerificationCode,
  verifyEmail,
  refreshAuth,
  onRefreshedToken,
  __sendPasswordSetRequest,
  __sendPasswordVerifyRequest,
  createUploadLink,
  shareUploadLink,
  updateUploadLink,
  _getUploadLinkList,
  _changeUploadLinkStatus,
  _getUploadLinkContent
} from '@/api' 
import EventBus from '../../event-bus.js'
import * as mutationTypes from '../mutationTypes'
import platformHelper from '@/utils/platformHelper'

const state = {
  tokens: storage.load(AUTH_TOKENS_STORAGE_KEY),
  profile: storage.load(PROFILE_STORAGE_KEY) || {},
  loading: false, // Show loading icon if TRUE
  error: null, // Show error in sign-in/sign-up dialog if error
  refreshingToken: false,
  allSubAccount: []
}

const getters = {
  authenticated: state => !!state.tokens,
  profile: state => state.profile,
  allSubAccount: state => state.allSubAccount,
  loading: state => state.loading,
  error: state => state.error,
  isAdmin: state => state.profile.role === 0
}

const mutations = {
  [mutationTypes.SIGN_UP_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SIGN_UP_SUCCESS](state, payload) {
    state.loading = false
    state.tokens = null

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SIGN_UP_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SUB_SIGN_UP_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SUB_SIGN_UP_SUCCESS](state) {
    state.loading = false
    EventBus.$emit('clearSubForm', true)
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SUB_SIGN_UP_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SIGN_IN_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SIGN_IN_SUCCESS](state, payload) {
    // Store tokens into local storage
    storage.save(AUTH_TOKENS_STORAGE_KEY, payload)

    state.loading = false
    state.tokens = payload

    // router.push({name: 'Dashboard'})
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SIGN_IN_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SIGN_IN_TOTP_NEEDED](state) {
    state.loading = false
    state.error = null

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SEND_TOTP_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SEND_TOTP_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('set-unknown-error', false)
    EventBus.$emit('set-totp-mismatch-error', true)
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SEND_TOTP_ERROR_500](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('set-totp-mismatch-error', false)
    EventBus.$emit('set-unknown-error', true)
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SEND_TOTP_SUCCESS](state) {
    state.loading = false
    EventBus.$emit('set-totp-mismatch-error', false)
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.GET_MFA_ENABLED_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.GET_MFA_ENABLED_SUCCESS](state) {

    state.loading = false
    state.error = null
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.GET_MFA_ENABLED_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SIGN_OUT_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.SIGN_OUT_SUCCESS](state) {
    // Remove tokens and profile from local storage
    storage.remove(AUTH_TOKENS_STORAGE_KEY)
    storage.remove(PROFILE_STORAGE_KEY)

    state.loading = false
    state.tokens = null
    state.profile = {}

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SIGN_OUT_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.LOAD_ALL_SUB_ACCOUNT](state) {
    
  },

  [mutationTypes.GET_ALL_SUB_ACCOUNT](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.GET_ALL_SUB_ACCOUNT_SUCCESS](state, payload) {
    state.loading = false
    state.allSubAccount = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.GET_ALL_SUB_ACCOUNT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.UPDATE_SUB_ACCOUNT](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.UPDATE_SUB_ACCOUNT_SUCCESS](state, payload) {
    state.loading = false
    Vue.toasted.global.information_updated()
  },

  [mutationTypes.UPDATE_SUB_ACCOUNT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.REMOVE_SUB_ACCOUNT](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.REMOVE_SUB_ACCOUNT_SUCCESS](state, payload) {
    state.loading = false
    //Vue.toasted.global.user_removed()
  },

  [mutationTypes.REMOVE_SUB_ACCOUNT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.CHANGE_ROLE](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.CHANGE_ROLE_SUCCESS](state, payload) {
    state.loading = false
    //Vue.toasted.global.role_changed()
  },

  [mutationTypes.CHANGE_ROLE_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.CREATE_UPLOAD_LINK](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.CREATE_UPLOAD_LINK_SUCCESS](state, payload) {
    state.loading = false
    //Vue.toasted.global.role_changed()
  },

  [mutationTypes.CREATE_UPLOAD_LINK_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.SHARE_UPLOAD_LINK](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.SHARE_UPLOAD_LINK_SUCCESS](state, payload) {
    state.loading = false
    //Vue.toasted.global.role_changed()
  },

  [mutationTypes.SHARE_UPLOAD_LINK_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.UPDATE_UPLOAD_LINK](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.UPDATE_UPLOAD_LINK_SUCCESS](state, payload) {
    state.loading = false
    //Vue.toasted.global.role_changed()
  },

  [mutationTypes.UPDATE_UPLOAD_LINK_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.GET_UPLOAD_LINK_LIST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.GET_UPLOAD_LINK_LIST_SUCCESS](state, payload) {
    state.loading = false
    //Vue.toasted.global.role_changed()
  },

  [mutationTypes.GET_UPLOAD_LINK_LIST_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.GET_UPLOAD_LINK_CONTENT](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.GET_UPLOAD_LINK_CONTENT_SUCCESS](state, payload) {
    state.loading = false
    //Vue.toasted.global.role_changed()
  },

  [mutationTypes.GET_UPLOAD_LINK_CONTENT_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.CHANGE_UPLOAD_LINK_STATUS](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.CHANGE_UPLOAD_LINK_STATUS_SUCCESS](state, payload) {
    state.loading = false
    //Vue.toasted.global.role_changed()
  },

  [mutationTypes.CHANGE_UPLOAD_LINK_STATUS_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.GET_PROFILE_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.GET_PROFILE_SUCCESS](state, payload) {
    state.loading = false
    state.profile = payload

    storage.save(PROFILE_STORAGE_KEY, payload)
  },

  [mutationTypes.GET_PROFILE_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.PUT_PROFILE_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.PUT_PROFILE_SUCCESS](state, payload) {
    state.loading = false
    state.profile = payload
    storage.save(PROFILE_STORAGE_KEY, payload)

    EventBus.$emit('change-loader-state', false)

    Vue.toasted.global.information_updated()
  },

  [mutationTypes.PUT_PROFILE_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.GET_WATERMARK_OVERLAY_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.GET_WATERMARK_OVERLAY_SUCCESS](state, payload) {
    state.loading = false
  },

  [mutationTypes.GET_WATERMARK_OVERLAY_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.enableMfa_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.enableMfa_SUCCESS](state, payload) {
    state.loading = false
  },

  [mutationTypes.enableMfa_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.DISABLE_MFA_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.DISABLE_MFA_SUCCESS](state, payload) {
    state.loading = false
  },

  [mutationTypes.DISABLE_MFA_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.VERIFY_INITIAL_PASSCODE_REQUEST](state) {
    state.loading = true
    state.error = null
  },

  [mutationTypes.VERIFY_INITIAL_PASSCODE_SUCCESS](state, payload) {
    state.loading = false
  },

  [mutationTypes.VERIFY_INITIAL_PASSCODE_ERROR](state, payload) {
    state.loading = false
    state.error = payload
  },

  [mutationTypes.PUT_TENANT_PROFILE_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.PUT_TENANT_PROFILE_SUCCESS](state, payload) {
    state.loading = false
    state.profile = payload
    storage.save(PROFILE_STORAGE_KEY, payload)

    EventBus.$emit('change-loader-state', false)

    Vue.toasted.global.information_updated()
  },

  [mutationTypes.PUT_TENANT_PROFILE_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.VERIFY_EMAIL_REQUEST](state) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.VERIFY_EMAIL_SUCCESS](state, payload) {
    state.loading = false

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.VERIFY_EMAIL_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.RESET_PASSWORD_REQUEST](state, payload) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.RESET_PASSWORD_SUCCESS](state, payload) {
    state.loading = false

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.RESET_PASSWORD_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.CONFIRM_RESET_PASSWORD_REQUEST](state, payload) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.CONFIRM_RESET_PASSWORD_SUCCESS](state, payload) {
    state.loading = false

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.CONFIRM_RESET_PASSWORD_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.CHANGE_PASSWORD_REQUEST](state, payload) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.CHANGE_PASSWORD_SUCCESS](state, payload) {
    state.loading = false

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SEND_PASSWORD_SET_REQUEST](state, payload) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.PASSWORD_SET_SUCCESS](state, payload) {
    state.loading = false

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.SEND_PASSWORD_VERIFY_REQUEST](state, payload) {
    state.loading = true
    state.error = null

    EventBus.$emit('change-loader-state', true)
  },

  [mutationTypes.PASSWORD_VERIFY_SUCCESS](state, payload) {
    state.loading = false

    EventBus.$emit('change-loader-state', false)
  },

  [mutationTypes.CHANGE_PASSWORD_ERROR](state, payload) {
    state.loading = false
    state.error = payload

    EventBus.$emit('change-loader-state', false)
  },

  errorToNull(state) {
    state.error = null
  }
}

const actions = {
  async signUp({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.SIGN_UP_REQUEST)

      await signUp(
        payload
      )

      commit(mutationTypes.SIGN_UP_SUCCESS)
      // Sign in automatically
      const { email, password } = payload
      await dispatch('signIn', {
        email,
        password
      })
      // Send verification code
      // APRIL 2020 - SUPPRESSING VERIFICATION EMAIL - JW
      // await sendVerificationCode()
    } catch (err) {
      commit(mutationTypes.SIGN_UP_ERROR, err.response.data.error)
    }
  },

  async signUpSubAccount({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.SUB_SIGN_UP_REQUEST)

      await signUpSubAccount(
        payload
      )
      commit(mutationTypes.SUB_SIGN_UP_SUCCESS)
      await dispatch('getAllSubAccount')
    } catch (err) {
      commit(mutationTypes.SUB_SIGN_UP_ERROR, err.response.data.error)
    }
  },

  async signIn({ commit, dispatch }, payload) {
    const { email, password, platform_id } = payload

    try {
      commit(mutationTypes.SIGN_IN_REQUEST)

      const resp = await signIn({
        email,
        password,
        platform_id
      })
      if(resp.data.success){
        // We only save access token and refresh token
        const { result: { AccessToken, RefreshToken } } = resp.data
        const tokens = { AccessToken, RefreshToken }

        commit(mutationTypes.SIGN_IN_SUCCESS, tokens)

        // Load user profile

        await dispatch('getProfile')
      }
      else if(resp.data.challengeName == "SOFTWARE_TOKEN_MFA")
      {
        commit(mutationTypes.SIGN_IN_TOTP_NEEDED)
        return resp.data
      }
    } catch (err) {
      // console.log(err)
      commit(mutationTypes.SIGN_IN_ERROR, err.response.data.error)
    }
  },

  async sendTOTP({commit, dispatch}, payload) {
    const {TOTP, Session, Email, Password} = payload

    try{
      commit(mutationTypes.SEND_TOTP_REQUEST)
      const resp = await sendTOTP({
        TOTP,
        Session,
        Email,
        Password,
      })

      console.log("resp -> ", resp)
      if(resp.data.success) {
        commit(mutationTypes.SEND_TOTP_SUCCESS)
        const { result: { AccessToken, RefreshToken } } = resp.data
        const tokens = { AccessToken, RefreshToken }

        commit(mutationTypes.SIGN_IN_SUCCESS, tokens)

        // Load user profile

        await dispatch('getProfile')
      }
    } catch(err) {
      console.log("err : ", err.message)
      if(err.message == 'Request failed with status code 403'){
        commit(mutationTypes.SEND_TOTP_ERROR, err.response.data.error)
      }
      if(err.message == 'Request failed with status code 500'){
        commit(mutationTypes.SEND_TOTP_ERROR_500, err.response.data.error)
      }
    }
  },

  async loadAllSubAccount({ commit, dispatch }) {
    
    commit(mutationTypes.LOAD_ALL_SUB_ACCOUNT)
    if (!state.allSubAccount || state.allSubAccount.length === 0) {
      await dispatch('getAllSubAccount')
    }
  },

  async getAllSubAccount({ commit }) {
    try {
      commit(mutationTypes.GET_ALL_SUB_ACCOUNT)

      const resp = await getAllSubAccount()
      // console.log("resp:",resp.data.user)
      commit(mutationTypes.GET_ALL_SUB_ACCOUNT_SUCCESS, resp.data.user)
      // const profile = resp.data.user
    } catch (err) {
      commit(mutationTypes.GET_ALL_SUB_ACCOUNT_ERROR, err.response.data.message)
    }
  },

  async updateSubAccountStatus({ commit }, payload) {
    try {
      commit(mutationTypes.UPDATE_SUB_ACCOUNT)
      const resp = await updateSubAccountStatus(payload)
      commit(mutationTypes.UPDATE_SUB_ACCOUNT_SUCCESS, resp.data.success)

    } catch (err) {
      commit(mutationTypes.UPDATE_SUB_ACCOUNT_ERROR, err.response.data.message)
    }
  },

  async removeSubAccount({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.REMOVE_SUB_ACCOUNT)
      const resp = await removeSubAccount(payload)
      commit(mutationTypes.REMOVE_SUB_ACCOUNT_SUCCESS, resp.data.success)
      await dispatch('getAllSubAccount')
    } catch (err) {
      commit(mutationTypes.REMOVE_SUB_ACCOUNT_ERROR, err.response.data.message)
    }
  },

  async changeRole({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.CHANGE_ROLE)
      const resp = await changeRole(payload)
      commit(mutationTypes.CHANGE_ROLE_SUCCESS, resp.data.success)
      await dispatch('manuallyRefreshToken')
      await dispatch('getAllSubAccount')
    } catch (err) {
      commit(mutationTypes.CHANGE_ROLE_ERROR, err.response.data.message)
    }
  },

  async changeRoleAndOut({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.CHANGE_ROLE)
      const resp = await changeRole(payload)
      commit(mutationTypes.CHANGE_ROLE_SUCCESS, resp.data.success)
      await dispatch('signOut')
    } catch (err) {
      commit(mutationTypes.CHANGE_ROLE_ERROR, err.response.data.message)
    }
  },

  async createUploadLink({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.CREATE_UPLOAD_LINK)
      const resp = await createUploadLink(payload)
      commit(mutationTypes.CREATE_UPLOAD_LINK_SUCCESS, resp.data.success)
      return resp.data
    } catch (err) {
      commit(mutationTypes.CREATE_UPLOAD_LINK_ERROR, err.response.data.message)
    }
  },

  async shareUploadLink({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.SHARE_UPLOAD_LINK)
      const resp = await shareUploadLink(payload)
      commit(mutationTypes.SHARE_UPLOAD_LINK_SUCCESS, resp.data.success)
      return resp.data
    } catch (err) {
      commit(mutationTypes.SHARE_UPLOAD_LINK_ERROR, err.response.data.message)
    }
  },

  async updateUploadLink({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.UPDATE_UPLOAD_LINK)
      const resp = await updateUploadLink(payload)
      commit(mutationTypes.UPDATE_UPLOAD_LINK_SUCCESS, resp.data.success)
      return resp.data
    } catch (err) {
      commit(mutationTypes.UPDATE_UPLOAD_LINK_ERROR, err.response.data.message)
    }
  },

  async getUploadLinkList({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.GET_UPLOAD_LINK_LIST)
      const resp = await _getUploadLinkList(payload)
      commit(mutationTypes.GET_UPLOAD_LINK_LIST_SUCCESS)
      return resp.data
    } catch (err) {
      commit(mutationTypes.GET_UPLOAD_LINK_LIST_ERROR)
    }
  },

  async getUploadLinkContent({ commit, dispatch }, payload) {
    try {
      commit(mutationTypes.GET_UPLOAD_LINK_CONTENT)
      const resp = await _getUploadLinkContent(payload)
      commit(mutationTypes.GET_UPLOAD_LINK_CONTENT_SUCCESS)
      return resp.data
    } catch (err) {
      commit(mutationTypes.GET_UPLOAD_LINK_CONTENT_ERROR)
    }
  },

  async changeUploadLinkStatus({commit, dispatch}, payload) {
    try{
      commit(mutationTypes.CHANGE_UPLOAD_LINK_STATUS)
      const resp = await _changeUploadLinkStatus(payload)
      commit(mutationTypes.CHANGE_UPLOAD_LINK_STATUS_SUCCESS)
      return resp.data
    } catch (err) {
      commit(mutationTypes.CHANGE_UPLOAD_LINK_STATUS_ERROR)
    }
  },

 
  /**
   * Update tokens
   */
  async updateTokens({ commit, dispatch }, payload) {
    commit(mutationTypes.SIGN_IN_SUCCESS, payload)
    await dispatch('getProfile')
  },

  async getProfile({ commit }) {
    try {
      commit(mutationTypes.GET_PROFILE_REQUEST)

      const resp = await getProfile()
      const profile = resp.data.user
      // Show toast if user account not verified
      if (!profile.status && profile.role === 0) {
        Vue.toasted.global.email_not_verified()
      }

      commit(mutationTypes.GET_PROFILE_SUCCESS, profile)
    } catch (err) {
      commit(mutationTypes.GET_PROFILE_ERROR, err.response.data.message)
    }
  },

  async putProfile({ commit }, payload) {
    try {
      console.log("process.env.API_BASE_URL : ", process.env.API_BASE_URL)
      commit(mutationTypes.PUT_PROFILE_REQUEST)
      const resp = await putProfile(payload)
      commit(mutationTypes.PUT_PROFILE_SUCCESS, resp.data.user)

      return resp.data.user
    } catch (err) {
      commit(mutationTypes.PUT_PROFILE_ERROR, err)
    }
  },

  async putTenantProfile({ commit }, payload) {
    try {
      commit(mutationTypes.PUT_TENANT_PROFILE_REQUEST)
      const resp = await putTenantProfile(payload)
      commit(mutationTypes.PUT_TENANT_PROFILE_SUCCESS, resp.data.user)
      return resp.data.user
    } catch (err) {
      commit(mutationTypes.PUT_TENANT_PROFILE_ERROR, err)
    }
  },

  async getWatermarkOverlay({ commit }, payload) {
    try {
      commit(mutationTypes.GET_WATERMARK_OVERLAY_REQUEST)
      const resp = await getWatermarkOverlay(payload)
      commit(mutationTypes.GET_WATERMARK_OVERLAY_SUCCESS, resp.data)
      return resp.data
    } catch (err) {
      commit(mutationTypes.GET_WATERMARK_OVERLAY_ERROR, err)
    }
  },

  async enableMfa({ commit }, payload) {
    try {
      commit(mutationTypes.enableMfa_REQUEST)
      const resp = await enableMfa(payload)
      commit(mutationTypes.enableMfa_SUCCESS, resp.data)
      return resp.data
    } catch (err) {
      commit(mutationTypes.enableMfa_ERROR, err)
    }
  },

  async verifyInitialPasscode({ commit }, payload) {
    try {
      commit(mutationTypes.VERIFY_INITIAL_PASSCODE_REQUEST)
      const resp = await verifyInitialPasscode(payload)
      commit(mutationTypes.VERIFY_INITIAL_PASSCODE_SUCCESS, resp.data)
      return resp.data
    } catch (err) {
      commit(mutationTypes.VERIFY_INITIAL_PASSCODE_ERROR, err)
    }
  },

  async getMfaEnabled({ commit }) {
    try {
      commit(mutationTypes.GET_MFA_ENABLED_REQUEST)

      const resp = await getMfaEnabled()
      const mfaStatus = resp.data
      return mfaStatus
      commit(mutationTypes.GET_MFA_ENABLED_SUCCESS)
    } catch (err) {
      commit(mutationTypes.GET_MFA_ENABLED_ERROR, err.response.data.message)
    }
  },

  async disableMfa({ commit }) {
    try {
      commit(mutationTypes.DISABLE_MFA_REQUEST)

      const resp = await disableMfa()
      return resp
      commit(mutationTypes.DISABLE_MFA_SUCCESS)
    } catch (err) {
      commit(mutationTypes.DISABLE_MFA_ERROR, err.response.data.message)
    }
  },

  async signOut({ commit, dispatch }) {
    try {
      commit(mutationTypes.SIGN_OUT_REQUEST)
      await signOut()

      commit(mutationTypes.SIGN_OUT_SUCCESS)
    } catch (err) {
      // commit(mutationTypes.SIGN_OUT_ERROR, err.response.data.message)

      // If SignOut request fails, let's forcefully sign out
      dispatch('forceSignOut')
    }
  },

  async resetPassword({ commit }, payload) {
    try {
      commit(mutationTypes.RESET_PASSWORD_REQUEST)
      await resetPassword(payload)

      commit(mutationTypes.RESET_PASSWORD_SUCCESS)

      return true
    } catch (err) {
      commit(mutationTypes.RESET_PASSWORD_ERROR, err.response.data.error)
      return err
    }
  },

  async confirmResetPassword({ commit }, payload) {
    try {
      commit(mutationTypes.CONFIRM_RESET_PASSWORD_REQUEST)
      await confirmResetPassword(payload)

      commit(mutationTypes.CONFIRM_RESET_PASSWORD_SUCCESS)

      return true
    } catch (err) {
      commit(mutationTypes.CONFIRM_RESET_PASSWORD_ERROR, err.response.data.error)
    }
  },

  async changePassword({ commit }, payload) {
    try {
      commit(mutationTypes.CHANGE_PASSWORD_REQUEST)
      const resp = await changePassword(payload)

      commit(mutationTypes.CHANGE_PASSWORD_SUCCESS)

      Vue.toasted.global.password_reset()
      return resp.data
    } catch (err) {
      commit(mutationTypes.CHANGE_PASSWORD_ERROR, err.response.data.error)
      Vue.toasted.global.password_reset_error({
        message: err.response.data.error
      })

      return err.response.data
    }
  },

  async sendPasswordSetRequest({ commit }, payload) {
    try {
      commit(mutationTypes.SEND_PASSWORD_SET_REQUEST)
      const resp = await __sendPasswordSetRequest(payload)
      commit(mutationTypes.PASSWORD_SET_SUCCESS)
      return resp.data
    } catch (err) {
      return err.response.data.error
    }
  },

  async verifyOldPassword({ commit }, payload) {
    try {
      commit(mutationTypes.SEND_PASSWORD_VERIFY_REQUEST)
      const resp = await __sendPasswordVerifyRequest(payload)
      commit(mutationTypes.PASSWORD_VERIFY_SUCCESS)
      return resp.data
    } catch (err) {
      return err.response.data.error
    }
  },

  async verifyEmail({ commit }, payload) {
    try {
      commit(mutationTypes.VERIFY_EMAIL_REQUEST)

      await verifyEmail(payload)

      commit(mutationTypes.VERIFY_EMAIL_SUCCESS)

      Vue.toasted.global.email_verified()
    } catch (err) {
      commit(mutationTypes.VERIFY_EMAIL_ERROR, err)
    }
  },

  /**
   * Forcefully sign out.
   * It simply clears the token stored in storage and store.
   *
   * It can be used when signOut api call cannot be made, ie. token is expired
   */
  forceSignOut({ commit }) {
    commit(mutationTypes.SIGN_OUT_SUCCESS)
    router.push("/signin")
  },

  errorToNull({ commit }) {
    commit('errorToNull')
  },

  async manuallyRefreshToken({ state, dispatch }) {
    if (!state.refreshingToken) {
      state.refreshingToken = true
      try {
          const resp = await refreshAuth({
            refreshToken: state.tokens.RefreshToken
        })
        const {
          result: { AccessToken }
        } = resp.data
        await dispatch('updateTokens', {
          AccessToken,
          RefreshToken: state.tokens.RefreshToken
        })
      } catch(ex) {
        // console.log(`Error refreshing token`, ex)
      }
      state.refreshingToken = false
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
