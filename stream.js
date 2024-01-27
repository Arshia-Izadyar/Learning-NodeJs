const fs = require('fs');
const http = require('http');

const stream = fs.createReadStream("./content/first.txt", {highWaterMark:900, encoding:"utf-8"});
// default buffer => 64kb
// stream.on("data", (data) => {console.log(data)})

// stream.on("error", (error) => {console.log("error")})


const server = http.createServer((req, res) => {
    const streamFile = fs.createReadStream("./content/first.txt", {encoding:"utf-8"});
    streamFile.on("data", (data) => {streamFile.pipe(res)});
    streamFile.on('error', (err) => {console.log(err)});

}
).listen(8000)