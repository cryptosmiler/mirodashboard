// Auth Module
export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST'
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS'
export const SIGN_IN_ERROR = 'SIGN_IN_ERROR'
export const SIGN_IN_TOTP_NEEDED = 'SIGN_IN_TOTP_NEEDED'

export const SEND_TOTP_REQUEST = 'SEND_TOTP_REQUEST'
export const SEND_TOTP_ERROR = 'SEND_TOTP_ERROR'
export const SEND_TOTP_ERROR_500 = 'SEND_TOTP_ERROR_500'
export const SEND_TOTP_SUCCESS = 'SEND_TOTP_SUCCESS'

export const SIGN_OUT_REQUEST = 'SIGN_OUT_REQUEST'
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS'
export const SIGN_OUT_ERROR = 'SIGN_OUT_ERROR'

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST'
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS'
export const SIGN_UP_ERROR = 'SIGN_UP_ERROR'

export const SUB_SIGN_UP_REQUEST = 'SUB_SIGN_UP_REQUEST'
export const SUB_SIGN_UP_SUCCESS = 'SUB_SIGN_UP_SUCCESS'
export const SUB_SIGN_UP_ERROR = 'SUB_SIGN_UP_ERROR'

export const GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST'
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'
export const GET_PROFILE_ERROR = 'GET_PROFILE_ERROR'

export const LOAD_ALL_SUB_ACCOUNT = 'LOAD_ALL_SUB_ACCOUNT'
export const GET_ALL_SUB_ACCOUNT = 'GET_ALL_SUB_ACCOUNT'
export const GET_ALL_SUB_ACCOUNT_SUCCESS = 'GET_ALL_SUB_ACCOUNT_SUCCESS'
export const GET_ALL_SUB_ACCOUNT_ERROR = 'GET_ALL_SUB_ACCOUNT_ERROR'

export const UPDATE_SUB_ACCOUNT = 'UPDATE_SUB_ACCOUNT'
export const UPDATE_SUB_ACCOUNT_SUCCESS = 'UPDATE_SUB_ACCOUNT_SUCCESS'
export const UPDATE_SUB_ACCOUNT_ERROR = 'UPDATE_SUB_ACCOUNT_ERROR'

export const REMOVE_SUB_ACCOUNT = 'REMOVE_SUB_ACCOUNT'
export const REMOVE_SUB_ACCOUNT_SUCCESS = 'REMOVE_SUB_ACCOUNT_SUCCESS'
export const REMOVE_SUB_ACCOUNT_ERROR = 'REMOVE_SUB_ACCOUNT_ERROR'

export const CHANGE_ROLE = 'CHANGE_ROLE'
export const CHANGE_ROLE_SUCCESS = 'CHANGE_ROLE_SUCCESS'
export const CHANGE_ROLE_ERROR = 'CHANGE_ROLE_ERROR'

export const PUT_PROFILE_REQUEST = 'PUT_PROFILE_REQUEST'
export const PUT_PROFILE_SUCCESS = 'PUT_PROFILE_SUCCESS'
export const PUT_PROFILE_ERROR = 'PUT_PROFILE_ERROR'

export const PUT_TENANT_PROFILE_REQUEST = 'PUT_TENANT_PROFILE_REQUEST'
export const PUT_TENANT_PROFILE_SUCCESS = 'PUT_TENANT_PROFILE_SUCCESS'
export const PUT_TENANT_PROFILE_ERROR = 'PUT_TENANT_PROFILE_ERROR'

export const GET_WATERMARK_OVERLAY_REQUEST = 'GET_WATERMARK_OVERLAY_REQUEST'
export const GET_WATERMARK_OVERLAY_SUCCESS = 'GET_WATERMARK_OVERLAY_SUCCESS'
export const GET_WATERMARK_OVERLAY_ERROR = 'GET_WATERMARK_OVERLAY_ERROR'

