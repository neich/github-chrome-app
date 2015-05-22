define(['dispatcher', 'action/types'],
  function (Dispatcher, ActionTypes) {


  var Actions = {

    /**
     * @param  {string} text
     */
    create: function (text) {
      Dispatcher.dispatch({
        actionType: ActionTypes.CREATE_CONTEXT,
        text: text
      });
    },

    loadContexts: function (type) {
      AppDispatcher.dispatch({
        actionType: ActionTypes.LOAD_CONTEXTS,
        contextType: type
      });
    }
  }

    return Actions;

});