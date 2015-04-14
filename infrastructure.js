var http      = require('http');
var httpProxy = require('http-proxy');

// Main and canary server addresses. Should probably be moved to config
var MAIN = 'http://ec2-52-10-3-226.us-west-2.compute.amazonaws.com:3000';
var CANARY  = 'http://ec2-54-148-142-135.us-west-2.compute.amazonaws.com:3000';

var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

// Proxy server
var options = {};
var proxy   = httpProxy.createProxyServer(options);

// Session middleware
app.use(cookieParser());
app.use(session({
	secret: 'difference',
	resave: false,
	saveUninitialized: false
}));

// Proxy every xth user to the canary, others to main
var userId = 1;
app.use(function(req, res, next) {
	req.session.userid = req.session.userid || userId++;
	//Set "forceCanary" cookie to true to forcibly enable forwarding to canary
	if(req.cookies.forceCanary || req.session.userid % 3 === 0) {
		proxy.web( req, res, {target: CANARY }, function(err){
			console.log("Proxy error");
			console.log(err);
		});
	}
	else {
		proxy.web( req, res, {target: MAIN }, function(err){
			console.log("Proxy error");
			console.log(err);
		});
	}
});

// Server setup
app.listen(3000, function() {
	console.log("Infrastructure listening on port 3000");
});

// Basic signal handlers
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
