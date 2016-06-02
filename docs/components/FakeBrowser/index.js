import React from 'react'
import { B, V, H, PAD, LIGHT_GRAY, GRAY } from '../layout'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import LeftArrow from 'react-icons/lib/ti/arrow-left'
import RightArrow from 'react-icons/lib/ti/arrow-right'
import { button } from './style.css'
import FileCode from 'react-icons/lib/go/file-code'

const createFakeBrowserHistory = (createHistory) => {
  let length = 0
  let cursor = 0

  const getUserConfirmation = (message, callback) => {
    callback(window.confirm(message))
  }

  const history = createHistory({ getUserConfirmation })

  const goForward = () => {
    cursor++
    history.goForward()
  }

  const goBack = () => {
    cursor--
    history.goBack()
  }

  const push = (...args) => {
    if (cursor === length) {
      length++
      cursor++
    } else {
      length = cursor
    }
    history.push(...args)
  }

  return {
    ...history,
    getUserConfirmation,
    push,
    goForward,
    goBack,
    canGoBack: () => cursor > 0,
    canGoForward: () => length > cursor
  }
}

const Button = ({ children, ...props }) => (
  <B
    component="button"
    className={button}
    display="inline-block"
    border="none"
    margin="0"
    padding="0"
    background="none"
    fontSize="200%"
    marginTop="-3px"
    props={props}
    children={children}
  />
)

class FakeBrowser extends React.Component {

  state = { address: null }

  componentWillMount() {
    const history = this.history = createFakeBrowserHistory(createMemoryHistory)
    this.unlisten = history.listen((location) => {
      this.setState({ address: location.pathname })
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { children:Child } = this.props
    const { address } = this.state
    const { history } = this
    return (
      <V
        background="white"
        boxShadow="0px 4px 10px hsla(0, 0%, 0%, 0.25)"
        border="1px solid #ccc"
        flex="1"
      >
        <H
          background={LIGHT_GRAY}
          border="none"
          borderBottom="solid 1px #ccc"
          alignItems="center"
          padding={`0 ${PAD/2}px`}
        >
          <Button
            onClick={history.goBack}
            disabled={!history.canGoBack()}
            ariaLabel="Go back in fake browser"
          ><LeftArrow/></Button>
          <Button
            onClick={history.goForward}
            disabled={!history.canGoForward()}
            ariaLabel="Go forward in fake browser"
          ><RightArrow/></Button>
          <B
            position="relative"
            zIndex="1"
            left={`${PAD/2.5}px`}
            top="-2px"
            color={GRAY}
          >
            <FileCode/>
          </B>
          <H
            flex="1"
            alignItems="center"
            padding={`${PAD/3}px`}
            marginLeft={`-${PAD}px`}
          >
            <B
              component="input"
              font="inherit"
              width="100%"
              paddingLeft={`${PAD*1.25}px`}
              color={GRAY}
              props={{
                type: 'text',
                value: address,
                onChange: (e) => {
                  this.setState({
                    address: e.target.value
                  })
                },
                onKeyDown: (e) => {
                  if (e.key === 'Enter')
                    this.history.push(e.target.value)
                }
              }}
            />
          </H>
        </H>
        <B flex="1" padding={`${PAD}px`} overflow="auto">
          <Child history={history}/>
        </B>
      </V>
    )
  }
}

export default FakeBrowser
