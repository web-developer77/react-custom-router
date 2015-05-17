/* jshint -W058 */
var assign = require('object-assign');
var NavigationTypes = require('./NavigationTypes');
var { getWindowPath, supportsHistory } = require('./DOMUtils');
var RefreshHistory = require('./RefreshHistory');
var DOMHistory = require('./DOMHistory');

function getSerializableState(history) {
  return {
    current: history.current,
    navigationType: history.navigationType
  };
}

function handlePopState(event) {
  if (event.state === undefined)
    return; // Ignore extraneous popstate events in WebKit.

  var state = event.state;

  if ('current' in state)
    BrowserHistory.current = state.current;

  BrowserHistory.length = window.history.length;
  BrowserHistory.navigationType = NavigationTypes.POP;
  BrowserHistory._notifyChange();
}

var state = window.history.state || {};

/**
 * A history implementation for DOM environments that support the
 * HTML5 history API (pushState, replaceState, and the popstate event).
 * Provides the cleanest URLs and a reliable canGo(n) in browser
 * environments. Should always be used in browsers if possible.
 */
var BrowserHistory = assign(new DOMHistory(window.history.length, state.current, state.navigationType), {

  // Fall back to full page refreshes in browsers
  // that do not support the HTML5 history API.
  fallback: (supportsHistory() ? null : RefreshHistory),

  addChangeListener(listener) {
    DOMHistory.prototype.addChangeListener.call(this, listener);

    if (this.changeListeners.length === 1) {
      if (window.addEventListener) {
        window.addEventListener('popstate', handlePopState, false);
      } else {
        window.attachEvent('onpopstate', handlePopState);
      }
    }
  },

  removeChangeListener(listener) {
    DOMHistory.prototype.removeChangeListener.call(this, listener);

    if (this.changeListeners.length === 0) {
      if (window.removeEventListener) {
        window.removeEventListener('popstate', handlePopState, false);
      } else {
        window.removeEvent('onpopstate', handlePopState);
      }
    }
  },

  getPath: getWindowPath,

  push(path) {
    // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-pushstate
    this.navigationType = NavigationTypes.PUSH;
    this.current += 1;
    window.history.pushState(getSerializableState(this), '', path);
    this.length = window.history.length;
    this._notifyChange();
  },

  replace(path) {
    // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-replacestate
    this.navigationType = NavigationTypes.REPLACE;
    window.history.replaceState(getSerializableState(this), '', path);
    this._notifyChange();
  }

});

module.exports = BrowserHistory;
