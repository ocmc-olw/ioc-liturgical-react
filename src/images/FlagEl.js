import React from 'react'
import flag from './graphics/flags/gr.png'

export default React.createClass({
  render() {
    return <img
          id="el"
          className="App-flag App-flag-el"
          role="presentation"
          height="1em"
          width="1.3em"
          src={flag}
        />
  }
})
