const {CustomError} = require('../errors/custom_error');


function errorHandlerMiddleware(err, req, res, next){
    if (err instanceof CustomError){
        return res.status(err.status).json({"error": err.message, "status": (err.status < 300 && err.status >= 200)});
    }

    return res.status(500).json({"error": err, "status": false});

}

module.exports = errorHandlerMiddleware