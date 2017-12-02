var fs = require('fs');
// callback anonima 
fs.readFile('dati.txt', "utf8", function(err,data){
    console.log('-- Callback --');
    if(err) {
        console.log('Error reading file %s',err);
        }
    else    {
        console.log(data);
        }
});

//promisify fs.readFile()
fs.readFileAsync = function (filename) {
    return new Promise(function (resolve, reject) {
        try {
            fs.readFile(filename, function(err, buffer){
                console.log('-- Promise --');
                if (err) 
                    reject(err); 
                else 
                   resolve(buffer);
            });
        } catch (err) {
            reject(err);
        }
    });
};
// run 
fs.readFileAsync('dati.txt', "utf8")
.then(function(data) {
   console.log('Data %s',data);})
.catch(function (err){
    console.log('Error reading file %s',err);
});
