import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../actions/WorkspaceActions'
import Immutable from 'immutable'

import BaseCom from './BaseCom'

class Text extends Component {
  constructor(props){
    super(props)
  }
  shouldComponentUpdate(nextProps){
    return !(Immutable.is(this.props.data, nextProps.data)
              && (this.props.isSelected === nextProps.isSelected))
  }
  componentDidUpdate(){
    console.timeEnd('render text'+this.props.data.get('id'))
  }
  render(){
    // console.log('render Text');
    console.time('render text'+this.props.data.get('id'));

    const data = Immutable.fromJS({
      id: this.props.data.get('id'),
      index: this.props.data.get('index'),
      x:this.props.data.get('position').get('0'),
      y: this.props.data.get('position').get('1'),
      width: this.props.data.get('dimension').get('0'),
      height: this.props.data.get('dimension').get('1'),
      isSelected: this.props.isSelected
    })
    return (
      <BaseCom data={data}>
        <div style={{...this.props.data.get('style').toJS(), fontSize:`${this.props.data.get('fontSize')}${this.props.data.get('fontSizeUnit')}`}}>
          {
            this.props.data.get('content').toJS().map((contentItem,index)=>(<p key={index}>{contentItem}</p>))
          }
        </div>
      </BaseCom>
    )
  }
}

export default Text
