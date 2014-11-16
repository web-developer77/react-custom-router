/** @jsx React.DOM */
var assert = require('assert');
var expect = require('expect');
var React = require('react/addons');
var Router = require('../../Router');
var TestLocation = require('../../locations/TestLocation');
var { Nested, Bar } = require('../../__tests__/TestHandlers');
var Redirect = require('../Redirect');
var Route = require('../Route');

describe('Redirect', function () {

  describe('at the root of the config', function () {
    it('redirects', function () {
      TestLocation.history = [ '/foo' ];

      var div = document.createElement('div');
      var routes = [
        <Redirect from="/foo" to="/bar"/>,
        <Route path="/bar" handler={Bar}/>
      ];

      Router.run(routes, TestLocation, function (Handler) {
        var html = React.render(<Handler />, div);
        expect(div.innerHTML).toMatch(/Bar/);
      });
    });
  });

  describe('nested deeply in the config', function () {
    it('redirects with absolute paths', function () {
      TestLocation.history = [ '/foo/bar' ];

      var div = document.createElement('div');
      var routes = (
        <Route path="/" handler={Nested}>
          <Route path="foo" handler={Nested}>
            <Redirect from="/foo/bar" to="/baz" />
          </Route>
          <Route path="baz" handler={Bar}/>
        </Route>
      );

      Router.run(routes, TestLocation, function (Handler) {
        var html = React.render(<Handler />, div);
        expect(div.innerHTML).toMatch(/Bar/);
      });
    });

    it('redirects with relative paths', function () {
      TestLocation.history = [ '/foo/bar' ];

      var div = document.createElement('div');
      var routes = (
        <Route path="/" handler={Nested}>
          <Route path="foo" handler={Nested}>
            <Redirect from="bar" to="/baz" />
          </Route>
          <Route path="baz" handler={Bar}/>
        </Route>
      );

      Router.run(routes, TestLocation, function (Handler) {
        var html = React.render(<Handler />, div);
        expect(div.innerHTML).toMatch(/Bar/);
      });
    });
  });

});
