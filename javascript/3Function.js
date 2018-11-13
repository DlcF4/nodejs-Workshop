//normal 
console.log("TEST FUNCTION ")
function func(a,b){
return a+b;
};
var result = func(5,3);
console.log('func(5,3) --> '+result)
//anonymus
var func1 = function(a,b){ 
   return func(a,b);
};
var result = func1(5,'a');
console.log("func1(5,'a') --> "+result)

// Arrow function 
var f = (a,b,c) => {
	 return func(a,b)+c;
};
result = f(5,3,8);
// console log param : %d integet %s string %i %f float ecc ecc 
console.log("f(5,3,8) --> %d",result);
//Template  literals Attenzione --> ` backtick (ALT 96) 
var end=' \n is the result of arrow function!'
console.log(`f(5,3,8) --> ${result}  ${end}.`);

