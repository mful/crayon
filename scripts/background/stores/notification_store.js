background.stores || ( background.stores = {} );

background.stores.NotificationStore = {

  updateCount: function ( options ) {
    options || ( options = {} );
    if ( options.count === 0 || options.count ) return this.setBadgeText( options.count );
    var _this = this;

    crayon.helpers.xhr.get(
      crayon.helpers.routes.api_notification_count_url(),
      function ( err, response ) {
        if ( err ) return;
        _this.setBadgeText( response.data.notification_count );
      }
    );
  },

  setBadgeText: function ( count ) {
    if ( count > 0 ) {
      chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' });
      chrome.browserAction.setBadgeText({ text: count + '' });
    } else {
      chrome.browserAction.setBadgeText({ text: '' });
    }
  }
}
