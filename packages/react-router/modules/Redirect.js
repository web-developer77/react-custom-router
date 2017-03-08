import React, { PropTypes } from 'react'

/**
 * The public API for updating the location programatically
 * with a component.
 */
class Redirect extends React.Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired
      }).isRequired,
      staticContext: PropTypes.object
    }).isRequired
  }

  static propTypes = {
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ])
  }

  static defaultProps = {
    push: false
  }

  isStatic() {
    return this.context.router && this.context.router.staticContext
  }

  componentWillMount() {
    if (this.isStatic())
      this.perform()
  }

  componentDidMount() {
    if (!this.isStatic())
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
