function notFound(req, res, next){
    res.status(404).json({'status':'not found'});
}

module.exports = notFound;