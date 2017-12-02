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
        }
    }
})();

var cnt = func1.add();
console.log('cnt %d',cnt);
cnt = func1.del();
console.log('cnt %d',cnt);
console.log('func1.counter %d',func1.counter);