import React, { Component } from "react";
import MxCell from 'mxgraph';
import { Container, Col, Row } from "reactstrap";
import SideBar from "./Sidebar";
import Toolbar from "./Toolbar";
import Editor from './Editor';
import CellView from './CellView';
import Preview from './Preview';

import IMAGE_SHAPES from '../shapes/basic-shape';
import CARD_SHAPES from '../shapes/card-shape';
import SVG_SHAPES from '../shapes/svg-shape.xml';

import './Diagram.css';

export class Diagram extends Component {
  static displayName = Diagram.name;

  constructor(props) {
    super(props);

    this.state = {
      editor: null,
      currentCell:null     
    };

    this.graphContainerClickCount = 0;
  }

  componentDidMount() {
    this.mounted = true;

    const editor = new Editor({
      container: '.graph-content',
      clickFunc: this.clickFunc,
      doubleClickFunc: this.doubleClickFunc,
      autoSaveFunc: this.autoSaveFunc,
      cellCreatedFunc: this.cellCreatedFunc,
      previewCreatedFunc:this.previewCreatedFunc,
      deleteFunc: this.deleteFunc,
      undoFunc: this.undoFunc,
      copyFunc: this.copyFunc,
      valueChangeFunc: this.valueChangeFunc,
      IMAGE_SHAPES,
      CARD_SHAPES,
      SVG_SHAPES
    });

    this.editor = editor;

    window.editor = editor;

    const xml = window.localStorage.getItem('autosaveXml');

    this.editor.renderGraphFromXml(xml);

    this.setState({ editor, currentCell: new MxCell() });
  }

  componentWillUnmount() {
    this.mounted = false;

    // remove event listeners when component will unmount
    this.editor.removeEventListeners();
  }

  /**
   * double click event callback
   */
  doubleClickFunc = (cell) => {
    console.log('double click', cell);
    this.editor.getCellsSelected();
  };

  cellCreatedFunc = (currentCell) => {
    const allCells = this.editor.getAllCells();

    let sameShapeNameCount = 0;
    const { shapeName } = currentCell;

    allCells
      && Object.keys(allCells).forEach((index) => {
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
    console.log('cells deleted: ', cells);
  };

  /**
   * value change callback
   * @param {*} cell cell
   * @param {*} newValue new value
   */
  valueChangeFunc = (cell, newValue) => {
    console.log(`new value: ${newValue}`);
  };

  
  autoSaveFunc = (xml) => {
    window.autosaveXml = xml;

    const oParser = new DOMParser (); // eslint-disable-line
    const oDOM = oParser.parseFromString(xml, 'application/xml');

    window.autoSaveXmlDom = oDOM;

    window.localStorage.setItem('autosaveXml', xml);
  };

  clickFunc = (cell, event) => {
    this.setState({currentCell:cell});
  };

  undoFunc = (histories) => {
    console.log('undo', histories);
  }

  copyFunc = (cells) => {
    console.log('copy', cells);
  }

  updateDiagramData = (data) => {
    console.log(`update diagram: ${data}`);
  } 

  render() {
    return (
      <Container fluid> 
      <div className="editor-container">
        <Row>
          <Col xs={1}>
          <SideBar key="sidebar" editor={this.editor} />
          <Preview key="preview" editor={this.editor} />
          </Col>
          <Col xs={10}>
          <div className="graph-inner-container">
          {this.editor ? (
                <Toolbar
                  editor={this.editor}
                  updateDiagramData={this.updateDiagramData}
                />
              ) : null}
          <div id="mxcontainer" className="graph-content" key="graphcontent" />
          </div>
          </Col>
          <Col xs={1}>            
            <CellView editor={this.editor} activeCell ={this.state.currentCell} />
            </Col>
        </Row>
        </div>
      </Container>
    );
  }
}