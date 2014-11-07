var React = require('react');
var ConfigRoute = require('../mixins/ConfigRoute');

/**
 * A <DefaultRoute> component is a special kind of <Route> that
 * renders when its parent matches but none of its siblings do.
 * Only one such route may be used at any given level in the
 * route hierarchy.
 */
var DefaultRoute = React.createClass({
  mixins: [ ConfigRoute ],

  getDefaultProps: function() {
    return {
      // TODO: make sure we ignore any path the user might supply, or
      // throw/warn when we encounter it
      path: null,
      isDefault: true
    };
  }
});

module.exports = DefaultRoute;

