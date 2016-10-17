import * as types from '../constants/ActionTypes';
import * as comTypes from '../constants/ComTypes';
import * as slideEffect from '../constants/SlideEffect'
import * as staticValues from '../constants/StaticValues'

import Immutable from 'immutable'
import _ from 'lodash'

import undoable, {
	excludeAction
} from 'redux-undo'

const initialState = Immutable.fromJS({
	effect: slideEffect.SLIDE,
	isAudioTabOpen: false,
	audioSrc: '',
	pages: [0, 1],
	message: "",
	selectedPageId: 0,
	pagesById: [{
		id: 0,
		content: "douyu",
		selectedComId: 0,
		items: [{
			id: 0,
			index: 0,
			type: comTypes.BACKGROUND,
			src: '',
			size: '',
			color: ''
		}, {
			id: 1,
			index: 1,
			type: comTypes.IMAGE,
			animation: {
				speed: 1,
				latency: 0.5
			},
			position: [-3, 73],
			dimension: [640, 497],
			src: "/images/5.png",
			opacity: 0,
			radius: 0,
			shadow: 0,
			rotate: 0
		}, {
			id: 2,
			index: 2,
			type: comTypes.IMAGE,
			animation: {
				speed: 1,
				latency: 0.5
			},
			position: [0, 45],
			dimension: [640, 529],
			src: "/images/1.png",
			opacity: 0,
			radius: 0,
			shadow: 0,
			rotate: 0
		}, {
			id: 3,
			index: 3,
			type: comTypes.IMAGE,
			animation: {
				speed: 1,
				latency: 0.5
			},
			position: [44, 165],
			dimension: [246, 313],
			src: "/images/3.png",
			opacity: 0,
			radius: 0,
			shadow: 0,
			rotate: 0
		}, {
			id: 4,
			index: 4,
			type: comTypes.IMAGE,
			animation: {
				speed: 1,
				latency: 0.5
			},
			position: [62, 259],
			dimension: [458, 347],
			src: "/images/4.png",
			opacity: 0,
			radius: 0,
			shadow: 0,
			rotate: 0
		}]
	}, {
		id: 1,
		content: "shark",
		selectedComId: 0,
		items: [{
			id: 0,
			index: 0,
			type: comTypes.BACKGROUND,
			src: '',
			color: ''
		}, {
			id: 1,
			index: 1,
			type: comTypes.TEXT,
			style: {
				textAlign: 'center'
			},
			fontSize: 40,
			fontSizeUnit: 'px',
			animation: {
				speed: 1,
				latency: 0.5
			},
			content: ['text0', 'text1'],
			position: [50, 50],
			dimension: [200, 50]
		}, {
			id: 2,
			index: 2,
			type: comTypes.IMAGE,
			animation: {
				speed: 1,
				latency: 0.5
			},
			position: [0, 100],
			dimension: [staticValues.CAROUSEL_WIDTH, 400],
			src: "/images/1.png",
			opacity: 0,
			radius: 0,
			shadow: 0,
			rotate: 0
		}]
	}]
});

function createPage(id) {
	return Immutable.fromJS({
		id,
		selectedComId: 0,
		items: [{
			id: 0,
			index: 0,
			type: comTypes.BACKGROUND,
			color: '',
			size: '',
			src: ''
		}]
	})
}

function createText(id) {
	return Immutable.fromJS({
		id,
		index: id,
		type: comTypes.TEXT,
		style: {
			textAlign: "center"
		},
		fontSize: 40,
		fontSizeUnit: 'px',
		animation: {
			speed: 1,
			latency: 0.5
		},
		content: ['new text'],
		position: [0, 0],
		dimension: [200, 50]
	});
}

function createImage(id) {
	return Immutable.fromJS({
		id,
		index: id,
		type: comTypes.IMAGE,
		animation: {
			speed: 1,
			latency: 0.5
		},
		position: [0, 100],
		dimension: [staticValues.CAROUSEL_WIDTH, 400],
		src: "",
		opacity: 0,
		radius: 0,
		shadow: 0,
		rotate: 0
	})
}

