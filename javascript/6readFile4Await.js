var fs = require('fs');
fs.readFileAsync =  (filename) => {
    return new Promise(
    		(resolve, reject) => {
        try {
        	fs.readFile(filename, "utf8" ,function (err,data) {
        		//console.log(data);
                if (err) 
                	reject(err);
                else      
                	resolve(data);
        });
        } catch (err) {reject(err);}
    });
};

async function asyncCall() {
	console.log("asyncCall");
	var first= await fs.readFileAsync('dati.txt');
	console.log(first);
	var second=await fs.readFileAsync(JSON.parse(first).filename);
	console.log(second);
	console.log(JSON.parse(second).risultato);
}

asyncCall();