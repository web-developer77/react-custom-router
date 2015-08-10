[![build status](https://img.shields.io/travis/rackt/react-router/master.svg?style=flat-square)](https://travis-ci.org/rackt/react-router)
[![npm package](https://img.shields.io/npm/v/react-router.svg?style=flat-square)](https://www.npmjs.org/package/react-router)
[![react-router channel on slack](https://img.shields.io/badge/slack-react--router@reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)

<img src="https://rackt.github.io/react-router/img/vertical.png" width="300"/>

A complete routing library for React. https://rackt.github.io/react-router

React Router keeps your UI in sync with the URL. It has a simple API
with powerful features like lazy code loading, dynamic route matching,
and location transition handling built right in. Make the URL your first
thought, not an after-thought.

### Docs & Help

- [Guides and API Docs](https://rackt.github.io/react-router)
- [Upgrade Guide](/UPGRADE_GUIDE.md)
- [Changelog](/CHANGELOG.md)
- [#react-router channel on reactiflux](http://www.reactiflux.com/)

**Note: the docs and the examples in master refer to the 1.0 Beta and may be incomplete.**  
**Browse [the website](http://rackt.github.io/react-router/) and [the 0.13.3 tag](https://github.com/rackt/react-router/tree/v0.13.3) for the information about the latest stable version.**

### Browser Support

We support all browsers and environments where React runs.

### Installation

#### npm + webpack/browserify

    $ npm install react-router

Then with a module bundler or webpack, use as you would anything else:

```js
// using an ES6 transpiler
import { Router, Route, Link } from 'react-router';

// not using an ES6 transpiler
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
```

There's also a `lib/umd` folder containing a UMD version.

#### bower + who knows what

    $ bower install react-router

Find the UMD/global build in `lib/umd`, and the library on `window.ReactRouter`. Best of luck to you. :)

#### CDN

If you just want to drop a `<script>` tag in your page and be done with it, you can use the UMD/global build [hosted on cdnjs](https://cdnjs.com/libraries/react-router).

### What's it look like?

```js
import { Router, Route } from 'react-router';
import { history } from 'react-router/lib/BrowserHistory';

var App = React.createClass({/*...*/});
var About = React.createClass({/*...*/});
// etc.

var Users = React.createClass({
  render() {
    return (
      <div>
        <h1>Users</h1>
        <div className="master">
          <ul>
            {/* use Link to route around the app */}
            {this.state.users.map(user => (
              <li key={user.id}><Link to={`/user/${user.id}`}>{user.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="detail">
          {this.props.children}
        </div>
      </div>
    );
  }
});

var User = React.createClass({
  componentDidMount() {
    this.setState({
      // route components are rendered with useful information, like URL params
      user: findUserById(this.props.params.userId)
    });
  },

  render() {
    return (
      <div>
        <h2>{this.state.user.name}</h2>
        {/* etc. */}
      </div>
    );
  }
});

// Declarative route configuration (could also load this config lazily
// instead, all you really need is a single root route, you don't need to
// colocate the entire config).
React.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="users" component={Users}>
        <Route path="/user/:userId" component={User}/>
      </Route>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.body);
```

See more in the [overview guide](/doc/00 Guides/0 Overview.md) and [Advanced
Usage](/doc/00 Guides/Advanced Usage.md)

### Thanks

React Router was initially inspired by Ember's fantastic router. Many
thanks to the Ember team.

Also, thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.
