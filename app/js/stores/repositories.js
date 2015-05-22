var Promise = require('bluebird')
var Api = require('../api')

var urepos = {}

exports.isInitialized = function (login) {
  return urepos.hasOwnProperty(login)
}

exports.initRepos = function (login) {
  return new Promise(function (resolve, reject) {
    if (urepos.hasOwnProperty(login)) {
      resolve(urepos[login])
    } else {
      Api.Repos.loadRepos(login)
        .then(function (results) {
          urepos[login] = results
          resolve(results)
        })
        .catch(function (err) {
          reject(err)
        })
    }
  })
}

exports.findById = function (login, id) {
  return new Promise(function (resolve) {
    var repo = null;
    var repos = urepos[login]
    var l = repos.length;
    for (var i = 0; i < l; i++) {
      if (repos[i].id == id) {
        repo = repos[i];
        break;
      }
    }
    resolve(repo)
  })
}

exports.findByName = function (login, searchKey) {
  function find(repos) {
    return repos.filter(function (r) {
      var fullName = r.name
      return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
    })
  }

  return new Promise(function (resolve, reject) {
    if (urepos[login]) {
      resolve(find(urepos[login]))
    } else {
      exports.initRepos(login)
        .then(function (repos) {
          resolve(find(urepos[login]))
        })
        .catch(reject)
    }
  })
}
