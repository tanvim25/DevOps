var phantom = require('phantom');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var CANARY  = 'http://ec2-54-148-142-135.us-west-2.compute.amazonaws.com:3000';

var errors = [];
var phPage;

app.get("/start", function(req, res) {
	if(!req.query.url)
		res.status(400).send("Bad Request !");
	createPhantom(req.query.url);
	res.send("OK");
});

app.get("/status", function(req, res) {
	res.send(errors);
});

app.post("/event", function(req, res) {
	res.send("OK");
});

app.listen(3000, function() {
	console.log("Listening on port 3000");
});

function createPhantom(url) {
	phantom.create(function (ph) {
		ph.createPage(function (page) {
			phPage = page;
			page.onError(function(msg, trace) {

				var msgStack = ['ERROR: ' + msg];

				if (trace && trace.length) {
					msgStack.push('TRACE:');
					trace.forEach(function(t) {
						msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
					});
				}

				errors.push({
					msg: msg,
					stack: msgStack.join('\n')
				});
			});
			page.open(CANARY + url, function (status) {
				
			});
		});
	});
}