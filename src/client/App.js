import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
require("socket.io-client");
import 'whatwg-fetch';
const moment = require('moment');

// const felt = require("url-loader?mimetype=image/png!./assets/felt.png");
// const felt = require("file!./assets/felt.jpg");
// console.log(felt);

import felt from './assets/felt.jpg';

import { gameRoutes } from './components/Game';
import CardComponent from './components/Card';
import { Suit, Value, Card } from '../poker';

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div style={{ backgroundImage: `url('${felt}')`, height: '100%' }}>
      <Provider store={this.props.store}>
        <Router history={hashHistory}>
          {gameRoutes}
        </Router>
      </Provider>
      </div>
    );
  }
}
