import React from 'react';
import warning from 'warning';
import invariant from 'invariant';
import { createRoutes } from './RouteUtils';
import { getQueryString, parseQueryString, stringifyQuery, queryContains } from './URLUtils';
import { branchMatches, getProps, getTransitionHooks, getAndAssignComponents } from './RoutingUtils';
import { routes, component, components, history, location } from './PropTypes';
import RoutingContext from './RoutingContext';
import Location from './Location';

var { any, array, func, object, instanceOf } = React.PropTypes;

export var Router = React.createClass({

  statics: {
    
    match(routes, location, callback) {
      // TODO: Mimic what we're doing in _updateLocation, but statically
      // so we can get the right props for doing server-side rendering.
    }

  },

  propTypes: {
    history,
    children: routes.isRequired,
    parseQueryString: func.isRequired,
    stringifyQuery: func.isRequired,
    onError: func.isRequired,
    onUpdate: func,

    // Primarily for server-side rendering.
    location: any,
    branch: routes,
    params: object,
    query: object,
    components
  },

  getDefaultProps() {
    return {
      location: '/',
      parseQueryString,
      stringifyQuery,
      onError: function (error) {
        // Throw errors by default so we don't silently swallow them!
        throw error; // This error probably originated in getChildRoutes or getComponents.
      }
    };
  },

  getInitialState() {
    return {
      location: null,
      branch: null,
      params: null,
      query: null,
      components: null,
      isTransitioning: false
    };
  },

  _updateLocation(location) {
    if (!Location.isLocation(location))
      location = Location.create(location);

    this.setState({ isTransitioning: true });
    this.nextLocation = location;

    getProps(this.routes, location, this.props.parseQueryString, (error, state) => {
      if (error) {
        this.handleError(error);
        this.setState({ isTransitioning: false });
        this.nextLocation = null;
        return;
      }

      warning(state, 'Location "%s" did not match any routes', location.path);

      if (state == null || !this._runTransitionHooks(state)) {
        this.setState({ isTransitioning: false });
        this.nextLocation = null;
        return;
      }

      this._getAndAssignComponents(state, (error) => {
        if (error) {
          this.handleError(error);
        } else if (this.nextLocation === location) {
          state.isTransitioning = false;
          this.setState(state, this.onUpdate);
          this._alreadyUpdated = true;
        }

        this.nextLocation = null;
      });
    });
  },

  _runTransitionHooks(nextState) {
    // Run component hooks before route hooks.
    var hooks = this.transitionHooks.map(hook => hook.bind(this, nextState, this));

    hooks.push.apply(
      hooks,
      getTransitionHooks(this.state, nextState, this)
    );

    var nextLocation = this.nextLocation;

    try {
      for (var i = 0, len = hooks.length; i < len; ++i) {
        hooks[i].call(this);

        if (this.nextLocation !== nextLocation)
          break; // No need to proceed further.
      }
    } catch (error) {
      this.handleError(error);
      return false;
    }

    // Allow the transition if nextLocation hasn't changed.
    return this.nextLocation === nextLocation;
  },

  _getAndAssignComponents(nextState, callback) {
    if (this.props.components) {
      nextState.components = this.props.components;
      callback();
    } else {
      getAndAssignComponents(nextState, callback);
    }
  },

  /**
   * Cancels the current transition, preventing any subsequent
   * transition hooks from running.
   */
  cancelTransition() {
    this.nextLocation = null;
  },

  /**
   * Adds a transition hook that runs before all route hooks in a
   * transition. The signature is the same as route transition hooks.
   */
  addTransitionHook(hook) {
    this.transitionHooks.push(hook);
  },

  /**
   * Removes the given transition hook.
   */
  removeTransitionHook(hook) {
    this.transitionHooks = this.transitionHooks.filter(h => h !== hook);
  },

  /**
   * Returns a full URL path from the given pathname and query.
   */
  makePath(pathname, query) {
    if (query) {
      if (typeof query !== 'string')
        query = this.props.stringifyQuery(query);

      if (query !== '')
        return pathname + '?' + query;
    }

    return pathname;
  },

  /**
   * Returns a string that may safely be used to link to the given
   * pathname and query.
   */
  makeHref(pathname, query) {
    var path = this.makePath(pathname, query);
    var { history } = this.props;

    if (history && history.makeHref)
      return history.makeHref(path);

    return path;
  },

  transitionTo(pathname, query) {
    var path = this.makePath(pathname, query);
    var { history } = this.props;

    if (history) {
      if (this.nextLocation) {
        history.replace(path);
      } else {
        history.push(path);
      }
    } else {
      this._updateLocation(path);
    }
  },

  replaceWith(pathname, query) {
    var path = this.makePath(pathname, query);
    var { history } = this.props;

    if (history) {
      history.replace(path);
    } else {
      this._updateLocation(path);
    }
  },

  go(n) {
    var { history } = this.props;
    invariant(history, 'Router#go needs a history');
    history.go(n);
  },

  goBack() {
    this.go(-1);
  },

  goForward() {
    this.go(1);
  },

  isActive(pathname, query) {
    return branchMatches(this.state.branch, pathname) && queryContains(this.state.query, query);
  },

  componentWillMount() {
    var { children, history, location } = this.props;

    this.transitionHooks = [];
    this.routes = createRoutes(children);
    this.nextLocation = null;

    if (history) {
      if (typeof history.setup === 'function')
        history.setup();

      this._updateLocation(history.location);
    } else {
      this._updateLocation(location);
    }
  },

  handleHistoryChange() {
    this._updateLocation(this.props.history.location);
  },

  componentDidMount() {
    var { history } = this.props;

    if (history)
      history.addChangeListener(this.handleHistoryChange);

    // React doesn't fire the setState callback when we call setState
    // synchronously within componentWillMount, so we need this. Note
    // that we still only get one call to onUpdate, even if setState
    // was called multiple times in componentWillMount.
    if (this._alreadyUpdated && this.props.onUpdate)
      this.props.onUpdate.call(this);
  },

  componentWillReceiveProps(nextProps) {
    invariant(
      this.props.history === nextProps.history,
      '<Router history> may not be changed'
    );

    if (this.props.children !== nextProps.children) {
      this.routes = createRoutes(nextProps.children);

      // Call this now because _updateLocation uses
      // this.routes to determine state.
      this._updateLocation(nextProps.location);
    } else if (this.props.location !== nextProps.location) {
      this._updateLocation(nextProps.location);
    }
  },

  componentWillUnmount() {
    var { history } = this.props;

    if (history)
      history.removeChangeListener(this.handleHistoryChange);
  },

  childContextTypes: {
    router: object.isRequired
  },

  getChildContext() {
    return {
      router: this
    };
  },

  render() {
    return <RoutingContext {...this.state}/>;
  }

});

export default Router;
