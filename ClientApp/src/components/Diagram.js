import React, { Component } from "react";
import MxCell from "mxgraph";
import { Container, Col, Row, Button } from "reactstrap";
import SideBar from "./Sidebar";
import Toolbar from "./Toolbar";
import Editor from "./Editor";
import CellView from "./CellView";
import Preview from "./Preview";
import Shapes from "./ShapeList";
import ModalForm from "./ModalForm";

import "./Diagram.css";

export class Diagram extends Component {
  static displayName = Diagram.name;

  constructor(props) {
    super(props);

    this.state = {
      editor: null,
      currentCell: null,
      createVisile: false,
    };

    this.graphContainerClickCount = 0;

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ createVisile: true });
    console.log("Diagram toggle");
  }

  componentDidMount() {
    this.mounted = true;

    const editor = new Editor({
      container: ".graph-content",
      clickFunc: this.clickFunc,
      doubleClickFunc: this.doubleClickFunc,
      autoSaveFunc: this.autoSaveFunc,
      cellCreatedFunc: this.cellCreatedFunc,
      previewCreatedFunc: this.previewCreatedFunc,
      deleteFunc: this.deleteFunc,
      undoFunc: this.undoFunc,
      copyFunc: this.copyFunc,
      valueChangeFunc: this.valueChangeFunc,
      Shapes,
    });

    this.editor = editor;

    window.editor = editor;

    const xml = window.localStorage.getItem("autosaveXml");

    this.editor.renderGraphFromXml(xml);

    this.setState({ editor, currentCell: new MxCell() });
  }

  componentWillUnmount() {
    this.mounted = false;

    // remove event listeners when component will unmount
    this.editor.removeEventListeners();
  }

  doubleClickFunc = (cell) => {
    console.log("double click", cell);
    this.setState({ createVisile: true,
      currentCell: cell});
    //this.editor.getCellsSelected();
  };

  cellCreatedFunc = (currentCell) => {
    const allCells = this.editor.getAllCells();

    let sameShapeNameCount = 0;
    const { shapeName } = currentCell;

    allCells &&
      Object.keys(allCells).forEach((index) => {
        if (allCells[index].shapeName === shapeName) {
          sameShapeNameCount += 1;
        }
      });

    const labelName = currentCell.value;

    this.editor.renameCell(`${labelName}${sameShapeNameCount}`, currentCell);
  };

  previewCreatedFunc = (output) => {
    console.log("Diagram previewCreatedFunc: " + output);
  };

  deleteFunc = (cells) => {
    console.log("cells deleted: ", cells);
  };

  valueChangeFunc = (cell, newValue) => {
    console.log(`new value: ${newValue}`);
  };

  autoSaveFunc = (xml) => {
    window.autosaveXml = xml;

    const oParser = new DOMParser(); // eslint-disable-line
    const oDOM = oParser.parseFromString(xml, "application/xml");

    window.autoSaveXmlDom = oDOM;

    window.localStorage.setItem("autosaveXml", xml);
  };

  clickFunc = (cell, event) => {
    this.setState({ currentCell: cell });
  };

  undoFunc = (histories) => {
    console.log("undo", histories);
  };

  copyFunc = (cells) => {
    console.log("copy", cells);
  };

  updateDiagramData = (data) => {
    console.log(`update diagram: ${data}`);
  };

  handleCancel = () => {
    console.log("Diagram handleCancel");
    this.setState({ createVisile: false });
  };

  handleConfirm = fields => {   
    console.log("Diagram handleConfirm"); 
    this.setState({ createVisile: false });
  };

  render() {
    return (
      <Container fluid>
        <div className="editor-container">
          <Row>
            <Col xs={1}>
              <h6>Toolbox</h6>
              <Button onClick={this.toggle}>TOGGLE</Button>
            </Col>
            <Col xs={10}>
              <Toolbar
                editor={this.editor}
                updateDiagramData={this.updateDiagramData}
              />
            </Col>
            <Col xs={1}>
              <h6>Properties</h6>
            </Col>
          </Row>
          <Row>
            <Col xs={1}>
              <SideBar key="sidebar" editor={this.editor} />
              <Preview key="preview" editor={this.editor} />
            </Col>
            <Col xs={10}>
              <div className="graph-inner-container">
                <div
                  id="mxcontainer"
                  className="graph-content"
                  key="graphcontent"
                />
              </div>
            </Col>
            <Col xs={1}>
              <CellView
                editor={this.editor}
                activeCell={this.state.currentCell}
              />
            </Col>
          </Row>
        </div>
        {this.state.createVisile && (
          <ModalForm
            visible={this.state.createVisile}
            currentCell={this.state.currentCell}
            handleCancel={this.handleCancel}
            handleConfirm={this.handleConfirm}
          />
        )}
      </Container>
    );
  }
}
