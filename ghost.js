var phantom = require('phantom');
var express = require('express');
var app = express();

app.get("/start", function(req, res) {
	if(!req.query.url)
		res.status(400).send("Bad Request !");
	createPhantom(req.query.url);
	res.send("OK");
})

app.listen(8080, function() {
	console.log("Listening on port 8080");
});

function createPhantom(url) {
	phantom.create(function (ph) {
	  ph.createPage(function (page) {
		page.open(url, function (status) {
		  page.evaluate(function () { return document.title; }, function (result) {
			console.log('Page title is ' + result);
			ph.exit();
		  });
		});
	  });
	});
}