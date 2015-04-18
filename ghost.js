var phantom = require('phantom');
var express = require('express');
var app = express();
var CANARY  = 'http://ec2-54-148-142-135.us-west-2.compute.amazonaws.com:3000';

var errors = [];

app.get("/start", function(req, res) {
	if(!req.query.url)
		res.status(400).send("Bad Request !");
	createPhantom(req.query.url);
	res.send("OK");
});

app.get("/status", function(req, res) {
	res.send(errors);
});

app.listen(3000, function() {
	console.log("Listening on port 3000");
});

function createPhantom(url) {
	phantom.create(function (ph) {
		ph.createPage(function (page) {
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