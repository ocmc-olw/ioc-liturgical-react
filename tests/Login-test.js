import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import {Login} from '../src/index'

var loginCallback = () => {

}

describe('Login', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('Login render is not null', () => {

    render(<Login
        formMsg=""
        formPrompt="Please enter login data:"
        loginCallback={loginCallback}
        username=""
        password=""
        restServer="https://ioc-liturgical-ws.org"
    />, node, () => {
      expect(node.innerHTML !== null);
    })
  })
})
