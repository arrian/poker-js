const _ = require('lodash');
const cuid = require('cuid');

const DEAL_SIZE = 2;
const HAND_SIZE = 5;
const ACTION_TIME_LIMIT = 1000;
const MAX_PLAYERS = 8;

const Suit = {
	HEARTS: { id: 'HEARTS', name: 'Hearts', short: '♥' },
	CLUBS: { id: 'CLUBS', name: 'Clubs', short: '♠' },
	SPADES: { id: 'SPADES', name: 'Spades', short: '♣' },
	DIAMONDS: { id: 'DIAMONDS', name: 'Diamonds', short: '♦' }
};

const Value = {
	TWO: { id: 'TWO', rank: 2, name: 'Two', short: '2' },
	THREE: { id: 'THREE', rank: 3, name: 'Three', short: '3' },
	FOUR: { id: 'FOUR', rank: 4, name: 'Four', short: '4' },
	FIVE: { id: 'FIVE', rank: 5, name: 'Five', short: '5' },
	SIX: { id: 'SIX', rank: 6, name: 'Six', short: '6' },
	SEVEN: { id: 'SEVEN', rank: 7, name: 'Seven', short: '7' },
	EIGHT: { id: 'EIGHT', rank: 8, name: 'Eight', short: '8' },
	NINE: { id: 'NINE', rank: 9, name: 'Nine', short: '9' },
	TEN: { id: 'TEN', rank: 10, name: 'Ten', short: '10' },
	JACK: { id: 'JACK', rank: 11, name: 'Jack', short: 'J' },
	QUEEN: { id: 'QUEEN', rank: 12, name: 'Queen', short: 'Q' },
	KING: { id: 'KING', rank: 13, name: 'King', short: 'K' },
	ACE: { id: 'ACE', rank: 14, altRank: 1, name: 'Ace', short: 'A' }
};

class Card {
	constructor(value, suit) {
		if(_.isString(value) && !suit) {
			suit = value.length === 2 ? value[1] : value[2];
			value = value.length === 2 ? value[0] : value[0] + value[1];
			this.value = _.find(Value, v => v.short === value);
			this.suit = _.find(Suit, s => s.short === suit);
		} else {
			this.value = value;
			this.suit = suit;
		}
	}

	toString() {
		return `${this.value.short}${this.suit.short}`;
	}

	log() {
		console.log(`${this.value.name} of ${this.suit.name}`);
	}

	valueOf() {
		return this.value.rank;
	}

	isSame(card) {
		return this.value === card.value && this.suit === card.suit;
	}

	isSuit(suit) {
		return suit.id === this.suit.id;
	}

	isValue(value) {
		return value.id === this.value.id;
	}
}

class Cards {
	constructor(cards) {
		if(_.isString(cards)) {
			this.cards = _.map(_.split(cards, ' '), cardString => new Card(cardString));
		} else {
			this.cards = cards ? cards : [];
		}
	}

	add(card) {
		this.cards.push(card);
	}

	draw() {
		if(!this.cards.length) throw new Error('Not enough cards to draw from');
		return this.cards.pop();
	}

	shuffle() {
		this.cards = _.shuffle(this.cards);
	}

	count() {
		return this.cards.length;
	}

	getCard(index) {
		return this.cards[index];
	}

	getCards() {
		return this.cards;
	}

	getCombined(other) {
		return new Cards(_.concat(this.cards, other.cards));
	}

	getStraight(length) {
		var cards = this.getSorted(),
			straight = new Cards();

		for(var i = 0; i < cards.count(); i++) {
			var currentCard = cards.getCard(i),
				currentLow = straight.count() > 0 ? _.last(straight.cards) : null;

			if(!currentLow) {
				// first card
				straight.add(currentCard);
			} else if(currentCard.valueOf() === (currentLow.valueOf() - 1)) {
				straight.add(currentCard);
			} else if(currentCard.valueOf() === currentLow.valueOf()) {
				// skip duplicates
				continue;
			} else {
				// current straight ended and is not of required length. reset.
				straight = new Cards();
				straight.add(currentCard);
			}

			if(straight.count() === length) return straight;
			else if(straight.count() === length - 1) {
				// Determine if ace is low in the straight
				var two = straight.containsValue(Value.TWO),
						ace = cards.containsValue(Value.ACE);
				if(two && ace) {
					straight.add(ace);
					return straight;
				}
			}
		}
		return null;
	}

