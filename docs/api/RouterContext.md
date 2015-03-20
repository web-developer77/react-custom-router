API: Router Context
===================

The `context` feature of React is undocumented because its not
completely baked yet, however, it is commited to by the React team and
we use it with great effect in the Router. There are plans to make
reliance on context optional, but for now, this is what we use.

You access the router inside of route handlers with
`this.context.router`. Its got a few useful methods on it.

### `transitionTo(routeNameOrPath, [params[, query]])`

Programmatically transition to a new route.

#### Examples

```js
this.context.router.transitionTo('user', {id: 10}, {showAge: true});
this.context.router.transitionTo('about');
this.context.router.transitionTo('/users/10?showAge=true');
this.context.router.transitionTo('http://example.com/users/10?showAge=true');
```

### `replaceWith(routeNameOrPath, [params[, query]])`

Programmatically replace current route with a new route. Does not add an
entry into the browser history.

#### Examples

```js
this.context.router.replaceWith('user', {id: 10}, {showAge: true});
this.context.router.replaceWith('about');
this.context.router.replaceWith('/users/10?showAge=true');
```

### `goBack()`

Programmatically go back to the last route and remove the most recent
entry from the browser history. Returns `true` unless it's the first entry
in the app history.

#### Example

```js
this.context.router.goBack();
```

If you want to make sure there was a history entry to go back to, use the return value:

```js
if (!this.context.router.goBack()) {
  this.context.router.transitionTo('/otherpage')
}
```

### `makePath(routeName, params, query)`

Creates a URL path to a route.

### `makeHref(routeName, params, query)`

Creates an `href` to a route.

#### Example

```js
// given a route like this:
// <Route name="user" path="users/:userId"/>
this.context.router.makeHref('user', {userId: 123}); // "users/123"
```

### `getPath()`

Returns the current URL path, including query string.

### `getPathname()`

Returns the current URL path without the query string.

### `getParams()`

Returns a hash of the currently active URL params.

### `getQuery()`

Returns a hash of the currently active query params.

### `isActive(routeName, params, query)`

Returns `true` if a route, params, and query are active, `false`
otherwise.

### `getRoutes()`

Returns an array of the currently active routes, in nesting order.

Examples
--------

Often you'll want access to params and query:

```js
// route
<Route name="user" path="user/:name" handler={User} />

// handler
var User = React.createClass({
  render: function () {
    var name = this.context.router.getParams().name;
    return (
      <div>
        <h1>{name}</h1>
      </div>
    );
  }
});
```

Let's say you are using bootstrap and want to get `active` on those `li`
tags for the Tabs:

```js
var Link = require('react-router').Link;

var Tab = React.createClass({
  render: function () {
    var { router } = this.context;
    var isActive = router.isActive(this.props.to, this.props.params, this.props.query);
    var className = isActive ? 'active' : '';
    var link = (
      <Link {...this.props} />
    );
    return <li className={className}>{link}</li>;
  }

});

// use it just like <Link/>, and you'll get an anchor wrapped in an `li`
// with an automatic `active` class on both.
<Tab to="foo">Foo</Tab>
```

Some navigation:

```js
React.createClass({
  render: function() {
    var { router } = this.context;
    return (
      <div onClick={() => router.transitionTo('foo')}>Go to foo</div>
      <div onClick={() => router.replaceWith('bar')}>Go to bar without creating a new history entry</div>
      <div onClick={() => router.goBack()}>Go back</div>
    );
  }
});
```


