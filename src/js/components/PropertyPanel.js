import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions/WorkspaceActions.js';
import * as slideEffect from '../constants/SlideEffect';
import * as comTypes from '../constants/ComTypes.js';
import SettingList from './PropertyList/SettingList.js';
import AudioList from './PropertyList/AudioList.js';

import {
	Tabs,
	Tab,
	TextField,
	Avatar,
	List,
	ListItem,
	MakeSelectable,
	Subheader,
	Slider,
	IconButton,
	RaisedButton,
	SelectField,
	MenuItem
} from 'material-ui';

import { ImageImage, EditorTextFields, ImagePhotoLibrary, AvPlayCircleFilled, AvPauseCircleFilled, ContentBlock } from 'material-ui/svg-icons';
import { grey500, red500 } from 'material-ui/styles/colors';

let SelectableList = MakeSelectable(List);

function wrapState(ComposedComponent) {
	class SelectableList extends Component {

		componentWillMount() {
			this.setState({
				selectedIndex: this.props.defaultValue
			});
		}

		handleRequestChange(event, index) {
			this.setState({
				selectedIndex: index
			});
		}

		render() {
			return (
				<ComposedComponent
					value={this.state.selectedIndex}
					onChange={this.handleRequestChange}
					>
					{this.props.children}
				</ComposedComponent>
			);
		}
	}

	SelectableList.propTypes = {
		children: PropTypes.node.isRequired,
		defaultValue: PropTypes.number.isRequired
    };

	return SelectableList;
}

SelectableList = wrapState(SelectableList);

import injectTapEventPlugin from 'react-tap-event-plugin';

import AnimationAction from './AnimationAction';
import './PropertyPanel.sass';

injectTapEventPlugin();

class PropertyPanel extends Component {
	constructor(props) {
		super(props);

		this.afterWheel = false;
		this.onWheel = this.onWheel.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.changeAudioSrc = this.changeAudioSrc.bind(this);

		this.handleTouchTap = this.handleTouchTap.bind(this);

		this.onRadiusSliderChange = this.onRadiusSliderChange.bind(this);

		this.pauseAudio = this.pauseAudio.bind(this);
		this.playAudio = this.playAudio.bind(this);
		this.audio = new Audio('');

		this.state = {
			playingAudioIndex: 0
		};
	}

	changeAudioSrc(valueByDefault) {
		return (e, valueByInput) => {
			value = valueByDefault || valueByInput;
			this.props.changeAudioSrc(value);
		}
	}

	changeItem(selector, comId, value) {
		switch (selector) {
			case 'property-panel-change-bgSrc':
				this.props.changeBgSrc(value)
				break;
			case 'property-panel-change-bgColor':
				this.props.changeBgColor(value)
				break;
			case 'property-panel-change-x':
				this.props.changeItemX(comId, parseInt(value))
				break;
			case 'property-panel-change-y':
				this.props.changeItemY(comId, parseInt(value))
				break;
			case 'property-panel-change-width':
				this.props.changeItemWidth(comId, parseInt(value))
				break;
			case 'property-panel-change-height':
				this.props.changeItemHeight(comId, parseInt(value))
				break;
			case 'property-panel-change-content':
				this.props.changeItemContent(comId, value.split('\n'))
				break;
			case 'property-panel-change-src':
				this.props.changeItemSrc(comId, value)
				break;
			case 'property-panel-change-border':
				this.props.changeItemBorder(comId, value)
				break;
			case 'property-panel-change-box-shadow':
				this.props.changeItemBoxShadow(comId, value)
				break;
			case 'property-panel-change-speed':
				console.log('change speed');
				console.log(value);
				break;
			case 'property-panel-change-fontSize':
				console.log('change font size');
				this.props.changeItemFontSize(comId, parseInt(value))
				break;
			case 'parentLeft':
				this.props.changeItemX(comId, 0)
				break;
			case 'parentTop':
				this.props.changeItemY(comId, 0)
				break;
			case 'textAlignLeft':
			case 'textAlignCenter':
			case 'textAlignRight':
			case 'textItalic':
			case 'textBold':
			case 'textUnderlined':
				this.props[selector](comId)
				break;
			case 'parentCenter':
			case 'parentRight':
			case 'parentCentre':
			case 'parentBottom':
				console.log('change to parent left');
				this.props.changeItemPosition(comId, selector)
				break;
			default:
		}
	}

