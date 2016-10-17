import React, { Component, PropTypes } from 'react'

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem'
import Subheader from 'material-ui/Subheader'
import FlatButton from 'material-ui/FlatButton'

class AnimationAction extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const actions = {
      'Attention Seekers': ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "tada", "wobble"],
      'Bouncing Entrances': ["bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp"],
      'Fading Entrances': ["fadeIn", "fadeInDown"],
      'Flippers': ["flip", "flipInX", "flipInY", "flipOutX", "flipOutY"]
    }
    const btnStyle = {
      marginLeft: 10
    }
    console.log('render AnimationAction');
    return (
      <List>
        <Subheader>Attention Seekers</Subheader>
          {
            ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "tada", "wobble"].map(ele=>(
              // <ListItem
              //     key={ele}
              //     primaryText={ele}
              //     onTouchTap={this.props.handleTouchTap}
              //   />
              <FlatButton
                key={ele}
                style={{...btnStyle, color:(this.props.animationName === ele ? '#fff':'rgba(0, 0, 0, 0.870588)')}}
                onTouchTap={this.props.handleTouchTap}
                backgroundColor={this.props.animationName === ele ? '#373F42':''}
                >
                  <span>{ele}</span>
              </FlatButton>
            ))
          }
        <Subheader>Bouncing Entrances</Subheader>
          {
            ["bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp"].map(ele=>(
              <FlatButton
                key={ele}
                style={{...btnStyle, color:(this.props.animationName === ele ? '#fff':'rgba(0, 0, 0, 0.870588)')}}
                onTouchTap={this.props.handleTouchTap}
                backgroundColor={this.props.animationName === ele ? '#373F42':''}
                >
                  <span>{ele}</span>
              </FlatButton>
            ))
          }
        <Subheader>Fading Entrances</Subheader>
          {
            ["fadeIn", "fadeInDown"].map(ele=>(
              <FlatButton
                key={ele}
                style={{...btnStyle, color:(this.props.animationName === ele ? '#fff':'rgba(0, 0, 0, 0.870588)')}}
                onTouchTap={this.props.handleTouchTap}
                backgroundColor={this.props.animationName === ele ? '#373F42':''}
                >
                  <span>{ele}</span>
              </FlatButton>
            ))
          }
        <Subheader>Flippers</Subheader>
          {
            ["flip", "flipInX", "flipInY", "flipOutX", "flipOutY"].map(ele=>(
              <FlatButton
                key={ele}
                style={{...btnStyle, color:(this.props.animationName === ele ? '#fff':'rgba(0, 0, 0, 0.870588)')}}
                onTouchTap={this.props.handleTouchTap}
                backgroundColor={this.props.animationName === ele ? '#373F42':''}
                >
                  <span>{ele}</span>
              </FlatButton>
            ))
          }
        <Subheader>Zoom Entrances</Subheader>
          {
            ["zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"].map(ele=>(
              <FlatButton
                key={ele}
                style={{...btnStyle, color:(this.props.animationName === ele ? '#fff':'rgba(0, 0, 0, 0.870588)')}}
                onTouchTap={this.props.handleTouchTap}
                backgroundColor={this.props.animationName === ele ? '#373F42':''}
                >
                  <span>{ele}</span>
              </FlatButton>
            ))
          }
      </List>
    )
  }
}

export default AnimationAction
