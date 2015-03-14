crayon.services || ( crayon.services = {} );

crayon.services.PageInitializer = ( function () {

  function PageInitializer () {
    this.go = this.go.bind( this );
  };

  PageInitializer.prototype.go = function () {
    crayon.annotatedTextManager.showAllOnPage(
      crayon.helpers.url.currentHref(),
      this.handlePotentialNotification
    );

    this.alertPageLoad();
  };

  PageInitializer.prototype.handlePotentialNotification = function () {
    new crayon.services.QueryParamParser().handleParams();
  };

  PageInitializer.prototype.alertPageLoad = function () {
    crayon.courier.longDistance(
      crayon.constants.AppConstants.PAGE_LOAD,
      {}
    );
  };

  return PageInitializer;

})();