	getReversed() {
		return new Cards(_.reverse(this.cards));
	}

	/**
	Get a new sorted set of cards from high to low.
	**/
	getSorted() {
		return new Cards(_.reverse(_.sortBy(this.cards, 'value.rank')));
	}

	getRelativeComplement(excluded) {
		return new Cards(_.filter(this.cards, card => !_.includes(excluded, card)));
	}

	getGroupedBySuit() {
		return _.mapValues(_.groupBy(this.cards, card=>card.suit.id), cards => new Cards(cards));
	}

	getGroupedByValue() {
		return _.mapValues(_.groupBy(this.cards, card=>card.value.id), cards => new Cards(cards));
	}

	getHighestCard() {
		return this.getSorted().cards[0];
	}

	getHighestCards(count) {
		return this.getSorted().cards.slice(0, count);
	}

	toString() {
		return _.join(_.map(this.cards, card=>card.toString()), ' ');
	}

	containsValue(value) {
		return _.find(this.cards, card => card.isValue(value));
	}

	containsSuit(suit) {
		return _.find(this.cards, card => card.isSuit(suit));
	}

	contains(card) {
		return _.find(this.cards, card => card.isSame(card));
	}

	static isSame(leftCards, rightCards) {
		let same = false,
			a = leftCards.getSorted().cards,
			b = rightCards.getSorted().cards;

		if(leftCards.count() !== rightCards.count()) {
			return false;
		}

		return _.some(_.zip(a, b), _.spread((aCard, bCard) => {
			same = aCard.valueOf() - bCard.valueOf();
			return !same;
		}));
	}

	static compare(leftCards, rightCards) {
		let result = 0,
			a = leftCards.cards,
			b = rightCards.cards;
			
		_.some(_.zip(a, b), _.spread((aCard, bCard) => {
			result = aCard.valueOf() - bCard.valueOf();
			return result !== 0;
		}));
		return result;
	}

	static createDeck() {
		var cards = new Cards();

		_.forOwn(Suit, function(suit) {
			_.forOwn(Value, function(value) {
				cards.add(new Card(value, suit));
			});
		});

		cards.shuffle();

		return cards;
	}

}

class Hand {
	constructor(cards, communityCards) {
		this.cards = cards;
		this.communityCards = communityCards;

		var allCards = cards.getCombined(communityCards),
			handTypes = _.reverse(_.sortBy(_.values(Hand.Type), 'rank'));
		
		_.some(handTypes, (type, key) => {
			let { hand, kickers } = type.is(allCards);
			if(hand) {
				this.type = type;
				this.hand = hand;
				this.kickers = kickers;
			}
			return hand;
		});
	}

	static compare(leftHand, rightHand) {
		if(leftHand.type.rank === rightHand.type.rank) {
			let handRank = Cards.compare(new Cards(leftHand.hand), new Cards(rightHand.hand));
			if(handRank === 0) {
				let kickerRank = Cards.compare(new Cards(leftHand.kickers), new Cards(rightHand.kickers));
				return kickerRank;
			}
			return handRank;
		}
		return leftHand.type.rank - rightHand.type.rank;
	}
}

