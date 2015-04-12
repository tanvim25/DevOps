var express = require('express');
var app = express();
var fs = require("fs");
app.use(cookieParser());
app.use(session({
	secret: 'difference',
	resave: false,
	saveUninitialized: false
}));
app.get("/", function(req, res) {
	res.send(fs.readFileSync("./public/index.html", {encoding: 'utf8'}));
});
app.use('/', express.static(__dirname+'/public'));
app.use(function(error, req, res, next) {
	var err = JSON.stringify(error);
	res.status(500).send('500: Internal Server Error <br/>' + err);
});
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});