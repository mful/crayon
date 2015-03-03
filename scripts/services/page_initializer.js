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
  };

  PageInitializer.prototype.handlePotentialNotification = function () {
    new crayon.services.QueryParamParser().handleParams();
  };

  return PageInitializer;

})();
