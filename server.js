var express = require('express');
var app = express();
//app.configure(function () {
    app.use('/test', express.static(__dirname+'/public') //where your static content is located in your filesystem
    );
//});
app.listen(3000);