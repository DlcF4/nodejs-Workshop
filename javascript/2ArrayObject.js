// Array
var arr = ["one", "two", 3]; // Dichiarazione Array .
console.log("Init array");
typeof arr; // outputs object
console.log("Array.isArray() "+Array.isArray(arr)); // outputs true



// Objects
var obj = {
	firstname : "Mario",
	lastname : "Rossi"
};
console.log("****************************************************")
console.log('Init object creato' +obj);
console.log(obj)
// Accesso Utilizzando chiave.
console.log('obj.firstname --> ' + obj.firstname); // returns Davide
// Aggiunta chiave valore
obj.middlename = "Paolo"; // add middlename:"Paolo"
obj["country"] = "Italia"; // add country:"Italia"
// rimuove elemento da object
console.log('obj : ');
console.log( obj)
delete obj.middlename; //
// numero di chiavi
console.log('obj : ');
console.log(obj);

var k = Object.keys(obj);
console.log("object lenght " + k.length);

/*
 * FOR EACH 
 */
console.log("Scan object FOR EACH ");

k.forEach(function(key) {
	console.log(key + " --> " + obj[key]);
});

// check key exists in object or not
obj.hasOwnProperty("firstname"); // true;
obj.hasOwnProperty("dummy"); // false;

// Array
var arr = [ "one", "two", "three", "four" ];
console.log(arr);
var jsonStrArr = JSON.stringify(arr); // "["one","two","three","four"]"
console.log(jsonStrArr);
var arrFromJSONStr = JSON.parse(jsonStrArr); // Returns ["one", "two",
												// "three", "four"]
console.log("****************************************************")
console.log("JSON")
// Objects
var obj = {
	firstname : "Mario",
	lastname : "Bianchi"
};
console.log(obj);
var jsonStrObj = JSON.stringify(obj); // "{"firstname":"hiral","lastname":"patel"}"
console.log(jsonStrObj);
var objFromJSONStr = JSON.parse(jsonStrObj);
console.log("Add ")
obj.middlename = "Paolo"; // add middlename:"Paolo"
obj["country"] = "Italia"; // add country:"Italia"
obj.data={"Fiscal":"ESBADG56G11D223F","age":22,"son":['Carlo',"Giulia"]};
console.log(JSON.stringify(obj));
console.log("Pretty")
console.log(JSON.stringify(obj, null, 2));
console.log("****************************************************");
var a={"firstname":"Luigi","lastname":"Bianchi"};
console.log(typeof a)
console.log(a)


var sum = [0, 1, 2, 3].reduce(function(a, b) {
  return a + b;
}, 0);
console.log('Sum = '+sum)





