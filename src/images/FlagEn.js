import React from 'react'
import flag from './graphics/flags/uk.png'

export class FlagEn extends React.Component {

  render(){
    return (
       <img
           id="en"
           className="App-flag App-flag-uk"
           role="presentation"
           height="1em"
           width="1.3em"
           src={flag}
       />
    )
};
}

export default FlagEn;