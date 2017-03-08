import React from 'react'
import flag from './graphics/flags/en.png'

export class FlagEn extends React.Component {

  render(){
    return (
       <img
           id="en"
           className="App-flag"
           role="presentation"
           src={flag}
       />
    )
};
}

export default FlagEn;