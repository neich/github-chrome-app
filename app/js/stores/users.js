var Promise = require('bluebird')
var Api = require('../api')

var users = []

var findByLogin = function (searchKey) {
  return Api.Users.loadUsers(searchKey)
    .then(function (res) {
      var users = res.items
      var results = users.filter(function (element) {
        var fullName = element.login
        return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
      })
      return results
    })
}


// The public API
module.exports = {
  findByLogin: findByLogin
}

