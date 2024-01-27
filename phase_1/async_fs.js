// const fs = require('fs');
const fs = require('fs').promises;  // USE THIS
const util = require('util');   

// const readAsync = util.promisify(fs.readFile)
// const writeAsync = util.promisify(fs.writeFile)

async function read(){
    try{

        let first = await fs.readFile("./content/first.txt", {"encoding":"utf-8"});
        let second = await fs.readFile("./content/second.txt", {"encoding":"utf-8"});
        console.log(first);
        console.log(second);
        await fs.writeFile("./content/first.txt", `${first} \n${second}`, {"encoding":"utf-8"});

    } catch(error) {
        console.log(error);
        return;
    }





}
console.log("before")
read()
console.log("after")
