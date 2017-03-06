import React, { PropTypes } from 'react'
import warning from 'warning'
import matchPath from './matchPath'

/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends React.Component {
  static contextTypes = {
    route: PropTypes.object.isRequired
  }

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    warning(
      !(nextProps.location && !this.props.location),
      '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
    )

    warning(
      !(!nextProps.location && this.props.location),
      '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
    )
  }

  render() {
    const { children } = this.props
    const location = this.props.location || this.context.route.location
    const parent = this.context.route.match
    let match, child
    React.Children.forEach(children, element => {
      if (match == null) {
        child = element
        match = matchPath(location.pathname, element.props, parent)
      }
    })

    return match ? React.cloneElement(child, { location, computedMatch: match }) : null
  }
}

export default Switch
