import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import IconButton from 'material-ui/IconButton';
import { EditorTitle, EditorInsertPhoto, ImageCropDin, ImageAudiotrack, NotificationSdCard, ImageRemoveRedEye, ActionSettings } from 'material-ui/svg-icons';

import * as actions from '../actions/WorkspaceActions.js';
import * as comTypes from '../constants/ComTypes.js';

import './MaterialPanel.sass';

class MaterialPanel extends Component {

	constructor(props) {
		super(props);

		this.addCom = this.addCom.bind(this);
		this.save = this.save.bind(this);
		this.toggleAudioSrcTab = this.toggleAudioSrcTab.bind(this);
		this.toggleSettingTab = this.toggleSettingTab.bind(this);
	}

	addCom(type) {
		return (e) => {
			e.stopPropagation();
			this.props.addCom(type);
		};
	}

	toggleAudioSrcTab() {
		return (e) => {
			e.stopPropagation();
			this.props.toggleAudioSrcTab();
		};
	}

	toggleSettingTab() {
		return (e) => {
			e.stopPropagation();
			this.props.toggleSettingTab();
		};
	}

	save(e) {
		e.stopPropagation();
		return this.props.save();
	}

	preview(e) {
		e.stopPropagation();
		const urlArray = window.location.href.split('/');
		const pageId = urlArray[urlArray.length - 2];

		const win = window.open('/page/' + pageId, '_blank');

		if (win) {
			//Browser has allowed it to be opened
			win.focus();
		} else {
			//Browser has blocked it
			alert('Use Chrome plz');
		}
		return;
	}

	render() {
		return (
			<div className="m-container">
			<div className="components-wrapper">
					<IconButton
						tooltip="add text"
						onClick={this.addCom(comTypes.TEXT)}
						iconStyle={styles.smallIcon}
						style={{...styles.small, float: 'left'}}
					>
						<EditorTitle color={"#fff"}/>
						<span className="button-tips">文本</span>
					</IconButton>

					<IconButton
						tooltip="add image"
						onClick={this.addCom(comTypes.IMAGE)}
						iconStyle={styles.smallIcon}
						style={{...styles.small, float: 'left' }}
						>
						<EditorInsertPhoto color={"#fff"}/>
						<span className="button-tips">图片</span>
					</IconButton>

					<IconButton
						tooltip="add shape"
						onClick={this.addCom(comTypes.SHAPE)}
						iconStyle={styles.smallIcon}
						style={{...styles.small, float: 'left' }}
						>
						<ImageCropDin color={"#fff"}/>
						<span className="button-tips">形状</span>
					</IconButton>

					<IconButton
						tooltip="toggle audio src tab"
						onClick={this.toggleAudioSrcTab()}
						iconStyle={styles.smallIcon}
						style={{...styles.small, float: 'left' }}
						>
						<ImageAudiotrack color={"#fff"}/>
						<span className="button-tips">音乐</span>
					</IconButton>
			</div>

			<div className="action-wrapper">			
				<IconButton
					tooltip="save work"
					onClick={this.save}
					iconStyle={styles.smallIcon}
					style={{...styles.small, float: 'right' }}
					>
					<NotificationSdCard color={"#fff"}/>
					<span className="button-tips">保存</span>
				</IconButton>

				<IconButton
					tooltip="preview"
					onClick={this.preview}
					iconStyle={styles.smallIcon}
					style={{...styles.small, float: 'right' }}
					>
					<ImageRemoveRedEye color={"#fff"}/>
					<span className="button-tips">预览</span>
				</IconButton>

				<IconButton
					tooltip="page setting"
					onClick={this.toggleSettingTab()}
					iconStyle={styles.smallIcon}
					style={{...styles.small, float: 'right' }}
					>
					<ActionSettings color={"#fff"}/>
					<span className="button-tips">设置</span>
				</IconButton>
			</div>
		</div >
	);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		addCom: bindActionCreators(actions.addCom, dispatch)
		, toggleAudioSrcTab: bindActionCreators(actions.toggleAudioSrcTab, dispatch)
		, save: () => dispatch(actions.save())
		, toggleSettingTab: bindActionCreators(actions.toggleSettingTab, dispatch)
	};
}

const styles = {
	smallIcon: {
        width: 15,
        height: 15
	},
	mediumIcon: {
        width: 48,
        height: 48
	},
	small: {
        width: 30,
        height: 30,
        padding: 15,
        paddingLeft: 20,
        paddingRight: 40,
		top: -10
	},
	medium: {
        width: 96,
        height: 96,
        padding: 24
	}
};

MaterialPanel.propTypes = {
	addCom: PropTypes.func
	, toggleAudioSrcTab: PropTypes.func
	, toggleSettingTab: PropTypes.func
	, save: PropTypes.func
};

export default connect(null, mapDispatchToProps)(MaterialPanel);
