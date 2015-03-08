var fs = require("fs");

var coverage = fs.readFileSync("./coverage-summary.json", {encoding: 'utf8'});
coverage = JSON.parse(coverage);
var covered = true;

for(var file in coverage) {
	if(coverage[file].functions.pct < 80) {
		covered = false;
	}
}

if(!covered) {
	console.log("Coverage criteria not met!");
	process.exit(1);
}