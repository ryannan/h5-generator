import React, { Component, PropTypes } from 'react';
import * as actions from '../actions/WorkspaceActions.js'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import MaterialPanel from './MaterialPanel.js'
import Carousel from './Carousel.js';
import ControlPanel from './ControlPanel.js'
import './Workspace.sass'

class Workspace extends Component {
  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  onClick(e){
    e.stopPropagation()
    this.props.clickOtherArea()
  }
  render(){
    console.log("render workspace");
    return (
      <div className="workspace" onClick={this.onClick}>
        <Carousel></Carousel>
        <ControlPanel></ControlPanel>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {

  }
}

function mapDispatchToProps(dispatch){
  return {
    clickOtherArea: bindActionCreators(actions.clickOtherArea, dispatch)
  }
}

Workspace = connect(mapStateToProps, mapDispatchToProps)(Workspace)
export default Workspace
