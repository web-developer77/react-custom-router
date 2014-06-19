/** @jsx React.DOM */

var React = require('react');
var ReactRouter = require('../../modules/main');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ul>
          <li><Link to="dashboard">Dashboard</Link></li>
          <li><Link to="form">Form</Link></li>
        </ul>
        {this.props.activeRoute || <h1>Home</h1>}
      </div>
    );
  }
});

var Dashboard = React.createClass({
  render: function() {
    return <h1>Dashboard</h1>
  }
});

var Form = React.createClass({
  statics: {
    willTransitionFrom: function(transition, component) {
      if (component.refs.userInput.getDOMNode().value !== '') {
        if (!confirm('You have unsaved information, are you sure you want to leave this page?')) {
          transition.abort();
        }
      }
    }
  },

  handleSubmit: function(event) {
    event.preventDefault();
    this.refs.userInput.getDOMNode().value = '';
    Router.transitionTo('/');
  },

  render: function() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>Click the dashboard link with text in the input.</p>
          <input type="text" ref="userInput" defaultValue="ohai" />
          <button type="submit">Go</button>
        </form>
      </div>
    );
  }
});

Router(
  <Route handler={App}>
    <Route name="dashboard" handler={Dashboard} />
    <Route name="form" handler={Form} />
  </Route>
).renderComponent(document.body);

