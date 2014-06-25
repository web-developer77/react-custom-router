require('./helper');
var ActiveStore = require('../modules/stores/ActiveStore');
var Route = require('../modules/components/Route');

var App = React.createClass({
  displayName: 'App',
  render: function () {
    return React.DOM.div();
  }
});

describe('when a Route is active', function () {
  var route;
  beforeEach(function () {
    route = Route({ name: 'products', handler: App });
  });

  describe('and it has no params', function () {
    beforeEach(function () {
      ActiveStore.update({
        activeRoutes: [ route ]
      });
    });

    it('is active', function () {
      assert(ActiveStore.isActive('products'));
    });
  });

  describe('and the right params are given', function () {
    beforeEach(function () {
      ActiveStore.update({
        activeRoutes: [ route ],
        activeParams: { id: '123', show: 'true' },
        activeQuery: { search: 'abc' }
      });
    });

    describe('and no query is used', function () {
      it('is active', function () {
        assert(ActiveStore.isActive('products', { id: 123 }));
      });
    });

    describe('and a matching query is used', function () {
      it('is active', function () {
        assert(ActiveStore.isActive('products', { id: 123 }, { search: 'abc' }));
      });
    });

    describe('but the query does not match', function () {
      it('is not active', function () {
        refute(ActiveStore.isActive('products', { id: 123 }, { search: 'def' }));
      });
    });
  });

  describe('and the wrong params are given', function () {
    beforeEach(function () {
      ActiveStore.update({
        activeRoutes: [ route ],
        activeParams: { id: 123 }
      });
    });

    it('is not active', function () {
      refute(ActiveStore.isActive('products', { id: 345 }));
    });
  });
});
