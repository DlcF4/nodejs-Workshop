var func1= (function () {
    var counter = 0; // private var
    console.log('Module init '+counter);
    return {
        // JSON notation in javascript
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
console.log('cnt %d',cnt);
cnt=func1.add();
console.log('cnt %d',cnt);
func1.del();
console.log('func1.val %d',func1.val());
console.log('func.counter= %d',func1.counter);
func1.counter=100;
console.log('func.counter= %d',func1.counter);