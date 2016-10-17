import React, { Component, PropTypes } from 'react';
import * as actions from '../actions/WorkspaceActions.js'
import * as comTypes from '../constants/ComTypes';

import { ActionCreators as UndoActionCreators } from 'redux-undo'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import IconButton from 'material-ui/IconButton';
import {ContentUndo, ContentRedo, AvPlayArrow} from 'material-ui/svg-icons'

import classnames from 'classnames'

import './ControlPanel.sass'

class ControlPanel extends Component {
  constructor(props){
    super(props)
    this.onHandlePreview = this.onHandlePreview.bind(this)

    const styles = {
      smallIcon: {
        width: 30,
        height: 30,
      },
      mediumIcon: {
        width: 48,
        height: 48,
      },
      largeIcon: {
        width: 60,
        height: 60,
      },
      small: {
        width: 40,
        height: 40,
        padding: 0
      },
      medium: {
        width: 96,
        height: 96,
        padding: 24,
      },
      large: {
        width: 120,
        height: 120,
        padding: 30,
      },
    };
    this.styles = styles

    //只要items不变，就不需要重复计算
    const {pagesById, selectedPageId} = this.props
    const items = pagesById.find(page=> page.get('id') === selectedPageId)
                                .get('items').toJS()
    this.items = items
  }
  componentWillReceiveProps(props){
    const {pagesById, selectedPageId} = this.props
    const items = pagesById.find(page=> page.get('id') === selectedPageId)
                                .get('items').toJS()
    this.items = items
  }
  onHandlePreview(e){
    console.log('preview current page');
    e.stopPropagation()

    const root = document.querySelector(".swiper-slide.selected")
    let animationEnd = 'webkitAnimationEnd'

    let itemsCount = this.items.length
    for (let i = 0; i < itemsCount; i++) {
      let item = this.items[i]

      if ((item.type === comTypes.BACKGROUND) || (item.animation.length === 0)) {
        continue
      }
      let el = root.querySelector(`[data-id='${item.id}']`)
      let animationEndHandler = function(){
        el.style.webkitAnimation = ''
        el.removeEventListener(animationEnd, animationEndHandler)
      }
      el.addEventListener(animationEnd, animationEndHandler)
      el.style.webkitAnimation = `${item.animation.name} ${item.animation.speed}s ease ${item.animation.latency}s both`
    }
  }
  render(){
    return (
      <div className="control-panel">
        <IconButton
          id="preview"
          className={classnames("control-panel-item", "preview")}
          tooltip="预览当前页"
          tooltipPosition="top-center"
          onClick={this.onHandlePreview}
          iconStyle={this.styles.smallIcon}
          style={this.styles.small}
          >
            <AvPlayArrow color={"#fff"}/>
        </IconButton>

        <IconButton
          className={classnames("control-panel-item", "redo")}
          tooltip="重做"
          tooltipPosition="top-center"
          onClick={this.props.onRedo}
          iconStyle={this.styles.smallIcon}
          style={this.styles.small}
          disabled={!this.props.canRedo}
          >
            <ContentRedo color={"#fff"}/>
        </IconButton>

        <IconButton
          className={classnames("control-panel-item", "undo")}
          tooltip="撤消"
          tooltipPosition="top-center"
          onClick={this.props.onUndo}
          iconStyle={this.styles.smallIcon}
          style={this.styles.small}
          disabled={!this.props.canUndo}
          >
            <ContentUndo color={"#fff"}/>
        </IconButton>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    canUndo: state.pageList.past.length > 0
    , canRedo: state.pageList.future.length > 0

    , pagesById: state.pageList.present.get('pagesById')
    , selectedPageId: state.pageList.present.get('selectedPageId')
  }
}

function mapDispatchToProps(dispatch){
  return {
    onUndo: (e)=>{e.stopPropagation();dispatch(UndoActionCreators.undo())},
    onRedo: (e)=>{e.stopPropagation();dispatch(UndoActionCreators.redo())}
  }
}

ControlPanel = connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
export default ControlPanel
