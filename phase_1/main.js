
const names = require('./app');

const { NAME } = require('./app');
const { lol } = require('./app');

console.log(names.NAME);
console.log(names.PASSWORD);
console.log(NAME);

console.log(names.strFormat("kos")); 
console.log(lol(1, 3));



const add1 = (a, b) => a + b;
const add2 = function(a, b){return a + b};
function add3(a, b){
    return a + b
}

console.log(add1(1, 2))
console.log(add2(1, 2))
console.log(add3(1, 2))

require('./export2'); // the whole file will run

// console.log("sum",sum(3, 45))
