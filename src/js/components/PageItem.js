import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable'

import classnames from 'classnames';

import * as comTypes from '../constants/ComTypes.js'
import Com_Text from './Com/Text'
import Com_Image from './Com/Image'
import Com_Shape from './Com/Shape'

class PageItem extends Component {
  constructor(props){
    super(props)
  }
  shouldComponentUpdate(nextProps){
    return !(Immutable.is(this.props.pageData, nextProps.pageData)
              && (this.props.isSelected === nextProps.isSelected))
  }
  render(){
    const {pageData, isSelected} = this.props

    const backgroundData = pageData.getIn(['items', '0']).toJS()
    const style = {
      backgroundImage: backgroundData.src ? `url(${backgroundData.src})` : '',
      backgroundSize: backgroundData.size,
      backgroundColor: backgroundData.color,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top'
    }
    return (
      <div className={classnames('swiper-slide', {'selected': isSelected})} style={style}>
          {
            pageData.get('items').map(item=>{
              const isComSelected = pageData.get('selectedComId') === item.get('id')
              switch (item.get('type')) {
                case comTypes.TEXT:
                  return <Com_Text key={item.get('id')} data={item} isSelected={isComSelected} />

                case comTypes.IMAGE:
                  return <Com_Image key={item.get('id')} data={item} isSelected={isComSelected} />

                case comTypes.SHAPE:
                  return <Com_Shape key={item.get('id')} data={item} isSelected={isComSelected} />

                default:
                  return null
            }
          })}
      </div>
    )
  }
}

export default PageItem
