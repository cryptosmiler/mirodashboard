'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DOMAIN: '"dev.runnertag.com"',
  S3_IMAGE_URL: '"//face-rek-dev.s3.amazonaws.com"',
  API_BASE_URL: '"http://localhost:3000/v1/"',
  // API_BASE_URL: '"https://0j4gjvp42a.execute-api.us-west-2.amazonaws.com/dev/v1/"',
  PLATFORM_ID: 1
})
