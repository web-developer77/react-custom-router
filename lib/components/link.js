var React = require('react');
var invariant = require('react/lib/invariant');
var path = require('../path');
var urlStore = require('../stores/url-store');

var RESERVED_PROPS = {
  activeClassName: true,
  to: true,
  query: true,
  children: true // ReactChildren
};

var Link = React.createClass({

  statics: {

    /**
     * Returns an href that can be used to link to the given path or
     * route name, params, and query.
     */
    makeHref: function (to, params, query) {
      return makeHref(resolveTo(to), params, query);
    },

    getUnreservedProps: function (props) {
      var unreservedProps = {};

      for (var name in props) {
        if (!RESERVED_PROPS[name]) {
          unreservedProps[name] = props[name];
        }
      }

      return unreservedProps;
    }

  },

  propTypes: {
    activeClassName: React.PropTypes.string.isRequired,
    to: React.PropTypes.string.isRequired,
    query: React.PropTypes.object
  },

  getDefaultProps: function () {
    return {
      activeClassName: 'active'
    };
  },

  getInitialState: function () {
    return {
      isActive: false
    };
  },

  /**
   * Returns the pattern this <Link> uses to match the URL.
   */
  getPattern: function () {
    return resolveTo(this.props.to);
  },

  /**
   * Returns a hash of URL parameters this <Link> interpolates into its pattern (see getPattern).
   */
  getParams: function () {
    return Link.getUnreservedProps(this.props);
  },

  /**
   * Returns a hash of query string parameters this <Link> appends to its path.
   */
  getQuery: function () {
    return this.props.query;
  },

  /**
   * Returns the value of the "href" attribute to use on the <a> element.
   */
  getHref: function () {
    return makeHref(this.getPattern(), this.getParams(), this.getQuery());
  },

  /**
   * Returns the value of the "class" attribute to use on the <a> element, which contains
   * the value of the "activeClassName" property when this <Link> is active.
   */
  getClassName: function () {
    var className = this.props.className || '';

    if (this.state.isActive)
      return className + ' ' + this.props.activeClassName;

    return className;
  },

  componentWillMount: function () {
    urlStore.addChangeListener(this.handleRouteChange);
    this.updateActive(urlStore.getCurrentPath());
  },

  componentWillUnmount: function () {
    urlStore.removeChangeListener(this.handleRouteChange);
  },

  handleRouteChange: function () {
    this.updateActive(urlStore.getCurrentPath());
  },

  updateActive: function (currentPath) {
    // Make sure this link's params are present in the URL.
    var params = path.extractParams(this.getPattern(), path.withoutQuery(currentPath));
    var isActive = !!(params && hasUriProperties(params, this.getParams()));

    if (isActive) {
      var query = this.getQuery();
      var activeQuery = path.extractQuery(currentPath);

      // Make sure this link's query is in the URL, if it has one.
      if (query)
        isActive = !!(activeQuery && hasUriProperties(activeQuery, query));
    }

    this.setState({
      isActive: isActive
    });
  },

  follow: function () {
    urlStore.push(this.getHref());
  },

  handleClick: function (event) {
    if (!isModifiedEvent(event)) {
      event.preventDefault();
      this.follow();
    }
  },

  render: function () {
    var props = {
      href: this.getHref(),
      className: this.getClassName(),
      onClick: this.handleClick
    };

    return React.DOM.a(props, this.props.children);
  }

});

function makeHref(pattern, params, query) {
  var relativePath = path.withQuery(path.injectParams(pattern, params), query);
  var prefix = urlStore.getLocation() === 'history' ? '/' : '#/';

  return prefix + relativePath;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.ctrlKey || event.shiftKey);
}

function hasUriProperties(object, properties) {
  for (var name in object) {
    if (object[name] !== encodeURIComponent(properties[name])) {
      return false;
    }
  }

  return true;
}

var Router = require('../router');

function resolveTo(to) {
  if (to.charAt(0) === '/')
    return path.normalize(to); // Absolute path.

  var router = Router.lookup(to);

  invariant(
    router,
    'Unable to resolve <Link to="' + to + '">. Make sure you have a <Route name="' + to + '">.'
  );

  return router.pattern;
}

module.exports = Link;

