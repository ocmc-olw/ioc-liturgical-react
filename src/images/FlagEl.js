import React from 'react'
import flag from './graphics/flags/el.png'

export default React.createClass({
  render() {
    return <img
        id="el"
        className="App-flag"
        role="presentation"
        src={flag}
/>
  }
})
