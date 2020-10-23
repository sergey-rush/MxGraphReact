import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

export default class CellView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {

    const {
        editor
      } = this.props;
  
      const graph = editor && editor.graph;
      console.log("Cell View");

    return (
      <div>
        
          <FormGroup>
            <Label for="idInput">Id</Label>
            <Input type="text" name="idInput" id="idInput" placeholder="Id" />
          </FormGroup>
          <FormGroup>
            <Label for="nameInput">Name</Label>
            <Input
              type="text"
              name="nameInput"
              id="nameInput"
              placeholder="Name"
            />
          </FormGroup>
          <Button>Submit</Button>
        
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
