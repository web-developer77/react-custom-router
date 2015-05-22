Renders a branch of route components given a location.

Props
-----

Generally you do not need to provide any props to `Router`. It should be
used as a direct child of a [History][History] component, which will
automatically inject the location prop it needs and then `Router` will
match the location to the routes and manage all the state it needs to
render.

However, there are cases where you need to provide `Router` with that
state manually.

On the server you want to fetch data before rendering, and typically you
want `Router` to help you decide what to fetch. However, `Router`
determines its state after render, which is too late for server
rendering. React Router provides a `match` function that calculates the
state you need before rendering, then you pass it in as props.

For testing, you can simply render `Router` with stubbed props
representing the state you want to test.

### `location`

A [location][location] from a [History][History] or a string path for
server rendering and testing.

### `params`

An object of the names/values that correspond with dynamic segments in your route path.

### `branch`

An array of matched [routes][route] for a location.

### `components`

An array of route components from the route branch.

### `children`

A single [Middleware][Middleware] child.

Examples
--------

### Typical Usage

```js
import { Router, BrowserHistory } from 'react-router';
import routes from './routes';
React.render((
  <BrowserHistory>
    <Router routes={routes}/>
  </BrowserHistory>
));
```

### With Middleware

```js
import { Router, BrowserHistory } from 'react-router';
import routes from './routes';

React.render((
  <BrowserHistory>
    <Router routes={routes}>
      <Transitions>
        <RestoreScroll/>
      </Transitions>
    </Router>
  </BrowserHistory>
));
```

### Server Rendering

```js
import { match, Router } from 'react-router';
import routes from './routes';

someServer((req, res) => {
  match(req.path, routes, (err, props) => {
    // props contains location, params, branch, components,
    // useful for loading up some data, you could get queries from your
    // matched components, etc.
    loadData(props, (err, data) => {
      // pass in the props and `Router` will use them for initial state
      var markup = React.renderToString(<Router {...props} routes={routes}/>);
    });
  });
});
```

### Testing

Just stub all the props and make your assertions. Though, you're really
just testing `Router`, a component React Router already tests.  You
should probably just test your components.

```js
it('does stuff', () => {
  var stubs = {
    location: '/friends/sally',
    params: { friendName: 'sally' },
    branch: [
      { component: App },
      { path: '/friends/:name', component: Friend }
    ]
    components: [App, Friend]
  };
  var subject = <Router routes={routes} {...stubs}/>;
  expect(subject).toBeAwesome();
});
```

  [location]:#TODO
  [History]:#TODO
  [route]:#TODO
  [Middleware]:#TODO

