import React, { Component } from "react";
import { Container, Col, Row } from "reactstrap";
import SideBar from "./Sidebar";
import Toolbar from "./Toolbar";
import Editor from './Editor';
import CellView from './CellView';

//import IMAGE_SHAPES from '../shapes/image-shape';
import IMAGE_SHAPES from '../shapes/basic-shape';
import CARD_SHAPES from '../shapes/card-shape';
import SVG_SHAPES from '../shapes/svg-shape.xml';

import './Diagram.css';

export class Diagram extends Component {
  static displayName = Diagram.name;

  constructor(props) {
    super(props);

    this.state = {
      editor: null
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
      deleteFunc: this.deleteFunc,
      undoFunc: this.undoFunc,
      copyFunc: this.copyFunc,
      valueChangeFunc: this.valueChangeFunc,
      selectionChanged: this.selectionChanged,
      IMAGE_SHAPES,
      CARD_SHAPES,
      SVG_SHAPES
    });

    // const editor = new Editor({
    //   container: '#mxcontainer'      
    // });

    this.editor = editor;

    window.editor = editor;

    //editor.initCustomPort('https://gw.alicdn.com/tfs/TB1PqwZzzDpK1RjSZFrXXa78VXa-200-200.png');

    const xml = window.localStorage.getItem('autosaveXml');

    this.editor.renderGraphFromXml(xml);

    this.setState({ editor });
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

  selectionChanged = (cell) => {
    console.log('selectionChanged', cell);
    console.log(`selectionChanged: ${cell}`);
  };

  autoSaveFunc = (xml) => {
    window.autosaveXml = xml;

    const oParser = new DOMParser (); // eslint-disable-line
    const oDOM = oParser.parseFromString(xml, 'application/xml');

    window.autoSaveXmlDom = oDOM;

    window.localStorage.setItem('autosaveXml', xml);
  };

  clickFunc = (cell) => {
    console.log('click', cell);
  };

  undoFunc = (histories) => {
    console.log('undo', histories);
  }

  copyFunc = (cells) => {
    console.log('copy', cells);
  }

  updateDiagramData = (data) => {
    console.log(`update diagram: ${data}`);

    //message.info('diagram save success');
  }

  render() {
    return (
      <Container fluid> 
      <div className="editor-container">
        <Row>
          <Col xs={2}>
          <SideBar key="sidebar" editor={this.editor} />
          </Col>
          <Col xs={8}>
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
          <Col xs={2}>            
            <CellView editor={this.editor} />
            </Col>
        </Row>
        </div>
      </Container>
    );
  }
}

// componentDidMount() {
//   //let mxClient = mxnspaceobj.mxClient
//   let mxRubberband = mxnspaceobj.mxRubberband;
//   let mxKeyHandler = mxnspaceobj.mxKeyHandler;
//   let mxUtils = mxnspaceobj.mxUtils;
//   let mxEvent = mxnspaceobj.mxEvent;

//   const container = document.querySelector("#mxcontainer");

//   // Now, the tricky one, because most examples codes directly use the
//   // following statement :
//   // let graph = new mxGraph(container);
//   // which will fail.

//   // Instead, we have to call the mxGraph constructor via mxnspaceobj variable as follows :
//   let graph = new mxnspaceobj.mxGraph(container);

//   // -- The rest is the same as usually found in examples -- //

//   new mxRubberband(graph);
//   let parent = graph.getDefaultParent();

//   this.graph = graph;

//   window.graph = graph;

//   //graph.initCustomPort('https://gw.alicdn.com/tfs/TB1PqwZzzDpK1RjSZFrXXa78VXa-200-200.png');

//   graph.getModel().beginUpdate();
//   try {
//     const v1 = graph.insertVertex(parent, null, "Start,", 20, 20, 80, 30);
//     const v2 = graph.insertVertex(parent, null, "End", 200, 150, 80, 30);
//     const e1 = graph.insertEdge(parent, null, "", v1, v2);
//   } finally {
//     graph.getModel().endUpdate();
//   }
// }
