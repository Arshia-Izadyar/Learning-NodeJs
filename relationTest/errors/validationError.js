import CustomAPIError from "./custom-api.js"

class CustomValidationError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = 400
    }
}

export default CustomValidationError