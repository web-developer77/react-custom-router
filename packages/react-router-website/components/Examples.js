import React from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import Link from 'react-router-dom/Link'
import { EXAMPLES } from '../routes'
import { B, H, I, PAD, VSpace, darkGray, lightGray, red } from './bricks'
import LoadBundle from './LoadBundle'
import SourceViewer from './SourceViewer'
import FakeBrowser from './FakeBrowser'
import ScrollToMe from './ScrollToMe'

const Nav = (props) => (
  <B {...props}>
    <B marginTop={PAD + 'px'}>
      {EXAMPLES.map((example, i) => (
        <B key={i} margin={`${PAD / 2}px 0`}>
          <Route path={example.path} children={({ match }) => (
            <Link to={example.path} style={match ? { color: red } : undefined}>{example.name}</Link>
          )}/>
        </B>
      ))}
    </B>
    <VSpace height={PAD + 'px'}/>
    <B component="p" color={lightGray}>
      All of these examples can be copy pasted into an app created with <CRApp/>.
      Just paste the code into <code>src/App.js</code> of your project.
    </B>
  </B>
)

const CRApp = () => (
  <I color={red} component="a" href="https://github.com/facebookincubator/create-react-app">
    <I component="code">create-react-app</I>
  </I>
)

const Example = ({ example, ...props }) => (
  <H {...props}>
    <B height="100%" flex="1" padding={`${PAD / 2}px ${PAD * 2}px`}>
      <LoadBundle load={example.load} children={mod => (
        <FakeBrowser height="85vh">
          <mod.default/>
        </FakeBrowser>
      )}/>
    </B>
    <B flex="1" padding={`0 ${PAD * 2}px`} overflow="auto">
      <LoadBundle load={example.loadSource} children={code => (
        <SourceViewer code={code}/>
      )}/>
    </B>
  </H>
)

Example.propTypes = {
  example: React.PropTypes.object
}

class Examples extends React.Component {
  preloadExamples() {
    EXAMPLES.forEach(example => {
      example.load(() => {})
      example.loadSource(() => {})
    })
  }

  componentDidMount() {
    this.preloadExamples()
  }

  render() {
    const routes = EXAMPLES.slice(1).map((example, index) => (
      <Route key={example.path} path={example.path} render={() => <Example example={example}/>}/>
    ))

    routes.push(
      <Route key="basic" render={() => <Example example={EXAMPLES[0]}/>}/>
    )

    return (
      <B>
        <Route exact path="/examples" component={ScrollToMe}/>
        <H minHeight="100vh" background={darkGray} color="white" padding={PAD * 2 + 'px'}>
          <Nav width="300px"/>
          <B flex="1">
            <Switch children={routes}/>
          </B>
        </H>
      </B>
    )
  }
}

export default Examples
