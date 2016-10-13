import React, { PropTypes } from 'react'
import { LocationSubscriber } from './Broadcasts'
import {
  routerContext as routerContextType
} from './PropTypes'

class Link extends React.Component {
  static defaultProps = {
    replace: false,
    activeOnlyWhenExact: false,
    className: '',
    activeClassName: '',
    style: {},
    activeStyle: {},
    isActive: (location, to, props) => {
      return pathIsActive(
        to.pathname,
        location.pathname,
        props.activeOnlyWhenExact
      ) && queryIsActive(
        to.query,
        location.query
      )
    }
  }

  static contextTypes = {
    router: routerContextType
  }

  handleClick = (event) => {
    if (this.props.onClick)
      this.props.onClick(event)

    if (
      !event.defaultPrevented && // onClick prevented default
      !this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) &&
      isLeftClickEvent(event)
    ) {
      event.preventDefault()
      this.handleTransition()
    }
  }

  handleTransition = () => {
    const { router } = this.context
    const { to, replace } = this.props
    const navigate = replace ? router.replaceWith : router.transitionTo
    navigate(to)
  }

  render() {
    const { router } = this.context
    const {
      to,
      style,
      activeStyle,
      className,
      activeClassName,
      location: propLocation,
      isActive: getIsActive,
      activeOnlyWhenExact, // eslint-disable-line
      replace, // eslint-disable-line
      ...rest
    } = this.props

    const apatheticToIsActive = (
      activeClassName === '' &&
      Object.keys(activeStyle).length === 0 &&
      typeof rest.children !== 'function'
    )

    if (apatheticToIsActive) {
      return (
        <a
          href={router ? router.createHref(to) : to}
          onClick={this.handleClick}
          style={style}
          className={className}
          {...rest}
        />
      )
    }

    return (
      <LocationSubscriber>
        {(contextLocation) => {
          const location = propLocation || contextLocation

          const isActive = getIsActive(
            location,
            createLocationDescriptor(to),
            this.props
          )

          // If children is a function, we are using a Function as Children Component
          // so useful values will be passed down to the children function.
          if (typeof rest.children == 'function') {
            return rest.children({
              isActive,
              location,
              href: router ? router.createHref(to) : to,
              onClick: this.handleClick,
              transition: this.handleTransition
            })
          }

          // Maybe we should use <Match> here? Not sure how the custom `isActive`
          // prop would shake out, also, this check happens a LOT so maybe its good
          // to optimize here w/ a faster isActive check, so we'd need to benchmark
          // any attempt at changing to use <Match>
          return (
            <a
              href={router ? router.createHref(to) : to}
              onClick={this.handleClick}
              style={isActive ? { ...style, ...activeStyle } : style }
              className={isActive ?
                [ className, activeClassName ].join(' ').trim() : className
              }
              {...rest}
            />
          )
        }}
      </LocationSubscriber>
    )
  }
}

if (__DEV__) {
  Link.propTypes = {
    to: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]).isRequired,
    replace: PropTypes.bool,
    activeStyle: PropTypes.object,
    activeClassName: PropTypes.string,
    location: PropTypes.object,
    activeOnlyWhenExact: PropTypes.bool,
    isActive: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

    // props we have to deal with but aren't necessarily
    // part of the Link API
    style: PropTypes.object,
    className: PropTypes.string,
    target: PropTypes.string,
    onClick: PropTypes.func
  }
}

// we should probably use LocationUtils.createLocationDescriptor
const createLocationDescriptor = (to) =>
  typeof to === 'object' ? to : { pathname: to }

const pathIsActive = (to, pathname, activeOnlyWhenExact) =>
  activeOnlyWhenExact ? pathname === to : pathname.indexOf(to) === 0

const queryIsActive = (query, activeQuery) => {
  if (activeQuery == null)
    return query == null

  if (query == null)
    return true

  return deepEqual(query, activeQuery)
}

const isLeftClickEvent = (event) =>
  event.button === 0

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const deepEqual = (a, b) => {
  if (a == b)
    return true

  if (a == null || b == null)
    return false

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((item, index) => deepEqual(item, b[index]))
    )
  }

  if (typeof a === 'object') {
    for (let p in a) {
      if (!Object.prototype.hasOwnProperty.call(a, p)) {
        continue
      }

      if (a[p] === undefined) {
        if (b[p] !== undefined) {
          return false
        }
      } else if (!Object.prototype.hasOwnProperty.call(b, p)) {
        return false
      } else if (!deepEqual(a[p], b[p])) {
        return false
      }
    }

    return true
  }

  return String(a) === String(b)
}

export default Link
