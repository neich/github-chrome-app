var $ = require('jquery')
var Promise = require('bluebird')

var users = {}

users.loadUsers = function (text) {

  return new Promise(function (resolve, reject) {
    if (!text) {
      resolve([])
    } else {
      $.ajax({
        url: 'https://api.github.com/search/users?q=' + text,
        type: 'get',
        crossDomain: true,
        processData: false,
        success: resolve,
        error: reject
      })
    }
  })
}

module.exports = users