function createShape(id) {
	return Immutable.fromJS({
		id,
		index: id,
		type: comTypes.SHAPE,
		animation: {
			speed: 1,
			latency: 0.5
		},
		style: {
			border: '1px solid #000',
			boxShadow: ''
		},
		position: [0, 0],
		dimension: [150, 150],
		opacity: 0,
		radius: 0,
		shadow: 0,
		rotate: 0
	})
}

function createAudio(id) {
	return Immutable.fromJS({
		id,
		index: id,
		type: comTypes.AUDIO,
		src: ''
	})
}

const pageList = function (state = initialState, action) {
	let selectedPageIndex
	let selectedPage
	let selectedItemIndex

	switch (action.type) {
		case types.CLEAR_MSG_BUF:
			{
				console.log('clear msg buffer');

				return state.set('message', '')
			}
		case types.SHOW_MSG:
			{
				console.log('show msg');

				return state.set('message', action.msg)

				break;
			}
		case types.ADD_PAGE:
			{
				console.log('add page');
				const newId = state.get('pages').max() + 1
				console.log(newId);

				// const selectedIndex = state.get('pages').toJS().indexOf(state.get('selectedId'))
				const selectedIndex = state.get('pages').indexOf(state.get('selectedPageId'))
				console.log(selectedIndex);

				return state.set('selectedPageId', newId)
					.setIn(['pagesById', selectedIndex + 1, 'selectedComId'], 0)
					.set('pages', state.get('pages').insert(selectedIndex + 1, newId))
					.set('pagesById', state.get('pagesById').insert(selectedIndex + 1, createPage(newId)))
				break;
			}
		case types.SELECT_PAGE:
			{
				console.log('select page');
				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))

				return state.set('isAudioTabOpen', false)
					.set('selectedPageId', action.id)
					.setIn(['pagesById', selectedPageIndex, 'selectedComId'], 0)
			}

		case types.MOVE_PAGE_UP:
			{
				console.log('move page up');
				const index = action.index

				const movingPageId = state.getIn(['pages', index])
				const movingPagePreId = state.getIn(['pages', index - 1])
				const movingPage = state.getIn(['pagesById', index])
				const movingPagePre = state.getIn(['pagesById', index - 1])

				return state.setIn(['pages', index], movingPagePreId)
					.setIn(['pages', index - 1], movingPageId)
					.setIn(['pagesById', index], movingPagePre)
					.setIn(['pagesById', index - 1], movingPage)

			}

		case types.MOVE_PAGE_DOWN:
			{
				console.log('move page down');

				const index = action.index

				const movingPageId = state.getIn(['pages', index])
				const movingPageNextId = state.getIn(['pages', index + 1])
				const movingPage = state.getIn(['pagesById', index])
				const movingPageNext = state.getIn(['pagesById', index + 1])

				console.log(state.setIn(['pages', index], movingPageNextId)
					.setIn(['pages', index + 1], movingPageId)
					.setIn(['pagesById', index], movingPageNext)
					.setIn(['pagesById', index + 1], movingPage)
					.toJS());

				return state.setIn(['pages', index], movingPageNextId)
					.setIn(['pages', index + 1], movingPageId)
					.setIn(['pagesById', index], movingPageNext)
					.setIn(['pagesById', index + 1], movingPage)
			}

		case types.COPY_PAGE:
			{
				console.log('copy page');

				let copied
					//modify id when paste
					//cause we dont know what it will be now
				copied = {
					type: 'page',
					content: state.getIn(['pagesById', action.index])
				}
				window.SliderMakerCopied = copied
				//no state change when copy
				return state
			}

		case types.PASTE_PAGE:
			{
				console.log('paste page');

				const selectedPageIndex = action.index
				let copied = window.SliderMakerCopied

				const newId = state.get('pages').max() + 1
				return state.set('selectedPageId', newId)
					.set('pages', state.get('pages').insert(selectedPageIndex + 1, newId))
					.set('pagesById', state.get('pagesById').insert(selectedPageIndex + 1, copied.content.set('id', newId)))
			}

		case types.DEL_PAGE:
			{
				console.log('del page');

				const selectedPageIndex = action.index

				//if not the last, ++
				//if is the last, and has pre-element, select the last pre
				let pageCount = state.get('pages').size
				let nextSelectedId
				if (selectedPageIndex !== pageCount - 1) {
					nextSelectedId = state.getIn(['pages', selectedPageIndex + 1])

					return state.set('selectedPageId', nextSelectedId)
						.setIn(['pagesById', selectedPageIndex + 1, 'selectedComId'], 0)
						.deleteIn(['pagesById', selectedPageIndex])
						.deleteIn(['pages', selectedPageIndex])
				} else {
					if (pageCount >= 2) {
						nextSelectedId = state.getIn(['pages', selectedPageIndex - 1])

						return state.set('selectedPageId', nextSelectedId)
							.setIn(['pagesById', selectedPageIndex - 1, 'selectedComId'], 0)
							.deleteIn(['pagesById', selectedPageIndex])
							.deleteIn(['pages', selectedPageIndex])
					} else {
						//only one page and we delete it now
						nextSelectedId = 0

						return state.deleteIn(['pagesById', 0])
							.delete(['pages'], 0)
							.setIn(['pagesById', 0], createPage(0))
							.set('pages', Immutable.fromJS([0]))
							.set('selectedPageId', nextSelectedId)
					}
				}
			}

		case types.CHANGE_BG_SRC:
			{
				console.log('change background image src');

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
				return state.setIn(['pagesById', selectedPageIndex, 'items', '0', 'src'], action.src)
			}

		case types.CHANGE_BG_COLOR:
			{
				console.log('change background color');

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
				return state.setIn(['pagesById', selectedPageIndex, 'items', '0', 'color'], action.color)
			}

		case types.CHANGE_BG_SIZE:
			{
				console.log('change background size');

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
				const size = ['cover', 'contain'][action.size]
				return state.setIn(['pagesById', selectedPageIndex, 'items', '0', 'size'], size)
			}

		case types.TOGGLE_AUDIO_SRC_TAB:
			{
				return state.set('currOpenTab', comTypes.AUDIO_TAB);
			}

		case types.TOGGLE_SETTING_TAB:
			{
				return state.set('currOpenTab', comTypes.SETTING_TAB);
			}

		case types.CHANGE_SETTING_INFO:
			{
				console.log('change setting info');

				let key;

				switch (action.name) {
					case comTypes.SETTING_TITLE:
						key = 'title';
						break;
					case comTypes.SETTING_DESCRIBE:
						key = 'describe';
						break;
					case comTypes.SETTING_KEYWORDS:
						key = 'keywords';
						break;
					default:
				}

				return state.set(key, action.value);

			}

		case types.CHANGE_AUDIO_SRC:
			{
				console.log('change audio src');

				return state.set('audioSrc', action.src);
			}

		case types.SELECT_BACKGROUND:
			{
				console.log('select background');

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))

				return state.set('isAudioTabOpen', false)
					.set('currOpenTab', '')
					.setIn(['pagesById', selectedPageIndex, 'selectedComId'], 0)
			}

		case types.CHANGE_SLIDE_EFFECT:
			{
				console.log('change slide effect');

				return state.set('effect', slideEffect.effectArray[action.effect])
			}

		case types.ADD_COM:
			{
				console.log(`add com: ${action.comType}`);

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
				selectedPage = state.get('pagesById').get(selectedPageIndex)
				const id = selectedPage.get('items').maxBy(item => item.get('id')).get('id') + 1

				let com;
				switch (action.comType) {
					case comTypes.TEXT:
						com = createText(id)
						break;
					case comTypes.IMAGE:
						com = createImage(id)
						break;
					case comTypes.SHAPE:
						com = createShape(id)
						break;
					case comTypes.AUDIO:
						com = createAudio(id)
						break;
					default:

				}
				return state.updateIn(['pagesById', selectedPageIndex, 'items'], v => v.push(Immutable.fromJS(com)))
					.setIn(['pagesById', selectedPageIndex, 'selectedComId'], id)

			}

		case types.DELETE_COM:
			{
				console.log("delete com");

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
				selectedItemIndex = state.getIn(['pagesById', selectedPageIndex, 'items'])
				.findIndex(item => item.get('id') === state.getIn(['pagesById', selectedPageIndex, 'selectedComId']))

				return state.deleteIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex])
					.setIn(['pagesById', selectedPageIndex, 'selectedComId'], 0)
				break;
			}

		case types.SELECT_COM:
			{
				console.log("select com");

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))

				return state.set('isAudioTabOpen', false)
					.setIn(['pagesById', selectedPageIndex, 'selectedComId'], action.id)
				break;
			}

		case types.ADD_COM_INDEX:
			{
				console.log("add com index");

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
				selectedItemIndex = state.getIn(['pagesById', selectedPageIndex, 'items'])
				.findIndex(item => item.get('id') === state.getIn(['pagesById', selectedPageIndex, 'selectedComId']))

				//id 0 is background
				const comCounts = state.getIn(['pagesById', selectedPageIndex, 'items']).size - 1

				//start with 1
				if (selectedItemIndex === comCounts) {
					// the last index item
					return state
				} else {
					let selectedItem = state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex])
					let nextItem = state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex + 1])
					let nextItemIndex = nextItem.get('index')

					return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex],
							nextItem.set('index', selectedItemIndex))
						.setIn(['pagesById', selectedPageIndex, 'items', nextItemIndex],
							selectedItem.set('index', nextItemIndex))
				}
			}

		case types.MINUS_COM_INDEX:
			{
				console.log("minus com index");

				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
				selectedItemIndex = state.getIn(['pagesById', selectedPageIndex, 'items'])
				.findIndex(item => item.get('id') === state.getIn(['pagesById', selectedPageIndex, 'selectedComId']))

				//id 0 is background
				const comCounts = state.getIn(['pagesById', selectedPageIndex, 'items']).size - 1

				//start with 1
				if (selectedItemIndex === 1) {
					// the first index item
					return state
				} else {
					let selectedItem = state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex])
					let nextItem = state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex - 1])
					let nextItemIndex = nextItem.get('index')

					return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex],
							nextItem.set('index', selectedItemIndex))
						.setIn(['pagesById', selectedPageIndex, 'items', nextItemIndex],
							selectedItem.set('index', nextItemIndex))
				}
			}

		case types.STOP_DRAG:
			console.log('stop drag');

			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.getIn(['pagesById', selectedPageIndex, 'items'])
				.findIndex(item => item.get('id') === action.id)

			console.log(action);
			return state.updateIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'position'],
				v => Immutable.List([action.x, action.y]))
			break;

		case types.STOP_RESIZE:
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.updateIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'dimension'],
				v => Immutable.List([action.width, action.height]))
			break;

		case types.CHANGE_ITEM_X:
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'position', '0'],
				action.x)
			break;

		case types.CHANGE_ITEM_Y:
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'position', '1'],
				action.y)
			break;

		case types.CHANGE_ITEM_WIDTH:
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'dimension', '0'],
				action.width)
			break;

		case types.CHANGE_ITEM_HEIGHT:
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'dimension', '1'],
				action.height)
			break;

		case types.CHANGE_ITEM_CONTENT:
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'content'],
				Immutable.fromJS(action.content))
			break;

		case types.CHANGE_ITEM_ANIMATION_NAME:
			console.log('change item animation name');
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'animation', 'name'],
				action.name)

		case types.CHANGE_ITEM_ANIMATION_SPEED:
			console.log('change item animation speed');
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'animation', 'speed'],
				action.speed)

		case types.CHANGE_ITEM_ANIMATION_LATENCY:
			console.log('change item animation latency');

			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'animation', 'latency'],
				action.latency)

		case types.CHANGE_ITEM_SRC:
			console.log('change src');
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'src'],
				Immutable.fromJS(action.src))
			break;

		case types.CHANGE_ITEM_RADIUS:
			console.log("change item radius");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'radius'],
				action.radius)
			break;

		case types.CHANGE_ITEM_SHADOW:
			console.log("change item shadow");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'shadow'],
				action.shadow)
			break;

		case types.CHANGE_ITEM_ROTATE:
			console.log("change item rotate");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'rotate'],
				action.rotate)
			break;

		case types.CHANGE_ITEM_OPACITY:
			console.log("change item shadow");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'opacity'],
				action.opacity)

		case types.CHANGE_ITEM_BORDER:
			console.log('change item border');
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'border'],
				action.border)

		case types.CHANGE_ITEM_BOX_SHADOW:
			console.log('change item boxShadow');
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'boxShadow'],
				action.boxShadow)


		case types.CHANGE_ITEM_POSITION:
			console.log('change item position');
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			let width, height;

			switch (action.method) {
				case 'parentCenter':
					console.log('parent center');
					width = state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'dimension', '0'])
					return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'position', '0'],
						(staticValues.CAROUSEL_WIDTH - width) / 2)
					break;
				case 'parentRight':
					console.log('parent right');
					width = state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'dimension', '0'])
					return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'position', '0'],
						(staticValues.CAROUSEL_WIDTH - width))
					break;

				case 'parentCentre':
					console.log('parent centre');
					height = state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'dimension', '1'])
					return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'position', '1'],
						(staticValues.CAROUSEL_HEIGHT - height) / 2)
					break;

				case 'parentBottom':
					console.log('parent bottom');
					height = state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'dimension', '1'])
					return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'position', '1'],
						(staticValues.CAROUSEL_HEIGHT - height))
					break;
				default:

			}

		case types.CHANGE_ITEM_FONTSIZE:
			console.log('change item font size');

			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'fontSize'],
				action.fontSize)
			break;

		case types.TEXT_ALIGN_LEFT:
			console.log("text align left");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'textAlign'],
				'left')
			break;

		case types.TEXT_ALIGN_RIGHT:
			console.log("text align right");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'textAlign'],
				'right')
			break;

		case types.TEXT_ALIGN_CENTER:
			console.log("text align center");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'textAlign'],
				'center')
			break;

		case types.TEXT_ITALIC:
			console.log("text italic");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			let isTextItalic = !!state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'fontStyle'])

			if (isTextItalic) {
				return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'fontStyle'],
					'')
			} else {
				return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'fontStyle'],
					'italic')
			}
			break;

		case types.TEXT_UNDERLINED:
			console.log("text underlined");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			let isTextUnderline = !!state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'textDecoration'])

			if (isTextUnderline) {
				return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'textDecoration'],
					'')
			} else {
				return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'textDecoration'],
					'underline')
			}
			break;


		case types.TEXT_BOLD:
			console.log("text bold");
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedItemIndex = state.get('pagesById').get(selectedPageIndex).get('items').findIndex(item => item.get('id') === action.id)

			let isTextBold = !!state.getIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'fontWeight'])

			if (isTextBold) {
				return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'fontWeight'],
					'')
			} else {
				return state.setIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex, 'style', 'fontWeight'],
					'bold')
			}
			break;

		case types.COPY:
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedPage = state.get('pagesById').find(page => page.get('id') === state.get('selectedPageId'))
			let selectedItemId = state.getIn(['pagesById', selectedPageIndex, 'selectedComId'])

			let copied
			if (selectedItemId === 0) {
				//background being selected, copy the page
				console.log('copy page');
				//modify id when paste
				//cause we dont know what it will be
				copied = {
						type: 'page',
						content: selectedPage
					}
					//we can set it to be a array in future
			} else {
				// copy component, add some bias to the origin x,y
				console.log('copy component');
				copied = {
					type: 'com',
					content: state.getIn(['pagesById', selectedPageIndex, 'items']).find(item => item.get('id') === selectedItemId)
				}
			}
			window.SliderMakerCopied = copied
				//no state change when copy
			return state;

		case types.PASTE:
			console.log('paste');
			if (!window.SliderMakerCopied) {
				return state
			} else {
				let copied = window.SliderMakerCopied
				selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))

				if (copied.type === 'page') {
					console.log('paste page');
					const newId = state.get('pages').max() + 1
					return state.set('selectedPageId', newId)
						.set('pages', state.get('pages').insert(selectedPageIndex + 1, newId))
						.set('pagesById', state.get('pagesById').insert(selectedPageIndex + 1, copied.content.set('id', newId)))

				} else if (copied.type === 'com') {
					console.log('paste component');

					const selectedComId = state.getIn(['pagesById', selectedPageIndex, 'selectedComId'])
						// selectedItemIndex = state.getIn(['pagesById', selectedPageIndex, 'items'])
						//                          .findIndex(item=>item.get('id')===selectedComId)

					const items = state.getIn(['pagesById', selectedPageIndex, 'items'])
					const newId = items.maxBy(item => item.get('id')).get('id') + 1
						//put it on the top
					const index = items.maxBy(item => item.get('index')).get('index') + 1

					return state.setIn(['pagesById', selectedPageIndex, 'selectedComId'], newId)
						.updateIn(['pagesById', selectedPageIndex, 'items'],
							v => v.push(copied.content.set('id', newId).set('index', index)))
						// v=>v.insert(selectedItemIndex + 1, copied.content.set('id', newId).set('index', index)))
				}
			}
			break;
		case types.DEL:
			//fire by keyboard shortcut
			//it can be del component or del page
			console.log('del');
			selectedPageIndex = state.get('pagesById').findIndex(page => page.get('id') === state.get('selectedPageId'))
			selectedPage = state.get('pagesById').find(page => page.get('id') === state.get('selectedPageId'))
			let selectedComId = state.getIn(['pagesById', selectedPageIndex, 'selectedComId'])
			if (selectedComId === 0) {
				console.log("del page");
				//if not the last, ++
				//if is the last, and has pre-element, select the last pre
				let pageCount = state.get('pages').size
				let nextSelectedId
				if (selectedPageIndex !== pageCount - 1) {
					nextSelectedId = state.getIn(['pages', selectedPageIndex + 1])

					return state.set('selectedPageId', nextSelectedId)
						.setIn(['pagesById', selectedPageIndex + 1, 'selectedComId'], 0)
						.deleteIn(['pagesById', selectedPageIndex])
						.deleteIn(['pages', selectedPageIndex])
				} else {
					if (pageCount >= 2) {
						nextSelectedId = state.getIn(['pages', selectedPageIndex - 1])

						return state.set('selectedPageId', nextSelectedId)
							.setIn(['pagesById', selectedPageIndex - 1, 'selectedComId'], 0)
							.deleteIn(['pagesById', selectedPageIndex])
							.deleteIn(['pages', selectedPageIndex])
					} else {
						//only one page and we delete it now
						nextSelectedId = 0

						return state.deleteIn(['pagesById', 0])
							.delete(['pages'], 0)
							.setIn(['pagesById', 0], )
							.set('pages', Immutable.fromJS([0]))
							.set('selectedPageId', nextSelectedId)

					}
				}

			} else {
				console.log("del component");
				selectedItemIndex = state.getIn(['pagesById', selectedPageIndex, 'items'])
					.findIndex(item => item.get('id') === state.getIn(['pagesById', selectedPageIndex, 'selectedComId']))

				return state.deleteIn(['pagesById', selectedPageIndex, 'items', selectedItemIndex])
					.setIn(['pagesById', selectedPageIndex, 'selectedComId'], 0)
			}
			break;
		default:
			return state
	}
}

export default undoable(pageList, {
		filter: (action) => {
			return [types.SELECT_PAGE, types.SELECT_BACKGROUND, types.SELECT_COM, types.TOGGLE_AUDIO_SRC_TAB].indexOf(action.type) === -1
		}
	})
	// export default undoable(pageList, {filter: excludeAction([types.SELECT_PAGE, types.SELECT_BACKGROUND, types.SELECT_COM])})