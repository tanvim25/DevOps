var phantom = require('phantom');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var CANARY  = 'http://localhost:3000';

var errors = [];
var phPage;

app.get("/start", function(req, res) {
	if(!req.query.url)
		res.status(400).send("Bad Request !");
	console.log("Starting Phantomjs client");
	createPhantom(req.query.url);
	res.send("OK");
});

app.get("/status", function(req, res) {
	res.send(errors);
});

app.post("/event", function(req, res) {
	console.log(req.body);
	phPage.evaluate(function(evt) {
		if(evt.type === "keyup")
			$(evt.elem).val(evt.val);
		$(evt.elem).trigger(evt.type);
	}, function(result){
	}, req.body.data);
	res.send("OK");
});

app.listen(3001, function() {
	console.log("Listening on port 3001");
});

function createPhantom(url) {
	phantom.create(function (ph) {
		ph.createPage(function (page) {
			phPage = page;
			console.log("Pointing client to URL: " + CANARY + url);
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
				console.log(status);
				page.injectJs("public/lib/jquery-1.11.2.min.js");
			});
		});
	});
}