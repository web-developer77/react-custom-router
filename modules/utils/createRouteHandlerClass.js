var React = require('react');
var invariant = require('react/lib/invariant');
var assign = require('react/lib/Object.assign');
var HashLocation = require('../locations/HashLocation');
var Route = require('./Route');
var Path = require('./Path');
var ActiveRouteHandler = require('../components/ActiveRouteHandler');

function routeIsActive(activeRoutes, routeName) {
  return activeRoutes.some(function (route) {
    return route.name === routeName;
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
 * Returns a React class that can be used to render the current state of
 * the given Router.
 */
function createRouteHandlerClass(router, location) {
  var state = router.state;

  var handlersCopy;

  var activeHandlers = state.matches.map(function(match) {
    return match.route.handler;
  });

  function copyHandlers() {
    handlersCopy = activeHandlers.slice(0);
  }

  copyHandlers();

  var ActiveContext = {

    /**
     * Returns a read-only array of the currently active routes.
     */
    getActiveRoutes: function () {
      return state.activeRoutes.slice(0);
    },

    /**
     * Returns a read-only object of the currently active URL parameters.
     */
    getActiveParams: function () {
      return assign({}, state.activeParams);
    },

    /**
     * Returns a read-only object of the currently active query parameters.
     */
    getActiveQuery: function () {
      return assign({}, state.activeQuery);
    },

    /**
     * Returns true if the given route, params, and query are active.
     */
    isActive: function (to, params, query) {
      if (Path.isAbsolute(to))
        return to === state.path;

      return routeIsActive(state.activeRoutes, to) &&
        paramsAreActive(state.activeParams, params) &&
        (query == null || queryIsActive(state.activeQuery, query));
    },

    childContextTypes: {
      activeRoutes: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Route)).isRequired,
      activeParams: React.PropTypes.object.isRequired,
      activeQuery: React.PropTypes.object.isRequired,
      isActive: React.PropTypes.func.isRequired
    },

    getChildContext: function () {
      return {
        activeRoutes: this.getActiveRoutes(),
        activeParams: this.getActiveParams(),
        activeQuery: this.getActiveQuery(),
        isActive: this.isActive
      };
    }

  };

  var LocationContext = {

    /**
     * Returns the location (static or dynamic) that is in use.
     */
    getLocation: function () {
      return location;
    },

    childContextTypes: {
      location: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ]).isRequired
    },

    getChildContext: function () {
      return {
        location: this.getLocation()
      };
    }

  };

  var NavigationContext = {

    makePath: function (to, params, query) {
      return router.makePath(to, params, query);
    },

    /**
     * Returns a string that may safely be used as the href of a link
     * to the route with the given name, URL parameters, and query.
     */
    makeHref: function (to, params, query) {
      var path = this.makePath(to, params, query);
      return (location === HashLocation) ? '#' + path : path;
    },

    /**
     * Transitions to the URL specified in the arguments by pushing
     * a new URL onto the history stack.
     */
    transitionTo: function (to, params, query) {
      invariant(
        typeof location !== 'string',
        'You cannot use transitionTo with a static location'
      );

      location.push(this.makePath(to, params, query));
    },

    /**
     * Transitions to the URL specified in the arguments by replacing
     * the current URL in the history stack.
     */
    replaceWith: function (to, params, query) {
      invariant(
        typeof location !== 'string',
        'You cannot use replaceWith with a static location'
      );

      location.replace(this.makePath(to, params, query));
    },

    /**
     * Transitions to the previous URL.
     */
    goBack: function () {
      invariant(
        typeof location !== 'string',
        'You cannot use goBack with a static location'
      );

      location.pop();
    },

    childContextTypes: {
      makePath: React.PropTypes.func.isRequired,
      makeHref: React.PropTypes.func.isRequired,
      transitionTo: React.PropTypes.func.isRequired,
      replaceWith: React.PropTypes.func.isRequired,
      goBack: React.PropTypes.func.isRequired
    },

    getChildContext: function () {
      return {
        makePath: this.makePath,
        makeHref: this.makeHref,
        transitionTo: this.transitionTo,
        replaceWith: this.replaceWith,
        goBack: this.goBack
      };
    }

  };

  var PathContext = {

    /**
     * Returns the current URL path + query string.
     */
    getCurrentPath: function () {
      return state.path;
    },

    childContextTypes: {
      currentPath: React.PropTypes.string.isRequired
    },

    getChildContext: function () {
      return {
        currentPath: this.getCurrentPath()
      };
    }

  };

  var RouteContext = {

    /**
     * Returns a read-only array of all available <Route>s.
     */
    getRoutes: function () {
      return router.routes.slice(0);
    },

    /**
     * Returns a read-only hash { name: <Route> } of all named <Route>s.
     */
    getNamedRoutes: function () {
      return assign({}, router.namedRoutes);
    },

    /**
     * Returns the <Route> with the given name.
     */
    getRouteByName: function (routeName) {
      return router.namedRoutes[routeName] || null;
    },

    childContextTypes: {
      routes: React.PropTypes.array.isRequired,
      namedRoutes: React.PropTypes.object.isRequired
    },

    getChildContext: function () {
      return {
        routes: this.getRoutes(),
        namedRoutes: this.getNamedRoutes(),
      };
    }

  };

  var ActiveRouteHandlerContext = {

    childContextTypes: {
      lookupActiveRouteHandler: React.PropTypes.func.isRequired
    },

    getChildContext: function() {
      return {
        lookupActiveRouteHandler: this.lookupActiveRouteHandler
      }
    },

    componentWillUpdate: function() {
      copyHandlers();
    },

    lookupActiveRouteHandler: function() {
      // TODO: figure out a way to prevent calling <ActiveRouteHandler/> twice
      // in a single owner's render, could maybe attach it to the matches
      // before any rendering and then not manage an array here at the top?
      return handlersCopy.shift();
    }

  };

  return React.createClass({

    displayName: 'RouteHandler',

    mixins: [
      ActiveContext,
      LocationContext,
      NavigationContext,
      PathContext,
      RouteContext,
      ActiveRouteHandlerContext
    ],

    propTypes: {
      children: function () {
        return new Error('You cannot pass children to a RouteHandler');
      }
    },

    render: function () {
      var route = state.activeRoutes[0];
      return route ? ActiveRouteHandler(this.props) : null;
    }

  });
}

module.exports = createRouteHandlerClass;
