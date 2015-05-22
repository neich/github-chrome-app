var Promise = require('bluebird')

var routes = []

function addRoute(route, handler) {

  routes.push({
    parts: route.split('/'),
    handler: handler,
    pre: Array.prototype.slice.call(arguments, 2)
  })
}

function load(route) {
  window.location.hash = route;
}

function start() {

  var path = window.location.hash.substr(1),
    parts = path.split('/'),
    partsLength = parts.length;

  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    if (route.parts.length === partsLength) {
      var params = [];
      for (var j = 0; j < partsLength; j++) {
        if (route.parts[j].substr(0, 1) === ':') {
          params.push(parts[j]);
        } else if (route.parts[j] !== parts[j]) {
          break;
        }
      }
      if (j === partsLength) {
        if (route.pre.length > 0) {
          var preProm = route.pre.map(function (f) {
            f.apply(undefined, params)
          })
          var extraParams = []
          Promise.each(preProm, extraParams.push.bind(extraParams))
            .then(function() {
              route.handler.apply(undefined, params.concat(extraParams))
            })
        } else {
          route.handler.apply(undefined, params)
        }
      }
    }
  }
}

window.onhashchange = start

module.exports = {
  addRoute: addRoute,
  load: load,
  start: start
}
