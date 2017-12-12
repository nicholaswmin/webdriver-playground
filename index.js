'use strict'

const shortid = require('shortid')
const WebDriver = require('./webdriver')

const browser = new WebDriver()

browser.init()
.then(browser => {
  return browser.goToUrl(`http://localhost:5001/go/as/${shortid.generate()}`)
})
.then(browser => {
  return browser.pause(10000)
})
.then(browser => {
  return browser.performPointerActions([
    {
      type: 'key',
      id: 'keyboard_1',
      actions: [
        { 'type': 'keyDown', 'value': '\uE00C', 'duration': 1000 },
      ]
    }
  ])
})
.then(browser => browser.pause(1000))
.then(browser => {
  return browser.performPointerActions([
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
.then(browser => browser.pause(5000))
.then(browser => browser.releasePointerActions())
.then(browser => browser.end())
.catch(console.error)