Hand.Type = {
	ROYAL_FLUSH: {
		rank: 10,
		name: 'Royal Flush',
		is: function(cards) {
			var royalFlush = _.find(cards.getGroupedBySuit(), function(suitGroup) {
				var straight = suitGroup.getStraight(HAND_SIZE);
				return straight && straight.containsValue(Value.ACE) && straight.containsValue(Value.KING);
			});

			return {
				hand: royalFlush ? royalFlush.getCards() : null,
				kickers: null
			};
		}
	},
	STRAIGHT_FLUSH: { 
		rank: 9,
		name: 'Straight Flush',
		is: function(cards) {
			var straightFlush = _.find(cards.getGroupedBySuit(), suitGroup=> suitGroup.getStraight(HAND_SIZE));

			return {
				hand: straightFlush ? straightFlush.getCards() : null,
				kickers: null
			};
		}
	},
	FOUR_OF_A_KIND: {
		rank: 8,
		name: 'Four of a Kind',
		is: function(cards) {
			var four = _.find(cards.getGroupedByValue(), valueGroup=> valueGroup.count() === 4);
			return {
				hand: four ? four.getCards() : null,
				kickers: [ cards.getRelativeComplement(four).getHighestCard() ]
			};
		}
	},
	FULL_HOUSE: {
		rank: 7,
		name: 'Full House',
		is: function(cards) {
			var handByValues = cards.getGroupedByValue(),
				triple = _.find(handByValues, valueGroup=> valueGroup.count() === 3), // three of a kind in the full house
				double = _.find(handByValues, valueGroup=> valueGroup.count() === 2); // two pair in the full house
		
			return {
				hand: triple && double ? [ ...triple.getCards(), ...double.getCards()] : null,
				kickers: null
			};
		}
	},
	FLUSH: {
		rank: 6,
		name: 'Flush',
		is: function(cards) {
			const flush = _.find(cards.getGroupedBySuit(), suitGroup=> suitGroup.count() === HAND_SIZE);
			return {
				hand: flush ? flush.getCards() : null,
				kickers: null
			};
		}
	},
	STRAIGHT: {
		rank: 5,
		name: 'Straight',
		is: function(cards) {
			const straight = cards.getStraight(HAND_SIZE);
			return {
				hand: straight ? straight.getCards() : null,
				kickers: null
			};
		}
	},
	THREE_OF_A_KIND: {
		rank: 4,
		name: 'Three of a Kind',
		is: function(cards) {
			var three = _.find(cards.getGroupedByValue(), valueGroup=> valueGroup.count() === 3);
			return {
				hand: three ? three.getCards() : null,
				kickers: cards.getRelativeComplement(three).getHighestCards(2)
			};
		}
	},
	TWO_PAIR: {
		rank: 3,
		name: 'Two Pair',
		is: function(cards) {
			var pairs = _.filter(cards.getGroupedByValue(), valueGroup=> valueGroup.count() === 2);
			var twoPairs = pairs.length >= 2 ? [...pairs[0].getCards(), ...pairs[1].getCards()] : null;

			return {
				hand: twoPairs,
				kickers: [ cards.getRelativeComplement(twoPairs).getHighestCard() ]
			};
		}
	},
	PAIR: {
		rank: 2,
		name: 'Pair',
		is: function(cards) {
			var pair = _.find(cards.getGroupedByValue(), valueGroup=> valueGroup.count() === 2);

			return {
				hand: pair ? pair.getCards() : null,
				kickers: cards.getRelativeComplement(pair).getHighestCards(3)
			};
		}
	},
	HIGH_CARD: {
		rank: 1,
		name: 'High Card',
		is: function(cards) {
			return {
				hand: [ cards.getHighestCard() ],
				kickers: cards.getRelativeComplement().getHighestCards(4)
			};
		}
	}
};

class Player {
	constructor(name) {
		this.id = cuid();
		this.name = name;

		this.worth = 0;

		this.clearCards();
	}

	addCard(card) {
		this.hand.add(card);
	}

	clearCards() {
		this.hand = new Cards();
	}

	log() {
		console.log(`${this.name}: ${this.hand.getSorted().toString()}`);
	}

	getHand(communityCards) {
		return new Hand(this.hand, communityCards);
	}
}

class Action {
	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
}

Action.Type = {
	CHECK: 'CHECK',
	BET: 'BET',
	CALL: 'CALL',
	RAISE: 'RAISE',
	FOLD: 'FOLD',
	ALL_IN: 'ALL_IN',
	STARTED: 'STARTED',
	DEAD: 'DEAD'
};

