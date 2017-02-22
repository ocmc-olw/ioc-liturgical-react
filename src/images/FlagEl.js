import React from 'react'
//import flag from './graphics/flags/el.ico'

var flag = require("file-loader!./graphics/flags/el.ico")

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
