const http = require('http');

const server = http.createServer((req, res) => {

    if (req.url == "/") {

        response = `<h2>hello</h2>`
        res.write(response);
        res.end();
        return;
    } else {
        response = `not the root`;
        res.write(response);
        res.end();
        return;
    }

});

server.listen(4000)