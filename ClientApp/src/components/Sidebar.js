import React, { Component } from "react";
import PropTypes from "prop-types";
import IMAGE_SHAPES from "../shapes/basic-shape";
import "./Sidebar.css"

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate() {
    //console.log("SideBar componentDidUpdate");
    this.handleSidebarItems();
  }

  handleSidebarItems() {
    const { editor } = this.props;

    if (editor && editor.initSidebar) {
      const sidebarItems = document.querySelectorAll('.custom-sidebar-node');

      const newSidebarItems = Array.from(sidebarItems).filter((item) => {
        if (!item.classList.contains('has-inited')) {
          item.classList.add('has-inited');
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
    return (
  
    <div header="images" key="picture">
      {
      IMAGE_SHAPES.map(shape => (
        
        <a
        onClick={(e) => {
          console.log(`panel_a_${shape.key}`);
          e.preventDefault();
          return false;
        }}
        key={`panel_a_${shape.key}`}
        href="a"
        className="geItem custom-sidebar-node"
        data-shape-type="image"
        data-shape-width={shape.width}
        data-shape-height={shape.height}
        data-shape-name={shape.key}
        data-shape-label={shape.name}
        title={shape.name}
      >
        
          <img className="sidebar-node-image" src={shape.logo} alt="" />
          <span key={`panel_${shape.key}`} className="sidebar-node-label">
            {shape.name}
          </span>
          

      </a>
            )
            
            )
      }
    </div>
  );
}
}

SideBar.propTypes = {
  editor: PropTypes.object,
};

// Specifies the default values for props:
SideBar.defaultProps = {
  editor: {},
};
