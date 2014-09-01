/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var Link = Router.Link;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ul>
          <li><Link to="user" params={{userId: "123"}}>Bob</Link></li>
          <li><Link to="user" params={{userId: "123"}} query={{showAge: true}}>Bob With Query Params</Link></li>
          <li><Link to="user" params={{userId: "abc"}}>Sally</Link></li>
        </ul>
        {this.props.activeRouteHandler()}
      </div>
    );
  }
});

var User = React.createClass({
  render: function() {
    var age = this.props.query.showAge ? '33' : '';
    return (
      <div className="User">
        <h1>User id: {this.props.params.userId}</h1>
        {age}
      </div>
    );
  }
});

var routes = (
  <Routes>
    <Route handler={App}>
      <Route name="user" path="user/:userId" handler={User}/>
    </Route>
  </Routes>
);

React.renderComponent(routes, document.getElementById('example'));
