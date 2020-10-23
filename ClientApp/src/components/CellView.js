import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import MxCell from "mxgraph";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

export default class CellView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editor: null };
  }

  componentDidMount() {}

  componentDidUpdate() {
    this.handleSidebarItems();
  }

  handleSidebarItems() {
    const { editor } = this.props;

    if (editor && editor.initSidebar) {
      const sidebarItems = document.querySelectorAll(".custom-sidebar-node");

      const newSidebarItems = Array.from(sidebarItems).filter((item) => {
        if (!item.classList.contains("has-inited")) {
          item.classList.add("has-inited");
          return true;
        }
        return false;
      });

      editor.initSidebar(newSidebarItems);
    }
  }

  onChange() {
    setTimeout(() => {
      this.handleSidebarItems();
    }, 1000);
  }

  inputChangedHandler(event){
    console.log("Cell View inputChangedHandler: " + event.value);
  }

  render() {
    const { editor } = this.props;
    const graph = editor && editor.graph;

    if (!this.props.activeCell) {
      return null;
    }

    return (
      <div>        
        <FormGroup>
          <Label for="idInput">Id</Label>
          <Input type="text" name="idInput" id="idInput" value={this.props.activeCell.id} onChange={(event)=>this.inputChangedHandler(event)} placeholder="Id" />
        </FormGroup>
        <FormGroup>
          <Label for="shapeNameInput">Name</Label>
          <Input type="text" name="shapeNameInput" id="shapeNameInput" value={this.props.activeCell.shapeName} onChange={(event)=>this.inputChangedHandler(event)} placeholder="Name" />
        </FormGroup>
        <FormGroup>
          <Label for="valueInput">Value</Label>
          <Input type="text" name="valueInput" id="valueInput" value={this.props.activeCell.value} onChange={(event)=>this.inputChangedHandler(event)} placeholder="Value" />
        </FormGroup>
      </div>
    );
  }
}

CellView.propTypes = {
  editor: PropTypes.object,  
};

CellView.defaultProps = {
  editor: {},  
};
