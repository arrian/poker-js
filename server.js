var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var server = require('./src/server');

var env = process.env.NODE_ENV || 'dev';

if(env === 'dev') {

	new WebpackDevServer(webpack(config), {
		proxy: {
			"*" : "http://localhost:1234"
		},
		publicPath: config.output.publicPath,
		hot: true,
		historyApiFallback: true
	}).listen(3001, 'localhost', function (err, result) {
	  if (err) {
	    return console.log(err);
	  }

	  console.log('Listening at http://localhost:3001/');
	});

}

