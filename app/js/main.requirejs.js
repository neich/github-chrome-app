require.config({
  paths: {
    'react': '../bower_components/react/react-with-addons',
    'text': '../bower_components/requirejs-text/text',
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'JSXTransformer': '../bower_components/react/JSXTransformer',
    'jsx': '../bower_components/requirejs-react-jsx/jsx',
    'promise': '../bower_components/bluebird/js/browser/bluebird.min'
  },
  packages: [
    {name: 'flux', location: '../bower_components/flux/dist', main: 'Flux.js'},
    {name: 'dispatcher', main: 'dispatcher.js'},
    {name: 'actions', main: 'actions.js'},
    {name: 'actionTypes', location: 'actions', main: 'types.js'}
  ],
  shim: {
    'react': {
      'exports': 'React'
    },
    'JSXTransformer': 'JSXTransformer',
    'promises': {
      init: function() {
        this.promises.defer =  function () {
          var resolve, reject;
          var promise = new P(function() {
            resolve = arguments[0];
            reject = arguments[1];
          });
          return {
            resolve: resolve,
            reject: reject,
            promise: promise
          };
        };
      }
    }
    
  },

  jsx: {
    fileExtension: '.jsx',
    transformOptions: {
      harmony: true,
      stripTypes: false,
      inlineSourceMap: true
    },
    usePragma: false
  }
});

require(['app'], function (App) {

  App.init();

});