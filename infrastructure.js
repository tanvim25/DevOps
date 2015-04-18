var http      = require('http');
var httpProxy = require('http-proxy');

// Main and canary server addresses. Should probably be moved to config
var MAIN = 'http://ec2-52-10-3-226.us-west-2.compute.amazonaws.com:3000';
var CANARY  = 'http://ec2-54-148-142-135.us-west-2.compute.amazonaws.com:3000';
var GHOST = "http://localhost:3000";
var canaryRoute = true;


var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var request = require('request');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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

// Canary status endpoint
app.get("/infra/canary", function(req, res){
	request({
		url: CANARY + "/status"
	}, function(err, resp, body) {
		var response = JSON.parse(body);
		if(response.errors.length > 0) {
			canaryRoute = false;
		}
		response.canaryRoute = canaryRoute;
		res.send(response);
	})
});

app.post("/infra/event", function(req, res){
	request({
		url: GHOST + "/event",
		method: "POST",
		body: req.body,
		json: true
	});
	res.send("OK");
});

app.get("/infra/ghost", function(req, res){
	request({
		url: GHOST + "/status"
	}, function(err, resp, body) {
		console.log(body);
		var response = JSON.parse(body);
		res.send(response);
	})
});

// Infra related static files
app.use('/infra', express.static(__dirname+'/public/infra'));
app.use('/infra/lib', express.static(__dirname+'/public/lib'));

// Proxy every xth user to the canary, others to main
var userId = 1;
app.use(function(req, res, next) {
	req.session.userid = req.session.userid || userId++;
	//Set "forceCanary" cookie to true to forcibly enable forwarding to canary
	if(canaryRoute && (req.cookies.forceCanary || req.session.userid % 3 === 0)) {
		proxy.web( req, res, {target: CANARY }, function(err){
			console.log("Proxy error");
			console.log(err);
		});
		if(req.path === "/") {
			request({
				url: GHOST + "/start",
				qs: {url: req.url}
			});
		}
	}
	else {
		proxy.web( req, res, {target: MAIN }, function(err){
			console.log("Proxy error");
			console.log(err);
		});
	}
});

// Server setup
app.listen(8080, function() {
	console.log("Infrastructure listening on port 8080");
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
