var Promise = require('bluebird')
var Repos = require('./repositories')
var Users = require('./users')


var Api = module.exports = {}

Api.Repos = Repos
Api.Users = Users

var cache = {}

Api.loadImage = function (url, img) {
  if (cache.hasOwnProperty(url)) {
    var p = cache[url]
    p.then(function (blob) {
      img.src = window.URL.createObjectURL(blob)
      return blob
    })
  } else {
    var p = new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = function (e) {
        resolve(this.response)
      }
      xhr.send()
    })
    cache[url] = p
    p.then(function(blob) {
      img.src = window.URL.createObjectURL(blob)
      return blob
    })
  }
}