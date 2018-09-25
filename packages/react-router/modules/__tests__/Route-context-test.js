import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { createMemoryHistory as createHistory } from "history";

import Router from "../Router";
import RouterContext from "../RouterContext";
import Route from "../Route";

describe("A <Route>", () => {
  const node = document.createElement("div");

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  describe("context", () => {
    let context;
    function ContextChecker() {
      return (
        <RouterContext.Consumer>
          {value => {
            context = value;
            return null;
          }}
        </RouterContext.Consumer>
      );
    }

    afterEach(() => {
      context = undefined;
    });

    it("has a `history` property", () => {
      const history = createHistory();

      ReactDOM.render(
        <Router history={history}>
          <Route component={ContextChecker} />
        </Router>,
        node
      );

      expect(context.history).toBe(history);
    });

    it("has a `location` property", () => {
      const history = createHistory();

      ReactDOM.render(
        <Router history={history}>
          <Route component={ContextChecker} />
        </Router>,
        node
      );

      expect(context.location).toBe(history.location);
    });

    it("has a `match` property", () => {
      const history = createHistory({
        initialEntries: ["/"]
      });

      ReactDOM.render(
        <Router history={history}>
          <Route component={ContextChecker} />
        </Router>,
        node
      );

      expect(context.match).toMatchObject({
        path: "/",
        url: "/",
        params: {},
        isExact: true
      });
    });
  });

  describe("legacy context", () => {
    let context;
    class LegacyContextChecker extends React.Component {
      static contextTypes = {
        router: PropTypes.object.isRequired
      };

      render() {
        context = this.context.router;
        return null;
      }
    }

    afterEach(() => {
      context = undefined;
    });

    it("has a `history` property", () => {
      const history = createHistory();

      ReactDOM.render(
        <Router history={history}>
          <Route component={LegacyContextChecker} />
        </Router>,
        node
      );

      expect(context.history).toBe(history);
    });

    it("has a `location` property", () => {
      const history = createHistory();

      ReactDOM.render(
        <Router history={history}>
          <Route component={LegacyContextChecker} />
        </Router>,
        node
      );

      expect(context.location).toBe(history.location);
    });

    it("has a `match` property", () => {
      const history = createHistory({
        initialEntries: ["/"]
      });

      ReactDOM.render(
        <Router history={history}>
          <Route component={LegacyContextChecker} />
        </Router>,
        node
      );

      expect(context.match).toMatchObject({
        path: "/",
        url: "/",
        params: {},
        isExact: true
      });
    });
  });
});
