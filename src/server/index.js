const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'dev';
const API_PORT = ENV === 'dev' ? PORT + 1 : PORT;

// Development Server

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../../webpack.config');

if(ENV === 'dev') {

	new WebpackDevServer(webpack(config), {
		proxy: {
		"/socket.io" : `http://localhost:${API_PORT}`
		},
		publicPath: config.output.publicPath,
		hot: true,
		historyApiFallback: true
	}).listen(PORT, 'localhost', function (err, result) {
	  if (err) {
	    return console.log(err);
	  }

	  console.log(`Listening at http://localhost:${PORT}/ (hot reload)`);
	});

}

// Poker Server

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const serveStatic = require('serve-static');
const { Table, Player, Action } = require('../poker');

var tables = [];

function addTable(name) {
	var table = new Table(name);
	tables.push(table);
	io.emit('table created', table);
}

var testTable = new Table('Arrian\'s test table');
testTable.join(new Player('Test Player'));

function act(table, player, action) {
	table.act(player, action);
	notify(table);
}

function notify(table) {
	console.log('player on table notify');
	console.log(table.round ? table.round.actingPlayer : null);
	if(table.isRoundComplete()) io.emit('table update', { table, winners: table.getRoundWinners() });
	else io.emit('table update', { table });
}

app.use(serveStatic(__dirname + config.output.publicPath));

io.on('connection', function(socket) {
	var player = new Player('Arrian');
	
	console.log('a user connected');
	io.emit('player update', { player: player });

	testTable.join(player);
	testTable.startRound();

	notify(testTable);

	socket.on('disconnect', () => {
		testTable.leave(player);

		console.log('user disconnected');
		// io.emit('player update', { player: player });
		notify(testTable);
	});

	// socket.on('table create', name => addTable(name));
	// socket.on('table join', table => table.join(player));
	// socket.on('table leave', table => table.leave(player));

	socket.on('player bet', amount => act(testTable, player, new Action(Action.Type.BET, amount)));
	socket.on('player call', amount => act(testTable, player, new Action(Action.Type.CALL, amount)));
	socket.on('player raise', amount => act(testTable, player, new Action(Action.Type.RAISE, amount)));
	socket.on('player fold', () => act(testTable, player, new Action(Action.Type.FOLD)));
	socket.on('player all in', () => act(testTable, player, new Action(Action.Type.ALL_IN)));

});

http.listen(API_PORT, function() {
  console.log(`Listening at http://localhost:${API_PORT}`);
});

// Poker Console
const { Console } = require('../console');
const testConsole = new Console(testTable);
testConsole.on(['flop', 'turn', 'river', 'start', 'end', 'call', 'fold', 'raise', 'check', 'all_in', 'bet'], table => notify(table));

