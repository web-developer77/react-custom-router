var React = require('react');
var resolveAsyncState = require('../helpers/resolveAsyncState');

/**
 * A mixin for route handler component classes that fetch at least
 * part of their state asynchronously. Classes that use it should
 * declare a static `getInitialAsyncState` method that fetches state
 * for a component after it mounts. This function is given three
 * arguments: 1) the current route params, 2) the current query and
 * 3) a function that can be used to set state as it is received.
 *
 * Example:
 *
 *   var User = React.createClass({
 *   
 *     statics: {
 *   
 *       getInitialAsyncState: function (params, query, setState) {
 *         // If you don't need to do anything async, just update
 *         // the state immediately and you're done.
 *         setState({
 *           user: UserStore.getUserByID(params.userID)
 *         });
 *   
 *         // Or, ignore the setState argument entirely and return a
 *         // hash with keys named after the state variables you want
 *         // to set. The values may be immediate values or promises.
 *         return {
 *           user: getUserByID(params.userID) // may be a promise
 *         };
 *   
 *         // Or, stream your data!
 *         var buffer = '';
 *   
 *         return {
 *
 *           // Same as above, the stream state variable is set to the
 *           // value returned by this promise when it resolves.
 *           stream: getStreamingData(params.userID, function (chunk) {
 *             buffer += chunk;
 *   
 *             // Notify of progress.
 *             setState({
 *               streamBuffer: buffer
 *             });
 *           })
 *   
 *         };
 *       }
 *   
 *     },
 *   
 *     getInitialState: function () {
 *       return {
 *         user: null,        // Receives a value when getUserByID resolves.
 *         stream: null,      // Receives a value when getStreamingData resolves.
 *         streamBuffer: ''   // Used to track data as it loads.
 *       };
 *     },
 *   
 *     render: function () {
 *       if (!this.state.user)
 *         return <LoadingUser/>;
 *   
 *       return (
 *         <div>
 *           <p>Welcome {this.state.user.name}!</p>
 *           <p>So far, you've received {this.state.streamBuffer.length} data!</p>
 *         </div>
 *       );
 *     }
 *   
 *   });
 *
 * When testing, use the `initialAsyncState` prop to simulate asynchronous
 * data fetching. When this prop is present, no attempt is made to retrieve
 * additional state via `getInitialAsyncState`.
 */
var AsyncState = {

  propTypes: {
    initialAsyncState: React.PropTypes.object
  },

  getInitialState: function () {
    return this.props.initialAsyncState || null;
  },

  updateAsyncState: function (state) {
    if (this.isMounted())
      this.setState(state);
  },

  componentDidMount: function () {
    if (this.props.initialAsyncState || !this.constructor.getInitialAsyncState)
      return;

    resolveAsyncState(
      this.constructor.getInitialAsyncState(this.props.params, this.props.query, this.updateAsyncState),
      this.updateAsyncState
    );
  }

};

module.exports = AsyncState;
