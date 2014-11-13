/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var Link = Router.Link;
var ActiveRouteHandler = Router.ActiveRouteHandler;

var AsyncReactComponent = {
  loadedComponent: null,

  load: function () {
    if (this.constructor.loadedComponent) {
      return;
    }

    this.bundle(function (component) {
      this.constructor.loadedComponent = component;
      this.forceUpdate();
    }.bind(this));
  },

  componentDidMount: function () {
    setTimeout(this.load, 1000); // feel it good
  },

  render: function () {
    var component = this.constructor.loadedComponent;
    if (component) {
      // can't find ActiveRouteHandler in the loaded component, so we just grab
      // it here first.
      this.props.activeRoute = <ActiveRouteHandler />;
      return component(this.props);
    }
    return this.preRender();
  }
};

var PreDashboard = React.createClass({
  mixins: [AsyncReactComponent],
  bundle: require('bundle?lazy!./dashboard.js'),
  preRender: function () {
    return <div>Loading dashboard...</div>
  }
});

var PreInbox = React.createClass({
  mixins: [AsyncReactComponent],
  bundle: require('bundle?lazy!./inbox.js'),
  preRender: function () {
    return <div>Loading inbox...</div>
  }
});

var App = React.createClass({
  render: function () {
    return (
      <div>
        <h1>Partial App</h1>
        <ul>
          <li><Link to="dashboard">Dashboard</Link></li>
        </ul>
        <ActiveRouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route handler={App}>
    <Route name="dashboard" path="dashboard" handler={PreDashboard}>
      <Route name="inbox" path="dashboard/inbox" handler={PreInbox}/>
    </Route>
  </Route>
);

Router.run(routes, function (Handler) {
  React.renderComponent(<Handler/>, document.getElementById('example'));
});

