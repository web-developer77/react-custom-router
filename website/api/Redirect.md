# `<Redirect>`

Rendering a `Redirect` will navigate to a new location and add the
previous location onto the next location state.

(If this freaks you out you can use the imperative API from the `router`
on context.)

```js
<Match pattern="/" exactly render={() => (
  loggedIn ? (
    <Redirect to="/dashboard"/>
  ) : (
    <PublicHomePage/>
  )
)}/>
```


## `to: string`

The pathname to redirect to.

```js
<Redirect to="/somewhere/else" />
```

## `to: location`

A location descriptor to redirect to.

```js
<Redirect to={{
  pathname: '/login',
  query: { utm: 'your+face' },
  state: { referrer: currentLocation }
}}/>
```

# `</Redirect>`