class Round {
	constructor(players) {
		if(players.length <= 0) throw new Error('Can\'t start a round with no players');

		this.id = cuid();
		this.time = 0;

		this.communityCards = new Cards();
		this.deck = null;


		this.players = [...players];
		this.actingPlayer = players[0]; //acting player
		// this.dealer = ;
		// this.bigBlind = ;
		// this.smallBlind = ;

		this.actions = [];
		this.bets = {};

		this.progress = Round.State.STARTING;
		this.record();
	}

	nextState() {
		if(this.players.length <= 1) {
			this.end();
		} else if(this.isAwaitingAction()) {
			this.players.push(this.players.shift());
			this.actingPlayer = this.players[0];
		} else if(this.progress === Round.State.DEALT) {
			this.flop();
		} else if(this.progress === Round.State.FLOPPED) {
			this.turn();
		} else if(this.progress === Round.State.TURNED) {
			this.river();
		} else {
			this.end();
		}
	}

	isAwaitingAction() {
		const allPlayersActed = _.every(_.map(this.players, player => player.id), _.partial(_.has, this.bets));
		if(!allPlayersActed) return true;

		const betsEqual = _.uniq(_.map(this.bets)).length === 1; // TODO: improve this logic. bets may be different if all in

		return !betsEqual;
	}

	record(player, action) {
		this.actions.push({ state: this.progress, player: player, action: action, time: this.time });
	}

	act(player, action) {
		if(player !== this.actingPlayer) {
			this.dead(player);
			throw new Error('Player acted out of turn');
		}

		this.record(player, action);

		if(action.type === Action.Type.FOLD) this.fold(player, action);
		else if(action.type === Action.Type.CHECK) this.check(player, action);
		else if(action.type === Action.Type.BET) this.bet(player, action);
		else if(action.type === Action.Type.RAISE) this.raise(player, action);
		else if(action.type === Action.Type.CALL) this.call(player, action);
		else if(action.type === Action.Type.ALL_IN) this.allIn(player, action);
		else throw new Error(`Invalid action ${action.type}`);

		this.nextState();
	}

	dead(player) {
		this.record(player, new Action(Action.Type.DEAD));
		this.removePlayer(player);
	}

	fold(player, action) {
		this.removePlayer(player);

		if(this.players.length === 1) {
			this.end();
		} else {
			this.actingPlayer = this.players[0];
			this.record(this.actingPlayer, new Action(Action.Type.STARTED));
		}
	}

	check(player, action) {
	}

	bet(player, action) {
		if(action.data <= 0) throw new Error('A bet > 0 was expected');
		if(this.getBetSize()) throw new Error('Can\'t bet after a bet. Call or raise was expected.');
		this.bets[player.id] = action.data;
	}

	raise(player, action) {
		if(action.data <= this.getBetSize()) throw new Error('A raise larger than the current bet was expected.');
		this.bets[player.id] = action.data;
	}

	call(player, action) {
		if(action.data !== this.getBetSize()) throw new Error('A call must be the size of the current bet.');
		this.bets[player.id] = action.data;
	}

	allIn(player, action) {
		if(action.data !== player.worth) throw new Error('All in must be of the size of the player worth');// fix this, depend on size of other all ins
		this.bets[player.id] = action.data;
	}

	deal() {
		if(this.progress !== Round.State.STARTING) throw new Error(`Expected ${Round.State.STARTING} instead of ${this.progress}`);

		this.deck = Cards.createDeck();
		this.deck.shuffle();

		for(var i = 0; i < DEAL_SIZE; i++) {
			_.each(this.players, player=>player.addCard(this.deck.draw()));
		}

		this.progress = Round.State.DEALT;
		this.record();
	}

	flop() {
		if(this.progress !== Round.State.DEALT) throw new Error(`Expected ${Round.State.DEALT} instead of ${this.progress}`);

		this.communityCards.add(this.deck.draw());
		this.communityCards.add(this.deck.draw());
		this.communityCards.add(this.deck.draw());

		this.progress = Round.State.FLOPPED;
		this.record();
	}

	turn() {
		if(this.progress !== Round.State.FLOPPED) throw new Error(`Expected ${Round.State.FLOPPED} instead of ${this.progress}`);

		this.communityCards.add(this.deck.draw());

		this.progress = Round.State.TURNED;
		this.record();
	}

