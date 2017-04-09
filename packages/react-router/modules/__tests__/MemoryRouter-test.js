import expect from 'expect'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import MemoryRouter from '../MemoryRouter'

describe('A <MemoryRouter>', () => {
  it('puts history on context.router', () => {
    let history
    const ContextChecker = (props, context) => {
      history = context.router.history
      return null
    }

    ContextChecker.contextTypes = {
      router: PropTypes.object.isRequired
    }

    const node = document.createElement('div')

    ReactDOM.render((
      <MemoryRouter>
        <ContextChecker/>
      </MemoryRouter>
    ), node)

    expect(history).toBeAn('object')
  })
})
