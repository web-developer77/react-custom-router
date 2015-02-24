var React = require('react');
var assign = require('react/lib/Object.assign');
var PropTypes = require('./PropTypes');

var REF_NAME = '__routeHandler__';

var RouteHandlerMixin = {

  contextTypes: {
    routeHandlers: PropTypes.array.isRequired,
    router: PropTypes.router.isRequired
  },

  childContextTypes: {
    routeHandlers: PropTypes.array.isRequired
  },

  getChildContext: function () {
    return {
      routeHandlers: this.context.routeHandlers.concat([ this ])
    };
  },

  componentDidMount: function () {
    this._updateRouteComponent(this.refs[REF_NAME]);
  },

  componentDidUpdate: function () {
    this._updateRouteComponent(this.refs[REF_NAME]);
  },

  componentWillUnmount: function () {
    this._updateRouteComponent(null);
  },

  _updateRouteComponent: function (component) {
    this.context.router.setRouteComponentAtDepth(this.getRouteDepth(), component);
  },

  getRouteDepth: function () {
    return this.context.routeHandlers.length;
  },

  createChildRouteHandler: function (props) {
    var route = this.context.router.getRouteAtDepth(this.getRouteDepth());
    return route ? React.createElement(route.handler, assign({}, props || this.props, { ref: REF_NAME })) : null;
  }

};

module.exports = RouteHandlerMixin;
