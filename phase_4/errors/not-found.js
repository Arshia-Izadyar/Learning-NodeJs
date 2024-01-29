const {StatusCodes} = require('http-status-codes');
const CustomError = require('./customError');

class NotFound extends CustomError{
    constructor(msg){
        super(msg);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFound;