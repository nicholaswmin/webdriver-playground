'use strict'

const shortid = require('shortid')
const child_process = require('child_process')
const rp = require('request-promise-native')

class WebDriver {
  constructor({ driverUrl = 'http://127.0.0.1:4444' } = {}) {
    this.driverUrl = driverUrl
  }

  init() {
    return rp({
      method: 'POST',
      uri: `${this.driverUrl}/session`,
      body: {
        desiredCapabilities: {
          browserName: 'chrome'
        }
      },
      json: true
    })
    .then(result => {
      this.session = result.value

      return this
    })
  }

  pause(duration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this)
      }, duration || 5000)
    })
  }

  moveTo({ x, y }) {
    return rp({
      method: 'POST',
      uri: `${this.driverUrl}/session/${this.session.sessionId}/moveTo`,
      body: { x, y },
      json: true
    }).then(() => {
      return this
    })
  }

  goToUrl(url) {
    return rp({
      method: 'POST',
      uri: `${this.driverUrl}/session/${this.session.sessionId}/url`,
      body: { url },
      json: true
    }).then(() => {
      return this
    })
  }

  performPointerActions(actions) {
    return rp({
      method: 'POST',
      uri: `${this.driverUrl}/session/${this.session.sessionId}/actions`,
      body: { actions },
      json: true
    }).then(() => {
      return this
    })
  }

  releasePointerActions(actions) {
    return rp({
      method: 'DELETE',
      uri: `${this.driverUrl}/session/${this.session.sessionId}/actions`
    }).then(() => {
      return this
    })
  }

  end() {
    return rp({
      method: 'DELETE',
      uri: `${this.driverUrl}/session/${this.session.sessionId}`,
      body: { foo: 'bar' },
      json: true
    }).then(() => {
      process.exit(0)
    })
  }
}

module.exports = WebDriver
