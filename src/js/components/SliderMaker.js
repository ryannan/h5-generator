import './SliderMaker.sass';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import PageList from '../containers/PageList';
import Workspace from '../components/Workspace';
import PropertyPanel from '../components/PropertyPanel';
import MaterialPanel from './MaterialPanel.js';

import parsekey from 'parse-key';

import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import { blue500 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';

import * as actions from '../actions/WorkspaceActions.js';

const muiTheme = getMuiTheme({
	palette: {
		accent1Color: blue500
	}
});

class SliderMaker extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			autoHideDuration: 3000,
			message: '',
			open: false
		};

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleRequestClose = this.handleRequestClose.bind(this);
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown);

		window.onbeforeunload = function () {
			// return '请确认您的场景已保存';
		};
	}

	componentWillReceiveProps(props) {
		if (props.message) {
			const message = props.message;
			this.setState({ open: true, message: message });
		}
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown);
	}

	matchesKey(key, event) {
		if (!key) {
			return false;
		}

		const charCode = event.keyCode || event.which;
		const char = String.fromCharCode(charCode);

		return key.name.toUpperCase() === char.toUpperCase()
            && key.alt === event.altKey
            && key.ctrl === event.ctrlKey
            && key.meta === event.metaKey
            && key.shift === event.shiftKey;
	}

	handleKeyDown(e) {

		if (e.target.tagName === 'INPUT'
			|| e.target.tagName === 'SELECT'
			|| e.target.tagName === 'TEXTAREA'
			|| e.target.isContentEditable
			|| (!e.ctrlKey && !e.metaKey && !e.altKey)
		) {
			return;
		}

		if (e.keyCode === 46) {
			e.preventDefault();
			this.props.del();
			this.setState({
				open: true,
				message: '已删除'
			});
			return;
		}
		// ctrl-c 复制组件或页面
		// ctrl-v 粘贴组件或页面
		// ctrl-z 撤销
		// ctrl-y 重做
		const copy = parsekey('ctrl-c');
		const paste = parsekey('ctrl-v');
		const undo = parsekey('ctrl-z');
		const redo = parsekey('ctrl-y');

		if (this.matchesKey(copy, e)) {
			e.preventDefault();
			this.props.copy();
			this.setState({
				open: true,
				message: '已复制'
			});
		} else if (this.matchesKey(paste, e)) {
			e.preventDefault();
			if (!window.SliderMakerCopied) {
				this.setState({
					open: true,
					message: '没有可粘贴的东西'
				});
			} else {
				this.props.paste();
			}
		} else if (this.matchesKey(undo, e)) {
			e.preventDefault();
			this.props.onUndo();
		} else if (this.matchesKey(redo, e)) {
			e.preventDefault();
			this.props.onRedo();
		}

	}

	handleRequestClose() {
		//every time after show message
		//reset the message buffer
		this.setState({
			open: false
		}, () => this.props.clearMsgBuf());

	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div className="sliderMaker">
					<MaterialPanel />
					<PageList />
					<Workspace />
					<PropertyPanel />
					<Snackbar
						open={this.state.open}
						message={this.state.message}
						autoHideDuration={this.state.autoHideDuration}
						onRequestClose={this.handleRequestClose}
						/>
				</div>
			</MuiThemeProvider>
		);
	}
}

SliderMaker.propTypes = {
	del: PropTypes.func,
	copy: PropTypes.func,
	paste: PropTypes.func,
	onUndo: PropTypes.func,
	onRedo: PropTypes.func,
	clearMsgBuf: PropTypes.func
};

function mapStateToProps(state) {
	const pageList = state.pageList.present;

	return {
		message: pageList.get('message')
	};
}

function mapDispatchToProps(dispatch) {
	return {
		copy: bindActionCreators(actions.copy, dispatch),
		paste: bindActionCreators(actions.paste, dispatch),
		onUndo: () => { dispatch(UndoActionCreators.undo()); },
		onRedo: () => { dispatch(UndoActionCreators.redo()); },
		del: bindActionCreators(actions.del, dispatch),

		clearMsgBuf: bindActionCreators(actions.clearMsgBuf, dispatch),
		showMsg: bindActionCreators(actions.showMsg, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderMaker);
