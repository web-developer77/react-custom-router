import History from './History';
import { getWindowScrollPosition } from './DOMUtils';

/**
 * A history interface that assumes a DOM environment.
 */
class DOMHistory extends History {
  constructor(options={}) {
    super(options);
    this.getScrollPosition = options.getScrollPosition || getWindowScrollPosition;
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  go(n) {
    if (n === 0)
      return;

    window.history.go(n);
  }

  saveState(key, state) {
    window.sessionStorage.setItem(key, JSON.stringify(state));
  }

  readState(key) {
    var json = window.sessionStorage.getItem(key);

    if (json) {
      try {
        return JSON.parse(json);
      } catch (error) {
        // Ignore invalid JSON in session storage.
      }
    }

    return null;
  }

  onBeforeChange(listener) {
    if (!this.beforeChangeListener && listener) {
      if (window.addEventListener) {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
      } else {
        window.attachEvent('onbeforeunload', this.handleBeforeUnload);
      }
    } else if(this.beforeChangeListener && !listener) {
      if (window.removeEventListener) {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
      } else {
        window.detachEvent('onbeforeunload', this.handleBeforeUnload);
      }
    }

    super.onBeforeChange(listener);
  }

  handleBeforeUnload(event) {
    var message = this.beforeChangeListener.call(this);

    if (message != null) {
      // cross browser, see https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
      (event || window.event).returnValue = message;
      return message;
    }
  }

  pushState(state, path) {
    var location = this.location;
    if (location && location.state && location.state.key) {
      var key = location.state.key;
      var curState = this.readState(key);
      var scroll = this.getScrollPosition();
      this.saveState(key, {...curState, ...scroll});
    }

    super.pushState(state, path);
  }

}

export default DOMHistory;
