import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Preview.css";

export default class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = { editor: null };
  }

  componentDidMount() {}

  componentDidUpdate() {
    console.log("Preview componentDidUpdate");
  }

  render() {
    return (
      <div className="preview">
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
