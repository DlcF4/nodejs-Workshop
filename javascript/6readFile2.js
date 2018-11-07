var fs = require('fs');
console.log(fs);
console.log(JSON.stringify(fs));
fs.readFile('dati.txt', "utf8", function(err, data) {
	console.log('-- Callback --');
	if (err) {
		console.log('Error reading file %s', err);
	} else {
		console.log(data);
		var res = JSON.parse(data);
		console.log();
		fs.readFile(res.filename, "utf8", function(err, data) {
			console.log('-- Callback 2--');
			if (err) {
				console.log('Error reading file %s', err);
			} else {
				console.log(data);
				var res = JSON.parse(data);
				console.log(res.risultato);

			}
		})
	}
});
