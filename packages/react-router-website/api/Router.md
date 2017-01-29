# &lt;Router>

The common low-level interface for all router components. Higher-level routers include:

- [`<BrowserRouter>`](#browserrouter)
- [`<HashRouter>`](#hashrouter)
- [`<MemoryRouter>`](#memoryrouter)
- [`<NativeRouter>`](#nativerouter)
- [`<StaticRouter>`](#staticrouter)

Use a `<Router>` directly if you already have a `history` object.

## history: object _`<Router>`_

A [`history`](https://github.com/mjackson/history) object to use for navigation.

## children: node _`<Router>`_

A [single child element](https://facebook.github.io/react/docs/react-api.html#react.children.only) to render.
