import createReactClass from 'create-react-class'
import { string, object } from 'prop-types'
import warning from './routerWarning'
import invariant from 'invariant'
import Redirect from './Redirect'
import { falsy } from './InternalPropTypes'

/**
 * An <IndexRedirect> is used to redirect from an indexRoute.
 */
/* eslint-disable react/require-render-return */
const IndexRedirect = createReactClass({
  displayName: 'IndexRedirect',

  statics: {

    createRouteFromReactElement(element, parentRoute) {
      /* istanbul ignore else: sanity check */
      if (parentRoute) {
        parentRoute.indexRoute = Redirect.createRouteFromReactElement(element)
      } else {
        warning(
          false,
          'An <IndexRedirect> does not make sense at the root of your route config'
        )
      }
    }

  },

  propTypes: {
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: falsy,
    children: falsy
  },

  /* istanbul ignore next: sanity check */
  render() {
    invariant(
      false,
      '<IndexRedirect> elements are for router configuration only and should not be rendered'
    )
  }

})

export default IndexRedirect
