import wr from "./Wrapper";

var mxnspaceobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

export default class Editor {
  constructor(props) {
    this.init(props);
  }

  init(props) {
    const { container, cellCreatedFunc, previewCreatedFunc, valueChangeFunc } = props;

    let containerEle = document.querySelector(container);
    if (typeof container === "string") {
      containerEle = document.querySelector(container);
    } else {
      containerEle = container;
    }

    let graph = new mxnspaceobj.mxGraph(containerEle);

    let mxRubberband = mxnspaceobj.mxRubberband;
    // Enables rubberband selection
    new mxRubberband(graph);
    let mxUtils = mxnspaceobj.mxUtils;
    let mxEvent = mxnspaceobj.mxEvent;
    let mxVertexHandler = mxnspaceobj.mxVertexHandler;
    let mxUndoManager = mxnspaceobj.mxUndoManager;
    let mxGraphHandler = mxnspaceobj.mxGraphHandler;
    let mxEdgeHandler = mxnspaceobj.mxGraphHandler;
    let mxGraph = mxnspaceobj.mxGraph;
    let mxShape = mxnspaceobj.mxGraphHandler;
    let mxConnectionConstraint = mxnspaceobj.mxConnectionConstraint;
    let mxPolyline = mxnspaceobj.mxPolyline;
    let mxConstraintHandler = mxnspaceobj.mxConstraintHandler;
    let mxConnectionHandler = mxnspaceobj.mxConnectionHandler;
    let mxImage = mxnspaceobj.mxConstraintHandler;
    let mxConstants = mxnspaceobj.mxConstants;
    let mxPerimeter = mxnspaceobj.mxPerimeter;
    let mxPoint = mxnspaceobj.mxPoint;
    let mxStencil = mxnspaceobj.mxStencilRegistry;
    let mxStencilRegistry = mxnspaceobj.mxStencilRegistry;
    let mxCell = mxnspaceobj.mxCell;
    let mxClient = mxnspaceobj.mxClient;
    let mxDragSource = mxnspaceobj.mxDragSource;
    let mxClipboard = mxnspaceobj.mxClipboard;
    let mxGraphView = mxnspaceobj.mxGraphView;
    let mxResources = mxnspaceobj.mxResources;

    // Disables the built-in context menu
    mxEvent.disableContextMenu(containerEle); // eslint-disable-line
    mxVertexHandler.prototype.rotationEnabled = true; // eslint-disable-line
    
    this.containerEle = containerEle;

    this.initEditor({
      ...props,
      graph,
      mxGraph,
      mxCell,
      mxShape,
      mxEvent,
      mxUtils,
      mxUndoManager,
      mxGraphHandler,
      mxEdgeHandler,
      mxConnectionConstraint,
      mxConnectionHandler,
      mxImage,
      mxPolyline,
      mxConstraintHandler,
      mxConstants,
      mxPerimeter,
      mxPoint,
      mxStencil,
      mxStencilRegistry,
      mxClient,
      mxClipboard,
      mxGraphView,
      mxVertexHandler
    });

    this.graph = graph;
    this.mxClient = mxClient;
    this.cellCreatedFunc = cellCreatedFunc;
    this.previewCreatedFunc = previewCreatedFunc;
    this.mxUtils = mxUtils;
    this.mxEvent = mxEvent;
    this.mxDragSource = mxDragSource;
    this.mxConstraintHandler = mxConstraintHandler;
    this.valueChangeFunc = valueChangeFunc;
    this.mxResources = mxResources;
    this.mxConstants = mxConstants;
  }

  initEditor(config) {
    // eslint-disable-line
    const {
      graph,
      mxGraph,
      mxCell,
      mxShape,
      mxEvent,
      mxUtils,
      mxUndoManager,
      mxGraphHandler,
      mxEdgeHandler,
      mxConnectionConstraint,
      mxConnectionHandler,
      mxImage,
      mxPolyline,
      mxConstraintHandler,
      mxConstants,
      mxPerimeter,
      mxPoint,
      mxStencil,
      mxStencilRegistry,
      mxClient,
      mxClipboard,
      mxGraphView,
      mxVertexHandler,
      clickFunc,
      doubleClickFunc,
      autoSaveFunc,
      hoverFunc,
      deleteFunc,
      undoFunc,
      copyFunc,
      valueChangeFunc,
      changeFunc,
      Shapes
    } = config;

    // Disables the built-in context menu
    //mxEvent.disableContextMenu(this.containerEle); // eslint-disable-line

    // Uncomment the following if you want the container
    // to fit the size of the graph
    // graph.setResizeContainer(true);

    wr.initGraph({ graph });

    wr.initZoomConfig({ graph });

    // config shapes
    wr.initShapes({
      graph,
      mxUtils,
      mxConstants,
      mxPerimeter,
      mxStencilRegistry,
      Shapes
    });

    wr.initGrid({
      graph,
      mxGraphView,
      mxEvent
    });

    //undo event listener
    wr.undoListener({
      graph,
      mxEvent,
      mxUndoManager,
      callback: undoFunc,
    });

    //copy event listener
    wr.copyListener({
      graph,
      mxClipboard,
      callback: copyFunc,
    });

    //delete event listener
    wr.deleteListener({
      graph,
      callback: deleteFunc,
    });

    wr.handleDoubleClick({
      graph,
      mxEvent,
      callback: doubleClickFunc,
    });

    wr.handleClick({
      graph,
      mxEvent,
      callback: clickFunc,
    });  

    wr.handleChange({
      graph,
      mxEvent,
      callback: changeFunc,
    });

    wr.initAutoSave({
      graph,
      callback: autoSaveFunc,
    });

    wr.vertexRenameListener({
      callback: valueChangeFunc,
      mxCell,
    });
  }

  
  initSidebar(sidebarItems) {
    return wr.initSidebar({
      graph: this.graph,
      mxEvent: this.mxEvent,
      mxClient: this.mxClient,
      mxUtils: this.mxUtils,
      mxDragSource: this.mxDragSource,
      sidebarItems,
      cellCreatedFunc: this.cellCreatedFunc,
    });
  }

