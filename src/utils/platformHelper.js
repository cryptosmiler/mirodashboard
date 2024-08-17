export default {
  platform() {
    // 0= unconfirmed, 2=MYLAPS, 1=RT Client, 3=myrace.photo, 4=CPS
    if (process.env.PLATFORM_ID) {
      return process.env.PLATFORM_ID
    } else {
      return 1
    }
  },
  defaultSetup() {
    // create event
    // sign up
    if (process.env.PLATFORM_ID == 0 || process.env.PLATFORM_ID == 1 || process.env.PLATFORM_ID == 4) {
      return true
    } else {
      return false
    }
  },
  hasPurchase() {
    const purchasePlatforms = process.env.PURCHASE_PLATFORMS.split(',')
    return purchasePlatforms.includes(this.platform().toString())
  },
  getLogo() {
    switch (this.platform()) {
      case 4:
        // cps
        return require("../assets/racetag_logo_white.png")
      case 2:
        // mylaps
        return require("../assets/mylaps_logo_white.png")
      case 3:
      case 1:
      default:
        return require("../assets/runnertag_logo_white.png")
    }
  },
  getCongratulationImage() {
    return require("../assets/congratulation.png")
  },
  get404Image() {
    return require("../assets/404.jpg")
  },
  getExpiredImage() {
    return require("../assets/expired.jpg")
  },
  getRestrictedImage() {
    return require("../assets/restricted.jpg")
  },
  getPasswordImage() {
    return require("../assets/password.jpg")
  },
  defaultDomain() {
    console.log(process.env.DOMAIN)
    return process.env.DOMAIN
  }
}
