import React from 'react';
import createHistory from 'history/lib/createHashHistory';
import { Router, Route, Link, Navigation } from 'react-router';

var App = React.createClass({
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/form">Form</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
});

var Home = React.createClass({
  render() {
    return <h1>Home</h1>;
  }
});

var Dashboard = React.createClass({
  render() {
    return <h1>Dashboard</h1>;
  }
});

var Form = React.createClass({
  mixins: [ Navigation ],

  getInitialState() {
    return {
      textValue: 'ohai'
    };
  },

  transitionHook() {
    if (this.state.textValue)
      return 'You have unsaved information, are you sure you want to leave this page?';
  },

  componentDidMount() {
    history.registerTransitionHook(this.transitionHook);
  },

  componentWillUnmount() {
    history.unregisterTransitionHook(this.transitionHook);
  },

  handleChange(event) {
    var { value } = event.target;

    this.setState({
      textValue: value
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      textValue: ''
    }, () => {
      this.transitionTo('/');
    });
  },

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>Click the dashboard link with text in the input.</p>
          <input type="text" ref="userInput" value={this.state.textValue} onChange={this.handleChange} />
          <button type="submit">Go</button>
        </form>
      </div>
    );
  }
});

var history = createHistory();

React.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="dashboard" component={Dashboard} />
      <Route path="form" component={Form} />
    </Route>
  </Router>
), document.getElementById('example'));
