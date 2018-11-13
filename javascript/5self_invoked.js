<<<<<<< HEAD:javascript/5self_invoked.js
var func1= (() => {
    var counter = 0; // private var
    console.log('Module init counter='+counter);
    return {
        // JSON notation 
        add: function () {
            
            return counter += 1;
        },
        del: function () {
            return counter -= 1;
        },
        val: function(){
            return counter;
        }
    }
})();

var cnt=func1.add();
console.log('func1.val %d',cnt);
cnt=func1.add();
console.log('func1.val %d',cnt);
func1.del();
console.log('func1.val %d',func1.val());
console.log('func.counter= %d',func1.counter);
//Ridefinisco counter 
func1.counter=100;
console.log('func.counter= %d',func1.counter);
console.log('func1.val %d',func1.val());
=======
var func1= (() => {
    var counter = 0; // private var
    console.log('Module init counter='+counter);
    return {
        // JSON notation 
        add: function () {
            
            return counter += 1;
        },
        del: function () {
            return counter -= 1;
        },
        val: function(){
            return counter;
        }
    }
})();

var cnt=func1.add();
console.log('func1.val %d',cnt);
cnt=func1.add();
console.log('func1.val %d',cnt);
func1.del();
console.log('func1.val %d',func1.val());
console.log('func.counter= %d',func1.counter);
//Ridefinisco counter 
func1.counter=100;
console.log('func.counter= %d',func1.counter);
console.log('func1.val %d',func1.val());
>>>>>>> 9ff2a800532424e9153a0e746578ac879d368be6:javascript/5self_invoked.js
