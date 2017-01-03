import React, { PropTypes } from 'react'
import matchPattern from './matchPattern'
import withHistory from './withHistory'
import {
  action as actionType,
  location as locationType
} from './PropTypes'

/**
 * The public API for matching a single pattern.
 */
class Route extends React.Component {
  static propTypes = {
    action: actionType.isRequired,
    location: locationType.isRequired,
    pattern: PropTypes.string,
    exact: PropTypes.bool,
    component: PropTypes.func,
    render: PropTypes.func
  }

  static defaultProps = {
    exact: false
  }

  handleRouteChange({ action, location }, callback) {
    const child = this.child

    if (typeof child.routeWillChange === 'function') {
      const { pattern, exact } = this.props
      const match = matchPattern(pattern, exact, location.pathname)

      // Compute the next props the component will
      // receive so it has access to params, etc.
      const props = {
        action,
        location,
        params: (match ? match.params : {}),
        match
      }

      child.routeWillChange.call(child, props, callback)
    } else {
      callback()
    }
  }

  updateChild = (child) => {
    this.child = child
  }

  render() {
    const { action, location, pattern, exact, component, render } = this.props
    const match = matchPattern(pattern, exact, location.pathname)

    const props = {
      action,
      location,
      params: (match ? match.params : {}),
      match
    }

    const ref = this.updateChild

    return (
      render ? (
        React.cloneElement(render(props), { ref })
      ) : (
        match ? React.createElement(component, { ...props, ref }) : null
      )
    )
  }
}

export default withHistory(Route)
