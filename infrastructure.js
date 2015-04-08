var http      = require('http');
var httpProxy = require('http-proxy');

var GREEN = 'http://127.0.0.1:5060';
var BLUE  = 'http://127.0.0.1:9090';

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