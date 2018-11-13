var fs = require('fs');
fs.readFileAsync =  (filename) => {
    return new Promise(
    		(resolve, reject) => {
        try {
        	fs.readFile(filename, "utf8" ,function (err,data) {
        		console.log(data);
                if (err) 
                	reject(err);
                else      
                	resolve(data);
        });
        } catch (err) {reject(err);}
    });
};

fs.readFileAsync('dati.txt')
   .then(
		   (first) => {fs.readFileAsync(JSON.parse(first).filename)}
		   )
   .then(
		   (second) => {console.log(JSON.parse(first).risultato)}
		   )
   .catch((err) => {console.log('Error reading data');}
   );
