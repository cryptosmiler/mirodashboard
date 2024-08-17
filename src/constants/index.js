export const AUTH_TOKENS_STORAGE_KEY = 'auth_tokens'
export const PROFILE_STORAGE_KEY = 'profile'
export const LOCAL_STORAGE_KEY = 'LocalSettings'
export const MAX_PHOTO_UPLOAD_SIZE = 10 //10 MB
export const EVENT_PUBLIC = 1
export const EVENT_PRIVATE = 0
export const EVENT_DELETED = 2
export const EVENT_FILTERS = [
  'E_ALL',
  'E_PUBLIC',
  'E_PRIVATE'
]
export const TIME_FILTERS = [
  'T_ALL',
  'T_UPCOMING',
  'T_RECENT',
  'T_PAST'
] 

export const EVENT_FILTER_FUNCS = {
  E_ALL: (e, idx) => e.state == EVENT_PUBLIC || e.state == EVENT_PRIVATE,
  E_PUBLIC: (e, idx) => e.state == EVENT_PUBLIC,
  E_PRIVATE: (e,idx) => e.state == EVENT_PRIVATE
}
export const TIME_FILTER_FUNCS = {
  T_ALL : (e,idx) => true,
  T_PAST: (e, idx) =>  new Date(e.event_date) < new Date(),
  T_UPCOMING : (e,idx) => new Date(e.event_date) > new Date(),
  T_RECENT: (e,idx) => {
    let eventDate = new Date(e.event_date)
    let now = new Date()
    return eventDate > now - (86400 * 28)*1000 || eventDate < now + (86400 * 7)*1000 // 86400 is 1 day in seconds. * 1000 for ms
  },
}

export const SELECT_LANGUAGES = [
  { value: "null", text: "Please select a language", disabled: true },
  { value: "en", text: "English (Default)", disabled: false },
  { value: "fr", text: "Français (French)", disabled: false },
  { value: "kr", text: "한국어 (Korean)", disabled: false },
  { value: "sk", text: "Slovenčina (Slovak)", disabled: false },
  { value: "nl", text: "Nederlands (Dutch)", disabled: false },
  { value: "de", text: "Deutsch (German)", disabled: false },
  { value: "el", text: "Ελληνικά (Greek)", disabled: false },
  { value: "es", text: "Español (Spanish)", disabled: false },
]

export const SELECT_CURRENCIES = [
  { value: "null", text: "Please select a currency to use", disabled: true },
  { value: "AUD", text: "Australian Dollar (AUD)" },
  { value: "EUR", text: "Euro (EUR)" },
  { value: "HKD", text: "Hong Kong Dollar (HKD)" },
  { value: "SGD", text: "Singapore Dollar (SGD)" },
  { value: "USD", text: "US Dollar (USD)" },
  { value: "CAD", text: "Canadian Dollar (CAD)" },
  { value: "GBP", text: "Pound Sterling (GBP)" },
  { value: "MYR", text: "Malaysian Ringgit (MYR)" },
  { value: "THB", text: "Thailand Baht (THB)" },
]