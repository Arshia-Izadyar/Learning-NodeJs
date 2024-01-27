// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
const os = require('os'); // import os


const user = os.userInfo()
console.log(`uptime -> ${os.uptime()/3600}`)

var info = {
    name: os.type(),
    release: os.release(),
    totalMem: os.totalmem() / (1024 ** 3),
    freeMem: os.freemem() / (1024 ** 3)

}

console.log(info)
*/
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


/*
const path = require('path');   

console.log(path.basename("D:\\Code\\JavaScript\\NodeJS\\app.js"))
console.log(path.sep)
console.log(path.join(__dirname, "./app.js"))
let file_path = path.join(__dirname,"./content", "test.txt")
console.log(path.basename(file_path))

let abs_path = path.resolve("./content/test.txt")
console.log(abs_path)

*/

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');   

// let a = fs.readFileSync(path.resolve("./content/test.txt"), {"encoding":"utf-8"});
// console.log(a);
// fs.writeFileSync(path.resolve("./content/test2.txt"), a, {"encoding":"utf-8"});

fs.readFile(path.resolve("./content/test.txt"),'utf-8' ,function(err, data){
    if (err){
        console.log(err.message);
    } else {
        fs.appendFile(path.resolve("./content/test2.txt",), data+"\n", {"encoding":"utf-8"}, function(err){
            if (err){
                console.log(err);
            }
        })
    }
});
