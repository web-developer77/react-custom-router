import expect, { spyOn } from 'expect'
import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import createHistory from '../createMemoryHistory'
import useQueries from 'history/lib/useQueries'
import execSteps from './execSteps'
import Router from '../Router'

describe('When a router enters a branch', function () {
  let
    node, leaveHookSpy, removeLeaveHook,
    DashboardRoute, NewsFeedRoute, InboxRoute, RedirectToInboxRoute, MessageRoute,
    routes

  beforeEach(function () {
    node = document.createElement('div')
    leaveHookSpy = expect.createSpy()

    class Dashboard extends Component {
      render() {
        return (
          <div className="Dashboard">
            <h1>The Dashboard</h1>
            {this.props.children}
          </div>
        )
      }
    }

    class NewsFeed extends Component {
      componentWillMount() {
        removeLeaveHook = this.context.router.setRouteLeaveHook(
          this.props.route,
          () => leaveHookSpy() // Break reference equality.
        )
      }

      render() {
        return <div>News</div>
      }
    }

    NewsFeed.contextTypes = {
      router: React.PropTypes.object.isRequired
    }

    class Inbox extends Component {
      render() {
        return <div>Inbox</div>
      }
    }

    NewsFeedRoute = {
      path: 'news',
      component: NewsFeed,
      onEnter(nextState, replace) {
        expect(this).toBe(NewsFeedRoute)
        expect(nextState.routes).toContain(NewsFeedRoute)
        expect(replace).toBeA('function')
      },
      onLeave() {
        expect(this).toBe(NewsFeedRoute)
      }
    }

    InboxRoute = {
      path: 'inbox',
      component: Inbox,
      onEnter(nextState, replace) {
        expect(this).toBe(InboxRoute)
        expect(nextState.routes).toContain(InboxRoute)
        expect(replace).toBeA('function')
      },
      onLeave() {
        expect(this).toBe(InboxRoute)
      }
    }

    RedirectToInboxRoute = {
      path: 'redirect-to-inbox',
      onEnter(nextState, replace) {
        expect(this).toBe(RedirectToInboxRoute)
        expect(nextState.routes).toContain(RedirectToInboxRoute)
        expect(replace).toBeA('function')

        replace('/inbox')
      },
      onLeave() {
        expect(this).toBe(RedirectToInboxRoute)
      }
    }

    MessageRoute = {
      path: 'messages/:messageID',
      onEnter(nextState, replace) {
        expect(this).toBe(MessageRoute)
        expect(nextState.routes).toContain(MessageRoute)
        expect(replace).toBeA('function')
      },
      onLeave() {
        expect(this).toBe(MessageRoute)
      }
    }

    DashboardRoute = {
      path: '/',
      component: Dashboard,
      onEnter(nextState, replace) {
        expect(this).toBe(DashboardRoute)
        expect(nextState.routes).toContain(DashboardRoute)
        expect(replace).toBeA('function')
      },
      onLeave() {
        expect(this).toBe(DashboardRoute)
      },
      childRoutes: [ NewsFeedRoute, InboxRoute, RedirectToInboxRoute, MessageRoute ]
    }

    routes = [
      DashboardRoute
    ]
  })

  afterEach(function () {
    unmountComponentAtNode(node)
  })

  it('calls the onEnter hooks of all routes in that branch', function (done) {
    const dashboardRouteEnterSpy = spyOn(DashboardRoute, 'onEnter').andCallThrough()
    const newsFeedRouteEnterSpy = spyOn(NewsFeedRoute, 'onEnter').andCallThrough()

    render(<Router history={createHistory('/news')} routes={routes}/>, node, function () {
      expect(dashboardRouteEnterSpy).toHaveBeenCalled()
      expect(newsFeedRouteEnterSpy).toHaveBeenCalled()
      done()
    })
  })

  it('calls the route leave hooks when leaving the route', function (done) {
    const history = createHistory('/news')

    // Stub this function to exercise the code path.
    history.listenBeforeUnload = () => (() => {})

    render(<Router history={history} routes={routes}/>, node, function () {
      expect(leaveHookSpy.calls.length).toEqual(0)
      history.push('/inbox')
      expect(leaveHookSpy.calls.length).toEqual(1)
      history.push('/news')
      expect(leaveHookSpy.calls.length).toEqual(1)
      history.push('/inbox')
      expect(leaveHookSpy.calls.length).toEqual(2)
      done()
    })
  })

  it('does not call removed route leave hooks', function (done) {
    const history = createHistory('/news')

    render(<Router history={history} routes={routes}/>, node, function () {
      removeLeaveHook()
      history.push('/inbox')
      expect(leaveHookSpy).toNotHaveBeenCalled()
      done()
    })
  })

  describe('and one of the transition hooks navigates to another route', function () {
    it('immediately transitions to the new route', function (done) {
      const redirectRouteEnterSpy = spyOn(RedirectToInboxRoute, 'onEnter').andCallThrough()
      const redirectRouteLeaveSpy = spyOn(RedirectToInboxRoute, 'onLeave').andCallThrough()
      const inboxEnterSpy = spyOn(InboxRoute, 'onEnter').andCallThrough()

      render(<Router history={createHistory('/redirect-to-inbox')} routes={routes}/>, node, function () {
        expect(this.state.location.pathname).toEqual('/inbox')
        expect(redirectRouteEnterSpy).toHaveBeenCalled()
        expect(redirectRouteLeaveSpy.calls.length).toEqual(0)
        expect(inboxEnterSpy).toHaveBeenCalled()
        done()
      })
    })
  })

  describe('and then navigates to another branch', function () {
    it('calls the onLeave hooks of all routes in the previous branch that are not in the next branch', function (done) {
      const dashboardRouteLeaveSpy = spyOn(DashboardRoute, 'onLeave').andCallThrough()
      const inboxRouteEnterSpy = spyOn(InboxRoute, 'onEnter').andCallThrough()
      const inboxRouteLeaveSpy = spyOn(InboxRoute, 'onLeave').andCallThrough()
      const history = createHistory('/inbox')

      const steps = [
        function () {
          expect(inboxRouteEnterSpy).toHaveBeenCalled('InboxRoute.onEnter was not called')
          history.push('/news')
        },
        function () {
          expect(inboxRouteLeaveSpy).toHaveBeenCalled('InboxRoute.onLeave was not called')
          expect(dashboardRouteLeaveSpy.calls.length).toEqual(0, 'DashboardRoute.onLeave was called')
        }
      ]

      const execNextStep = execSteps(steps, done)

      render(
        <Router history={history}
                routes={routes}
                onUpdate={execNextStep}
        />, node, execNextStep)
    })
  })

  describe('and then navigates to the same branch, but with different params', function () {
    it('calls the onLeave and onEnter hooks of all routes whose params have changed', function (done) {
      const dashboardRouteLeaveSpy = spyOn(DashboardRoute, 'onLeave').andCallThrough()
      const dashboardRouteEnterSpy = spyOn(DashboardRoute, 'onEnter').andCallThrough()
      const messageRouteLeaveSpy = spyOn(MessageRoute, 'onLeave').andCallThrough()
      const messageRouteEnterSpy = spyOn(MessageRoute, 'onEnter').andCallThrough()
      const history = createHistory('/messages/123')

      const steps = [
        function () {
          expect(dashboardRouteEnterSpy).toHaveBeenCalled('DashboardRoute.onEnter was not called')
          expect(messageRouteEnterSpy).toHaveBeenCalled('InboxRoute.onEnter was not called')
          history.push('/messages/456')
        },
        function () {
          expect(messageRouteLeaveSpy).toHaveBeenCalled('MessageRoute.onLeave was not called')
          expect(messageRouteEnterSpy).toHaveBeenCalled('MessageRoute.onEnter was not called')
          expect(dashboardRouteLeaveSpy.calls.length).toEqual(0, 'DashboardRoute.onLeave was called')
        }
      ]

      const execNextStep = execSteps(steps, done)

      render(
        <Router history={history}
                routes={routes}
                onUpdate={execNextStep}
        />, node, execNextStep)
    })
  })

  describe('and then the query changes', function () {
    it('calls the onEnter hooks of all routes in that branch', function (done) {
      const newsFeedRouteEnterSpy = spyOn(NewsFeedRoute, 'onEnter').andCallThrough()
      const history = useQueries(createHistory)('/inbox')

      render(<Router history={history} routes={routes}/>, node, function () {
        history.push({ pathname: '/news', query: { q: 1 } })
        expect(newsFeedRouteEnterSpy.calls.length).toEqual(1)
        history.push({ pathname: '/news', query: { q: 2 } })
        expect(newsFeedRouteEnterSpy.calls.length).toEqual(1)
        done()
      })
    })
  })

})
