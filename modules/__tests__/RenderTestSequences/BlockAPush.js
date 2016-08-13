import React from 'react'
import expect from 'expect'
import { Push, Block } from '../../HistoryActions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/'
      })

      return (
        <div>
          <Block message={(info, callback) => callback(false)}/>
          <Push path="/hello"/>
        </div>
      )
    },
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/'
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
