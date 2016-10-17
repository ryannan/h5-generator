import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Immutable from 'immutable'
import { ignoreActions, filterActions } from 'redux-ignore'

import * as actions from '../actions/PageListActions.js'

import './PageList.sass'

import PageListItem from '../components/PageListItem.js'

class PageList extends Component {

	constructor(props, context) {
		super(props);

		this.onClick = this.onClick.bind(this);
		this.addPage = this.addPage.bind(this);

		console.log(this);
	}

	onClick(id) {
		console.time('on click pagelist');
		this.props.selectPage(id);
	}

	addPage() {
		this.props.addPage();
	}

	shouldComponentUpdate(nextProps) {
		return true;
		//if only items selectedComId changed, we should not update this component

		//TODO: check the logic below to improve performance

		// if (!Immutable.is(this.props.selectedPageId, nextProps.selectedPageId)) return true
		//
		// if (!Immutable.is(this.props.pagesById, nextProps.pagesById)) return true
		//
		// let itemsHasChange = this.props.pagesById.some(function(page){
		//   return !Immutable.is(page.get('items'),
		//             nextProps.pagesById.find(nexrPropsPage=>page.get('id') === nexrPropsPage.get('id')).get('items'))
		// })
		// if (itemsHasChange) return true
		//
		// return false
	}

	render() {
		console.log("render pagelist");
		const { pagesById, selectedPageId } = this.props
		const pageCount = pagesById.size
		return (
			<div className="page-list">
				<ul>
					{
						pagesById.map((page, index) => {
							return <PageListItem
								key={page.get('id') }
								index={index}
								pageCount={pageCount}
								page={page}
								selected={selectedPageId === page.get('id') }
								onClick={() => (this.onClick(page.get('id'))) }
								/>
						})
					}
				</ul>
				<div className="add-page">
					<a href="javascript:void(0)" title="添加新页" onClick={this.addPage}><span>+</span></a>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const pageList = state.pageList.present
	return {
		pagesById: pageList.get('pagesById'),
		selectedPageId: pageList.get('selectedPageId')
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addPage: bindActionCreators(actions.addPage, dispatch),
		selectPage: bindActionCreators(actions.selectPage, dispatch)
	};
}


PageList = connect(mapStateToProps, mapDispatchToProps)(PageList)
export default PageList

// const PageListWithMenu = ContextMenuLayer(PAGELIST_MENU)(PageList)
//
// export default (
//   React.createClass({
//     render(){
//       return (
//         <div className="page-list-wrapper">
//           <PageListWithMenu />
//           <PagelistMenu />
//         </div>
//       )
//     }
//   })
// )
