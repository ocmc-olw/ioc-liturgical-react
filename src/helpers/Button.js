/**
 * Created by mac002 on 12/7/16.
 */
import React from 'react';

export class Button extends React.Component {
  render () {
    if (this.props.hidden) {
      return <button className="promptButton" hidden>{this.props.label}</button>
    } else {
      return <button className="promptButton" type="submit">{this.props.label}</button>
    }
  }
}

export default Button;