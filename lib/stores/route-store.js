import React from 'react';
module path from '../path';

/**
 * A hash of routes keyed by route name.
 */
var _namedRoutes = {};

/**
 * Gets the <Route> with the given name.
 */
export function getRouteByName(routeName) {
  return _namedRoutes[routeName];
}

/**
 * Makes a URL path for the route with the given name, interpolated
 * with the given params.
 */
export function makePathForRouteName(routeName, params) {
  var route = getRouteByName(routeName);

  if (!route)
    throw new Error('No route with name: ' + routeName);

  return path.injectParams(computeRoutePath(route), params);
}

var _routeTree = [];

/**
 * Recursively stores all <Route>s under the given <Routes> component in the
 * route tree, which has the following format:
 *
 *   {
 *     route: <Route>,
 *     computedPath: '...',
 *     childRoutes: [
 *       { route: <Route>, computedPath: '...', childRoutes: [ ... ] },
 *       { route: <Route>, computedPath: '...' }
 *     ]
 *   }
 *
 * Note that if a <Route> doesn't specify a "path" prop, the value of
 * its "name" prop is used as its computedPath. If no "name" is specified,
 * the computedPath is an empty string.
 */
export function storeRoutes(routes) {
  if (routes.props.children) {
    React.Children.forEach(routes.props.children, function (route) {
      storeRoute(route, _routeTree);
    });
  }
}

function storeRoute(route, _tree) {
  if (route.props.name)
    _namedRoutes[route.props.name] = route;

  var node = { route: route, computedPath: computeRoutePath(route) };
  _tree.push(node);

  // TODO: console.warn here if a child's computedPath doesn't contain
  // some dynamic segments that are contained in any of its parents.

  if (route.props.children) {
    node.childRoutes = [];

    React.Children.forEach(route.props.children, function (child) {
      storeRoute(child, node.childRoutes);
    });
  }
}

function computeRoutePath(route) {
  return (route.props.path || route.props.name || '').replace(/^\/+/, '');
}

var _activeRoutes = [];

/**
 * Returns an array of currently active routes, ordered by depth in the route tree.
 */
export function getActiveRoutes() {
  return _activeRoutes;
}

/**
 * Returns the currently active route.
 */
export function getActiveRoute() {
  return _activeRoutes[_activeRoutes.length - 1];
}

/**
 * Returns true if the given <Route> is currently active.
 */
export function isActiveRoute(route) {
  return _activeRoutes.indexOf(route) !== -1;
}

var _activeParams = {};

/**
 * Returns a hash of the currently active URL parameters.
 */
export function getActiveParams() {
  return _activeParams;
}

/**
 * Updates the currently active routes and URL parameters.
 */
export function updateActive(activePath) {
  _activeParams = findActiveParams(activePath, _routeTree, _activeRoutes = []);

  if (!_activeParams && activePath)
    console.warn('No routes matched path: ' + activePath);
}

/**
 * Attempts to match the active path against the computed paths of routes in the
 * given tree, returning the the URL parameters from the first one that matches.
 * Along the way, the given _routes array is populated with <Route> objects that
 * are parents of the matching route, in the order they appear in the tree.
 */
function findActiveParams(activePath, tree, _routes) {
  return findFirst(tree, function (node) {
    var route = node.route;
    var params = path.extractParams(node.computedPath, activePath);

    if (params) {
      _routes.unshift(route);
      return params;
    }

    if (node.childRoutes) {
      params = findActiveParams(activePath, node.childRoutes, _routes);

      if (params) {
        _routes.unshift(route);
        return params;
      }
    }
  });
}

/**
 * Returns the first truthy value that is returned from applying the given
 * callback to each element in the given array.
 */
function findFirst(array, callback, context) {
  var value;
  for (var i = 0, length = array.length; i < length; ++i) {
    if (value = callback.call(context, array[i], i, array)) {
      return value;
    }
  }
}
