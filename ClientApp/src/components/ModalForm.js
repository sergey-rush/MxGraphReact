import React, { Component, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ModalForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      taskDesc: "",
      confirmLoading: false
    };
    
  }

  hideModal = () => {
    this.props.handleCancel();
  };

  handleConfirm = () => {
    console.log("ModalForm handleConfirm");
    const taskName = "taskName";
    const { taskDesc } = this.state;
    this.setState({
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        confirmLoading: false
      });
      const id = Math.ceil(Math.random() * 100);
      this.props.handleConfirm({
        type: this.props.currentCell,
        taskName,
        taskDesc,
        id
      });
    }, 1000);
  };

  render() {    
    return (
    <div>      
      <Modal isOpen={this.props.visible}>
        <ModalHeader>{this.props.currentCell.shapeName}</ModalHeader>
        <ModalBody>
        {this.props.currentCell.value}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleConfirm}>Save</Button>{' '}
          <Button color="secondary" onClick={this.hideModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
  }
}