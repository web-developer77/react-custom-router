import React from 'react';
import Location from './Location';
import passMiddlewareProps from './passMiddlewareProps'
var { element, object, any, instanceOf, array } = React.PropTypes;

function getPropsFromServerRender () {
  return (typeof window !== 'undefined' && window.__ASYNC_PROPS__) || null;
}

function loadAsyncProps (env, cb) {
  var { branch, params } = env;
  var components = branch.map(route => route.component || route.components);
  var asyncPropsArray = new Array(components.length);
  var count = 0;

  function finish () {
    count++;
    if (count === components.length)
      cb(null, asyncPropsArray);
  }

  components.forEach((Component, index) => {
    if (typeof Component === 'object') {
      getAsyncPropsForComponentsObject(Component, env, (err, props) => {
        asyncPropsArray[index] = props;
        finish();
      });
    }
    else {
      if (Component.loadAsyncProps) {
        Component.loadAsyncProps(env, (err, props) => {
          asyncPropsArray[index] = props;
          finish();
        });
      }
      else {
        asyncPropsArray[index] = {};
        finish();
      }
    }
  });
}

function getAsyncPropsForComponentsObject (components, env, callback) {
  var total = Object.keys(components).length;
  var asyncProps = {};
  var count = 0;

  function finish () {
    count++;
    if (count === total)
      callback(null, asyncProps);
  }

  for (let key in components) {
    let Component = components[key];
    if (Component.loadAsyncProps) {
      Component.loadAsyncProps(env, (err, props) => {
        asyncProps[key] = props;
        finish();
      });
    }
    finish();
  }
}

export function hydrate (serverContext, env, callback) {
  loadAsyncProps(assign({}, env, { serverContext }, callback));
}

export default class AsyncProps extends React.Component {

  static propTypes = {
    branch: array,
    params: object.isRequired,
    location: instanceOf(Location).isRequired,
    children: element
  };

  constructor (props, context) {
    super(props, context);
    this.ignorePendingLoad = false;
    this.state = {
      loading: false,
      propsBeforeLoad: null,
      branchData: getPropsFromServerRender()
    };
  }

  componentDidMount () {
    var noServerCache = this.state.branchData === null;
    if (noServerCache)
      this.load();
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.loading) {
      this.setState({
        propsBeforeLoad: this.props,
        loading: true
      }, () => this.load());
    }
  }

  componentWillUnmount () {
    this.ignorePendingLoad = true;
  }

  load () {
    loadAsyncProps(this.props, (err, branchData) => {
      // TODO handle error
      if (this.ignorePendingLoad)
        return;
      this.setState({
        branchData,
        loading: false,
        propsBeforeLoad: null
      });
    });
  }

  render () {
    if (this.state.branchData === null)
      return null;

    var renderProps = this.state.loading ?
      this.state.propsBeforeLoad : this.props;

    return passMiddlewareProps(renderProps, {
      branchData: this.state.branchData || [],
      loading: this.state.loading
    });
  }
}

