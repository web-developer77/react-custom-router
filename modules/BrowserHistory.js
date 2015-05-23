import DOMHistory from './DOMHistory';
import { getWindowPath, supportsHistory } from './DOMUtils';
import NavigationTypes from './NavigationTypes';
import Location from './Location';

/**
 * A history implementation for DOM environments that support the
 * HTML5 history API (pushState, replaceState, and the popstate event).
 * Provides the cleanest URLs and should always be used in browser
 * environments if possible.
 *
 * Note: BrowserHistory automatically falls back to using full page
 * refreshes if HTML5 history is not available, so URLs are always
 * the same across browsers.
 */
class BrowserHistory extends DOMHistory {

  static propTypes = Object.assign({}, DOMHistory.propTypes);
  static defaultProps = Object.assign({}, DOMHistory.defaultProps);
  static childContextTypes = Object.assign({}, DOMHistory.childContextTypes);

  constructor(props) {
    super(props);
    this.handlePopState = this.handlePopState.bind(this);
    this.isSupported = supportsHistory();
  }

  _updateLocation(navigationType) {
    var [ path, queryString ] = getWindowPath().split('?', 2);

    this.setState({
      location: new Location(path, this.parseQueryString(queryString), navigationType)
    });
  }

  handlePopState(event) {
    if (event.state === undefined)
      return; // Ignore extraneous popstate events in WebKit.

    this._updateLocation(NavigationTypes.POP);
  }

  componentWillMount() {
    super.componentWillMount();
    this._updateLocation();
  }

  componentDidMount() {
    if (window.addEventListener) {
      window.addEventListener('popstate', this.handlePopState, false);
    } else {
      window.attachEvent('onpopstate', this.handlePopState);
    }
  }

  componentWillUnmount() {
    if (window.removeEventListener) {
      window.removeEventListener('popstate', this.handlePopState, false);
    } else {
      window.removeEvent('onpopstate', this.handlePopState);
    }
  }

  push(path, query) {
    var fullPath = this.makePath(path, query);

    if (this.isSupported) {
      // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-pushstate
      this.setState({
        location: new Location(path, query, NavigationTypes.PUSH)
      }, function () {
        window.history.pushState(null, '', fullPath);
      });
    } else {
      window.location = fullPath;
    }
  }

  replace(path, query) {
    var fullPath = this.makePath(path, query);

    if (this.isSupported) {
      // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-replacestate
      this.setState({
        location: new Location(path, query, NavigationTypes.REPLACE)
      }, function () {
        window.history.replaceState(null, '', fullPath);
      });
    } else {
      window.location.replace(fullPath);
    }
  }

}

export default BrowserHistory;
