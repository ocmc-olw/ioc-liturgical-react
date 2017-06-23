import React from 'react';
import Labels from './Labels';
import TopicsSelector from './modules/TopicsSelector';
import MessageIcons from './helpers/MessageIcons';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

/**
 * Use this as an example starting point for new React components
 */
class ParaColTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
  }

  setTheState = (props) => {
    return (
        {
          labels: {
            thisClass: Labels.getParaColTextEditorLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , values: this.props.values
          , options: {
            sizePerPage: 30
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
          , cellEditProp : {
            mode: 'click'
            , beforeSaveCell: this.onBeforeSaveCell
            , afterSaveCell: this.onAfterSaveCell
          }
          , maxCols: 6
        }
    )
  }

  handleRowSelect = (row, isSelected, e) => {
    let idParts = row["id"].split("~");
    this.setState({
      selectedId: row["id"]
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedValue: row["value"]
      , showIdPartSelector: true
      , showModalCompareDocs: true
    });
  }


  onBeforeSaveCell = (row, cellName, cellValue) => {
  }

  onAfterSaveCell = (row, cellName, cellValue) => {
    alert(`After save cell ${cellName} with value ${cellValue}`);
  }

  render() {
        return (
              <div className="App App-ParaColTextEditor">
                <div className="row">
                  <BootstrapTable
                      data={this.state.values}
                      trClassName={"App-data-tr"}
                      search
                      striped
                      pagination
                      options={ this.state.options }
                      cellEdit={this.state.cellEditProp}
                  >
                    <TableHeaderColumn
                        isKey
                        dataField={this.state.labels.thisClass.key}
                        hidden
                    >ID</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField='library'
                        tdClassname="tdColEditorGreek"
                        width={this.state.idColumnSize}>{this.props.libraries[0]}</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField='tdColEditorLib1'
                        width={this.state.idColumnSize}>{this.props.libraries[1]}</TableHeaderColumn>
                    {this.props.libraries[2].length > 0 &&
                    <TableHeaderColumn
                        dataField='tdColEditorLib2'
                        width={this.state.idColumnSize}>{this.props.libraries[2]}</TableHeaderColumn>
                    }
                    {this.props.libraries[3].length > 0 &&
                    <TableHeaderColumn
                        dataField='tdColEditorLib3'
                        dataSort={ true }
                    >{this.props.libraries[3]}</TableHeaderColumn>
                    }
                  </BootstrapTable>
                </div>
              </div>
        )
  }
}

ParaColTextEditor.propTypes = {
  languageCode: React.PropTypes.string.isRequired
  , title: React.PropTypes.string.isRequired
  , libraries: React.PropTypes.array.isRequired
  , values: React.PropTypes.array.isRequired
  , callBack: React.PropTypes.func.isRequired
};

ParaColTextEditor.defaultProps = {
};

export default ParaColTextEditor;