export const enableMfa_REQUEST = 'enableMfa_REQUEST'
export const enableMfa_SUCCESS = 'enableMfa_SUCCESS'
export const enableMfa_ERROR = 'enableMfa_ERROR'

export const DISABLE_MFA_REQUEST = 'DISABLE_MFA_REQUEST'
export const DISABLE_MFA_SUCCESS = 'DISABLE_MFAa_SUCCESS'
export const DISABLE_MFA_ERROR = 'DISABLE_MFA_ERROR'

export const GET_MFA_ENABLED_REQUEST = 'GET_MFA_ENABLED_REQUEST'
export const GET_MFA_ENABLED_SUCCESS = 'GET_MFA_ENABLED_SUCCESS'
export const GET_MFA_ENABLED_ERROR = 'GET_MFA_ENABLED_ERROR'

export const VERIFY_INITIAL_PASSCODE_REQUEST = 'VERIFY_INITIAL_PASSCODE_REQUEST'
export const VERIFY_INITIAL_PASSCODE_SUCCESS = 'VERIFY_INITIAL_PASSCODE_SUCCESS'
export const VERIFY_INITIAL_PASSCODE_ERROR = 'VERIFY_INITIAL_PASSCODE_ERROR'

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST'
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR'

export const CONFIRM_RESET_PASSWORD_REQUEST = 'CONFIRM_RESET_PASSWORD_REQUEST'
export const CONFIRM_RESET_PASSWORD_SUCCESS = 'CONFIRM_RESET_PASSWORD_SUCCESS'
export const CONFIRM_RESET_PASSWORD_ERROR = 'CONFIRM_RESET_PASSWORD_ERROR'

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST'
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS'
export const CHANGE_PASSWORD_ERROR = 'CHANGE_PASSWORD_ERROR'

export const SEND_PASSWORD_SET_REQUEST = 'SEND_PASSWORD_SET_REQUEST'
export const PASSWORD_SET_SUCCESS = 'PASSWORD_SET_SUCCESS'
export const PASSWORD_SET_ERROR = 'PASSWORD_SET_ERROR'

export const SEND_PASSWORD_VERIFY_REQUEST = 'SEND_PASSWORD_VERIFY_REQUEST'
export const PASSWORD_VERIFY_SUCCESS = 'PASSWORD_VERIFY_SUCCESS'
export const PASSWORD_VERIFY_ERROR = 'PASSWORD_VERIFY_ERROR'

export const CREATE_UPLOAD_LINK = 'CREATE_UPLOAD_LINK'
export const CREATE_UPLOAD_LINK_SUCCESS = 'CREATE_UPLOAD_LINK_SUCCESS'
export const CREATE_UPLOAD_LINK_ERROR = 'CREATE_UPLOAD_LINK_ERROR'

export const SHARE_UPLOAD_LINK = 'SHARE_UPLOAD_LINK'
export const SHARE_UPLOAD_LINK_SUCCESS = 'SHARE_UPLOAD_LINK_SUCCESS'
export const SHARE_UPLOAD_LINK_ERROR = 'SHARE_UPLOAD_LINK_ERROR'

export const UPDATE_UPLOAD_LINK = 'UPDATE_UPLOAD_LINK'
export const UPDATE_UPLOAD_LINK_SUCCESS = 'UPDATE_UPLOAD_LINK_SUCCESS'
export const UPDATE_UPLOAD_LINK_ERROR = 'UPDATE_UPLOAD_LINK_ERROR'

export const GET_UPLOAD_LINK_LIST = 'GET_UPLOAD_LINK_LIST'
export const GET_UPLOAD_LINK_LIST_SUCCESS = 'GET_UPLOAD_LINK_LIST_SUCCESS'
export const GET_UPLOAD_LINK_LIST_ERROR = 'GET_UPLOAD_LINK_LIST_ERROR'

