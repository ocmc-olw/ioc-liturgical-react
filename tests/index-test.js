import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import {Login} from '../src/index'

var loginCallback = () => {

}

describe('Index', () => {
  it('Exports Login', () => {
      expect('Login').toExist();
  })
})