  initPreview(preview) {
    return wr.initPreview({
      graph: this.graph,
      mxResources:this.mxResources,
      mxUtils:this.mxUtils,
      mxEvent:this.mxEvent,
      mxConstants:this.mxConstants,
      preview,
      previewCreatedFunc:this.previewCreatedFunc
    });
  } 

  /**
   * zoom
   * type: in、out、actual
   */
  zoom(type) {
    return wr.zoom({
      type,
      graph: this.graph,
    });
  }

  /**
   * update style
   * @param {*} cell cell
   * @param {*} key the key of style
   * @param {*} value the value of style
   */
  updateStyle(cell, key, value) {
    return wr.updateStyle(this.graph, this.mxUtils, cell, key, value);
  }

  groupCells(groupId, labelName) {
    const cellsGrouped = this.graph.getSelectionCells();

    const cell = this.graph.groupCells();
    cell.cellId = groupId;
    cell.value = labelName;
    cell.isGroupCell = true;

    cellsGrouped &&
      cellsGrouped.forEach((item) => {
        item.isGrouped = true;
      });

    // wr.updateStyle(this.graph, cell, 'strokeColor', 'none');
    wr.updateStyle(this.graph, cell, "fillColor", "none");
    wr.updateStyle(this.graph, cell, "dashed", 1);
    wr.updateStyle(this.graph, cell, "verticalLabelPosition", "bottom");
    wr.updateStyle(this.graph, cell, "verticalAlign", "top");

    return { groupCell: cell, cellsGrouped };
  }

  handleUngroupCells(cells) {
    cells &&
      cells.forEach((cell) => {
        if (cell.isGroupCell) {
          cell.isGroupCell = false;
        }

        cell.children &&
          cell.children.forEach((child) => {
            child.isGrouped = false;
          });
      });

    return cells;
  }

  /**
   * ungroup cells
   */
  ungroupCells(cells) {
    const tempCells = cells || this.graph.getSelectionCells();

    const groupCells = [];

    tempCells &&
      tempCells.forEach((cell) => {
        if (cell.isGroupCell) {
          groupCells.push(cell);
        }

        cell.children &&
          cell.children.forEach((child) => {
            if (child.isGroupCell) {
              groupCells.push(child);
            }
          });

        const { parent } = cell;

        if (parent && parent.isGroupCell) {
          groupCells.push(parent);
        }
      });

    this.handleUngroupCells(groupCells);

    return this.graph.ungroupCells(groupCells);
  }

  // get all cells selected
  getCellsSelected() {
    console.log("getCellsSelected");
    return this.graph.getSelectionCells();
  }

  /**
   * render graph from xml
   * @param {string} xml xml
   */
  renderGraphFromXml(xml) {
    return wr.renderGraphFromXml({
      graph: this.graph,
      mxUtils: this.mxUtils,
      xml,
    });
  }

  /**
   * get xml of the graph
   */
  getGraphXml() {
    const xml = wr.getGraphXml({
      graph: this.graph,
      mxUtils: this.mxUtils,
    });

    const xmlStr = new XMLSerializer().serializeToString(xml); // eslint-disable-line

    return xmlStr;
  }

  /**
   * create vertex
   * @param {shapeLabel, x, y, width, height, shapeStyle} param0 shapeLabel, x, y, width, height, shapeStyle
   */
  createVertex(shapeLabel, x, y, width, height, shapeStyle) {
    const { graph } = this;

    const parent = graph.getDefaultParent();
    const cell = graph.insertVertex(
      parent,
      null,
      shapeLabel,
      x,
      y,
      width,
      height,
      shapeStyle
    );

    return cell;
  }

  /**
   * insert edge
   * @param {*} v1 cell 1
   * @param {*} v2 cell 2
   */
  insertEdge(v1, v2) {
    const parent = this.graph.getDefaultParent();

    return this.graph.insertEdge(parent, null, "", v1, v2);
  }

  /**
   * get cell by id
   * @param {*} id id
   */
  getCellById(id) {
    const { cells } = this.graph.model;

    let cell;

    cells &&
      Object.keys(cells).forEach((key) => {
        if (cells[key].id === id) {
          cell = cells[key];
        }
      });

    return cell;
  }

  /**
   * get all cells
   */
  getAllCells() {
    const { cells } = this.graph.model;
    return cells;
  }

  removeEventListeners() {
    return wr.removeEventListeners();
  }

  /**
   * rename a cell label
   * @param {*} newName new name
   * @param {*} cell a cell
   */
  renameCell(newName, cell) {
    return wr.renameCell(newName, cell, this.graph);
  }

  /**
   * refresh the graph
   */
  refresh() {
    return this.graph.refresh();
  }

  /**
   * clear selection in the graph
   */
  clearSelection() {
    return this.graph.clearSelection();
  }

  startPanning() {
    return wr.startPanning(this.graph);
  }

  stopPanning() {
    return wr.stopPanning(this.graph);
  }
}