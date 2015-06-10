import React, { createElement, isValidElement } from 'react';
import warning from 'warning';
import invariant from 'invariant';
import { loopAsync } from './AsyncUtils';
import { createRoutes } from './RouteUtils';
import { getQueryString, parseQueryString, stringifyQuery, queryContains } from './URLUtils';
import { branchMatches, getProps, getTransitionHooks, createTransitionHook, getComponents } from './RoutingUtils';
import { routes, component, components, history, location } from './PropTypes';
import Location from './Location';

var { any, array, func, object, instanceOf } = React.PropTypes;

var ContextMixin = {

  childContextTypes: {
    router: object.isRequired
  },

  getChildContext() {
    return {
      router: this
    };
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

  transitionTo(pathname, query, state=null) {
    var path = this.makePath(pathname, query);
    var { history } = this.props;

    if (this.nextLocation) {
      history.replaceState(state, path);
    } else {
      history.pushState(state, path);
    }
  },

  replaceWith(pathname, query, state=null) {
    var path = this.makePath(pathname, query);
    var { history } = this.props;

    history.replaceState(state, path);
  },

  go(n) {
    this.props.history.go(n);
  },

  goBack() {
    this.go(-1);
  },

  goForward() {
    this.go(1);
  },
 
  isActive(pathname, query) {
    return branchMatches(this.state.branch, pathname) && queryContains(this.state.query, query);
  }

};

export var Router = React.createClass({

  mixins: [ ContextMixin ],

  statics: {
    
    match(routes, history, callback) {
      // TODO: Mimic what we're doing in _updateState, but statically
      // so we can get the right props for doing server-side rendering.
    }

  },

  propTypes: {
    history: history.isRequired,
    children: routes.isRequired,
    createElement: func.isRequired,
    parseQueryString: func.isRequired,
    stringifyQuery: func.isRequired,
    onError: func.isRequired,
    onUpdate: func,

    // For server-side rendering...
    location: any,
    branch: routes,
    params: object,
    query: object,
    components
  },

  getDefaultProps() {
    return {
      createElement,
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

  _updateState(location) {
    if (!Location.isLocation(location))
      location = Location.create(location);

    this.nextLocation = location;
    this.setState({ isTransitioning: true });

    getProps(this.routes, location, this.props.parseQueryString, (error, state) => {
      if (error || this.nextLocation !== location) {
        this._finishTransition(error);
      } else if (state == null) {
        this._finishTransition();
        warning(false, 'Location "%s" did not match any routes', location.path);
      } else {
        state.location = location;

        this._runTransitionHooks(state, (error) => {
          if (error || this.nextLocation !== location) {
            this._finishTransition(error);
          } else {
            this._getComponents(state, (error, components) => {
              if (error || this.nextLocation !== location) {
                this._finishTransition(error);
              } else {
                state.components = components;

                this._finishTransition(null, state);
              }
            });
          }
        });
      }
    });
  },

  _finishTransition(error, state) {
    this.setState({ isTransitioning: false });
    this.nextLocation = null;

    if (error) {
      this.handleError(error);
    } else if (state) {
      this.setState(state, this.props.onUpdate);
      this._alreadyUpdated = true;
    }
  },

  _runTransitionHooks(nextState, callback) {
    // Run component hooks before route hooks.
    var hooks = this.transitionHooks.map(hook => createTransitionHook(hook, this));

    hooks.push.apply(
      hooks,
      getTransitionHooks(this.state, nextState)
    );

    var nextLocation = this.nextLocation;

    loopAsync(hooks.length, (index, next, done) => {
      var hook = hooks[index];

      hooks[index].call(this, nextState, this, (error) => {
        if (error || this.nextLocation !== nextLocation) {
          done.call(this, error); // No need to continue.
        } else {
          next.call(this);
        }
      });
    }, callback);
  },

  _getComponents(nextState, callback) {
    if (this.props.components) {
      callback(null, this.props.components);
    } else {
      getComponents(nextState, callback);
    }
  },

  _createElement(component, props) {
    return typeof component === 'function' ? this.props.createElement(component, props) : null;
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

  componentWillMount() {
    var { children, history } = this.props;

    this.routes = createRoutes(children);
    this.transitionHooks = [];
    this.nextLocation = null;

    if (typeof history.setup === 'function')
      history.setup();

    // We need to listen first in case we redirect immediately.
    if (history.addChangeListener)
      history.addChangeListener(this.handleHistoryChange);

    this._updateState(history.location);
  },

  handleHistoryChange() {
    this._updateState(this.props.history.location);
  },

  componentDidMount() {
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

      // Call this here because _updateState
      // uses this.routes to determine state.
      if (nextProps.history.location)
        this._updateState(nextProps.history.location);
    }
  },

  componentWillUnmount() {
    var { history } = this.props;

    if (history.removeChangeListener)
      history.removeChangeListener(this.handleHistoryChange);
  },

  render() {
    var { location, branch, params, query, components, isTransitioning } = this.state;
    var element = null;

    if (components) {
      element = components.reduceRight((element, components, index) => {
        if (components == null)
          return element; // Don't create new children; use the grandchildren.

        var route = branch[index];
        var props = { location, params, query, route, isTransitioning };

        if (isValidElement(element)) {
          props.children = element;
        } else if (element) {
          // In render, do var { header, sidebar } = this.props;
          Object.assign(props, element);
        }

        if (typeof components === 'object') {
          var elements = {};

          for (var key in components)
            if (components.hasOwnProperty(key))
              elements[key] = this._createElement(components[key], props);

          return elements;
        }

        return this._createElement(components, props);
      }, element);
    }

    invariant(
      element === null || element === false || isValidElement(element),
      'The root route must render a single element'
    );

    return element;
  }

});

export default Router;
