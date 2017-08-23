import React from 'react'
import PropTypes from 'prop-types'
import warning from 'warning'
import invariant from 'invariant'
import { createLocation, locationsAreEqual } from 'history'

/**
 * The public API for updating the location programmatically
 * with a component.
 */
class Redirect extends React.Component {
  static propTypes = {
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired
  }

  static defaultProps = {
    push: false
  }

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired
      }).isRequired,
      staticContext: PropTypes.object
    }).isRequired
  }

  isStatic() {
    return this.context.router && this.context.router.staticContext
  }

  componentWillMount() {
    invariant(
      this.context.router,
      'You should not use <Redirect> outside a <Router>'
    )

    if (this.isStatic())
      this.perform()
  }

  componentDidMount() {
    if (!this.isStatic())
      this.perform()
  }

  componentDidUpdate(prevProps) {
    const prevTo = createLocation(prevProps.to)
    const nextTo = createLocation(this.props.to)

    if (locationsAreEqual(prevTo, nextTo)) {
      warning(false, `You tried to redirect to the same route you're currently on: ` +
        `"${nextTo.pathname}${nextTo.search}"`)
      return
    }

    this.perform()
  }

  perform() {
    const { history } = this.context.router
    const { push, to } = this.props

    if (push) {
      history.push(to)
    } else {
      history.replace(to)
    }
  }

  render() {
    return null
  }
}

export default Redirect
