# Location

The word "location" in React Router refers to a particular entry in the history
stack, usually analogous to a "page" or "screen" in your app. As the user clicks
on links and moves around the app, the location changes.

A `location` object has the following interface:

<pre>
interface Location {
  <a href="#locationpathname" title="location.pathname">pathname</a>: string;
  <a href="#locationsearch" title="location.search">search</a>: string;
  <a href="#locationhash" title="location.hash">hash</a>: string;
  <a href="#locationstate" title="location.state">state</a>: object | null;
  <a href="#locationkey" title="location.key">key</a>: string;
}
</pre>

## `location.pathname`

The `location.pathname` property contains an initial `/` followed by the
remainder of the URL up to the `?`.

See also [`URL.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname).

## `location.search`

The `location.search` property contains an initial `?` followed by the
`key=value` pairs in the query string. If there are no parameters, this value
may be the empty string (i.e. `''`).

See also [`URL.search`](https://developer.mozilla.org/en-US/docs/Web/API/URL/search).

## `location.hash`

The `location.hash` property contains an initial `#` followed by fragment
identifier of the URL. If there is no fragment identifier, this value may be the
empty string (i.e. `''`).

See also
[`URL.hash`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash).

## `location.state`

The `location.state` property contains a user-supplied object of arbitrary data
that is associated with this location. This can be a useful place to store any
information you do not want to put in the URL, e.g. session-specific data.

Note: In web browsers, this state is managed using the browser's built-in
`pushState`, `replaceState`, and `popstate` APIs. See also
[`History.state`](https://developer.mozilla.org/en-US/docs/Web/API/History/state).

## `location.key`

The `location.key` property is a unique string associated with this location. On
the initial location, this will be the string `default`. On all subsequent
locations, this string will be a unique identifier.

This can be useful in situations where you need to keep track of 2 different
states for the same URL. For example, you could use this as the key to some
network or device storage API.
