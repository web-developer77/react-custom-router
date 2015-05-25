import expect from 'expect';
import React from 'react';
import AsyncRouting from '../AsyncRouting';
import Location from '../Location';

function createPropAssertions (assertionsFunc, onRenderCount) {
  onRenderCount = onRenderCount || 1;
  var renderCount = 0;
  return class extends React.Component {
    render () {
      renderCount++;
      if (renderCount === onRenderCount)
        assertionsFunc(this.props);
      return null;
    }
  }
}

describe('AsyncRouting', () => {
  var div = document.createElement('div');

  class Component1 extends React.Component {
    render () {}
  }

  class Component2 extends React.Component {
    render () {}
  }

  class Component3 extends React.Component {
    render () {}
  }

  afterEach(() => {
    React.unmountComponentAtNode(div);
  });

  describe('with a synchronous route config', () => {
    var props = {
      location: new Location('/two/sally'),
      routes: {
        path: '/',
        component: Component1,
        childRoutes: [
          { path: 'two/:name', component: Component2 },
          { path: 'three', component: Component3 },
        ]
      }
    };

    it('passes components', () => {
      var Assertions = createPropAssertions((props) => {
        expect(props.components).toEqual([Component1, Component2]);
      });
      React.render(<AsyncRouting {...props}><Assertions/></AsyncRouting>, div);
    });

    it('passes matched route branch', () => {
      var Assertions = createPropAssertions((childProps) => {
        expect(childProps.branch).toEqual([props.routes, props.routes.childRoutes[0]]);
      });
      React.render(<AsyncRouting {...props}><Assertions/></AsyncRouting>, div);
    });

    it('passes params', () => {
      var Assertions = createPropAssertions((childProps) => {
        expect(childProps.params).toEqual({ name: 'sally' });
      });
      React.render(<AsyncRouting {...props}><Assertions/></AsyncRouting>, div);
    });
  });

  describe('with an asynchronous route config', () => {
    var parentRoute = {
      path: '/',
      getComponents (cb) {
        cb(null, Component1);
      },
      getChildRoutes (cb) {
        cb(null, childRoutes);
      }
    };

    var childRoutes = [
      { path: 'two/:name', getComponents (cb){ cb(null, Component2); } },
      { path: 'three', getComponents (cb) { cb(null, Component3); } }
    ];

    var props = {
      location: new Location('/two/sally'),
      routes: parentRoute
    };

    it('passes components', (done) => {
      var Assertions = createPropAssertions((props) => {
        expect(props.components).toEqual([Component1, Component2]);
        done();
      });
      React.render(<AsyncRouting {...props}><Assertions/></AsyncRouting>, div);
    });

    it('passes matched route branch', (done) => {
      var Assertions = createPropAssertions((childProps) => {
        expect(childProps.branch).toEqual([parentRoute, childRoutes[0]]);
        done();
      });
      React.render(<AsyncRouting {...props}><Assertions/></AsyncRouting>, div);
    });

    it('passes params', (done) => {
      var Assertions = createPropAssertions((childProps) => {
        expect(childProps.params).toEqual({ name: 'sally' });
        done();
      });
      React.render(<AsyncRouting {...props}><Assertions/></AsyncRouting>, div);
    });
  });

});

