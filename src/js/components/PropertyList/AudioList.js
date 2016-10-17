import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/WorkspaceActions.js';

import { Tabs, Tab, Divider, Subheader } from 'material-ui';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import FileFolder from 'material-ui/svg-icons/file/folder';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import { AvPlayCircleFilled, ContentLink } from 'material-ui/svg-icons/';

const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
};

class AudioList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tabs
                className = 'property-panel'
                inkBarStyle = {{ backgroundColor: '#d4d4d4' }}>
                <Tab label='背景音乐'
                    value='property'
                    style={{ backgroundColor: '#fff', color: '#000' }}
                    >
                    <List>
                        <ListItem
                            primaryText="请在下方选择音乐"
                            leftIcon={<AvPlayCircleFilled color="#00bcd4" />}
                            disabled={true}
                            style={{ color: '#00bcd4', fontSize: '12px' }}/>
                        <Divider />
                        <Subheader>音乐选择</Subheader>
                        <ListItem
                            primaryText="本地上传"
                            leftIcon={<FileFolder  />}
                            disabled={true}
                            style={{ color: '#808080' }}/>
                        <ListItem
                            primaryText="添加外链"
                            leftIcon={<ContentLink  />}
                            />
                        <ListItem
                            primaryText="预设音乐"
                            leftIcon={<ContentInbox />}
                            initiallyOpen={true}
                            primaryTogglesNestedList={true}
                            nestedItems={[
                                <RadioButtonGroup name="shipSpeed" defaultSelected="not_light" style={{ paddingLeft: "40px" }}>
                                    <RadioButton
                                        value="light"
                                        label="一路向北-周杰伦"
                                        style={styles.radioButton}
                                        />
                                    <RadioButton
                                        value="not_light"
                                        label="发如雪-周杰伦"
                                        style={styles.radioButton}
                                        />
                                    <RadioButton
                                        value="ludicrous"
                                        label="七里香-周杰伦"
                                        style={styles.radioButton}
                                        />
                                </RadioButtonGroup>
                            ]}
                            />
                    </List>
                </Tab>
            </Tabs>
        );
    }
}

// AudioList.propTypes = {
//     // title: PropTypes.string
//     // , describe: PropTypes.string
//     // , keywords: PropTypes.string
//     // , changeSettingInfo: PropTypes.func
//     // , backHome: PropTypes.func
// };

// function mapStateToProps(state) {
//     const pageList = state.pageList.present;

//     return {
//         // title: pageList.get('title')
//         // , describe: pageList.get('describe')
//         // , keywords: pageList.get('keywords')
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         // changeAudioSrc: bindActionCreators(actions.changeAudioSrc, dispatch)
//     };
// }

export default AudioList;