export const GET_UPLOAD_LINK_CONTENT = 'GET_UPLOAD_LINK_CONTENT'
export const GET_UPLOAD_LINK_CONTENT_SUCCESS = 'GET_UPLOAD_LINK_CONTENT_SUCCESS'
export const GET_UPLOAD_LINK_CONTENT_ERROR = 'GET_UPLOAD_LINK_CONTENT_ERROR'

export const CHANGE_UPLOAD_LINK_STATUS = 'CHANGE_UPLOAD_LINK_STATUS'
export const CHANGE_UPLOAD_LINK_STATUS_SUCCESS = 'CHANGE_UPLOAD_LINK_STATUS_SUCCESS'
export const CHANGE_UPLOAD_LINK_STATUS_ERROR = 'CHANGE_UPLOAD_LINK_STATUS_ERROR'

export const VERIFY_EMAIL_REQUEST = 'VERIFY_EMAIL_REQUEST'
export const VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS'
export const VERIFY_EMAIL_ERROR = 'VERIFY_EMAIL_ERROR'

// Events Module
export const LOAD_EVENTS_REQUEST = 'LOAD_EVENTS_REQUEST'
export const LOAD_EVENTS_SUCCESS = 'LOAD_EVENTS_SUCCESS'
export const LOAD_EVENTS_ERROR = 'LOAD_EVENTS_ERROR'

export const LOAD_EVENT_REQUEST = 'LOAD_EVENT_REQUEST'
export const LOAD_EVENT_SUCCESS = 'LOAD_EVENT_SUCCESS'
export const LOAD_EVENT_ERROR = 'LOAD_EVENT_ERROR'

export const LOAD_EVENTS_STATS_REQUEST = 'LOAD_EVENTS_STATS_REQUEST'
export const LOAD_EVENTS_STATS_SUCCESS = 'LOAD_EVENTS_STATS_SUCCESS'
export const LOAD_EVENTS_STATS_ERROR = 'LOAD_EVENTS_STATS_ERROR'

export const CREATE_EVENT_REQUEST = 'CREATE_EVENT_REQUEST'
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS'
export const CREATE_EVENT_ERROR = 'CREATE_EVENT_ERROR'

export const DELETE_EVENT_REQUEST = 'DELETE_EVENT_REQUEST'
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS'
export const DELETE_EVENT_ERROR = 'DELETE_EVENT_ERROR'

export const SET_EVENT_DOMAIN_REQUEST = 'SET_EVENT_DOMAIN_REQUEST'
export const SET_EVENT_DOMAIN_SUCCESS = 'SET_EVENT_DOMAIN_SUCCESS'
export const SET_EVENT_DOMAIN_ERROR = 'SET_EVENT_DOMAIN_ERROR'

export const SET_EVENT_STATE_REQUEST = 'SET_EVENT_STATE_REQUEST'
export const SET_EVENT_STATE_SUCCESS = 'SET_EVENT_STATE_SUCCESS'
export const SET_EVENT_STATE_ERROR = 'SET_EVENT_STATE_ERROR'

export const SET_EVENT_OVERLAY_MEDIA_REQUEST = 'SET_EVENT_OVERLAY_MEDIA_REQUEST'
export const SET_EVENT_OVERLAY_MEDIA_SUCCESS = 'SET_EVENT_OVERLAY_MEDIA_SUCCESS'
export const SET_EVENT_OVERLAY_MEDIA_ERROR = 'SET_EVENT_OVERLAY_MEDIA_ERROR'

export const SET_EVENT_SETTING_REQUEST = 'SET_EVENT_SETTING_REQUEST'
export const SET_EVENT_SETTING_SUCCESS = 'SET_EVENT_SETTING_SUCCESS'
export const SET_EVENT_SETTING_ERROR = 'SET_EVENT_SETTING_ERROR'

export const LOAD_EVENT_CONTENT_REQUEST = 'LOAD_EVENT_CONTENT_REQUEST'
export const LOAD_EVENT_CONTENT_SUCCESS = 'LOAD_EVENT_CONTENT_SUCCESS'
export const LOAD_EVENT_CONTENT_ERROR = 'LOAD_EVENT_CONTENT_ERROR'

export const LOAD_EVENT_CONTENT_SUMMARY_REQUEST = 'LOAD_EVENT_CONTENT_SUMMARY_REQUEST'
export const LOAD_EVENT_CONTENT_SUMMARY_SUCCESS = 'LOAD_EVENT_CONTENT_SUMMARY_SUCCESS'
export const LOAD_EVENT_CONTENT_SUMMARY_ERROR = 'LOAD_EVENT_CONTENT_SUMMARY_ERROR'

export const DELETE_EVENT_CONTENT_REQUEST = 'DELETE_EVENT_CONTENT_REQUEST'
export const DELETE_EVENT_CONTENT_SUCCESS = 'DELETE_EVENT_CONTENT_SUCCESS'
export const DELETE_EVENT_CONTENT_ERROR = 'DELETE_EVENT_CONTENT_ERROR'

export const SET_EVENT_CONTENT_STATE_REQUEST = 'SET_EVENT_CONTENT_STATE_REQUEST'
export const SET_EVENT_CONTENT_STATE_SUCCESS = 'SET_EVENT_CONTENT_STATE_SUCCESS'
export const SET_EVENT_CONTENT_STATE_ERROR = 'SET_EVENT_CONTENT_STATE_ERROR'

export const SELECT_EVENT = 'SELECT_EVENT'

export const CHANGE_GALLERY_URL_LOCK_STATE = 'CHANGE_GALLERY_URL_LOCK_STATE'

export const SET_EVENT_COLOR_SCHEME = 'SET_EVENT_COLOR_SCHEME'

export const SET_RUNNER_REQUEST = 'SET_RUNNER_REQUEST'
export const SET_RUNNER_SUCCESS = 'SET_RUNNER_SUCCESS'
export const SET_RUNNER_ERROR = 'SET_RUNNER_ERROR'

export const ADD_RUNNER_REQUEST = 'ADD_RUNNER_REQUEST'
export const ADD_RUNNER_SUCCESS = 'ADD_RUNNER_SUCCESS'
export const ADD_RUNNER_ERROR = 'ADD_RUNNER_ERROR'


export const DELETE_RUNNER_REQUEST = 'DELETE_RUNNER_REQUEST'
export const DELETE_RUNNER_SUCCESS = 'DELETE_RUNNER_SUCCESS'
export const DELETE_RUNNER_ERROR = 'DELETE_RUNNER_ERROR'

export const SET_CHECKPOINT_REQUEST = 'SET_CHECKPOINT_REQUEST'
export const SET_CHECKPOINT_SUCCESS = 'SET_CHECKPOINT_SUCCESS'
export const SET_CHECKPOINT_ERROR = 'SET_CHECKPOINT_ERROR'

export const LOAD_EVENT_MEDIA = "LOAD_EVENT_MEDIA"

export const SHARE_REVIEW_LINK_REQUEST = 'SHARE_REVIEW_LINK_REQUEST'
export const SHARE_REVIEW_LINK_SUCCESS = 'SHARE_REVIEW_LINK_SUCCESS'
export const SHARE_REVIEW_LINK_ERROR = 'SHARE_REVIEW_LINK_ERROR'

export const SET_EVENT_STICKERS_REQUEST = 'SET_EVENT_STICKERS_REQUEST'
export const SET_EVENT_STICKERS = 'SET_EVENT_STICKERS'
export const SET_EVENT_STICKERS_ERROR = 'SET_EVENT_STICKERS_ERROR'

export const CANCEL_OVERLAY_REQUEST = 'CANCEL_OVERLAY_REQUEST'

// Prices Module
export const GET_PRICES_SUCCESS = 'GET_PRICES_SUCCESS'
export const GET_PRICES_ERROR = 'GET_PRICES_ERROR'