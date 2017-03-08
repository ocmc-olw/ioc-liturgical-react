import React from 'react'
import globe from './graphics/globe.png'

export default React.createClass({
  render() {
    return <img className="App-img App-img-globe" role="presentation" src={globe} height="45px" width="60px"/>
  }
})

