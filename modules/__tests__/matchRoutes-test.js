import expect from 'expect'
import React from 'react'
import { createMemoryHistory } from 'history'
import { createRoutes } from '../RouteUtils'
import matchRoutes from '../matchRoutes'
import Route from '../Route'

describe('matchRoutes', function () {

  let routes, RootRoute, UsersRoute, UsersIndexRoute, UserRoute, PostRoute, FilesRoute, AboutRoute, TeamRoute, ProfileRoute, GreedyRoute, CatchAllRoute
  let createLocation = createMemoryHistory().createLocation
  beforeEach(function () {
    /*
    <Route>
      <Route path="users">
        <Index />
        <Route path=":userID">
          <Route path="/profile" />
        </Route>
        <Route path="/team" />
      </Route>
    </Route>
    <Route path="/about" />
    <Route path="*" />
    */
    routes = [
      RootRoute = {
        childRoutes: [
          UsersRoute = {
            path: 'users',
            indexRoute: (UsersIndexRoute = {}),
            childRoutes: [
              UserRoute = {
                path: ':userID',
                childRoutes: [
                  ProfileRoute = {
                    path: '/profile'
                  },
                  PostRoute = {
                    path: ':postID'
                  }
                ]
              },
              TeamRoute = {
                path: '/team'
              }
            ]
          }
        ]
      },
      FilesRoute = {
        path: '/files/*/*.jpg'
      },
      AboutRoute = {
        path: '/about'
      },
      GreedyRoute = {
        path: '/**/f'
      },
      CatchAllRoute = {
        path: '*'
      }
    ]
  })

  function describeRoutes() {
    describe('when the location matches an index route', function () {
      it('matches the correct routes', function (done) {
        matchRoutes(routes, createLocation('/users'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ RootRoute, UsersRoute, UsersIndexRoute ])
          done()
        })
      })
    })

    describe('when the location matches a nested route with params', function () {
      it('matches the correct routes and params', function (done) {
        matchRoutes(routes, createLocation('/users/5'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ RootRoute, UsersRoute, UserRoute ])
          expect(match.params).toEqual({ userID: '5' })
          done()
        })
      })
    })

    describe('when the location matches a deeply nested route with params', function () {
      it('matches the correct routes and params', function (done) {
        matchRoutes(routes, createLocation('/users/5/abc'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ RootRoute, UsersRoute, UserRoute, PostRoute ])
          expect(match.params).toEqual({ userID: '5', postID: 'abc' })
          done()
        })
      })
    })

    describe('when the location matches a nested route with multiple splat params', function () {
      it('matches the correct routes and params', function (done) {
        matchRoutes(routes, createLocation('/files/a/b/c.jpg'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ FilesRoute ])
          expect(match.params).toEqual({ splat: [ 'a', 'b/c' ] })
          done()
        })
      })
    })

    describe('when the location matches a nested route with a greedy splat param', function () {
      it('matches the correct routes and params', function (done) {
        matchRoutes(routes, createLocation('/foo/bar/f'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ GreedyRoute ])
          expect(match.params).toEqual({ splat: 'foo/bar' })
          done()
        })
      })
    })

    describe('when the location matches a route with hash', function () {
      it('matches the correct routes', function (done) {
        matchRoutes(routes, createLocation('/users#about'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ RootRoute, UsersRoute, UsersIndexRoute ])
          done()
        })
      })
    })

    describe('when the location matches a deeply nested route with params and hash', function () {
      it('matches the correct routes and params', function (done) {
        matchRoutes(routes, createLocation('/users/5/abc#about'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ RootRoute, UsersRoute, UserRoute, PostRoute ])
          expect(match.params).toEqual({ userID: '5', postID: 'abc' })
          done()
        })
      })
    })

    describe('when the location matches an absolute route', function () {
      it('matches the correct routes', function (done) {
        matchRoutes(routes, createLocation('/about'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ AboutRoute ])
          done()
        })
      })
    })

    describe('when the location does not match any routes', function () {
      it('matches the "catch-all" route', function (done) {
        matchRoutes(routes, createLocation('/not-found'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ CatchAllRoute ])
          done()
        })
      })
    })
  }

  describe('a synchronous route config', function () {
    describeRoutes()

    describe('when the location matches a nested absolute route', function () {
      it('matches the correct routes', function (done) {
        matchRoutes(routes, createLocation('/team'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ RootRoute, UsersRoute, TeamRoute ])
          done()
        })
      })
    })

    describe('when the location matches an absolute route nested under a route with params', function () {
      it('matches the correct routes and params', function (done) {
        matchRoutes(routes, createLocation('/profile'), function (error, match) {
          expect(match).toExist()
          expect(match.routes).toEqual([ RootRoute, UsersRoute, UserRoute, ProfileRoute ])
          expect(match.params).toEqual({}) // no userID param
          done()
        })
      })
    })
  })

  describe('an asynchronous route config', function () {
    function makeAsyncRouteConfig(routes) {
      routes.forEach(function (route) {
        const { childRoutes, indexRoute } = route

        if (childRoutes) {
          delete route.childRoutes

          route.getChildRoutes = function (location, callback) {
            setTimeout(function () {
              callback(null, childRoutes)
            })
          }

          makeAsyncRouteConfig(childRoutes)
        }

        if (indexRoute) {
          delete route.indexRoute

          route.getIndexRoute = function (location, callback) {
            setTimeout(function () {
              callback(null, indexRoute)
            })
          }
        }
      })
    }

    beforeEach(function () {
      makeAsyncRouteConfig(routes)
    })

    describeRoutes()
  })

  describe('an asynchronous JSX route config', function () {
    let getChildRoutes, getIndexRoute, jsxRoutes

    beforeEach(function () {
      getChildRoutes = function (location, callback) {
        setTimeout(function () {
          callback(null, <Route path=":userID" />)
        })
      }

      getIndexRoute = function (location, callback) {
        setTimeout(function () {
          callback(null, <Route name="jsx" />)
        })
      }

      jsxRoutes = createRoutes([
        <Route name="users"
               path="users"
               getChildRoutes={getChildRoutes}
               getIndexRoute={getIndexRoute} />
      ])
    })

    it('when getChildRoutes callback returns reactElements', function (done) {
      matchRoutes(jsxRoutes, createLocation('/users/5'), function (error, match) {
        expect(match).toExist()
        expect(match.routes.map(r => r.path)).toEqual([ 'users', ':userID' ])
        expect(match.params).toEqual({ userID: '5' })
        done()
      })
    })

    it('when getIndexRoute callback returns reactElements', function (done) {
      matchRoutes(jsxRoutes, createLocation('/users'), function (error, match) {
        expect(match).toExist()
        expect(match.routes.map(r => r.name)).toEqual([ 'users', 'jsx' ])
        done()
      })
    })
  })

})
