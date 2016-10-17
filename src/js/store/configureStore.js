import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import { persistState } from 'redux-devtools';

import thunk from 'redux-thunk'

const perflogger = store => next => action => {
  console.log( '%c Dispatching ', 'background: #222; color: #bada55', action );
  const start = performance.now();
  const result = next( action );
  const end = performance.now();
  console.log( `%c Action with type "${action.type}" took ${( end-start ).toFixed( 2 )} milliseconds.`, 'background: #bada55; color: #222' );
  return result;
}

export default function configureStore(initialState) {

  let middleware = applyMiddleware();
  let enhancer;

  if (process.env.NODE_ENV !== 'production') {

    let middlewares = [require('redux-immutable-state-invariant')()];
    middleware = applyMiddleware(...middlewares, perflogger, thunk);

    let getDebugSessionKey = function () {
      // By default we try to read the key from ?debug_session=<key> in the address bar
      const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
      return (matches && matches.length) ? matches[1] : null;
    };

    enhancer = compose(

      // Middleware we want to use in development
      middleware,
      window.devToolsExtension ?
        window.devToolsExtension() :
        require('../containers/DevTools').default.instrument(),

      // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
      persistState(getDebugSessionKey())
    );
  } else {
    // enhancer = compose(middleware);
    enhancer = compose(applyMiddleware(thunk));
  }

  const store = createStore(rootReducer, initialState, enhancer);

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
