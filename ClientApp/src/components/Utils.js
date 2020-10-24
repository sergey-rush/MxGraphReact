import DEFAULT_CARD_SHAPES from "../config/card-shape";
import DEFAULT_IMAGE_SHAPES from "../config/image-shape";

import STENCILS from "../config/stencils/index";
import GENERAL_SHAPES from "../config/general-shape";
//import './basic-shapes-generator';
import MxCellState from "mxgraph";
import mxAutoSaveManager from "mxgraph";
import MxPoint from "mxgraph";
import mxStencil from "mxgraph";
import mxRectangle from "mxgraph";
import mxImage from "mxgraph";
import MxEllipse from "mxgraph";
import MxConnectionConstraint from "mxgraph";
import MxCell from "mxgraph";
import MxGeometry from "mxgraph";
import MxCodec from "mxgraph";

export default {
  /**
   * init graph
   * @param {graph} config
   */
  initGraph(config) {
    const { graph } = config;

    // // Enables HTML labels
    // graph.setHtmlLabels(true);

    // Enables panning with left mouse button
    // graph.panningHandler.useLeftButtonForPanning = true;
    // graph.panningHandler.ignoreCell = true;
    // graph.container.style.cursor = 'move';
    graph.setPanning(true);
    graph.graphHandler.scaleGrid = true;
    graph.gridSize = 30;

    graph.setTooltips(true);
    graph.setConnectable(true);
    graph.setEnabled(true);
    graph.setEdgeLabelsMovable(false);
    graph.setVertexLabelsMovable(false);
    graph.setGridEnabled(true);
    graph.setAllowDanglingEdges(false);
    graph.setDropEnabled(true);

    // // Uncomment the following if you want the container
    // // to fit the size of the graph
    // graph.setResizeContainer(true);

    graph.collapsedImage = "";
    graph.expandedImage = "";

    graph.gridSize = 10;
  },

  initShapes(config) {
    const {
      graph,
      mxUtils,
      mxConstants,
      mxPerimeter,
      mxStencilRegistry,
      IMAGE_SHAPES,
      CARD_SHAPES,
      SVG_SHAPES,
    } = config;

    const { stylesheet } = graph;

    const vertexStyle = stylesheet.getDefaultVertexStyle();
    vertexStyle[mxConstants.STYLE_STROKECOLOR] = "#B9BECC";
    vertexStyle[mxConstants.STYLE_FILLCOLOR] = "#ffffff";
    vertexStyle[mxConstants.STYLE_FONTCOLOR] = "#000";

    const edgeStyle = stylesheet.getDefaultEdgeStyle();
    edgeStyle['edgeStyle'] = 'orthogonalEdgeStyle';
    edgeStyle['curved'] = '1';
    edgeStyle[mxConstants.STYLE_STROKECOLOR] = "#B9BECC";
    edgeStyle[mxConstants.STYLE_STROKEWIDTH] = 2;
    edgeStyle[mxConstants.STYLE_FONTCOLOR] = "#000";

    const cardShapes = CARD_SHAPES || DEFAULT_CARD_SHAPES;
    const imageShapes = IMAGE_SHAPES || DEFAULT_IMAGE_SHAPES;
    const svgShapes = { custom: SVG_SHAPES, ...STENCILS };

    this.imageShapes = imageShapes;

    const imageStyle = {};
    imageStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
    imageStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    // style[mxConstants.STYLE_IMAGE] = cardShapes[name];
    imageStyle[mxConstants.STYLE_FONTCOLOR] = "#333";
    graph.getStylesheet().putCellStyle("image", imageStyle);

    cardShapes &&
      cardShapes.forEach((shape) => {
        const style = mxUtils.clone(imageStyle);
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_IMAGE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_IMAGE] = shape.logo;
        style[mxConstants.STYLE_IMAGE_WIDTH] = "30";
        style[mxConstants.STYLE_IMAGE_HEIGHT] = "30";
        style[mxConstants.STYLE_SPACING_TOP] = "46";
        style[mxConstants.STYLE_SPACING] = "8";
        style[mxConstants.STYLE_ROUNDED] = 1;
        style[mxConstants.STYLE_ARCSIZE] = 10;
        style[mxConstants.STYLE_STROKECOLOR] = "#ffffff";
        style[mxConstants.STYLE_FILLCOLOR] = "#ffffff";
        graph.getStylesheet().putCellStyle(shape.key, style);
      });

    svgShapes &&
      Object.keys(svgShapes).forEach((name) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svgShapes[name], "text/xml"); // important to use "text/xml"
        const root = xmlDoc.firstChild;
        let shape = root.firstChild;

        while (shape != null) {
          if (shape.nodeType === mxConstants.NODETYPE_ELEMENT) {
            mxStencilRegistry.addStencil(
              shape.getAttribute("name"),
              new mxStencil(shape)
            );
          }

          shape = shape.nextSibling;
        }
      });
  },

  initGrid(config) {
    const { graph, mxGraphView, mxEvent } = config;

    var canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.zIndex = -1;
    graph.container.appendChild(canvas);

    // Modify event filtering to accept canvas as container
    var mxGraphViewIsContainerEvent = mxGraphView.prototype.isContainerEvent;
    mxGraphView.prototype.isContainerEvent = function (evt) {
      return (
        mxGraphViewIsContainerEvent.apply(this, arguments) ||
        mxEvent.getSource(evt) == canvas
      );
    };

    var mxGraphViewValidateBackground =
      mxGraphView.prototype.validateBackground;
    mxGraphView.prototype.validateBackground = function () {
      mxGraphViewValidateBackground.apply(this, arguments);
      repaintGrid(graph, canvas);
    };

    function repaintGrid(graph, canvas) {
      var ctx = canvas.getContext("2d");
      var s = 0;
      var gs = 0;
      var tr = new MxPoint();
      var w = 0;
      var h = 0;

      if (ctx != null) {
        var bounds = graph.getGraphBounds();
        var width = Math.max(
          bounds.x + bounds.width,
          graph.container.clientWidth
        );
        var height = Math.max(
          bounds.y + bounds.height,
          graph.container.clientHeight
        );
        var sizeChanged = width != w || height != h;

        if (
          graph.view.scale != s ||
          graph.view.translate.x != tr.x ||
          graph.view.translate.y != tr.y ||
          gs != graph.gridSize ||
          sizeChanged
        ) {
          tr = graph.view.translate.clone();
          s = graph.view.scale;
          gs = graph.gridSize;
          w = width;
          h = height;

          // Clears the background if required
          if (!sizeChanged) {
            ctx.clearRect(0, 0, w, h);
          } else {
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);
          }

          var tx = tr.x * s;
          var ty = tr.y * s;

          // Sets the distance of the grid lines in pixels
          var minStepping = graph.gridSize;
          var stepping = minStepping * s;

          if (stepping < minStepping) {
            var count = Math.round(Math.ceil(minStepping / stepping) / 2) * 2;
            stepping = count * stepping;
          }

          var xs = Math.floor((0 - tx) / stepping) * stepping + tx;
          var xe = Math.ceil(w / stepping) * stepping;
          var ys = Math.floor((0 - ty) / stepping) * stepping + ty;
          var ye = Math.ceil(h / stepping) * stepping;

          xe += Math.ceil(stepping);
          ye += Math.ceil(stepping);

          var ixs = Math.round(xs);
          var ixe = Math.round(xe);
          var iys = Math.round(ys);
          var iye = Math.round(ye);

          // Draws the actual grid
          ctx.strokeStyle = "#F4F4F4";
          ctx.beginPath();

          for (var x = xs; x <= xe; x += stepping) {
            x = Math.round((x - tx) / stepping) * stepping + tx;
            var ix = Math.round(x);

            ctx.moveTo(ix + 0.5, iys + 0.5);
            ctx.lineTo(ix + 0.5, iye + 0.5);
          }

          for (var y = ys; y <= ye; y += stepping) {
            y = Math.round((y - ty) / stepping) * stepping + ty;
            var iy = Math.round(y);

            ctx.moveTo(ixs + 0.5, iy + 0.5);
            ctx.lineTo(ixe + 0.5, iy + 0.5);
          }

          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  },

  initSidebar(config) {
    const {
      graph,
      mxEvent,
      mxClient,
      mxUtils,
      mxDragSource,
      sidebarItems,
      cellCreatedFunc,
    } = config;

    sidebarItems && sidebarItems.forEach((item) => {
        const width = item.getAttribute("data-shape-width");
        const height = item.getAttribute("data-shape-height");
        const shapeType = item.getAttribute("data-shape-type");
        const shapeName = item.getAttribute("data-shape-name");
        const shapeLabel = item.getAttribute("data-shape-label");
        const shapeContent = item.getAttribute("data-shape-content");
        let isEdge = false;

        let shapeStyle = shapeName;

        if (shapeType === "svg") {
          shapeStyle = `shape=${shapeName}`;
        } else if (shapeType === "general") {
          if (GENERAL_SHAPES[shapeName].type === "edge") {
            isEdge = true;
          }
          shapeStyle = GENERAL_SHAPES[shapeName].style;
        } else if (shapeType === "image") {
          const shape = this.findItemFromArray(this.imageShapes, {
            key: shapeName,
          });

          const img = shape.logo;

          shapeStyle = `shape=image;html=1;verticalLabelPosition=bottom;fontColor:#fff;verticalAlign=top;imageAspect=0;image=${img}`;
        } else if (shapeType === "card") {
          shapeStyle = `${shapeName}`;
        }

        this.createDragableItem({
          id: `cell${Date.now()}`,
          node: item,
          width,
          height,
          shapeName,
          shapeLabel,
          shapeContent,
          graph,
          isEdge,
          shapeStyle,
          cellCreatedFunc,
          mxClient,
          mxUtils,
          mxDragSource,
          mxEvent,
        });
      });
  },

  createDragableItem(config) {
    const {
      graph,
      node,
      shapeName,
      shapeStyle,
      shapeLabel,
      // shapeContent,
      id,
      isEdge,
      cellCreatedFunc,
      mxClient,
      mxUtils,
      mxDragSource,
      mxEvent,
    } = config;

    let { width, height } = config;

    width = width * 1 || 130;
    height = height * 1 || 90;

    // Returns the graph under the mouse
    const graphF = (evt) => {
      const x = mxEvent.getClientX(evt);
      const y = mxEvent.getClientY(evt);
      const elt = document.elementFromPoint(x, y);

      if (mxUtils.isAncestorNode(graph.container, elt)) {
        return graph;
      }

      return null;
    };

    // Inserts a cell at the given location
    const funct = (graph2, evt, target, x, y) => {
      try {
        // is a edge
        if (isEdge) {
          const cell = new MxCell(
            "",
            new MxGeometry(0, 0, width, height),
            shapeStyle
          );
          cell.geometry.setTerminalPoint(new MxPoint(0, height), true);
          cell.geometry.setTerminalPoint(new MxPoint(width, 0), false);
          // cell.geometry.points = [new MxPoint(width/2, height/2), new MxPoint(0, 0)];
          cell.geometry.relative = true;
          cell.edge = true;
          cell.shapeName = shapeName;
          cell.id = id;

          const cells = graph.importCells([cell], x, y, target);

          if (cells != null && cells.length > 0) {
            graph.scrollCellToVisible(cells[0]);
            graph.setSelectionCells(cells);
          }

          cellCreatedFunc && cellCreatedFunc(cell);
        } else {
          const parent = graph.getDefaultParent();

          if (parent) {
            const cell = graph.insertVertex(
              parent,
              id,
              shapeLabel,
              x,
              y,
              width,
              height,
              shapeStyle
            );
            cell.shapeName = shapeName;

            cellCreatedFunc && cellCreatedFunc(cell);
          } else {
            console.log("graph.getDefaultParent() 为 null");
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    // Disables built-in DnD in IE (this is needed for cross-frame DnD, see below)
    if (mxClient.IS_IE) {
      mxEvent.addListener(node, "dragstart", (evt) => {
        evt.returnValue = false;
      });
    }

    // Creates the element that is being for the actual preview.
    const dragElt = document.createElement("div");
    dragElt.style.border = "dashed black 1px";
    dragElt.style.width = `${width}px`;
    dragElt.style.height = `${height}px`;

    // Drag source is configured to use dragElt for preview and as drag icon
    // if scalePreview (last) argument is true. Dx and dy are null to force
    // the use of the defaults. Note that dx and dy are only used for the
    // drag icon but not for the preview.
    const ds = mxUtils.makeDraggable(
      node,
      graphF,
      funct,
      dragElt,
      null,
      null,
      graph.autoscroll,
      true
    );

    // Redirects feature to global switch. Note that this feature should only be used
    // if the the x and y arguments are used in funct to insert the cell.
    ds.isGuidesEnabled = () => graph.graphHandler.guidesEnabled;

    // Restores original drag icon while outside of graph
    ds.createDragElement = mxDragSource.prototype.createDragElement;
  },

  undoListener(config) {
    const { graph, mxEvent, mxUndoManager, callback } = config;

    // Undo/redo
    const undoManager = new mxUndoManager();

    graph.undoManager = undoManager;

    const listener = (sender, evt) => {
      undoManager.undoableEditHappened(evt.getProperty("edit"));
    };
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

    this.undoListenerFunc2 = this.undoListenerFunc.bind(
      this,
      undoManager,
      callback
    );

    document.body.addEventListener("keydown", this.undoListenerFunc2);
  },

  undoListenerFunc(undoManager, callback, e) {
    if (e.target !== e.currentTarget) {
      return false;
    }

    const evtobj = window.event ? window.event : e;

    if (evtobj.keyCode === 90 && (evtobj.ctrlKey || evtobj.metaKey)) {
      undoManager.undo();

      const { history: histories } = undoManager;

      callback && callback(histories);

      // undoManager.redo();
    }
  },

  copyListener(config) {
    const { graph, mxClipboard, callback } = config;

    this.copyListenerFunc2 = this.copyListenerFunc.bind(
      this,
      graph,
      mxClipboard,
      callback
    );
    document.body.addEventListener("keydown", this.copyListenerFunc2);
  },

  copyListenerFunc(graph, mxClipboard, callback, e) {
    if (e.target !== e.currentTarget) {
      return false;
    }
    const evtobj = window.event ? window.event : e;
    // command + c / ctrl + c
    if (evtobj.keyCode === 67 && (evtobj.ctrlKey || evtobj.metaKey)) {
      mxClipboard.copy(graph);
    } else if (evtobj.keyCode === 86 && (evtobj.ctrlKey || evtobj.metaKey)) {
      // command + v / ctrl + v
      // copy-paste cells array
      const cells = mxClipboard.paste(graph);
      callback && callback(cells);
    }
  },

  deleteListener(config) {
    const { graph, callback } = config;
    const { removeCells } = graph;
    graph.removeCells = function (cells) {
      const result = removeCells.apply(this, [cells]);
      callback && callback(cells);
      return result;
    };
    this.deleteListenerFunc2 = this.deleteListenerFunc.bind(this, graph);
    document.body.addEventListener("keydown", this.deleteListenerFunc2);
  },

  deleteListenerFunc(graph, e) {
    if (!(e.target === e.currentTarget || graph.container.contains(e.target))) {
      return false;
    }

    const { editingCell } = graph.cellEditor;

    const evtobj = window.event ? window.event : e;
    if (evtobj.keyCode === 46 || evtobj.keyCode === 8) {
      // No any cell can be deleted while editing
      if (!editingCell) {
        const cellsSelected = graph.getSelectionCells();
        // cellsSelected && cellsSelected.length && graph.removeCells(cellsSelected);

        const cellsSelectable = [];
        cellsSelected &&
          cellsSelected.forEach((cell) => {
            if (!cell.disabled) {
              cellsSelectable.push(cell);
            }
          });

        cellsSelectable &&
          cellsSelectable.length &&
          graph.removeCells(cellsSelectable);
      }
    }
  },

  handleDoubleClick(config) {
    const { graph, mxEvent, callback } = config;
    // Installs a handler for double click events in the graph that shows an alert box
    graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {
      const cell = evt.getProperty("cell");
      callback && callback(cell);
    });
  },

  handleClick(config) {
    const { graph, mxEvent, callback } = config;
    graph.addListener(mxEvent.CLICK, (sender, event) => {
      const cell = event.getProperty("cell");
      callback && callback(cell, event);
    });
  },

  handleChange(config) {
    const { graph, mxEvent, callback } = config;
    graph.getSelectionModel().addListener(mxEvent.CHANGE, (sender, evt) => {
      callback && callback();
    });
  },

  htmlLable(config) {
    const { graph, mxUtils } = config;

    // Enables HTML labels
    graph.setHtmlLabels(true);

    // Creates a user object that stores the state
    const doc = mxUtils.createXmlDocument();
    const obj = doc.createElement("UserObject");
    obj.setAttribute("label", "Hello, World!");
    obj.setAttribute("checked", "false");
  },

  initAutoSave(config) {
    const { graph, callback } = config;

    const mgr = new mxAutoSaveManager(graph);
    mgr.autoSaveDelay = 0; // Auto save delay time is set to 0
    mgr.save = () => {
      const xml = this.getGraphXml({
        graph,
      });

      const formatedNode = this.formatXmlNode(xml);

      if (!formatedNode) {
        return false;
      }

      const xmlStr = new XMLSerializer().serializeToString(formatedNode);

      graph.xmlStr = xmlStr;

      callback && callback(xmlStr);
    };
  },

  // check the xmlnode format to avoid error
  formatXmlNode(xmlNode) {
    const rootEle = xmlNode && xmlNode.firstElementChild;

    let hasRoot = false;
    if (rootEle && rootEle.tagName === "root") {
      hasRoot = true;
    }

    let hasIdO = false;
    if (
      rootEle &&
      rootEle.firstElementChild &&
      rootEle.firstElementChild.id === "0"
    ) {
      hasIdO = true;
    }

    if (!(hasRoot && hasIdO)) {
      console.warn("xmlNode must have root node");
      return false;
    }

    const elements = rootEle.children;

    const idsArr = [];

    elements &&
      Array.from(elements).forEach((element) => {
        const cellId = element && element.getAttribute("id");

        if (idsArr.indexOf(cellId) === -1) {
          idsArr.push(cellId);
        } else {
          console.warn("cell id is duplicated, delete the needless one", element);
          rootEle.removeChild(element);
        }

        if (
          element &&
          element.getAttribute("vertex") === "1" &&
          element.getAttribute("edge") === "1"
        ) {
          console.warn("cell's property vertex and edge cannot both be 1, set property edge to 0", element);
          element.setAttribute("edge", 0);
        }
      });

    return xmlNode;
  },

  /**
   * Returns the XML node that represents the current diagram.
   */
  getGraphXml(config) {
    let { ignoreSelection } = config;
    const { graph, mxUtils } = config;

    ignoreSelection = ignoreSelection != null ? ignoreSelection : true;
    let node = null;

    if (ignoreSelection) {
      const enc = new MxCodec(mxUtils.createXmlDocument());
      node = enc.encode(graph.getModel());
    } else {
      node = graph.encodeCells(
        mxUtils.sortCells(
          graph.model.getTopmostCells(graph.getSelectionCells())
        )
      );
    }

    if (graph.view.translate.x !== 0 || graph.view.translate.y !== 0) {
      node.setAttribute("dx", Math.round(graph.view.translate.x * 100) / 100);
      node.setAttribute("dy", Math.round(graph.view.translate.y * 100) / 100);
    }

    node.setAttribute("grid", graph.isGridEnabled() ? "1" : "0");
    node.setAttribute("gridSize", graph.gridSize);
    node.setAttribute("guides", graph.graphHandler.guidesEnabled ? "1" : "0");
    node.setAttribute("tooltips", graph.tooltipHandler.isEnabled() ? "1" : "0");
    node.setAttribute("connect", graph.connectionHandler.isEnabled() ? "1" : "0");
    node.setAttribute("arrows", graph.connectionArrowsEnabled ? "1" : "0");
    node.setAttribute("fold", graph.foldingEnabled ? "1" : "0");
    node.setAttribute("page", graph.pageVisible ? "1" : "0");
    node.setAttribute("pageScale", graph.pageScale);
    node.setAttribute("pageWidth", graph.pageFormat.width);
    node.setAttribute("pageHeight", graph.pageFormat.height);

    if (graph.background != null) {
      node.setAttribute("background", graph.background);
    }

    return node;
  },

  // From xml rendering graph
  renderGraphFromXml(config) {
    const { graph, mxUtils, xml } = config;

    // const xml = window.localStorage.getItem('graph-xml');
    const xmlDocument = mxUtils.parseXml(xml);

    if (
      xmlDocument.documentElement != null &&
      xmlDocument.documentElement.nodeName === "mxGraphModel"
    ) {
      const decoder = new MxCodec(xmlDocument);
      const node = xmlDocument.documentElement;

      const formatedNode = this.formatXmlNode(node);

      if (!formatedNode) {
        return false;
      }

      decoder.decode(formatedNode, graph.getModel());
    }
  },

  /**
   * Initialize zoom configuration
   */
  initZoomConfig(config) {
    const { graph } = config;
    graph.keepSelectionVisibleOnZoom = true;
    graph.centerZoom = true;
  },

  zoom(config) {
    const { graph, type } = config;

    switch (type) {
      case "in":
        graph.zoomIn();
        break;
      case "out":
        graph.zoomOut();
        break;
      case "actual":
        graph.zoomActual();
        break;
      default:
        break;
    }

    const cellsSelected = graph.getSelectionCells();
    graph.scrollCellToVisible(cellsSelected, true);
    graph.refresh();
  },

  updateStyle(graph, mxUtils, cell, key, value) {
    const model = graph.getModel();

    model.beginUpdate();

    let newStyle = model.getStyle(cell);

    newStyle = mxUtils.setStyle(newStyle, key, value);

    model.setStyle(cell, newStyle);

    model.endUpdate();
  },

  /**
   * vertex Rename Listener
   */
  vertexRenameListener({ callback, mxCell }) {
    mxCell.prototype.valueChangedCallback = callback;

    // If not rewritten valueChanged method rewrite
    if (!mxCell.prototype.hasRewriteValueChanged) {
      mxCell.prototype.hasRewriteValueChanged = true;

      const { valueChanged } = mxCell.prototype;
      mxCell.prototype.valueChanged = function (newValue) {
        const { valueChangedCallback } = mxCell.prototype;

        valueChangedCallback && valueChangedCallback(this, newValue);
        valueChanged.apply(this, [newValue]);
      };
    }
  },

  /**
   * Rename cell
   * @param {*} newName New name（labelName）
   * @param {*} cell cell
   * @param {*} graph cell attributable graph
   */
  renameCell(newName, cell, graph) {
    cell.value = newName;
    graph.refresh(); // Re-render graph
  },

  /**
   * remove event listeners
   */
  removeEventListeners() {
    document.body.removeEventListener("keydown", this.undoListenerFunc2);
    document.body.removeEventListener("keydown", this.copyListenerFunc2);
    document.body.removeEventListener("keydown", this.deleteListenerFunc2);
  },

  startPanning(graph) {
    // graph.setPanning(true);
    // Enables panning with left mouse button
    graph.panningHandler.useLeftButtonForPanning = true;
    graph.panningHandler.ignoreCell = true;
    graph.container.style.cursor = "move";
  },

  stopPanning(graph) {
    graph.panningHandler.useLeftButtonForPanning = false;
    graph.panningHandler.ignoreCell = false;
    graph.container.style.cursor = "auto";
  },

  findItemFromArray(arr, query) {
    const key = Object.keys(query)[0];
    const value = query[key];

    let result;

    arr &&
      arr.forEach((item) => {
        if (item && item[key] === value) {
          result = item;
        }
      });

    return result;
  },
};