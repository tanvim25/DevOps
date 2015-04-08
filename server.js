var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs = require("fs");
app.use(cookieParser());
app.use(session({
	secret: 'difference',
	resave: false,
	saveUninitialized: false
}));
app.get("/", function(req, res) {
	req.session.abc = true;
	res.send(fs.readFileSync("./public/index.html", {encoding: 'utf8'}));
});
app.use('/', express.static(__dirname+'/public'));
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});