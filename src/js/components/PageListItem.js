import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable'

import * as staticValues from '../constants/StaticValues'

import * as comTypes from '../constants/ComTypes.js'
import Com_Text from './Com/Text'
import Com_Image from './Com/Image'
import Com_Shape from './Com/Shape'

import classnames from 'classnames';
import './PageListItem.sass'

import { ContextMenuLayer } from "react-contextmenu";

import PagelistItemMenu from './Menu/PagelistItemMenu'
import { PAGELIST_ITEM_MENU } from '../constants/MenuTypes'

class PageListItem extends Component {
  constructor(props){
    super(props)
  }
  shouldComponentUpdate(nextProps){
    return !((this.props.selected === nextProps.selected)
              && (this.props.index === nextProps.index)
              && Immutable.is(this.props.page, nextProps.page))
  }
  render(){
    console.log("render page item");
    const { onClick, page, index, selected } = this.props
    this.isSelected = selected

    const ratio = 160 / staticValues.CAROUSEL_WIDTH

    const backgroundData = page.getIn(['items', '0']).toJS()
    const style = {
      backgroundImage: backgroundData.src ? `url(${backgroundData.src})` : '',
      backgroundSize: backgroundData.size,
      backgroundColor: backgroundData.color,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top'
    }

    return (
      <li
        className="page-list-item-wrapper"
        onClick={()=>{
          if (this.isSelected) {
            return
          }
          onClick()
          }
        }
      >
       
        <div
          className={
            classnames('page-list-item', {'selected': selected})
          }
          style={{
            width: 160,
            height: staticValues.CAROUSEL_HEIGHT * ratio,
            position: 'relative'
          }}
          >
          <div className="item-corner">
            <span>{index + 1}</span>
          </div>
          <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 999
            }}></div>
          <div className="page-list-item-thumb" style={{
                ...style,
                width: staticValues.CAROUSEL_WIDTH,
                height: staticValues.CAROUSEL_HEIGHT,
                transform: `scale(${ratio}, ${ratio})`,
                transformOrigin: "0 0"
              }}
            >
            {
              page.get('items').map(item=>{
                switch (item.get('type')) {
                  case comTypes.TEXT:
                    return <Com_Text key={item.get('id')} data={item} />

                  case comTypes.IMAGE:
                    return <Com_Image key={item.get('id')} data={item} />

                  case comTypes.SHAPE:
                    return <Com_Shape key={item.get('id')} data={item } />

                  default:
                    return null
                }
              })
            }
          </div>
        </div>
      </li>
    )
  }
}

// export default PageListItem

// const PageListItemWithMenu = ContextMenuLayer(PAGELIST_ITEM_MENU, (props)=>({props: props}))(PageListItem)
const PageListItemWithMenu = ContextMenuLayer((props)=>{
  console.log('context menu layer');
  console.log(props);
  console.log(`${PAGELIST_ITEM_MENU}_${props.index}`);
  return `${PAGELIST_ITEM_MENU}_${props.index}`
}, (props)=>({props: props}))(PageListItem)

export default (
  React.createClass({
    getInitialState(){
      // console.log('get initial state');
      // console.log(this.props.index);
      // console.log(this.props.pageCount);
      return {
        canMoveUp: (this.props.index !== 0),
        canMoveDown: (this.props.index !== (this.props.pageCount - 1)),

        canPaste: false
      }
    },
    onContextMenu(){
      // console.log(this.props.pageCount);
      // this.setState({
      //   canMoveUp: (this.props.index !== 0),
      //   canMoveDown: (this.props.index !== (this.props.pageCount - 1))
      // })
      this.setState({
        canPaste: window.SliderMakerCopied && (window.SliderMakerCopied.type === 'page')
      })
    },
    render(){
      const canMoveUp = this.props.index !== 0
      const canMoveDown = this.props.index !== this.props.pageCount - 1
      // console.log(this.state.canMoveUp);
      // console.log(this.state.canMoveDown);
      return (
        <div onContextMenu={this.onContextMenu}>
          <PageListItemWithMenu {...this.props}/>
          <PagelistItemMenu
            index={this.props.index}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            canPaste={this.state.canPaste} />
        </div>
      )
    }
  })
)
