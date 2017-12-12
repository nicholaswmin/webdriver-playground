'use strict'

const shortid = require('shortid')
const child_process = require('child_process')
const rp = require('request-promise-native')
const WebdriverActions = require('webdriver-actions')

class WebDriver {
  constructor({ driverUrl }) {
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
      // @NOTE geckodriver returns the sesssion in `result.value`,
      // while chromedriver/safaridriver return the session in `result`
      this.session = result.value.sessionId ? result.value : result

      return this
    })
  }

  pause(duration = 5000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this)
      }, duration)
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

  async performActions(actions) {
    if (await this._actionsApiUnsupported()) {
      const activeElementId = await this.getActiveElementId()

      for (const action of WebdriverActions.transform(actions, { activeElementId })) {
        await rp({
          method: 'POST',
          uri: `${this.driverUrl}/session/${this.session.sessionId}/${action.url}`,
          body: action.data,
          json: true
        })
      }

      return this
    }

    return rp({
      method: 'POST',
      uri: `${this.driverUrl}/session/${this.session.sessionId}/actions`,
      body: { actions },
      json: true
    }).then(() => {
      return this
    })
  }

  releaseActions(actions) {
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
      uri: `${this.driverUrl}/session/${this.session.sessionId}`
    }).then(() => {
      process.exit(0)
    })
  }

  getActiveElementId() {
    if (await this._actionsApiUnsupported()) return

    return rp({
      method: 'GET',
      uri: `${this.driverUrl}/session/${this.session.sessionId}/element/active`,
      json: true
    }).then(result => {
      return result.value.ELEMENT
    })
  }

  _actionsApiUnsupported() {
    return new Promise((resolve, reject) => {
      rp({
        method: 'DELETE',
        uri: `${this.driverUrl}/session/${this.session.sessionId}/actions`
      })
      .then(result => {
        resolve(false)
      })
      .catch(err => {
        resolve(true)
      })
    })
  }
}

module.exports = WebDriver
