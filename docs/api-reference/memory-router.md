# MemoryRouter

A `<MemoryRouter>` is a [`<Router>`](router.md#router) that manages the location
using an in-memory history stack. This makes it ideal for use in situations
where you either don't have a web browser (like [React
Native](https://reactnative.dev/)) or in tests.

A `<MemoryRouter>` accepts the following props:

<pre>
interface MemoryRouterProps {
  <a href="#memoryrouter-children">children</a>?: React.ReactNode;
  <a href="#memoryrouter-initialentries">initialEntries</a>?: <a href="#TODO">InitialEntry</a>[];
  <a href="#memoryrouter-initialindex">initialIndex</a>?: number;
}
</pre>

## `<MemoryRouter children>`

The children element(s) for this router (see [`<Router
children>`](router.md#router-children)).

## `<MemoryRouter initialEntries>`

The initial entries in the history stack for this router (see
[`createMemoryHistory`](https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#creatememoryhistory)).

## `<MemoryRouter initialIndex>`

The index of the current entry when this router first mounts. Defaults to the
index of the last item in [`initialEntries`](#memoryrouter-initialentries) or
`0` (see
[`createMemoryHistory`](https://github.com/ReactTraining/history/blob/dev/docs/api-reference.md#creatememoryhistory)).
