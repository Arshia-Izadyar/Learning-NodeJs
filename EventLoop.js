/*
- Allows NodeJs to perform None-Blocking I/O by offloading
- 
*/


// const fs = require('fs');
// const path = require('path');


// console.log("before task")
// fs.readFile(path.resolve("./README.md"), 'utf-8', (err, data) => {
//     if (err){
//         console.log(err);
//         return;
//     };
//     console.log(data);console.log("done task")
// });
// console.log("after task")

// // second

console.log("1.");
setTimeout(()=> {console.log("task")}, 1000);
console.log("2.")

// const os = require('os');
// setInterval(()=>{console.log("lmao")}, 200);
// console.log("first");