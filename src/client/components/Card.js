import React, { Component } from 'react';
import { Suit, Value } from '../../poker';
import Draggable from 'react-draggable';

const Images = {
	CLUBS: {
		ACE: require('babel!svg-react!../assets/faces/0_1.svg?name=Icon'),
		KING: require('babel!svg-react!../assets/faces/0_13.svg?name=Icon'),
		QUEEN: require('babel!svg-react!../assets/faces/0_12.svg?name=Icon'),
		JACK: require('babel!svg-react!../assets/faces/0_11.svg?name=Icon'),
		TEN: require('babel!svg-react!../assets/faces/0_10.svg?name=Icon'),
		NINE: require('babel!svg-react!../assets/faces/0_9.svg?name=Icon'),
		EIGHT: require('babel!svg-react!../assets/faces/0_8.svg?name=Icon'),
		SEVEN: require('babel!svg-react!../assets/faces/0_7.svg?name=Icon'),
		SIX: require('babel!svg-react!../assets/faces/0_6.svg?name=Icon'),
		FIVE: require('babel!svg-react!../assets/faces/0_5.svg?name=Icon'),
		FOUR: require('babel!svg-react!../assets/faces/0_4.svg?name=Icon'),
		THREE: require('babel!svg-react!../assets/faces/0_3.svg?name=Icon'),
		TWO: require('babel!svg-react!../assets/faces/0_2.svg?name=Icon')
	},
	HEARTS: {
		ACE: require('babel!svg-react!../assets/faces/1_1.svg?name=Icon'),
		KING: require('babel!svg-react!../assets/faces/1_13.svg?name=Icon'),
		QUEEN: require('babel!svg-react!../assets/faces/1_12.svg?name=Icon'),
		JACK: require('babel!svg-react!../assets/faces/1_11.svg?name=Icon'),
		TEN: require('babel!svg-react!../assets/faces/1_10.svg?name=Icon'),
		NINE: require('babel!svg-react!../assets/faces/1_9.svg?name=Icon'),
		EIGHT: require('babel!svg-react!../assets/faces/1_8.svg?name=Icon'),
		SEVEN: require('babel!svg-react!../assets/faces/1_7.svg?name=Icon'),
		SIX: require('babel!svg-react!../assets/faces/1_6.svg?name=Icon'),
		FIVE: require('babel!svg-react!../assets/faces/1_5.svg?name=Icon'),
		FOUR: require('babel!svg-react!../assets/faces/1_4.svg?name=Icon'),
		THREE: require('babel!svg-react!../assets/faces/1_3.svg?name=Icon'),
		TWO: require('babel!svg-react!../assets/faces/1_2.svg?name=Icon')
	},
	SPADES: {
		ACE: require('babel!svg-react!../assets/faces/2_1.svg?name=Icon'),
		KING: require('babel!svg-react!../assets/faces/2_13.svg?name=Icon'),
		QUEEN: require('babel!svg-react!../assets/faces/2_12.svg?name=Icon'),
		JACK: require('babel!svg-react!../assets/faces/2_11.svg?name=Icon'),
		TEN: require('babel!svg-react!../assets/faces/2_10.svg?name=Icon'),
		NINE: require('babel!svg-react!../assets/faces/2_9.svg?name=Icon'),
		EIGHT: require('babel!svg-react!../assets/faces/2_8.svg?name=Icon'),
		SEVEN: require('babel!svg-react!../assets/faces/2_7.svg?name=Icon'),
		SIX: require('babel!svg-react!../assets/faces/2_6.svg?name=Icon'),
		FIVE: require('babel!svg-react!../assets/faces/2_5.svg?name=Icon'),
		FOUR: require('babel!svg-react!../assets/faces/2_4.svg?name=Icon'),
		THREE: require('babel!svg-react!../assets/faces/2_3.svg?name=Icon'),
		TWO: require('babel!svg-react!../assets/faces/2_2.svg?name=Icon')
	},
	DIAMONDS: {
		ACE: require('babel!svg-react!../assets/faces/3_1.svg?name=Icon'),
		KING: require('babel!svg-react!../assets/faces/3_13.svg?name=Icon'),
		QUEEN: require('babel!svg-react!../assets/faces/3_12.svg?name=Icon'),
		JACK: require('babel!svg-react!../assets/faces/3_11.svg?name=Icon'),
		TEN: require('babel!svg-react!../assets/faces/3_10.svg?name=Icon'),
		NINE: require('babel!svg-react!../assets/faces/3_9.svg?name=Icon'),
		EIGHT: require('babel!svg-react!../assets/faces/3_8.svg?name=Icon'),
		SEVEN: require('babel!svg-react!../assets/faces/3_7.svg?name=Icon'),
		SIX: require('babel!svg-react!../assets/faces/3_6.svg?name=Icon'),
		FIVE: require('babel!svg-react!../assets/faces/3_5.svg?name=Icon'),
		FOUR: require('babel!svg-react!../assets/faces/3_4.svg?name=Icon'),
		THREE: require('babel!svg-react!../assets/faces/3_3.svg?name=Icon'),
		TWO: require('babel!svg-react!../assets/faces/3_2.svg?name=Icon')
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
					<div style={frontFaceStyle} className="cardFront"><span style={topValueStyle}>{value}</span>{ Front ? (<Front />) : null}<span style={bottomValueStyle}>{value}</span></div>
					<div style={backFaceStyle} className="cardBack"></div>
				</div>
			</div>
			</Draggable>
		);
	}
}
