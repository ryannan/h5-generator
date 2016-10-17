import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';

import classnames from 'classnames';

import * as actions from '../actions/WorkspaceActions.js'
import * as comTypes from '../constants/ComTypes.js'
import * as staticValues from '../constants/StaticValues'

import PageItem from './PageItem'

import './Carousel.sass'

const style = {
  'backgroundColor': '#fff'
}

class Carousel extends Component {
  constructor(props){
    super(props)
  }
  componentDidUpdate(){
    console.timeEnd('render carousel')
  }
  render(){
    console.log('render carousel');
    console.time('render carousel');
    const { pagesById, selectedPageId } = this.props;

    return (
      <div
        id="swiperContainer"
        className="swiper-container"
        style={{...style, width: staticValues.CAROUSEL_WIDTH, height: staticValues.CAROUSEL_HEIGHT}}
        onClick = {this.props.clickOtherArea}
        >
        <div className="swiper-wrapper">
          {
            pagesById.map((page)=>{
              return (
                <PageItem
                  key={page.get('id')}
                  pageData = {page}
                  isSelected={selectedPageId === page.get('id')}
                  />
              )
            })
          }
        </div>

        <div className="swiper-pagination"></div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const pageList = state.pageList.present
  return {
    selectedPageId: pageList.get('selectedPageId'),
    pagesById: pageList.get('pagesById')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clickOtherArea: bindActionCreators(actions.clickOtherArea, dispatch)
  };
}

Carousel = connect(mapStateToProps, mapDispatchToProps)(Carousel)
export default Carousel
