import React, { PropTypes } from 'react'
import StaticRouter from './StaticRouter'

class ServerRouter extends React.Component {
  static childContextTypes = {
    serverRouter: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      serverRouter: this.props.context
    }
  }

  render() {
    const { context, location, basename, ...rest } = this.props
    const redirect = (location) => {
      context.setRedirect(location)
    }
    return (
      <StaticRouter
        action="POP"
        location={location}
        basename={basename}
        onReplace={redirect}
        onPush={redirect}
        {...rest}
      />
    )
  }
}

if (__DEV__) {
  ServerRouter.propTypes = {
    basename: PropTypes.string,
    context: PropTypes.object.isRequired,
    location: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ])
  }
}

export default ServerRouter
