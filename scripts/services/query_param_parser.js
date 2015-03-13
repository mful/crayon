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
      case 'at_mention':
        this.notifyMentionNotification();
        break;
      case 'annotation':
        this.notifyCommentNotification();
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

  QueryParamParser.prototype.notifyMentionNotification = function () {
    var ev = this.params.cryn_cid === this.params.cryn_id ?
      'COMMENT_NOTIFICATION' : 'REPLY_NOTIFICATION';

    return crayon.dispatcher.dispatch({
      message: crayon.constants.NotificationConstants[ev],
      data: this.params
    });
  };

  QueryParamParser.prototype.notifyCommentNotification = function () {
    return crayon.dispatcher.dispatch({
      message: crayon.constants.NotificationConstants.COMMENT_NOTIFICATION,
      data: this.params
    });
  };

  return QueryParamParser;

})();
