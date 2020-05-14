# Router

A `<Router>` is the main [context
provider](https://reactjs.org/docs/context.html#contextprovider) in a React
Router app, which means it should probably be rendered at or near the root of
your app.

You typically do not need to render a `<Router>` directly. Instead, you'll
usually render one of the higher-level wrappers like
[`<BrowserRouter>`](browser-router.md), [`<StaticRouter>`](static-router.md), or
[`<NativeRouter>`](native-router.md) depending on your environment.

A `<Router>` accepts the following props:

<pre>
interface RouterProps {
  <a href="#router-children">children</a>?: React.ReactNode;
  <a href="#router-action">action</a>?: <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#action">Action</a>;
  <a href="#router-location">location</a>: <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#location">Location</a>;
  <a href="#router-navigator">navigator</a>: <a href="#navigator">Navigator</a>;
  <a href="#router-pending">pending</a>?: boolean;
  <a href="#router-static">static</a>?: boolean;
}
</pre>

`Navigator` is a type alias of [the `History` interface](#TODO), but
including only the methods needed for navigation.

<pre>
<a name="navigator"></a>
type Navigator = {
  <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#history.createhref">createHref</a>(to: <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#to">To</a>): string;
  <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#history.push">push</a>(to: <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#to">To</a>, state?: <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#state">State</a>): void;
  <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#history.replace">replace</a>(to: <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#to">To</a>, state?: <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#state">State</a>): void;
  <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#history.go">go</a>(delta: number): void;
  <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#history.block">block</a>(blocker: <a href="https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#blocker">Blocker</a>): () => void;
}
</pre>

All
[`History`](https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#history)
objects satisfy the `Navigator` interface. But a custom navigator may also be
supplied to override navigation behavior.

## `<Router children>`

The children element(s) that will be rendered inside this router.

## `<Router action>`

The current [`action`](https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#action).

## `<Router location>`

The current [`location`](https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#location).

## `<Router navigator>`

TODO

## `<Router pending>`

This should be `true` if the router is pending a location change, `false`
otherwise (the default). When `true`, other elements in the app may indicate a
location change is pending by showing a spinner or some other "loading" UI (see
also the [`useLocationPending`](#TODO) hook).


## `<Router static>`

This should be `true` if the router does not accept location changes, `false`
otherwise (the default).
