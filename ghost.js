var phantom = require('phantom');
var express = require('express');
var app = express();
var CANARY  = 'http://ec2-54-148-142-135.us-west-2.compute.amazonaws.com:3000';

app.get("/start", function(req, res) {
	if(!req.query.url)
		res.status(400).send("Bad Request !");
	createPhantom(req.query.url);
	res.send("OK");
})

app.listen(3000, function() {
	console.log("Listening on port 3000");
});

function createPhantom(url) {
	phantom.create(function (ph) {
		ph.createPage(function (page) {
			page.open(CANARY + url, function (status) {
				page.evaluate(function () { return document.title; }, function (result) {
					console.log('Page title is ' + result);
					ph.exit();
				});
			});
		});
	});
}