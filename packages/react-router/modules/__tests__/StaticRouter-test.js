import expect from 'expect'
import React, { PropTypes } from 'react'
import ReactDOMServer from 'react-dom/server'
import StaticRouter from '../StaticRouter'
import Redirect from '../Redirect'

describe('A <StaticRouter>', () => {
  it('puts a router on context', () => {
    let router
    const RouterSubject = (props, context) => {
      router = context.router
      return null
    }

    RouterSubject.contextTypes = {
      router: PropTypes.object.isRequired
    }

    const context = {}

    ReactDOMServer.renderToStaticMarkup(
      <StaticRouter context={context}>
        <RouterSubject/>
      </StaticRouter>
    )

    expect(router).toBeAn('object')
  })

  it('reports PUSH actions on the context object', () => {
    const context = {}

    ReactDOMServer.renderToStaticMarkup(
      <StaticRouter context={context}>
        <Redirect push to="/somewhere-else"/>
      </StaticRouter>
    )

    expect(context.action).toBe('PUSH')
    expect(context.url).toBe('/somewhere-else')
  })

  it('reports REPLACE actions on the context object', () => {
    const context = {}

    ReactDOMServer.renderToStaticMarkup(
      <StaticRouter context={context}>
        <Redirect to="/somewhere-else"/>
      </StaticRouter>
    )

    expect(context.action).toBe('REPLACE')
    expect(context.url).toBe('/somewhere-else')
  })
})
