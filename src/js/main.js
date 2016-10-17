import '../styles/styles.sass';
import '../styles/contextmenu.sass';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore  from './store/configureStore';
import Immutable from 'immutable';

import SliderMaker from './components/SliderMaker';

function decodeHTML(encodedStr) {
	const elem = document.createElement('textarea');
	elem.innerHTML = encodedStr;
	return elem.value;
}

const store = configureStore({ pageList: Immutable.fromJS(JSON.parse(decodeHTML(document.querySelector('body script').innerHTML))) });
const rootElement = document.getElementById('app');

let ComponentEl;

if (process.env.NODE_ENV !== 'production') {
	const DevTools = require('./containers/DevTools').default;
	const Perf = require('react-addons-perf');
	Perf.enableMeasure = true;
	window.Perf = Perf;
	// window.Perf.start()
	// <DevTools />
	ComponentEl = (
		<div>
			<SliderMaker />
			<DevTools />
		</div>
	);
} else {
	ComponentEl = (
		<div>
			<SliderMaker />
		</div>
	);
}

// Render the React application to the DOM
ReactDOM.render(
	<Provider store = {store}>
		{ComponentEl}
	</Provider>,
	rootElement
);
