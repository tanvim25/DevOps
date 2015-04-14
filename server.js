var express = require('express');
var Trie = require("./trie.js").Trie;
var app = express();
var fs = require("fs");

var serverErrors = [];

var words = JSON.parse(fs.readFileSync("./public/words.json"));
var wordsTrie = new Trie();
for(var i = 0; i < words.length; i++) {
	wordsTrie.add(words[i]);
}
app.get("/", function(req, res) {
	res.send(fs.readFileSync("./public/index.html", {encoding: 'utf8'}));
});
app.get("/lookup", function(req, res) {
	if(!req.query.q) {
		res.status(400).send("Bad Request");
		return;
	}
	var results = wordsTrie.lookup(req.query.q);
	res.send(results);
});
app.get("/status", function(req, res) {
	var appStatus = {
		errors: serverErrors,
		responseTimes: []
	};
	res.send(appStatus);
})
app.use('/', express.static(__dirname+'/public'));
app.use(function(error, req, res, next) {
	serverErrors.push(error.toString());
	res.status(500).send('500: Internal Server Error');
});
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});