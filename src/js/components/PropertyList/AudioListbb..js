import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions/WorkspaceActions.js';
import * as slideEffect from '../constants/SlideEffect';
import * as comTypes from '../constants/ComTypes.js';
import SettingList from './PropertyList/SettingList.js';

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

        handleRequestChange(index) {
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

class AudioList extends Component {

    constructor(props) {
        super(props);
    }

    const audioSrc = this.props.audioSrc || '';

    const defaultAudioSrc = [
        '//192.168.30.157:3030/res/b.mp3',
        '//192.168.30.157:3030/res/d.mp3'
    ]

    const tabStyle = {
        backgroundColor: '#fff',
        color: '#000'
    }

    const inkBarStyle = {
        backgroundColor: '#d4d4d4'
    }

    render() {
        return (
            <Tabs
                className = 'property-panel'
                inkBarStyle = {inkBarStyle}>
                <Tab label='背景音乐'
                    value='property'
                    style={tabStyle}
                    >
                    <SelectableList defaultValue={!!audioSrc ? 3 : 0}>
                        <ListItem
                            key={0}
                            value={0}
                            onClick={() => {
                                this.setState({ playingAudioIndex: 0 }, () => {
                                    this.pauseAudio()
                                    this.props.changeAudioSrc()
                                })
                            }
                            }
                            leftIcon={<ContentBlock />}
                            >
                            <span>关闭音乐</span>
                        </ListItem>

                        <ListItem
                            key={1}
                            value={1}
                            onClick={() => {
                                console.log(11111);
                                this.playAudio(defaultAudioSrc[0])
                                this.setState({ playingAudioIndex: 1 }, () => this.props.changeAudioSrc(defaultAudioSrc[0]))
                            }
                            }
                            leftIcon={
                                (() => {
                                    if (this.state.playingAudioIndex === 1) {
                                        return <AvPauseCircleFilled
                                            onClick={(e) => {
                                                console.log(22222);
                                                e.stopPropagation()
                                                this.pauseAudio()
                                                this.setState({ playingAudioIndex: 0 })
                                            } } />
                                    } else {
                                        return <AvPlayCircleFilled
                                            onClick={(e) => {
                                                console.log(33333);
                                                e.stopPropagation()
                                                this.playAudio(defaultAudioSrc[0])
                                                this.setState({ playingAudioIndex: 1 })
                                            } }/>
                                    }
                                })()
                            }
                            >
                            <span>预设音乐1</span>
                        </ListItem>

                        <ListItem
                            key={2}
                            value={2}
                            onClick={() => {
                                this.playAudio(defaultAudioSrc[1])
                                this.setState({ playingAudioIndex: 2 }, () => this.props.changeAudioSrc(defaultAudioSrc[1]))
                            }
                            }
                            leftIcon={
                                (() => {
                                    if (this.state.playingAudioIndex === 2) {
                                        return <AvPauseCircleFilled
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                this.pauseAudio()
                                                this.setState({ playingAudioIndex: 0 })
                                            } } />
                                    } else {
                                        return <AvPlayCircleFilled
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                this.playAudio(defaultAudioSrc[1])
                                                this.setState({ playingAudioIndex: 2 })
                                            } }/>
                                    }
                                })()
                            }
                            >
                            <span>预设音乐2</span>
                        </ListItem>

                        <Subheader>自定义</Subheader>
                        <ListItem
                            key={3}
                            value={3}
                            onClick={() => {
                                this.playAudio(audioSrc)
                                this.setState({ playingAudioIndex: 3 })
                            }
                            }
                            leftIcon={
                                (() => {
                                    if (this.state.playingAudioIndex === 3) {
                                        return <AvPauseCircleFilled
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                this.pauseAudio()
                                                this.setState({ playingAudioIndex: 0 })
                                            } } />
                                    } else {
                                        return <AvPlayCircleFilled
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                this.playAudio(audioSrc)
                                                this.setState({ playingAudioIndex: 3 })
                                            } }/>
                                    }
                                })()
                            }
                            >
                            <TextField id="property-panel-change-audio-src"
                                hintText="背景音乐地址"
                                value={audioSrc || ''}
                                className="property-panel-textfield"
                                onChange={(e, value) => this.props.changeAudioSrc(value) }
                                style={{ marginTop: -20, marginLeft: -4, width: '80%' }}
                                />
                        </ListItem>
                    </SelectableList>
                </Tab>
            </Tabs>
        )
    }
}

AudioList.propTypes = {
    // title: PropTypes.string
    // , describe: PropTypes.string
    // , keywords: PropTypes.string
    // , changeSettingInfo: PropTypes.func
    // , backHome: PropTypes.func
};

function mapStateToProps(state) {
    const pageList = state.pageList.present;

    return {
        // title: pageList.get('title')
        // , describe: pageList.get('describe')
        // , keywords: pageList.get('keywords')
    };
}

function mapDispatchToProps(dispatch) {
    return {
            : bindActionCreators(actions.changeAudioSrc, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioList);