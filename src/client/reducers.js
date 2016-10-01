import { combineReducers } from 'redux';
import { PLAYER_UPDATE, TABLE_UPDATE } from './actions';
import { routerReducer } from 'react-router-redux';

function player(state = {}, action) {
  switch (action.type) {
    case PLAYER_UPDATE:
      return action.player;
    default:
      return state;
  }
}

function table(state = {}, action) {
  switch (action.type) {
    case TABLE_UPDATE:
      return action.table;
    default:
      return state;
  }
}

const PokerStore = combineReducers({
  player,
  table,
  routing: routerReducer
});

export default PokerStore;
