import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField } from 'material-ui';

import * as actions from '../../actions/WorkspaceActions.js';
import * as comTypes from '../../constants/ComTypes.js';

import {
	Tabs,
	Tab,
	RaisedButton
} from 'material-ui';

import { grey500 } from 'material-ui/styles/colors';

class SettingList extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Tabs
				className = 'property-panel'
				inkBarStyle = {{ backgroundColor: '#d4d4d4'}}>
				<Tab label='设置'
					value='property'
					style={{ backgroundColor: '#fff', color: '#000'}}
					>
					<TextField
						hintText="标题"
						fullWidth
						style={{ marginTop: 30 }}
						value={this.props.title || ''}
						onChange={(e, value) => this.props.changeSettingInfo(comTypes.SETTING_TITLE, value)}	// eslint-disable-line no-unused-vars
						/>
					<TextField
						hintText="描述"
						fullWidth
						style={{ marginTop: 30 }}
						value={this.props.describe || ''}
						onChange={(e, value) => this.props.changeSettingInfo(comTypes.SETTING_DESCRIBE, value)}	// eslint-disable-line no-unused-vars
						/>
					<TextField
						hintText="关键字"
						fullWidth
						style={{ marginTop: 30 }}
						value={this.props.keywords || ''}
						onChange={(e, value) => this.props.changeSettingInfo(comTypes.SETTING_KEYWORDS, value)}	// eslint-disable-line no-unused-vars
						/>
					<div className="property-panel-action">
						<RaisedButton 
							label="后退"
							backgroundColor={grey500}
							labelStyle={{ color: '#fff' }}
							onClick={() => (this.props.backHome())}
							style={{ marginLeft: 15 }}
							/>
					</div>
				</Tab>
			</Tabs>
		);
	}
}

SettingList.propTypes = {
	title: PropTypes.string
	, describe: PropTypes.string
	, keywords: PropTypes.string
	, changeSettingInfo: PropTypes.func
	, backHome: PropTypes.func
};

function mapStateToProps(state) {
	const pageList = state.pageList.present;

	return {
		title: pageList.get('title')
		, describe: pageList.get('describe')
		, keywords: pageList.get('keywords')
	};
}

function mapDispatchToProps(dispatch) {
	return {
		changeSettingInfo: bindActionCreators(actions.changeSettingInfo, dispatch)
		, backHome: bindActionCreators(actions.clickOtherArea, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingList);