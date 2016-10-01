import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import PokerStore from './reducers';
import { playerUpdate, tableUpdate } from './actions';
import App from './App';
import io from 'socket.io-client';


const store = createStore(PokerStore, {}, compose(
  applyMiddleware(routerMiddleware(hashHistory)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

const connection = io();
connection.on('player update', data => { store.dispatch(playerUpdate(data.player)); console.log('player update: ' + data) });
connection.on('table update', data => { store.dispatch(tableUpdate(data.table)); console.log('table update: ' + data) });

render((<AppContainer><App store={store} /></AppContainer>), document.getElementById('root'));

if(module.hot) {
  module.hot.accept('./App', () => {
    console.log('got reload call');
  	const UpdatedApp = require('./App').default;
	render(<AppContainer><UpdatedApp store={store} /></AppContainer>, document.getElementById('root'));
  });
}
