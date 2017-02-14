# &lt;Route> {id=route}

Renders some UI when a URL matches a location.

```js
import { BrowserRouter as Router, Route } from 'react-router-dom'

<Router>
  <div>
    <Route exact path="/" component={Home}/>
    <Route path="/news" component={NewsFeed}/>
  </div>
</Router>
```

There are 3 ways to render something with a `<Route>`:

- [`<Route component>`](#route.component)
- [`<Route render>`](#route.render)
- [`<Route children>`](#route.children)

You should use only one of these props on a given `<Route>`. See their explanations below to understand why you have 3 options.

## component: func _`<Route>`_ {id=route.component}

A React component to render when the location matches. The component receives all the properties on [`context.router`](#context.router).

```js
<Route path="/user/:username" component={User}/>
```

```js
const User = ({ match }) => {
  return <h1>Hello {match.params.username}!</h1>
}
```

When you use `component` (instead of `render`, below) the router uses [`React.createElement`](https://facebook.github.io/react/docs/react-api.html#createelement) to create a new [React element](https://facebook.github.io/react/docs/rendering-elements.html) from the given component.

## render: func _`<Route>`_ {id=route.render}

Instead of having a new [React element](https://facebook.github.io/react/docs/rendering-elements.html) created for you using the [`component`](#route.component) prop, you can pass in a function to be called when the location matches. This function will be called with the same props that are passed to the `component`.

This allows for convenient inline match rendering and wrapping.

```js
// convenient inline rendering
<Route path="/home" render={() => <div>Home</div>}/>

// wrapping/composing
const FadingRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={matchProps => (
    <FadeIn>
      <Component {...matchProps}/>
    </FadeIn>
  )}/>
)

<FadingRoute path="/cool" component={Something}/>
```

**NOTE:** `<Route component>` takes precendence over `<Route render>` so don't use both in the same `<Route>`.

## children: func _`<Route>`_ {id=route.children}

Sometimes you need to render whether the path matches the location or not. In these cases, you can use the function `children` prop. It works exactly like `render` except that it gets called whether there is a match or not.

The children prop will be called with an object that contains a `match` and a `history` property. `match` will be null if there was no match. This will allow you to dynamically adjust your UI based on if the route matches or not.

Here we're adding an `active` class if the route matches

```js
<ul>
  <ListItemLink to="/somewhere"/>
  <ListItemLink to="/somewhere-else"/>
</ul>

const ListItemLink = ({ to, ...rest }) => (
  <Route path={to} children={({ match }) => (
    <li className={match ? 'active' : ''}>
      <Link to={to} {...rest}/>
    </li>
  )}/>
)
```

This could also be useful for animations:

```js
<Route children={({ match, ...rest}) => (
  {/* Animate will always render, so you can use lifecycles
      to animate its child in and out */}
  <Animate>
    {match && <Something {...rest}/>}
  </Animate>
)}/>
```

**NOTE:** Both `<Route component>` and `<Route render>` take precendence over `<Route children>` so don't use more than one in the same `<Route>`.

## path: string _`<Route>`_ {id=route.path}

Any valid URL path that [`path-to-regexp`](https://www.npmjs.com/package/path-to-regexp) understands.

```js
<Route path="/users/:id" component={User}/>
```

Routes without a `path` _always_ match.

## exact: bool _`<Route>`_ {id=route.exact}

When `true`, will only match if the path matches the `location.pathname` _exactly_.

```js
<Route exact path="/one" component={About}/>
```

| path | location.pathname | exact | matches? |   
|---|---|---|---|---|   
| `/one`  | `/one/two`  | `true` | no |   
| `/one`  | `/one/two`  | `false` | yes |   

## strict: bool _`<Route>`_ {id=route.strict}

When `true`, a `path` that has a trailing slash will only match a `location.pathname` with a trailing slash. This has no effect when there are additional URL segments in the `location.pathname`.

```js
<Route strict path="/one/" component={About}/>
```

| path | location.pathname | matches? |
| --- | --- | --- |
| `/one/` | `/one` | no |
| `/one/` | `/one/` | yes |
| `/one/` | `/one/two` | yes |

**NOTE:** `strict` can be used to enforce that a `location.pathname` has no trailing slash, but in order to do this both `strict` and `exact` must be `true`.

```js
<Route exact strict path="/one" component={About}/>
```

| path | location.pathname | matches? |
| --- | --- | --- |
| `/one` | `/one` | yes |
| `/one` | `/one/` | no |
| `/one` | `/one/two` | no |
