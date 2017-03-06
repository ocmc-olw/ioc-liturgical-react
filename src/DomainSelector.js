import React from 'react';
import axios from 'axios';
import server from './helpers/Server';
import {DropdownButton, MenuItem} from 'react-bootstrap';

class DomainSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverNotCalled: true
    };
    this.getMenuItems = this.getMenuItems.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount = () => {
    this.fetchData();
  }

  onSelect = (index) => {
    let item = this.state.items[index];
    console.log(item);
    let idParts = item.value.split("|");
    let domain = item.value;
    if (idParts.length === 3) {
      domain = idParts[2];
    }
    this.props.callback(domain, item.label);
  }

  domainObjectsToStringArray(domains) {
    let values = domains.values;
  }

  fetchData() {
    var config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };
    this.setState({serverNotCalled: false});
    axios.get(this.props.restServer + server.getDbServerDropdownsApi(), config)
        .then(response => {
          console.log(response.data);
          this.setState( { items: response.data.values[0].domains} );
        })
        .catch( (error) => {
          this.setState( { data: error.message });
          this.props.callback(error.message, "");
        });

    // axios.get(this.props.restServer + server.getWsServerDomainsApi(), config)
    //     .then(response => {
    //       this.setState( { items: response.data.values} );
    //     })
    //     .catch( (error) => {
    //       this.setState( { data: error.message });
    //       this.props.callback(error.message, "");
    //     });
  }

  getMenuItems = (items) => {
    let itemsList = items.map(function(item, index){
      let domain = item.value;
      let idParts = item.value.split("_");
      if (idParts.length === 3) {
        domain = idParts[2];
      }
      return <MenuItem key={domain} eventKey={ index }>{item.value + ": " + item.label}</MenuItem>;
    });
    return  itemsList ;
  };

  // getMenuItems = (items) => {
  //   let itemsList = items.map(function(item, index){
  //     let idParts = item._id.split("|");
  //     let domain = item._id;
  //     if (idParts.length === 3) {
  //       domain = idParts[2];
  //     }
  //     return <MenuItem key={domain} eventKey={ index }>{domain + ": " + item.value.description}</MenuItem>;
  //   });
  //   return  itemsList ;
  // };
  render() {
    if (this.state.items) {
        return (
            <div className="App-DomainSelector">
              <h3 className="App-DomainSelector-prompt">{this.props.formPrompt}</h3>
              <DropdownButton
                  bsStyle={this.props.style}
                  bsSize={this.props.size}
                  title={this.props.title}
                  id={this.props.id}
                  onSelect={this.onSelect}
              >
                {this.getMenuItems(this.state.items)}
              </DropdownButton>
            </div>
        );
    } else {
      return (<div className="Resource"><p>Loading domains!</p></div>);
    }
  }
}

DomainSelector.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , callback: React.PropTypes.func.isRequired
  , id: React.PropTypes.string.isRequired
  , title: React.PropTypes.string.isRequired
  , size: React.PropTypes.string
  , style: React.PropTypes.string
  , filterLanguage: React.PropTypes.string
  , publicOnly: React.PropTypes.bool
};

DomainSelector.defaultProps = {
  size: "small"
  , style: "primary"
  , filterLanguage: ""
  , publicOnly: true
};

export default DomainSelector;