	handleTouchTap(e) {
		console.log('AnimationAction');
		let el = document.querySelector(".swiper-slide.selected .com-selected")
		// let animationEnd = 'webkitAnimationEnd MSAnimationEnd animationend'
		let animationEnd = 'webkitAnimationEnd'

		let animationName = e.currentTarget.children[0].querySelector('span:last-child').innerText.replace(/\n/, '')
		let animation = `${animationName} ${this.animationSpeed}s ease ${this.animationLatency}s both`

		// const changeItemAnimation = this.props.changeItemAnimation
		this.props.changeItemAnimationName(this.id, animationName)
		// changeItemAnimation(comId, animation)

		let animationEndHandler = function () {
			el.style.webkitAnimation = ''
			el.removeEventListener(animationEnd, animationEndHandler)
		}

		el.addEventListener(animationEnd, animationEndHandler)

		el.style.webkitAnimation = animation
	}

	onWheel(e) {
		const speed = Math.abs(e.deltaY) < 60 ? 1 : 10
		if (e.deltaY > 0) {
			e.target.value = parseInt(e.target.value) + speed
		} else {
			e.target.value = parseInt(e.target.value) - speed
		}

		//watch out a hack here, just a smell
		this.afterWheel = true

		this.changeItem(e.target.id, this.id, parseInt(e.target.value))
	}

	onChange(e, value) {
		if (this.afterWheel) {
			this.afterWheel = false
			return
		}
		this.changeItem(e.target.id, this.id, value)
	}

	onSpeedSliderChange(e, value) {
		// this.setState({'speedSlider':value})
		this.props.changeItemAnimationSpeed(this.id, value)
	}

	onLatencySliderChange(e, value) {
		// this.setState({'latencySlider':value})
		this.props.changeItemAnimationLatency(this.id, value)
	}

	onOpacitySliderChange(e, value) {
		this.props.changeItemOpacity(this.id, value)
	}

	onRadiusSliderChange(e, value) {
		this.props.changeItemRadius(this.id, value)
	}

	onShadowSliderChange(e, value) {
		this.props.changeItemShadow(this.id, value)
	}

	onRotateSliderChange(e, value) {
		this.props.changeItemRotate(this.id, value)
	}

	handleClick(btnId) {
		return (e) => {
			this.changeItem(btnId, this.id)
		}
	}

	pauseAudio() {
		this.audio.pause()
	}

	playAudio(src) {
		if (src) {
			this.audio.src = src
		}
		this.audio.play()
	}

	componentDidUpdate() {
		console.timeEnd('property render')
	}

