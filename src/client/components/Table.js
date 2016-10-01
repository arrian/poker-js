import React, { Component } from 'react';
import { Suit, Value } from '../../poker';
import Card from './Card';

const playerStyle = { border: '1px solid white', display: 'inline-block', margin: 10, padding: 10, color: 'white' };

export default class Table extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const communityCards = this.props.table && this.props.table.round && this.props.table.round.communityCards ? this.props.table.round.communityCards.cards : [];
		const flop = (<span><Card card={communityCards[0]} /><Card card={communityCards[1]} /><Card card={communityCards[2]} /></span>);
		const turn = (<Card card={communityCards[3]} />);
		const river = (<Card card={communityCards[4]} />);
		return(
			<div className="table">
				<div style={{ textAlign: 'center' }}>{flop}{turn}{river}</div>
				<div>
					<button onClick={this.onFold}>Fold</button>
					<button onClick={this.onCall}>Call</button>
					<button onClick={this.onRaise}>Raise</button>
				</div>
				{this.props.table && this.props.table.players ? this.props.table.players.map(player => (
					<div key={player.id} style={playerStyle}>
						{this.props.table && this.props.table.round && this.props.table.round.actingPlayer && this.props.table.round.actingPlayer.id === player.id ? (<div style={{ backgroundColor: 'red', width: '100%', height: 10 }}></div>) : null}
						<div>{player.hand && player.hand.cards ? player.hand.cards.map(card => (<Card card={card} />)) : null}</div>
						<div>{player.name}</div>
					</div>
				)) : null}
			</div>
		);
	}
}
