# Migrating @reach/router to React Router v6

React Router v6 incorporates some of the best features of @reach/router into a
smaller, more powerful core library. The move from @reach/router to React Router
v6 [isn't "switching" routers; it's
upgrading](https://twitter.com/ryanflorence/status/1235598940809990145). This
document is a comprehensive guide through the process of upgrading your
@reach/router app to React Router v6.

If instead you are just getting started with React Router or you'd like to try
out v6 in a new app, please see [the Getting Started
guide](../installation/getting-started.md).

The upgrade from @reach/router to React Router v6 should be fairly
straightforward. In general, the process looks something like this:

- [Use @reach/router's hooks API](#use-reach-routers-hooks)
- [Replace `<LocationProvider>` with `<BrowserRouter>`](#replace-locationprovider-with-browserrouter)
- [Change `<Router>` to `<Routes>`](#change-router-to-routes)
- [Change `props.children` to `<Outlet />` in your route components](#change-props-children-to-outlet)
- [Update server rendering API](#update-server-rendering)

## Use @reach/router's Hooks
## Replace `<LocationProvider>` with `<BrowserRouter>`
## Change `<Router>` to `<Routes>`

### Note on Focus Management

Coming soon!

## Change `props.children` to `<Outlet />`
## Update Server Rendering
