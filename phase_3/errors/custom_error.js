class CustomError extends Error{
    constructor(msg, status){
        super(msg);
        this.status = status;
    }
}

function createCustomError(msg, status){
    return new CustomError(msg, status);

}


module.exports = {createCustomError, CustomError}