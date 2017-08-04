import React from 'react';
import PropTypes from 'prop-types';

import {Alert, Button, Glyphicon, Modal} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal window to allow user to select an AGES service or sacrament.
 */
export class ModalAgesServiceSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      labels: {
        thisClass: Labels.getModalAgesServiceSelectorLabels(this.props.languageCode)
        , messages: Labels.getMessageLabels(this.props.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.languageCode).initial
      , options: {
        sizePerPage: 15
        , sizePerPageList: [5, 15, 30]
        , onSizePerPageList: this.onSizePerPageList
        , hideSizePerPage: true
        , paginationShowsTotal: true
      }
      ,
      selectRow: {
        mode: 'radio' // or checkbox
        , hideSelectColumn: false
        , clickToSelect: false
        , onSelect: this.handleRowSelect
        , className: "App-row-select"
      }
      , tableColumnFilter: {
        defaultValue: ""
        , type: 'RegexFilter'
        , placeholder: Labels.getMessageLabels(this.props.languageCode).regEx
      }
      ,
      showSelectionButtons: false
      ,
      selectedId: ""
      , showModal: true
    }

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
  };

  PropTypesWillMount = () => {
  }

  close = () => {
    this.setState({showModal: false});
  };

  open = () => {
    this.setState({showModal: true});
  };

  handleRowSelect = (row, isSelected, e) => {
    this.setState({
      selectedUrl: row["url"]
    }, this.props.callBack(row["url"], row["type"], row["date"], row["dayOfWeek"]));
  }

  render() {
    return (
        <div>
          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.labels.thisClass.panelTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="App-modal-body">
                <div className="row">
                  <Alert bsStyle="info" className="App-modal-alert">
                    <p>
                      <Glyphicon glyph="hand-right"/>
                      {this.state.labels.thisClass.msg1}
                      {this.state.labels.thisClass.msg2}
                      {this.state.labels.thisClass.msg3}
                      {this.state.labels.thisClass.msg4}
                    </p>
                  </Alert>
                </div>
                <div className="row">
                  <BootstrapTable
                      ref="table"
                      data={this.props.values}
                      trClassName={"App-data-tr"}
                      striped
                      pagination
                      options={ this.state.options }
                      selectRow={ this.state.selectRow }
                  >
                    <TableHeaderColumn
                        ref="url"
                        isKey
                        dataField='url'
                        dataSort={ true }
                        width={this.state.topicKeyColumnSize}
                        filter={ this.state.tableColumnFilter }
                        hidden
                    >{"URL"}</TableHeaderColumn>
                    <TableHeaderColumn
                        ref="type"
                        dataSort={ true }
                        dataField="type"
                        tdClassname="tdColAgesType"
                        width={this.state.libraryValueColumnSize}
                        filter={ this.state.tableColumnFilter }
                    >{this.state.labels.thisClass.type}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        ref="date"
                        dataSort={ true }
                        dataField="date"
                        tdClassname='tdColAgesDate'
                        width={this.state.libraryValueColumnSize}
                        filter={ this.state.tableColumnFilter }
                    >{this.state.labels.thisClass.date}</TableHeaderColumn>
                    <TableHeaderColumn
                        ref="dayOfWeek"
                        dataField={"dayOfWeek"}
                        dataSort={ true }
                        tdClassname='tdColAgesDay'
                        width={this.state.libraryValueColumnSize}
                        filter={ this.state.tableColumnFilter }
                    >{this.state.labels.thisClass.dayOfWeek}</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>{this.state.labels.thisClass.close}</Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}
ModalAgesServiceSelector.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , languageCode: PropTypes.string.isRequired
  , callBack: PropTypes.func.isRequired
  , values: PropTypes.array.isRequired
};
export default ModalAgesServiceSelector;

