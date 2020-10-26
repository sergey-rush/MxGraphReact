import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Preview.css";

export default class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = { editor: null };
  }

  componentDidMount() {
    //console.log("Preview componentDidMount");
  }

  componentDidUpdate() {
    //console.log("Preview componentDidUpdate");
    const { editor } = this.props;
    if (editor) {
      let preview = document.getElementById('preview');
      editor.initPreview(preview);
    }
  }

  render() {
    return (
      <div id="preview" className="preview">
        <p>Outline window</p>
      </div>
    );
  }
}

Preview.propTypes = {
  editor: PropTypes.object,
};

Preview.defaultProps = {
  editor: {},
};
