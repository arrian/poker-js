const _ = require('lodash');
const readline = require('readline');
const { Player, Table, Action } = require('./poker');

const rl = readline.createInterface(process.stdin, process.stdout);

// const table = new Table();
// table.join(new Player('Player 1'));
// table.join(new Player('Player 2'));
class Console {

	constructor(table) {
		this.events = {};
		this.table = table;
		rl.on('line', this.act.bind(this)).on('close', this.exit);
		this.prompt();
	}

	simulate(count) {
		for(var i = 0; i < count; i++) {

			console.log('-----------------------------------------');

			var table = new Table();
			table.join(new Player('Player 1'));
			table.join(new Player('Player 2'));
			table.join(new Player('Player 3'));
			table.join(new Player('Player 4'));
			table.join(new Player('Player 5'));
			table.join(new Player('Player 6'));
			table.join(new Player('Player 7'));
			table.join(new Player('Player 8'));

			table.startRound();

			table.round.flop();
			table.round.turn();
			table.round.river();

			table.log();
			table.logRanked();
			table.logWinners();
		}
	}

	// simulate(100);

	exit() {
		process.exit(0);
	}

	prompt() {
		this.table.log();

		let player = this.table.getActingPlayer();
		if(player) rl.setPrompt(`${player.name} action (fold,check,raise,bet,call,all_in)> `);
		else rl.setPrompt(`admin action (simulate, start, flop, turn, river)> `);
		rl.prompt();
	}

	act(line) {
		if(line === 'simulate') {
			this.simulate(100);
			this.notify(line);
			this.prompt();
			return;
		} else if(line === 'start') {
			this.table.startRound();
			this.notify(line);
			this.prompt();
			return;
		} else if(line === 'end') {
			this.table.logWinners();
			this.notify(line);
			this.prompt();
			return;
		} else if(line === 'flop') {
			this.table.round.flop();
			this.notify(line);
			this.prompt();
			return;
		} else if(line === 'turn') {
			this.table.round.turn();
			this.notify(line);
			this.prompt();
			return;
		} else if(line === 'river') {
			this.table.round.river();
			this.notify(line);
			this.prompt();
			return;
		}

		var splitLine = line.split(' ');
		var action = splitLine.length ? Action.Type[splitLine[0].toUpperCase()] : null;
		var amount = splitLine.length > 1 ? splitLine[1] : null;

		if(action) {
			this.table.act(this.table.getActingPlayer(), new Action(action, amount));
			this.notify(splitLine[0]);
		}

		if(this.table.isRoundComplete()) {
			this.table.logWinners();
			console.log('-------------------Starting round');
			this.table.startRound();
			this.prompt();
		} else {
			this.prompt();
		}
	}

	on(input, func) {
		if(_.isArray(input)) _.each(input, i => this.events[i] = func);
		else this.events[input] = func;
	}

	notify(input) {
		if(this.events[input]) this.events[input](this.table);
	}

}

module.exports = {
	Console
};

// console.log('-------------------Starting game');
// table.startRound();
// prompt();









