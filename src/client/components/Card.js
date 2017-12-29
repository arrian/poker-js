import React, { Component } from 'react';
import { Suit, Value } from '../../poker';
import Draggable from 'react-draggable';

const Images = {
	CLUBS: {
		ACE: require('babel!svg-react!../assets/ace-clubs.svg?name=Icon'),
		KING: require('babel!svg-react!../assets/king-clubs.svg?name=Icon'),
		QUEEN: require('babel!svg-react!../assets/queen-clubs.svg?name=Icon'),
		JACK: require('babel!svg-react!../assets/jack-clubs.svg?name=Icon'),
		TEN: require('babel!svg-react!../assets/ten-clubs.svg?name=Icon'),
		NINE: require('babel!svg-react!../assets/nine-clubs.svg?name=Icon'),
		EIGHT: require('babel!svg-react!../assets/eight-clubs.svg?name=Icon'),
		SEVEN: require('babel!svg-react!../assets/seven-clubs.svg?name=Icon'),
		SIX: require('babel!svg-react!../assets/six-clubs.svg?name=Icon'),
		FIVE: require('babel!svg-react!../assets/five-clubs.svg?name=Icon'),
		FOUR: require('babel!svg-react!../assets/four-clubs.svg?name=Icon'),
		THREE: require('babel!svg-react!../assets/three-clubs.svg?name=Icon'),
		TWO: require('babel!svg-react!../assets/two-clubs.svg?name=Icon')
	},
	HEARTS: {
		ACE: require('babel!svg-react!../assets/ace-hearts.svg?name=Icon'),
		KING: require('babel!svg-react!../assets/king-hearts.svg?name=Icon'),
		QUEEN: require('babel!svg-react!../assets/queen-hearts.svg?name=Icon'),
		JACK: require('babel!svg-react!../assets/jack-hearts.svg?name=Icon'),
		TEN: require('babel!svg-react!../assets/ten-hearts.svg?name=Icon'),
		NINE: require('babel!svg-react!../assets/nine-hearts.svg?name=Icon'),
		EIGHT: require('babel!svg-react!../assets/eight-hearts.svg?name=Icon'),
		SEVEN: require('babel!svg-react!../assets/seven-hearts.svg?name=Icon'),
		SIX: require('babel!svg-react!../assets/six-hearts.svg?name=Icon'),
		FIVE: require('babel!svg-react!../assets/five-hearts.svg?name=Icon'),
		FOUR: require('babel!svg-react!../assets/four-hearts.svg?name=Icon'),
		THREE: require('babel!svg-react!../assets/three-hearts.svg?name=Icon'),
		TWO: require('babel!svg-react!../assets/two-hearts.svg?name=Icon')
	},
	SPADES: {
		ACE: require('babel!svg-react!../assets/ace-spades.svg?name=Icon'),
		KING: require('babel!svg-react!../assets/king-spades.svg?name=Icon'),
		QUEEN: require('babel!svg-react!../assets/queen-spades.svg?name=Icon'),
		JACK: require('babel!svg-react!../assets/jack-spades.svg?name=Icon'),
		TEN: require('babel!svg-react!../assets/ten-spades.svg?name=Icon'),
		NINE: require('babel!svg-react!../assets/nine-spades.svg?name=Icon'),
		EIGHT: require('babel!svg-react!../assets/eight-spades.svg?name=Icon'),
		SEVEN: require('babel!svg-react!../assets/seven-spades.svg?name=Icon'),
		SIX: require('babel!svg-react!../assets/six-spades.svg?name=Icon'),
		FIVE: require('babel!svg-react!../assets/five-spades.svg?name=Icon'),
		FOUR: require('babel!svg-react!../assets/four-spades.svg?name=Icon'),
		THREE: require('babel!svg-react!../assets/three-spades.svg?name=Icon'),
		TWO: require('babel!svg-react!../assets/two-spades.svg?name=Icon')
	},
	DIAMONDS: {
		ACE: require('babel!svg-react!../assets/ace-diamonds.svg?name=Icon'),
		KING: require('babel!svg-react!../assets/king-diamonds.svg?name=Icon'),
		QUEEN: require('babel!svg-react!../assets/queen-diamonds.svg?name=Icon'),
		JACK: require('babel!svg-react!../assets/jack-diamonds.svg?name=Icon'),
		TEN: require('babel!svg-react!../assets/ten-diamonds.svg?name=Icon'),
		NINE: require('babel!svg-react!../assets/nine-diamonds.svg?name=Icon'),
		EIGHT: require('babel!svg-react!../assets/eight-diamonds.svg?name=Icon'),
		SEVEN: require('babel!svg-react!../assets/seven-diamonds.svg?name=Icon'),
		SIX: require('babel!svg-react!../assets/six-diamonds.svg?name=Icon'),
		FIVE: require('babel!svg-react!../assets/five-diamonds.svg?name=Icon'),
		FOUR: require('babel!svg-react!../assets/four-diamonds.svg?name=Icon'),
		THREE: require('babel!svg-react!../assets/three-diamonds.svg?name=Icon'),
		TWO: require('babel!svg-react!../assets/two-diamonds.svg?name=Icon')
	}
};

