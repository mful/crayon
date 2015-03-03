crayon.services || ( crayon.services = {} );

crayon.services.QueryParamParser = ( function () {

  function QueryParamParser () {
    this.params = crayon.helpers.url.queryObject();
  };

  QueryParamParser.prototype.handleParams = function () {
    if ( !this.params.cryn_type ) return false;

    switch ( this.params.cryn_type ) {
      case 'reply':
        this.notifyReplyNotification();
        break;
      default:
        return false;
    }

    return true;
  };

  QueryParamParser.prototype.notifyReplyNotification = function () {
    return crayon.dispatcher.dispatch({
      message: crayon.constants.NotificationConstants.REPLY_NOTIFICATION,
      data: this.params
    });
  };

  return QueryParamParser;

})();
