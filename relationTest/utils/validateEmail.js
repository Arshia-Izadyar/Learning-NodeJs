import {CustomValidationError} from '../errors/index.js'

function validateEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!regex.test(email)){
        throw new CustomValidationError('invalid email ... ')
    }
}

export default validateEmail