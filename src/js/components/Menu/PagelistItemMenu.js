import React, { Component, PropTypes } from 'react';
import * as pageListActions from '../../actions/PageListActions'
import * as WorkspaceActions from '../../actions/WorkspaceActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { ContextMenu, MenuItem, ContextMenuLayer, monitor } from "react-contextmenu";
import Divider from 'material-ui/Divider';
import { PAGELIST_ITEM_MENU } from '../../constants/MenuTypes'

class Menu extends Component {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e, data){
    // console.log('click');
    // console.log(monitor.getItem())
    switch (data.action) {
      case 'moveUp':
        console.log('上移一页');
        this.props.moveUp(this.props.index)
        break;
      case 'moveDown':
        console.log('下移一页');
        this.props.moveDown(this.props.index)
        break;
      case 'copy':
        console.log('复制');
        this.props.copy(this.props.index)
        this.props.showMsg('已复制')
        break;
      case 'paste':
        console.log('粘贴');
        this.props.paste(this.props.index)
        break;
      case 'del':
        console.log('删除');
        this.props.del(this.props.index)
        break;
      default:
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    // console.log('shouldComponentUpdate');
    return true
    // return (this.props.canMoveUp !== nextProps.canMoveUp)
    //       || (this.props.canMoveDown !== nextProps.canMoveDown)
  }

  render(){
    console.log('render menu');
    // console.log(this.props);
    return (
      <ContextMenu identifier={`${PAGELIST_ITEM_MENU}_${this.props.index}`}>
        <MenuItem onClick={this.handleClick} data={{action: "moveUp"}} disabled={!this.props.canMoveUp}>上移一页</MenuItem>
        <MenuItem onClick={this.handleClick} data={{action: "moveDown"}} disabled={!this.props.canMoveDown}>下移一页</MenuItem>
        <Divider />
        <MenuItem onClick={this.handleClick} data={{action: "copy"}}>复制</MenuItem>
        <MenuItem onClick={this.handleClick} data={{action: "paste"}} disabled={!this.props.canPaste}>粘贴</MenuItem>
        <MenuItem onClick={this.handleClick} data={{action: "del"}}>删除</MenuItem>

      </ContextMenu>
    )
  }
}

function mapStateToProps(state){
  // const _state = state.pageList.present
  // return {
  //   canMoveUp:  _state.get('pages').indexOf(_state.get('selectedPageId')) > 0
  //   , canMoveDown: _state.get('pages').indexOf(_state.get('selectedPageId')) < _state.get('pages').size - 1
  // }
  return {}
}

function mapDispatchToProps(dispatch){
  return {
    moveUp: bindActionCreators(pageListActions.movePageUp, dispatch)
    , moveDown: bindActionCreators(pageListActions.movePageDown, dispatch)
    , copy: bindActionCreators(pageListActions.copyPage, dispatch)
    , paste: bindActionCreators(pageListActions.pastePage, dispatch)
    , del: bindActionCreators(pageListActions.delPage, dispatch)

    , showMsg: bindActionCreators(WorkspaceActions.showMsg,dispatch)
  }
}

Menu = connect(mapStateToProps, mapDispatchToProps)(Menu)

class PagelistItemMenu extends Component {
  constructor(props){
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState){
    // console.log('PagelistItemMenu shouldComponentUpdate');
    return true
    // return (this.props.canMoveUp !== nextProps.canMoveUp)
    //       || (this.props.canMoveDown !== nextProps.canMoveDown)
  }
  render(){
    return (
      <div>
        <Menu {...this.props}/>
      </div>
    )
  }
}

export default PagelistItemMenu
