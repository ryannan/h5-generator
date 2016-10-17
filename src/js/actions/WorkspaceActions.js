import * as types from '../constants/ActionTypes';
import $ from 'jquery';
import * as config from '../config';

export function changeBgSrc(src) {
	return {
		type: types.CHANGE_BG_SRC,
		src
	};
}

export function toggleAudioSrcTab() {
	return {
		type: types.TOGGLE_AUDIO_SRC_TAB
	};
}

export function toggleSettingTab() {
	return {
		type: types.TOGGLE_SETTING_TAB
	};
}

export function changeAudioSrc(src) {
	return {
		type: types.CHANGE_AUDIO_SRC,
		src
	};
}

export function changeSettingInfo(name, value) {
	return {
		type: types.CHANGE_SETTING_INFO,
		name,
		value
	};
}

export function changeBgColor(color) {
	return {
		type: types.CHANGE_BG_COLOR,
		color
	};
}

export function changeBgSize(size) {
	return {
		type: types.CHANGE_BG_SIZE,
		size
	};
}

export function addCom(comType) {
	return {
		type: types.ADD_COM,
		comType
	};
}

export function selectCom(id = 0) {
	return {
		type: types.SELECT_COM,
		id
	};
}
export function stopDrag(id, x, y) {
	return {
		type: types.STOP_DRAG,
		id,
		x,
		y
	};
}

export function stopResize(id, width, height) {
	return {
		type: types.STOP_RESIZE,
		id,
		width,
		height
	};
}

export function changeItemX(id, x) {
	return {
		type: types.CHANGE_ITEM_X,
		id,
		x
	};
}

export function changeItemY(id, y) {
	return {
		type: types.CHANGE_ITEM_Y,
		id,
		y
	};
}

export function changeItemWidth(id, width) {
	return {
		type: types.CHANGE_ITEM_WIDTH,
		id,
		width
	};
}

export function changeItemHeight(id, height) {
	return {
		type: types.CHANGE_ITEM_HEIGHT,
		id,
		height
	};
}

export function changeItemContent(id, content) {
	return {
		type: types.CHANGE_ITEM_CONTENT,
		id,
		content
	};
}

export function changeItemAnimation(id, animation) {
	return {
		type: types.CHANGE_ITEM_ANIMATION,
		id,
		animation
	};
}

export function textAlignLeft(id) {
	return {
		type: types.TEXT_ALIGN_LEFT,
		id
	};
}

export function textAlignCenter(id) {
	return {
		type: types.TEXT_ALIGN_CENTER,
		id
	};
}

export function textAlignRight(id) {
	return {
		type: types.TEXT_ALIGN_RIGHT,
		id
	};
}

export function textItalic(id) {
	return {
		type: types.TEXT_ITALIC,
		id
	};
}

export function textBold(id) {
	return {
		type: types.TEXT_BOLD,
		id
	};
}

export function textUnderlined(id) {
	return {
		type: types.TEXT_UNDERLINED,
		id
	};
}

export function changeItemPosition(id, method) {
	return {
		type: types.CHANGE_ITEM_POSITION,
		id,
		method
	};
}

export function changeItemFontSize(id, fontSize) {
	return {
		type: types.CHANGE_ITEM_FONTSIZE,
		id,
		fontSize
	};
}

export function changeItemSrc(id, src) {
	return {
		type: types.CHANGE_ITEM_SRC,
		id,
		src
	};
}
export function changeItemRotate(id, rotate) {
	return {
		type: types.CHANGE_ITEM_ROTATE,
		id,
		rotate
	};
}

export function changeItemShadow(id, shadow) {
	return {
		type: types.CHANGE_ITEM_SHADOW,
		id,
		shadow
	};
}

export function changeItemOpacity(id, opacity) {
	return {
		type: types.CHANGE_ITEM_OPACITY,
		id,
		opacity
	};
}
export function changeItemRadius(id, radius) {
	return {
		type: types.CHANGE_ITEM_RADIUS,
		id,
		radius
	};
}

export function changeItemBorder(id, border) {
	return {
		type: types.CHANGE_ITEM_BORDER,
		id,
		border
	};
}

export function changeItemBoxShadow(id, boxShadow) {
	return {
		type: types.CHANGE_ITEM_BOX_SHADOW,
		id,
		boxShadow
	};
}

export function changeItemAnimationName(id, name) {
	return {
		type: types.CHANGE_ITEM_ANIMATION_NAME,
		id,
		name
	};
}

export function changeItemAnimationLatency(id, latency) {
	return {
		type: types.CHANGE_ITEM_ANIMATION_LATENCY,
		id,
		latency
	};
}

export function changeItemAnimationSpeed(id, speed) {
	return {
		type: types.CHANGE_ITEM_ANIMATION_SPEED,
		id,
		speed
	};
}

export function deleteCom() {
	return {
		type: types.DELETE_COM
	};
}

export function addComIndex() {
	return {
		type: types.ADD_COM_INDEX
	};
}

export function minusComIndex() {
	return {
		type: types.MINUS_COM_INDEX
	};
}

export function clickOtherArea() {
	return {
		type: types.SELECT_BACKGROUND
	};
}

export function selectBackground() {
	return {
		type: types.SELECT_BACKGROUND
	};
}

export function changeSlideEffect(effect) {
	return {
		type: types.CHANGE_SLIDE_EFFECT,
		effect
	};
}

export function save() {
	const urlArray = window.location.href.split('/');
	const id = urlArray[urlArray.length - 2];

	return (dispatch, getState) => {

		$.ajax({
			method: "POST",
			url: `${config.SAVE_URL}${id}`,
			data: JSON.stringify(getState().pageList.present.toJS()),
			contentType: 'application/json'
		}).done((data) => {
			console.log(`get data from server:${data}`);

			dispatch({
				type: types.SHOW_MSG,
				msg: config.PAGE_SAVE_SUCCESS_INFO
			});
		}).fail((data) => {
			console.log(data);
			dispatch({
				type: types.SHOW_MSG,
				msg: config.PAGE_SAVE_FAIL_INFO + data.statusText
			});
		});
	};
}

export function copy() {
	return {
		type: types.COPY
	};
}

export function paste() {
	return {
		type: types.PASTE
	};
}

export function del() {
	return {
		type: types.DEL
	};
}

export function clearMsgBuf() {
	return {
		type: types.CLEAR_MSG_BUF
	};
}

export function showMsg(msg) {
	return {
		type: types.SHOW_MSG,
		msg
	};
}