// const Back = require('babel!svg-react!../assets/faces/back.svg?name=Back');
// import back from '../assets/back.jpg';

export default class Card extends Component {

	constructor(props) {
		super(props);
		this.state = { up: this.props.card && this.props.card.suit && this.props.card.value };
	}

	flip() {
		this.setState({ up: !this.state.up });
	}

	render() {
		const hasCardData = this.props.card && this.props.card.suit && this.props.card.value;
		const Front = hasCardData ? Images[this.props.card.suit.id][this.props.card.value.id] : null;
		const value = hasCardData ? this.props.card.value.short : '';
		const faceUp = hasCardData;// && this.state.up;
		const color = hasCardData && (this.props.card.suit.id === Suit.HEARTS.id || this.props.card.suit.id === Suit.DIAMONDS.id) ? '#D40000' : 'black';

		const width = this.props.width || 100;
		const height = width * (315/227);
		const fontSize = width / 4.5;

		const sizeStyle = { width, height };//{ width: 227, height: 315 };
		const cardStyle = { margin: 10, perspective: 1000, display: 'inline-block' };
		const flippedStyle = Object.assign({}, sizeStyle, { backgroundColor: 'white', boxShadow: '0px 0px 8px 0px rgba(50,50,50,0.71)', transform: faceUp ? 'rotateY(0deg)' : 'rotateY(180deg)', transition: '0.6s', transformStyle: 'preserve-3d', position: 'relative', border: 'none', borderRadius: 4 });

		const faceStyle = { position: 'absolute', top: 0, left: 0, backfaceVisibility: 'hidden' };
		const frontFaceStyle = Object.assign({}, sizeStyle, faceStyle, { transform: 'rotateY(0deg)' });
		const backFaceStyle = Object.assign({}, sizeStyle, faceStyle, { transform: 'rotateY(180deg)', backgroundColor: '#EBD89B', borderRadius: 4 });

		const valueStyle = { position: 'absolute', paddingLeft: 4, fontSize: fontSize, fontFamily: 'monospace', color: color, textAlign: 'left' };
		const topValueStyle = Object.assign({}, { left: '-3px' }, valueStyle);
		const bottomValueStyle = Object.assign({}, { right: '-3px', bottom: 0, transform: 'rotate(-180deg)' }, valueStyle);

		return(
			<Draggable>
			<div onClick={this.flip.bind(this)} className="card" style={cardStyle}>
				<div style={flippedStyle} className="cardFlipper">
					<div style={frontFaceStyle} className="cardFront">{ Front ? (<Front />) : null}</div>
					<div style={backFaceStyle} className="cardBack"></div>
				</div>
			</div>
			</Draggable>
		);
	}
}
