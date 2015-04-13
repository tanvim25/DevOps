var http      = require('http');
var httpProxy = require('http-proxy');

var GREEN = 'http://52.10.3.226:3000';
var BLUE  = 'http://54.148.142.135:3000';

var TARGET = GREEN;

var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

var options = {};
var proxy   = httpProxy.createProxyServer(options);

app.use(cookieParser());
app.use(session({
	secret: 'difference',
	resave: false,
	saveUninitialized: false
}));
app.use(function(req, res, next) {
	req.session.abc = true;
	proxy.web( req, res, {target: TARGET }, function(err){
		console.log("Proxy error");
		console.log(err);
	});
});
app.listen(3000, function() {
	console.log("Infrastructure listening on port 3000");
});

// Make sure to clean up.
process.on('exit', function(){
	process.exit();
});
process.on('SIGINT', function(){
	process.exit();
});
process.on('uncaughtException', function(err){
	console.log(err);
	process.exit(1);
});
