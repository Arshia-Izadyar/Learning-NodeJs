function notFound(req, res){
    res.status(404);
    res.send("Not found :)")
}

module.exports = notFound;