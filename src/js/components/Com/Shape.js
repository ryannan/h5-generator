import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'

import * as actions from '../../actions/WorkspaceActions'

import BaseCom from './BaseCom'

class Shape extends Component {
  constructor(props){
    super(props)
  }

  shouldComponentUpdate(nextProps){
    return !(Immutable.is(this.props.data, nextProps.data)
              && (this.props.isSelected === nextProps.isSelected))
  }
  render(){
    const baseStyle = {
      height: '100%',
      boxSizing: 'border-box'
    }
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
      <BaseCom data={data} >
        <div style={{
            ...baseStyle
            , borderRadius:`${this.props.data.get('radius')}%`
            , border: this.props.data.getIn(['style', 'border'])
            , boxShadow: this.props.data.getIn(['style', 'boxShadow'])
            , opacity: (100 - this.props.data.get('opacity'))/100.0
            , transform: `rotate(${this.props.data.get('rotate')}deg)`

          }}>
        </div>
      </BaseCom>
    )
  }
}

export default Shape
