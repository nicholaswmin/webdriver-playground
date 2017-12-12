'use strict'

const shortid = require('shortid')
const WebDriver = require('./webdriver')

const browser = new WebDriver({
  driverUrl: 'http://127.0.0.1:4444',
  desiredCapabilities: {
    browserName: 'chrome',
    pageLoadStrategy: 'normal'
  }
})

browser.init()
.then(browser => {
  return browser.goToUrl(`http://localhost:5001/go/as/${shortid.generate()}`)
})
.then(browser => browser.pause(5000))
.then(browser => {
  return browser.performActions([
    {
      type: 'key',
      id: 'keyboard_1',
      actions: [
        { 'type': 'keyDown', 'value': '\uE00C' },
      ]
    }
  ])
})
.then(browser => browser.pause(2000))
.then(browser => {
  return browser.performActions([
    {
      type: 'pointer',
      id: 'pointer_1',
      parameters: { 'pointerType' : 'mouse' },
      actions: [
        { 'type': 'pointerMove', 'duration': 0, 'x': 100, 'y': 100 },
        { 'type': 'pointerDown', 'button': 0 },
        { 'type': 'pointerMove', 'duration': 1000, 'origin': 'pointer', 'x': 0, 'y': 100 },
        { 'type': 'pointerUp', 'button': 0 },
        { 'type': 'pointerDown', 'button': 0 },
        { 'type': 'pointerMove', 'duration': 1000, 'origin': 'pointer', 'x': 100, 'y': 0 },
        { 'type': 'pointerUp', 'button': 0 },
        { 'type': 'pointerDown', 'button': 0 },
        { 'type': 'pointerMove', 'duration': 1000, 'origin': 'pointer', 'x': 0, 'y': -100 },
        { 'type': 'pointerUp', 'button': 0 },
        { 'type': 'pointerDown', 'button': 0 },
        { 'type': 'pointerMove', 'duration': 1000, 'origin': 'pointer', 'x': -100, 'y': 0 },
        { 'type': 'pointerUp', 'button': 0 }
      ]
    }
  ])
})
.then(browser => browser.releaseActions())
.then(browser => browser.pause(1500))
.then(browser => browser.end())
.catch(err => {
  console.error(err)
  browser.end(err)
})
