var React = require('react');
var ChangeEmitter = require('./ChangeEmitter');

function routeIsActive(activeRoutes, routeName) {
  return activeRoutes.some(function (route) {
    return route.props.name === routeName;
  });
}

function paramsAreActive(activeParams, params) {
  for (var property in params)
    if (String(activeParams[property]) !== String(params[property]))
      return false;

  return true;
}

function queryIsActive(activeQuery, query) {
  for (var property in query)
    if (String(activeQuery[property]) !== String(query[property]))
      return false;

  return true;
}

/**
 * A mixin for components that store the active state of routes, URL
 * parameters, and query.
 */
var ActiveDelegate = {

  mixins: [ ChangeEmitter ],

  childContextTypes: {
    activeDelegate: React.PropTypes.any.isRequired
  },

  getChildContext: function () {
    return {
      activeDelegate: this
    };
  },

  propTypes: {
    initialState: React.PropTypes.object
  },

  getDefaultProps: function () {
    return {
      initialState: {}
    };
  },

  getInitialState: function () {
    var initialState = this.props.initialState;

    return {
      activeRoutes: initialState.activeRoutes || [],
      activeParams: initialState.activeParams || {},
      activeQuery: initialState.activeQuery || {}
    };
  },

  /**
   * Returns true if the route with the given name, URL parameters, and
   * query are all currently active.
   */
  isActive: function (routeName, params, query) {
    var isActive = routeIsActive(this.state.activeRoutes, routeName) &&
                   paramsAreActive(this.state.activeParams, params);

    if (query)
      return isActive && queryIsActive(this.state.activeQuery, query);

    return isActive;
  }

};

module.exports = ActiveDelegate;
