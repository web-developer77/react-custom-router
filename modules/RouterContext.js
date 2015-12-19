import React from 'react'
import invariant from 'invariant'
import deprecateObjectProperties from './deprecateObjectProperties'
import { isReactChildren } from './RouteUtils'
import getRouteParams from './getRouteParams'

const { array, func, object } = React.PropTypes

/**
 * A <RouterContext> renders the component tree for a given router state
 * and sets the history object and the current location in context.
 */
const RouterContext = React.createClass({

  propTypes: {
    history: object.isRequired,
    transitionManager: object.isRequired,
    location: object.isRequired,
    routes: array.isRequired,
    params: object.isRequired,
    components: array.isRequired,
    createElement: func.isRequired
  },

  getDefaultProps() {
    return {
      createElement: React.createElement
    }
  },

  childContextTypes: {
    history: object.isRequired,
    location: object.isRequired,
    router: object.isRequired
  },

  getChildContext() {
    const { transitionManager } = this.props
    let { history, location } = this.props


    const router = {
      // must copy these properties before adding deprecations so that
      // correct usage of `router` doesn't trigger warnings
      ...history,
      addRouteLeaveHook: transitionManager.listenBeforeLeavingRoute,
      isActive: transitionManager.isActive
    }

    if (__DEV__) {
      history = deprecateObjectProperties(history, '`context.history` is deprecated, please use context.router')
      location = deprecateObjectProperties(location, '`context.location` is deprecated, please use a route component\'s `props.location` instead. If this is a deeply nested component, please refer to the strategies described in https://github.com/rackt/react-router/blob/v1.1.0/CHANGES.md#v110')
    }

    return { history, location, router }
  },

  createElement(component, props) {
    return component == null ? null : this.props.createElement(component, props)
  },

  render() {
    const { history, location, routes, params, components } = this.props
    let element = null

    if (components) {
      element = components.reduceRight((element, components, index) => {
        if (components == null)
          return element // Don't create new children; use the grandchildren.

        const route = routes[index]
        const routeParams = getRouteParams(route, params)
        const props = {
          history: deprecateObjectProperties(history, 'Accessing `props.history` is deprecated, please use a singleton `history` or `context.router`.'),
          location,
          params,
          route,
          routeParams,
          routes
        }

        if (isReactChildren(element)) {
          props.children = element
        } else if (element) {
          for (let prop in element)
            if (element.hasOwnProperty(prop))
              props[prop] = element[prop]
        }

        if (typeof components === 'object') {
          const elements = {}

          for (const key in components) {
            if (components.hasOwnProperty(key)) {
              // Pass through the key as a prop to createElement to allow
              // custom createElement functions to know which named component
              // they're rendering, for e.g. matching up to fetched data.
              elements[key] = this.createElement(components[key], {
                key, ...props
              })
            }
          }

          return elements
        }

        return this.createElement(components, props)
      }, element)
    }

    invariant(
      element === null || element === false || React.isValidElement(element),
      'The root route must render a single element'
    )

    return element
  }

})

export default RouterContext
