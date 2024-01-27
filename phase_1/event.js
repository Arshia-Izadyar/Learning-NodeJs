const EventEmitter = require('events');
const http = require('http');

const costumeEmitter = new EventEmitter()

/*
1. order matters
2. can have "on" as many as you want
3.  
*/

// costumeEmitter.on('response', () => {
//     console.log(`data received`);

// })

// costumeEmitter.on('response', () => {
//     console.log(`data received vol. 2`);

// })

// costumeEmitter.emit('response')

const server = http.createServer()

server.on('request', (req, res) => {
    console.log(req.url)
    res.end('bye')
})

server.listen(8000)