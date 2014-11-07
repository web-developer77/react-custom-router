/** @jsx React.DOM */
var assert = require('assert');
var expect = require('expect');
var React = require('react/addons');
var Redirect = require('../Redirect');
var Route = require('../Route');
var Router = require('../../Router');
var ActiveRouteHandler = require('../../components/ActiveRouteHandler');
var testLocation = require('../../locations/TestLocation');

var Nested = React.createClass({
  render: function () {
    return (
      <div>
        hello
        <ActiveRouteHandler />
      </div>
    );
  }
});

var Foo = React.createClass({
  render: function () {
    return <div>foo</div>;
  }
});

var RedirectTarget = React.createClass({
  render: function () {
    return <div>redirected</div>;
  }
});



describe('Redirect', function() {

  describe('at the root of the config', function() {
    it('redirects', function () {
      var location = testLocation('/foo');
      var div = document.createElement('div');
      var routes = [
        <Redirect from="/foo" to="/bar"/>,
        <Route path="/bar" handler={RedirectTarget}/>
      ];
      Router.run(routes, location, function (Handler) {
        var html = React.render(<Handler />, div);
        expect(div.innerHTML).toMatch(/redirected/);
      });
    });
  });

  describe('nested deeply in the config', function() {
    it('redirects with absolute paths', function () {
      var div = document.createElement('div');
      var routes = (
        <Route path="/" handler={Nested}>
          <Route path="foo" handler={Nested}>
            <Redirect from="/foo/bar" to="/baz" />
          </Route>
          <Route path="baz" handler={RedirectTarget}/>
        </Route>
      );
      Router.run(routes, testLocation('/foo/bar'), function (Handler) {
        var html = React.render(<Handler />, div);
        expect(div.innerHTML).toMatch(/redirected/);
      });
    });

    it('redirects with relative paths', function () {
      var div = document.createElement('div');
      var routes = (
        <Route path="/" handler={Nested}>
          <Route path="foo" handler={Nested}>
            <Redirect from="bar" to="/baz" />
          </Route>
          <Route path="baz" handler={RedirectTarget}/>
        </Route>
      );
      Router.run(routes, testLocation('/foo/bar'), function (Handler) {
        var html = React.render(<Handler />, div);
        expect(div.innerHTML).toMatch(/redirected/);
      });
    });
  });
});

