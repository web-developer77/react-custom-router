import React from 'react'
import PropTypes from 'prop-types'
import createHistory from 'history/createBrowserHistory'
import { Router } from 'react-router'

/**
 * The public API for a <Router> that uses HTML5 history.
 */
class BrowserRouter extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    children: PropTypes.node
  }

  history = createHistory(this.props)

  render() {
    return <Router history={this.history} children={this.props.children}/>
  }
}

export default BrowserRouter
