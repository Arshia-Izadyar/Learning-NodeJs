const http = require('http');   
const fs = require('fs');


const home = fs.readFileSync('./index.html', 'utf-8');

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET'){

        console.log(req.headers);
        // res.writeHead(200, {"content-type":"application/json"})
        // res.write('{"status":"Ok"}')
        res.writeHead(200, {"content-type":"text/html"})
        res.write(home);
        res.end();
    }else{
        res.writeHead(404, {"content-type":"application/json"})
        res.write('{"status":"Not Found"}')
        res.end();
    }
}).listen(8000) 