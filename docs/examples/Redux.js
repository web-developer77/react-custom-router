/*eslint no-console: 0*/
import React from 'react'
import { Router, MatchLocation, Link } from 'react-router'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'


////////////////////////////////////////////////////////////
// 1. reducer to keep the location in redux state

// in a real redux app you'd want to use `window.location`
// but for our demo we'll use this fake one
const initialLocation = { pathname: '/' }
const locationReducer = (state = initialLocation, action) => {
  return action.type === 'LOCATION_CHANGE' ?
    action.location : state
}


////////////////////////////////////////////////////////////
// normal redux stuff
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

const store = applyMiddleware(logger)(createStore)(
  combineReducers({ location: locationReducer })
)

const mapStateToAppProps = (state) => ({
  location: state.location
})


////////////////////////////////////////////////////////////
const App = connect(mapStateToAppProps)((props) => (
  // 2. use Router as a controlled component, exactly like
  //    controlling an input with redux state. Used this way
  //    it doesn't listen to the history, and doesn't have
  //    any of its own state, it only notifies the App that
  //    the user is attempting to go to a new location, but
  //    it won't go there. It goes to whichever location you
  //    pass to it.
  <Router
    history={props.history}
    location={props.location}
    onChange={(location) => {
      // 3. Dispatch location changes
      props.dispatch({
        type: 'LOCATION_CHANGE',
        location
      })
    }}
  >
    <ul>
      <li><Link to="/one">One</Link></li>
      <li><Link to="/two">Two</Link></li>
    </ul>

    <MatchLocation pattern="/" exactly children={() => (
      <div>
        <p>Open the console to see the logger middleware.</p>
        <p>
          Note: there is a bug somewhere with the fake browser
          back/forward buttons that doesn't show up when using
          the normal history.
        </p>
      </div>
    )}/>
    <MatchLocation pattern="/one" children={() => <h3>One</h3>}/>
    <MatchLocation pattern="/two" children={() => <h3>Two</h3>}/>
  </Router>
))


////////////////////////////////////////////////////////////
// you don't need this history, it's passed in for the fake
// browser window.
const ReduxExample = ({ history }) => (
  <Provider store={store}>
    <App history={history}/>
  </Provider>
)

export default ReduxExample

