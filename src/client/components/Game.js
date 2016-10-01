import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Table from './Table';
import Card from './Card';

import { playerBet, playerCall, playerRaise, playerFold, playerAllIn } from '../actions';

// Table

const tableStateToProps = function (state) {
  return {
    table: state.table
  };
};

const tableDispatchToProps = function (dispatch) {
  return {
    onCall: () => {
      dispatch(playerCall());
    },
    onRaise: () => {
      dispatch(playerRaise(100));
    },
    onFold: () => {
      dispatch(playerFold());
    }
  };
};

const TableContainer = connect(
  tableStateToProps,
  tableDispatchToProps
)(Table);

// Game Page

class Game extends React.Component {

  render() {
    return (
      <div className="administration">
        <TableContainer />
      </div>
    );
  }
}

Game.propTypes = {
  children: React.PropTypes.element
};

export default Game;

// Game Routes

export const gameRoutes = (
  <Route path="/" component={Game}>
    <Route path="details/:id" component={Card} />
  </Route>
);