	render() {
		console.log("render property panel");

		const iconStyle = {
			marginRight: 24
		}

		const tabStyle = {
			backgroundColor: '#fff',
			color: '#000'
		}

		const inkBarStyle = {
			backgroundColor: '#d4d4d4'
		}
		const textFieldStyle = {
			width: '18%',
			display: 'inline-block'
		}
		const sliderStyle = {
			margin: "0px 15px 30px",
			height: 30
		}

		//************************* check audio tab is open or not first *************************
		const { isAudioTabOpen, currOpenTab } = this.props;

		const audioSrc = this.props.audioSrc || '';

		const defaultAudioSrc = [
			'//192.168.30.157:3030/res/b.mp3',
			'//192.168.30.157:3030/res/d.mp3'
		];

		switch (currOpenTab) {
			case comTypes.SETTING_TAB:
				return (
					<SettingList />
				);
			case comTypes.AUDIO_TAB:
				return (
					<AudioList />
					// <Tabs key='audio-property'
					// 	id='audio-property'
					// 	className = 'property-panel'
					// 	inkBarStyle = {inkBarStyle}>
					// 	<Tab label='背景音乐'
					// 		value='property'
					// 		style={tabStyle}
					// 		>
					// 		<SelectableList defaultValue={!!audioSrc ? 3 : 0}>
					// 			<ListItem
					// 				key={0}
					// 				value={0}
					// 				onClick={() => {
					// 					this.setState({ playingAudioIndex: 0 }, () => {
					// 						this.pauseAudio()
					// 						this.props.changeAudioSrc()
					// 					})
					// 				}
					// 				}
					// 				leftIcon={<ContentBlock />}
					// 				>
					// 				<span>关闭音乐</span>
					// 			</ListItem>

					// 			<ListItem
					// 				key={1}
					// 				value={1}
					// 				onClick={() => {
					// 					console.log(11111);
					// 					this.playAudio(defaultAudioSrc[0])
					// 					this.setState({ playingAudioIndex: 1 }, () => this.props.changeAudioSrc(defaultAudioSrc[0]))
					// 				}
					// 				}
					// 				leftIcon={
					// 					(() => {
					// 						if (this.state.playingAudioIndex === 1) {
					// 							return <AvPauseCircleFilled
					// 								onClick={(e) => {
					// 									console.log(22222);
					// 									e.stopPropagation()
					// 									this.pauseAudio()
					// 									this.setState({ playingAudioIndex: 0 })
					// 								}} />
					// 						} else {
					// 							return <AvPlayCircleFilled
					// 								onClick={(e) => {
					// 									console.log(33333);
					// 									e.stopPropagation()
					// 									this.playAudio(defaultAudioSrc[0])
					// 									this.setState({ playingAudioIndex: 1 })
					// 								}}/>
					// 						}
					// 					})()
					// 				}
					// 				>
					// 				<span>预设音乐1</span>
					// 			</ListItem>

					// 			<ListItem
					// 				key={2}
					// 				value={2}
					// 				onClick={() => {
					// 					this.playAudio(defaultAudioSrc[1])
					// 					this.setState({ playingAudioIndex: 2 }, () => this.props.changeAudioSrc(defaultAudioSrc[1]))
					// 				}
					// 				}
					// 				leftIcon={
					// 					(() => {
					// 						if (this.state.playingAudioIndex === 2) {
					// 							return <AvPauseCircleFilled
					// 								onClick={(e) => {
					// 									e.stopPropagation()
					// 									this.pauseAudio()
					// 									this.setState({ playingAudioIndex: 0 })
					// 								}} />
					// 						} else {
					// 							return <AvPlayCircleFilled
					// 								onClick={(e) => {
					// 									e.stopPropagation()
					// 									this.playAudio(defaultAudioSrc[1])
					// 									this.setState({ playingAudioIndex: 2 })
					// 								}}/>
					// 						}
					// 					})()
					// 				}
					// 				>
					// 				<span>预设音乐2</span>
					// 			</ListItem>

					// 			<Subheader>自定义</Subheader>
					// 			<ListItem
					// 				key={3}
					// 				value={3}
					// 				onClick={() => {
					// 					this.playAudio(audioSrc)
					// 					this.setState({ playingAudioIndex: 3 })
					// 				}
					// 				}
					// 				leftIcon={
					// 					(() => {
					// 						if (this.state.playingAudioIndex === 3) {
					// 							return <AvPauseCircleFilled
					// 								onClick={(e) => {
					// 									e.stopPropagation()
					// 									this.pauseAudio()
					// 									this.setState({ playingAudioIndex: 0 })
					// 								}} />
					// 						} else {
					// 							return <AvPlayCircleFilled
					// 								onClick={(e) => {
					// 									e.stopPropagation()
					// 									this.playAudio(audioSrc)
					// 									this.setState({ playingAudioIndex: 3 })
					// 								}}/>
					// 						}
					// 					})()
					// 				}
					// 				>
					// 				<TextField id="property-panel-change-audio-src"
					// 					hintText="背景音乐地址"
					// 					value={audioSrc || ''}
					// 					className="property-panel-textfield"
					// 					onChange={(e, value) => this.props.changeAudioSrc(value)}
					// 					style={{ marginTop: -20, marginLeft: -4, width: '80%' }}
					// 					/>
					// 			</ListItem>
					// 		</SelectableList>
					// 	</Tab>
					// </Tabs>
				);
			default:
		}
		

		//*************************            render components         *************************
		const {selectedPageId, pagesById} = this.props

		const selectedPage = pagesById.find(page => page.get('id') === selectedPageId)
		const selectedComId = selectedPage.get('selectedComId')
		this.id = selectedComId
		const items = selectedPage.get('items')

		const selectedCom = items.find(item => item.get('id') === selectedComId).toJS()
		const selectedComIndex = items.findIndex(item => item.get('id') === selectedComId)

		let opacity, radius, shadow, rotate, animation;
		let animationName, animationSpeed, animationLatency;

		//compute all coms to display index
		//except the id=0 for background
		const comCounts = items.size - 1

		if (selectedCom.type !== comTypes.BACKGROUND) {
			({ opacity, radius, shadow, rotate, animation } = selectedCom)

			animationName = animation.name || '';
			this.animationName = animationName

			animationSpeed = animation.speed || 1;
			this.animationSpeed = animationSpeed

			animationLatency = animation.latency || 0.5;
			this.animationLatency = animationLatency
		}

		console.log("property switch to: " + selectedCom.type);
		switch (selectedCom.type) {
			case comTypes.TEXT:
				return (
					<Tabs className="property-panel" inkBarStyle={inkBarStyle} >
						<Tab label="样式" value="property" style={tabStyle}>
							<div className="00">
								<TextField id="property-panel-change-x"
									value={selectedCom.position[0]}
									floatingLabelText="X"
									type="number"
									onWheel={this.onWheel}
									onChange={this.onChange}
									ref={(node => this._inputX = node)}
									className="property-panel-textfield"
									style={textFieldStyle}
									/>
								<TextField id="property-panel-change-y"
									value={selectedCom.position[1]}
									floatingLabelText="Y"
									type="number"
									onWheel={this.onWheel}
									onChange={this.onChange}
									ref={(node => this._inputY = node)}
									className="property-panel-textfield"
									style={textFieldStyle}
									/>
							</div>
							<TextField id="property-panel-change-width"
								value={selectedCom.dimension[0]}
								floatingLabelText="width"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputWidth = node)}
								style={textFieldStyle}
								className="property-panel-textfield"
								/>
							<TextField id="property-panel-change-height"
								value={selectedCom.dimension[1]}
								floatingLabelText="height"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputHeight = node)}
								style={textFieldStyle}
								className="property-panel-textfield"
								/>

							<TextField id="property-panel-change-fontSize"
								value={selectedCom.fontSize}
								floatingLabelText="字体大小"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								className="property-panel-textfield"
								/>

							<div className="icon-iconfont-container-group">
								<IconButton
									id="parentLeft"
									iconClassName="icon-iconfont-container-left"
									tooltip="parent left"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentLeft')}
									/>

								<IconButton
									id="parentCenter"
									iconClassName="icon-iconfont-container-center"
									tooltip="parent center"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentCenter')}
									/>
								<IconButton
									id="parentRight"
									iconClassName="icon-iconfont-container-right"
									tooltip="parent right"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentRight')}
									/>
								<IconButton
									id="parentTop"
									iconClassName="icon-iconfont-container-top"
									tooltip="parent top"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentTop')}
									/>
								<IconButton
									id="parentCentre"
									iconClassName="icon-iconfont-container-centre"
									tooltip="parent centre"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentCentre')}
									/>
								<IconButton
									id="parentBottom"
									iconClassName="icon-iconfont-container-bottom"
									tooltip="parent bottom"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentBottom')}
									/>
							</div>

							<div style={{ marginBottom: 20 }}>
								<IconButton
									id="textAlignLeft"
									iconClassName="material-icons"
									tooltip="text align left"
									tooltipPosition="top-center"
									onClick={this.handleClick('textAlignLeft')}
									>
									format_align_left
								</IconButton>
								<IconButton
									id="textAlignCenter"
									iconClassName="material-icons"
									tooltip="text align center"
									tooltipPosition="top-center"
									onClick={this.handleClick('textAlignCenter')}
									>
									format_align_center
								</IconButton>
								<IconButton
									id="textAlignRight"
									iconClassName="material-icons"
									tooltip="text align right"
									tooltipPosition="top-center"
									onClick={this.handleClick('textAlignRight')}
									>
									format_align_right
								</IconButton>
								<IconButton
									id="textItalic"
									iconClassName="material-icons"
									tooltip="italic"
									tooltipPosition="top-center"
									onClick={this.handleClick('textItalic')}
									>
									format_italic
								</IconButton>
								<IconButton
									id="textBold"
									iconClassName="material-icons"
									tooltip="bold"
									tooltipPosition="top-center"
									onClick={this.handleClick('textBold')}
									>
									format_bold
								</IconButton>
								<IconButton
									id="textUnderlined"
									iconClassName="material-icons"
									tooltip="underlined"
									tooltipPosition="top-center"
									onClick={this.handleClick('textUnderlined')}
									>
									format_underlined
								</IconButton>
							</div>

							<TextField id="property-panel-change-content"
								hintText="文本内容"
								floatingLabelText="文本内容"
								multiLine={true}
								rows={selectedCom.content.length}
								value={selectedCom.content.join("\n")}
								className="property-panel-textfield"
								onChange={this.onChange}
								/>

							<div className="property-panel-action">
								<RaisedButton 
									label="后退"
									backgroundColor={grey500}
									labelStyle={{ color: '#fff' }}
									onClick={() => (this.props.backHome())}
									style={{ marginLeft: 15 }}
									/>
								<RaisedButton
									label="删除"
									backgroundColor={red500}
									labelStyle={{ color: '#fff' }}
									onClick={() => (this.props.deleteCom())}
									style={{ marginLeft: 15 }}
									/>
							</div>

						</Tab>
						<Tab label="动画" value="action" style={tabStyle}>
							<Slider id="property-panel-change-speed"
								defaultValue={1}
								description={`speed: ${animationSpeed}s`}
								style={{...sliderStyle, paddingTop: 15}}
							min={0}
							max={10}
							step={0.5}
							name="speed"
							value={animationSpeed}
							onChange={this.onSpeedSliderChange.bind(this)}
							/>

							<Slider id="property-panel-change-latency"
								defaultValue={0.5}
								description={`latency:${animationLatency}s`}
								style={sliderStyle}
								min={0}
								max={10}
								step={0.5}
								name="latency"
								value={animationLatency}
								onChange={this.onLatencySliderChange.bind(this)}
								/>

							<AnimationAction handleTouchTap={this.handleTouchTap} animationName = {animationName}/>
						</Tab>
					</Tabs>
				)

			case comTypes.IMAGE:
				return (
					<Tabs className="property-panel" inkBarStyle={inkBarStyle}>
						<Tab label="样式" value="property" style={tabStyle}>
							<TextField id="property-panel-change-x"
								value={selectedCom.position[0]}
								floatingLabelText="X"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputX = node)}
								className="property-panel-textfield"
								style={textFieldStyle}
								/>
							<TextField id="property-panel-change-y"
								value={selectedCom.position[1]}
								floatingLabelText="Y"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputY = node)}
								className="property-panel-textfield"
								style={textFieldStyle}
								/>
							<TextField id="property-panel-change-width"
								value={selectedCom.dimension[0]}
								floatingLabelText="width"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputWidth = node)}
								style={textFieldStyle}
								className="property-panel-textfield"
								/>
							<TextField id="property-panel-change-height"
								value={selectedCom.dimension[1]}
								floatingLabelText="height"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputHeight = node)}
								style={textFieldStyle}
								className="property-panel-textfield"
								/>

							<div className="icon-iconfont-container-group" style={{ marginBottom: 20 }}>
								<IconButton
									id="parentLeft"
									iconClassName="icon-iconfont-container-left"
									tooltip="parent left"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentLeft')}
									/>

								<IconButton
									id="parentCenter"
									iconClassName="icon-iconfont-container-center"
									tooltip="parent center"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentCenter')}
									/>
								<IconButton
									id="parentRight"
									iconClassName="icon-iconfont-container-right"
									tooltip="parent right"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentRight')}
									/>
								<IconButton
									id="parentTop"
									iconClassName="icon-iconfont-container-top"
									tooltip="parent top"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentTop')}
									/>
								<IconButton
									id="parentCentre"
									iconClassName="icon-iconfont-container-centre"
									tooltip="parent centre"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentCentre')}
									/>
								<IconButton
									id="parentBottom"
									iconClassName="icon-iconfont-container-bottom"
									tooltip="parent bottom"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentBottom')}
									/>
							</div>

							<Slider id="property-panel-change-opacity"
								defaultValue={0}
								description={`opacity: ${opacity}%`}
								style={sliderStyle}
								min={0}
								max={100}
								step={10}
								name="opacity"
								value={opacity}
								onChange={this.onOpacitySliderChange.bind(this)}
								/>

							<Slider id="property-panel-change-radius"
								defaultValue={0}
								description={`radius: ${radius}%`}
								style={sliderStyle}
								min={0}
								max={100}
								step={1}
								name="raidus"
								value={radius}
								onChange={this.onRadiusSliderChange.bind(this)}
								/>

							<Slider id="property-panel-change-shadow"
								defaultValue={0}
								description={`shadow: ${shadow}px`}
								style={sliderStyle}
								min={0}
								max={100}
								step={1}
								name="shadow"
								value={shadow}
								onChange={this.onShadowSliderChange.bind(this)}
								/>

							<Slider id="property-panel-change-rotate"
								defaultValue={0}
								description={`rotate: ${rotate}deg`}
								style={sliderStyle}
								min={0}
								max={360}
								step={5}
								name="rotate"
								value={rotate}
								onChange={this.onRotateSliderChange.bind(this)}
								/>

							<TextField id="property-panel-change-src"
								hintText="图片地址"
								floatingLabelText="图片地址"
								ref={(node => this._inputContent = node)}
								value={selectedCom.src}
								className="property-panel-textfield"
								onChange={this.onChange}
								/>

							<div style={{ marginBottom: 10, paddingLeft: 15 }}>
								<RaisedButton
									label="+"
									disabled={selectedComIndex === comCounts}
									primary={true}
									onClick={() => (this.props.addComIndex())}
									style={{ marginRight: 10 }}
									/>
								<RaisedButton
									label="-"
									disabled={selectedComIndex === 1}
									primary={true}
									onClick={() => (this.props.minusComIndex())}
									style={{ marginRight: 10 }}
									/>
								index: {selectedCom.index}
							</div>

							<div className="property-panel-action">
								<RaisedButton 
									label="后退"
									backgroundColor={grey500}
									labelStyle={{ color: '#fff' }}
									onClick={() => (this.props.backHome())}
									style={{ marginLeft: 15 }}
									/>
								<RaisedButton
									label="删除"
									backgroundColor={red500}
									labelStyle={{ color: '#fff' }}
									onClick={() => (this.props.deleteCom())}
									style={{ marginLeft: 15 }}
									/>
							</div>
						</Tab>

						<Tab label="动画" value="action" style={tabStyle}>
							<Slider id="property-panel-change-speed"
								defaultValue={1}
								description={`speed: ${animationSpeed}s`}
								style={{...sliderStyle, paddingTop: 15}}
							min={0}
							max={10}
							step={0.5}
							name="speed"
							value={animationSpeed}
							onChange={this.onSpeedSliderChange.bind(this)}
							/>

							<Slider id="property-panel-change-latency"
								defaultValue={0.5}
								description={`latency:${animationLatency}s`}
								style={sliderStyle}
								min={0}
								max={10}
								step={0.5}
								name="latency"
								value={animationLatency}
								onChange={this.onLatencySliderChange.bind(this)}
								/>

							<AnimationAction handleTouchTap={this.handleTouchTap} animationName = {animationName}/>

						</Tab>
					</Tabs>
				)

			case comTypes.SHAPE:
				return (
					<Tabs
						className="property-panel"
						inkBarStyle={inkBarStyle}
						key="shape-property"
						id="shape-property">
						<Tab label="样式" value="property" style={tabStyle}>
							<TextField id="property-panel-change-x"
								value={selectedCom.position[0]}
								floatingLabelText="X"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputX = node)}
								className="property-panel-textfield"
								style={textFieldStyle}
								/>
							<TextField id="property-panel-change-y"
								value={selectedCom.position[1]}
								floatingLabelText="Y"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputY = node)}
								className="property-panel-textfield"
								style={textFieldStyle}
								/>
							<TextField id="property-panel-change-width"
								value={selectedCom.dimension[0]}
								floatingLabelText="width"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputWidth = node)}
								style={textFieldStyle}
								className="property-panel-textfield"
								/>
							<TextField id="property-panel-change-height"
								value={selectedCom.dimension[1]}
								floatingLabelText="height"
								type="number"
								onWheel={this.onWheel}
								onChange={this.onChange}
								ref={(node => this._inputHeight = node)}
								style={textFieldStyle}
								className="property-panel-textfield"
								/>

							<div className="icon-iconfont-container-group" style={{ marginBottom: 20 }}>
								<IconButton
									id="parentLeft"
									iconClassName="icon-iconfont-container-left"
									tooltip="parent left"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentLeft')}
									/>

								<IconButton
									id="parentCenter"
									iconClassName="icon-iconfont-container-center"
									tooltip="parent center"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentCenter')}
									/>
								<IconButton
									id="parentRight"
									iconClassName="icon-iconfont-container-right"
									tooltip="parent right"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentRight')}
									/>
								<IconButton
									id="parentTop"
									iconClassName="icon-iconfont-container-top"
									tooltip="parent top"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentTop')}
									/>
								<IconButton
									id="parentCentre"
									iconClassName="icon-iconfont-container-centre"
									tooltip="parent centre"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentCentre')}
									/>
								<IconButton
									id="parentBottom"
									iconClassName="icon-iconfont-container-bottom"
									tooltip="parent bottom"
									tooltipPosition="top-center"
									onClick={this.handleClick('parentBottom')}
									/>
							</div>

							<Slider id="property-panel-change-opacity"
								defaultValue={0}
								description={`opacity: ${opacity}%`}
								style={sliderStyle}
								min={0}
								max={100}
								step={10}
								name="opacity"
								value={opacity}
								onChange={this.onOpacitySliderChange.bind(this)}
								/>

							<Slider id="property-panel-change-radius"
								defaultValue={0}
								description={`radius: ${radius}%`}
								style={sliderStyle}
								min={0}
								max={100}
								step={1}
								name="raidus"
								value={radius}
								onChange={this.onRadiusSliderChange.bind(this)}
								/>

							<Slider id="property-panel-change-rotate"
								defaultValue={0}
								description={`rotate: ${rotate}deg`}
								style={sliderStyle}
								min={0}
								max={360}
								step={5}
								name="rotate"
								value={rotate}
								onChange={this.onRotateSliderChange.bind(this)}
								/>

							<div style={{ marginBottom: 10, paddingLeft: 15 }}>
								<RaisedButton
									label="+"
									disabled={selectedComIndex === comCounts}
									primary={true}
									onClick={() => (this.props.addComIndex())}
									style={{ marginRight: 10 }}
									/>
								<RaisedButton
									label="-"
									disabled={selectedComIndex === 1}
									primary={true}
									onClick={() => (this.props.minusComIndex())}
									style={{ marginRight: 10 }}
									/>
								index: {selectedCom.index}
							</div>

							<TextField id="property-panel-change-border"
								hintText="边框"
								floatingLabelText="边框"
								ref={(node => this._inputContent = node)}
								value={selectedCom.style.border}
								className="property-panel-textfield"
								onChange={this.onChange}
								/>

							<TextField id="property-panel-change-box-shadow"
								hintText="阴影"
								floatingLabelText="阴影"
								ref={(node => this._inputContent = node)}
								value={selectedCom.style.boxShadow}
								className="property-panel-textfield"
								onChange={this.onChange}
								/>

							<div className="property-panel-action">
								<RaisedButton 
									label="后退"
									backgroundColor={grey500}
									labelStyle={{ color: '#fff' }}
									onClick={() => (this.props.backHome())}
									style={{ marginLeft: 15 }}
									/>
								<RaisedButton
									label="删除"
									backgroundColor={red500}
									labelStyle={{ color: '#fff' }}
									onClick={() => (this.props.deleteCom())}
									style={{ marginLeft: 15 }}
									/>
							</div>
						</Tab>
						<Tab label="动画" value="action" style={tabStyle}>
							<Slider id="property-panel-change-speed"
								defaultValue={1}
								description={`speed: ${animationSpeed}s`}
								style={{...sliderStyle, paddingTop: 15}}
							min={0}
							max={10}
							step={0.5}
							name="speed"
							value={animationSpeed}
							onChange={this.onSpeedSliderChange.bind(this)}
							/>

							<Slider id="property-panel-change-latency"
								defaultValue={0.5}
								description={`latency:${animationLatency}s`}
								style={sliderStyle}
								min={0}
								max={10}
								step={0.5}
								name="latency"
								value={animationLatency}
								onChange={this.onLatencySliderChange.bind(this)}
								/>

							<AnimationAction handleTouchTap={this.handleTouchTap} animationName = {animationName}/>

						</Tab>
					</Tabs>
				)

			case comTypes.BACKGROUND:
				const comTypeImgStyle = {
					// color: blue300,
					// backgroundColor: pink400
				}
				console.log(this.props.effect);

				return (
					<Tabs key="background-property"
						id="background-property"
						className="property-panel"
						inkBarStyle={inkBarStyle}>
						<Tab label="组件设置" value="property" style={tabStyle}>
							<Subheader>组件</Subheader>
							<List>
								{
									items.map(item => {
										switch (item.get('type')) {
											case comTypes.TEXT:
												return (
													<ListItem
														leftAvatar={
															<Avatar {...comTypeImgStyle} icon={<EditorTextFields />}/>
														}
														key={item.get('index')}
														onClick={() => this.props.selectCom(item.get('id'))}
														>
														{item.get('index')}
														<span style={{ marginLeft: 20 }}>文字</span>
													</ListItem>
												)

											case comTypes.IMAGE:
												return (
													<ListItem
														leftAvatar={
															<Avatar {...comTypeImgStyle} icon={<ImageImage />}/>
														}
														key={item.get('index')}
														onClick={() => this.props.selectCom(item.get('id'))}
														>
														{item.get('index')}
														<span style={{ marginLeft: 20 }}>图片</span>
													</ListItem>
												)

											case comTypes.SHAPE:
												return (
													<ListItem
														leftAvatar={
															<Avatar {...comTypeImgStyle} icon={<ImageImage />}/>
														}
														key={item.get('index')}
														onClick={() => this.props.selectCom(item.get('id'))}
														>
														{item.get('index')}
														<span style={{ marginLeft: 20 }}>形状</span>
													</ListItem>
												)

											case comTypes.BACKGROUND:
												return (
													<ListItem
														leftAvatar={
															<Avatar {...comTypeImgStyle} icon={<ImagePhotoLibrary />}/>
														}
														key={item.get('index')}
														>
														{item.get('index')}
														<span style={{ marginLeft: 20 }}>背景</span>
													</ListItem>
												)
												break;
											default:
										}
									})
								}
							</List>

							<Subheader>背景</Subheader>
							<TextField id="property-panel-change-bgSrc"
								hintText="背景图片地址"
								floatingLabelText="背景图片地址"
								value={selectedCom.src || ''}
								className="property-panel-textfield"
								onChange={this.onChange}
								style={{ marginTop: -20 }}
								/>
							<TextField id="property-panel-change-bgColor"
								hintText="颜色"
								floatingLabelText="颜色"
								value={selectedCom.color || ''}
								className="property-panel-textfield"
								onChange={this.onChange}
								style={{ marginTop: -20 }}
								/>
							<SelectField
								id="property-panel-change-bgSize"
								style={{ marginLeft: 20 }}
								value={(['cover', 'contain'].indexOf(selectedCom.size) === -1) ? 0 : (['cover', 'contain'].indexOf(selectedCom.size))}
								floatingLabelText="覆盖样式"
								onChange={(e, index, value) => this.props.changeBgSize(value)}>
								<MenuItem value={0} primaryText='cover' />
								<MenuItem value={1} primaryText='contain' />
							</SelectField>

							<Subheader>翻页效果</Subheader>
							<SelectField
								style={{ marginLeft: 20 }}
								value={slideEffect.effectArray.indexOf(this.props.effect)}
								onChange={(e, index, value) => this.props.changeSlideEffect(value)}
								>
								<MenuItem value={0} primaryText={slideEffect.SLIDE} />
								<MenuItem value={1} primaryText={slideEffect.FADE} />
								<MenuItem value={2} primaryText={slideEffect.CUBE} />
								<MenuItem value={3} primaryText={slideEffect.COVERFLOW} />
								<MenuItem value={4} primaryText={slideEffect.FLIP} />
							</SelectField>
						</Tab>
					</Tabs>
				)
			default:

		}
	}
}

