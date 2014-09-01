/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var Link = Router.Link;

var App = React.createClass({
  getInitialState: function() {
    return { states: findStates() }
  },

  indexTemplate: function() {
    return <p>Select a state from the left</p>;
  },

  render: function() {
    var links = this.state.states.map(function(state) {
      return <li><Link to="state" abbr={state.abbr}>{state.name}</Link></li>
    });
    return (
      <div className="App">
        <ul className="Master">
          {links}
        </ul>
        <div className="Detail">
          {this.props.activeRouteHandler() || this.indexTemplate()}
        </div>
      </div>
    );
  }
});

var State = React.createClass({
  getInitialState: function() {
    return findState(this.props.params.abbr);
  },

  imageUrl: function() {
    return "http://www.50states.com/maps/"+underscore(this.state.name)+".gif";
  },

  render: function() {
    return (
      <div className="State">
        <h1>{this.state.name}</h1>
        <img src={this.imageUrl()}/>
      </div>
    );
  }
});

var routes = (
  <Routes>
    <Route handler={App}>
      <Route name="state" path="state/:abbr" addHandlerKey={true} handler={State}/>
    </Route>
  </Routes>
);

React.renderComponent(routes, document.getElementById('example'));

/*****************************************************************************/
// data stuff

function findState(abbr) {
  var states = findStates();
  for (var i = 0, l = states.length; i < l; i ++) {
    if (states[i].abbr === abbr) {
      return states[i];
    }
  }
}

function findStates() {
  return [
    { abbr: "AL", name: "Alabama"},
    { abbr: "AK", name: "Alaska"},
    { abbr: "AZ", name: "Arizona"},
    { abbr: "AR", name: "Arkansas"},
    { abbr: "CA", name: "California"},
    { abbr: "CO", name: "Colorado"},
    { abbr: "CT", name: "Connecticut"},
    { abbr: "DE", name: "Delaware"},
    { abbr: "FL", name: "Florida"},
    { abbr: "GA", name: "Georgia"},
    { abbr: "HI", name: "Hawaii"},
    { abbr: "ID", name: "Idaho"},
    { abbr: "IL", name: "Illinois"},
    { abbr: "IN", name: "Indiana"},
    { abbr: "IA", name: "Iowa"},
    { abbr: "KS", name: "Kansas"},
    { abbr: "KY", name: "Kentucky"},
    { abbr: "LA", name: "Louisiana"},
    { abbr: "ME", name: "Maine"},
    { abbr: "MD", name: "Maryland"},
    { abbr: "MA", name: "Massachusetts"},
    { abbr: "MI", name: "Michigan"},
    { abbr: "MN", name: "Minnesota"},
    { abbr: "MS", name: "Mississippi"},
    { abbr: "MO", name: "Missouri"},
    { abbr: "MT", name: "Montana"},
    { abbr: "NE", name: "Nebraska"},
    { abbr: "NV", name: "Nevada"},
    { abbr: "NH", name: "New Hampshire"},
    { abbr: "NJ", name: "New Jersey"},
    { abbr: "NM", name: "New Mexico"},
    { abbr: "NY", name: "New York"},
    { abbr: "NC", name: "North Carolina"},
    { abbr: "ND", name: "North Dakota"},
    { abbr: "OH", name: "Ohio"},
    { abbr: "OK", name: "Oklahoma"},
    { abbr: "OR", name: "Oregon"},
    { abbr: "PA", name: "Pennsylvania"},
    { abbr: "RI", name: "Rhode Island"},
    { abbr: "SC", name: "South Carolina"},
    { abbr: "SD", name: "South Dakota"},
    { abbr: "TN", name: "Tennessee"},
    { abbr: "TX", name: "Texas"},
    { abbr: "UT", name: "Utah"},
    { abbr: "VT", name: "Vermont"},
    { abbr: "VA", name: "Virginia"},
    { abbr: "WA", name: "Washington"},
    { abbr: "WV", name: "West Virginia"},
    { abbr: "WI", name: "Wisconsin"},
    { abbr: "WY", name: "Wyoming"}
  ];
}

function underscore(str) {
  return str.toLowerCase().replace(/ /, '_');
}
