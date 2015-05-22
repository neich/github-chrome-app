var $ = require('jquery')
var Promise = require('bluebird')

var repos = {}

repos.loadRepos = function (username) {

  return new Promise(function (resolve, reject) {
    $.ajax({
      url: 'https://api.github.com/users/' + username + '/repos',
      type: 'get',
      crossDomain: true,
      processData: false,
      success: resolve,
      error: reject
    })
  })
}

module.exports = repos
