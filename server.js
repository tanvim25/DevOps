var express = require('express');
var Trie = require("./trie.js").Trie;
var app = express();
var fs = require("fs");

var serverErrors = [];

// Getting and adding word list to trie
var words = JSON.parse(fs.readFileSync("./public/words.json"));
var wordsTrie = new Trie();
for(var i = 0; i < words.length; i++) {
	wordsTrie.add(words[i]);
}

app.get("/", function(req, res) {
	res.send(fs.readFileSync("./public/index.html", {encoding: 'utf8'}));
});

// Lookup route
var avgTime;
app.get("/lookup", function(req, res) {
	if(!req.query.q) {
		res.status(400).send("Bad Request");
		return;
	}
	
	//Introducing random server errors
	if(Math.random() < 0.2)
		next();
	
	var startTime = new Date();
	//Random response times
	setTimeout(function() {
		var results = wordsTrie.lookup(req.query.q);
		res.send(results);
		var endTime = new Date();
		avgTime = !avgTime ? (endTime - startTime) : ((endTime - startTime) + avgTime) / 2;
	}, Math.random() * 10);
});

// Status route
app.get("/status", function(req, res) {
	var appStatus = {
		errors: serverErrors,
		responseTimes: avgTime
	};
	res.send(appStatus);
})

app.use('/', express.static(__dirname+'/public'));

// Error catcher
app.use(function(error, req, res, next) {
	serverErrors.push(error.toString());
	res.status(500).send('500: Internal Server Error');
});

// Server setup
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});