function mapStateToProps(state) {
	const pageList = state.pageList.present;

	return {
		selectedPageId: pageList.get('selectedPageId'),
		pagesById: pageList.get('pagesById')

		, effect: pageList.get('effect')
		, isAudioTabOpen: pageList.get('isAudioTabOpen')
		, audioSrc: pageList.get('audioSrc')
		, currOpenTab: pageList.get('currOpenTab')
	};
}

function mapDispatchToProps(dispatch) {
	return {
		changeBgSrc: bindActionCreators(actions.changeBgSrc, dispatch)
		, changeBgColor: bindActionCreators(actions.changeBgColor, dispatch)
		, changeBgSize: bindActionCreators(actions.changeBgSize, dispatch)

		, changeAudioSrc: bindActionCreators(actions.changeAudioSrc, dispatch)

		, changeItemX: bindActionCreators(actions.changeItemX, dispatch)
		, changeItemY: bindActionCreators(actions.changeItemY, dispatch)
		, changeItemWidth: bindActionCreators(actions.changeItemWidth, dispatch)
		, changeItemHeight: bindActionCreators(actions.changeItemHeight, dispatch)
		, changeItemContent: bindActionCreators(actions.changeItemContent, dispatch)
		, changeItemAnimation: bindActionCreators(actions.changeItemAnimation, dispatch)

		, changeItemPosition: bindActionCreators(actions.changeItemPosition, dispatch)

		, changeItemFontSize: bindActionCreators(actions.changeItemFontSize, dispatch)
		, textAlignLeft: bindActionCreators(actions.textAlignLeft, dispatch)
		, textAlignCenter: bindActionCreators(actions.textAlignCenter, dispatch)
		, textAlignRight: bindActionCreators(actions.textAlignRight, dispatch)
		, textBold: bindActionCreators(actions.textBold, dispatch)
		, textItalic: bindActionCreators(actions.textItalic, dispatch)
		, textUnderlined: bindActionCreators(actions.textUnderlined, dispatch)

		, changeItemSrc: bindActionCreators(actions.changeItemSrc, dispatch)
		, changeItemOpacity: bindActionCreators(actions.changeItemOpacity, dispatch)
		, changeItemRotate: bindActionCreators(actions.changeItemRotate, dispatch)
		, changeItemRadius: bindActionCreators(actions.changeItemRadius, dispatch)
		, changeItemShadow: bindActionCreators(actions.changeItemShadow, dispatch)

		, changeItemBorder: bindActionCreators(actions.changeItemBorder, dispatch)
		, changeItemBoxShadow: bindActionCreators(actions.changeItemBoxShadow, dispatch)

		, changeItemAnimationName: bindActionCreators(actions.changeItemAnimationName, dispatch)
		, changeItemAnimationSpeed: bindActionCreators(actions.changeItemAnimationSpeed, dispatch)
		, changeItemAnimationLatency: bindActionCreators(actions.changeItemAnimationLatency, dispatch)

		, deleteCom: bindActionCreators(actions.deleteCom, dispatch)
		, backHome: bindActionCreators(actions.clickOtherArea, dispatch)
		, addComIndex: bindActionCreators(actions.addComIndex, dispatch)
		, minusComIndex: bindActionCreators(actions.minusComIndex, dispatch)

		, selectCom: bindActionCreators(actions.selectCom, dispatch)
		, changeSlideEffect: bindActionCreators(actions.changeSlideEffect, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyPanel);