	river() {
		if(this.progress !== Round.State.TURNED) throw new Error(`Expected ${Round.State.TURNED} instead of ${this.progress}`);

		this.communityCards.add(this.deck.draw());

		this.progress = Round.State.RIVERED;
		this.record();
	}

	end() {
		this.progress = Round.State.ENDED;
		this.record();
	}

	hasEnded() {
		return this.progress === Round.State.ENDED;
	}

	getFlopCards() {
		if(this.progress !== Round.State.FLOPPED) throw new Error(`Expected ${Round.State.FLOPPED} instead of ${this.progress}`);
		return [this.communityCards[0], this.communityCards[1], this.communityCards[2]];
	}

	getTurnCard() {
		if(this.progress !== Round.State.TURNED) throw new Error(`Expected ${Round.State.TURNED} instead of ${this.progress}`);
		return this.communityCards[3];
	}

	getRiverCard() {
		if(this.progress !== Round.State.RIVERED) throw new Error(`Expected ${Round.State.RIVERED} instead of ${this.progress}`);
		return this.communityCards[4];
	}

	getWinners() {
		if(this.players.length === 0) return null;
		var ranked = this.rankPlayers(),
			winner = ranked[0], // we know this is a winner
			winners = _.filter(ranked, rank => Hand.compare(winner.hand, rank.hand) === 0); // find all winners

		return winners;
	}

	getBetSize() {
		return _.max(_.map(this.bets));
	}

	getPotSize() {
		return _.reduce(this.bets, (result, value) => result + value, 0);
	}

	getActingPlayer() {
		return this.actingPlayer;
	}

	rankPlayers() {
		return _.reverse(_.map(this.players, player => ({ player: player, hand: player.getHand(this.communityCards) })).sort((left, right) => Hand.compare(left.hand, right.hand)));
	}

	removePlayer(player) {
		_.remove(this.players, p => p.id === player.id);
	}

}

Round.State = {
	STARTING: 'STARTING',
	DEALT: 'DEALT',
	FLOPPED: 'FLOPPED',
	TURNED: 'TURNED',
	RIVERED: 'RIVERED',
	ENDING: 'ENDING',
};

class Table {
	constructor(name) {
		this.id = cuid();
		this.name = name;
		this.players = [];
		this.round = null;
		this.winners = null;
	}

	act(player, action) {
		if(!this.round) throw new Error('No round currently active');
		this.round.act(player, action);
	}

	tick() {
		if(!this.round) return;


	}

	startRound() {
		_.each(this.players, player => player.clearCards());
		this.round = new Round(this.players);
		this.round.deal();
	}

	isRoundComplete() {
		if(!this.round) return true;
		return this.round.hasEnded();
	}

	getRoundWinners() {
		return this.round.getWinners();
	}

	completeRound() {

	}

	join(player) {
		if(this.players.length >= MAX_PLAYERS) throw new Error('Player can\'t join. The table is full');
		this.players.push(player);
	}

	leave(player) {
		var removed = _.remove(this.players, p => player.id === p.id);
		if(removed.length < 1) throw new Error('Could not find the player to remove');
		else if(removed.length > 1) throw new Error('Found more than one of the player to remove');
	}

	getActingPlayer() {
		if(this.round) return this.round.getActingPlayer();
		return null;
	}

	log() {
		_.each(this.players, player=>player.log());
		if(this.round) console.log(`Table: ${this.round.communityCards.getSorted().toString()}`);
	}

	logRanked() {
		console.log('--Ranked');
		var ranked = this.round.rankPlayers();
		_.each(ranked, rank => {
			console.log(`${rank.player.name} (${rank.hand.type.name})`);
		});
	}

	logWinners() {
		console.log('--Winners');
		var winners = this.getRoundWinners();
		_.each(winners, rank => {
			console.log(`${rank.player.name} (${rank.hand.type.name} ${new Cards(rank.hand.hand).toString()})`);
		});
	}
}

module.exports = {
	Value,
	Suit,
	Card,
	Cards,
	Hand,
	Action,
	Player,
	Round,
	Table
};