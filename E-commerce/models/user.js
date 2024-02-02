const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide a name'],
        minlength: 3,
        maxlength:50
    }, 
    email: {
        type: String,
        required: [true, 'please provide an email'],
        minlength:6,
        maxlength: 100, 
        validate: {
            validator: validator.isEmail,
            message: "please provide an email"
        }
        
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
});

User.pre('save', async function() {
    if (!this.isModified('password')){
        return;
    }
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

User.methods.comparePassword = async function (password) {
   
    return await bcrypt.compare(password, this.password);
}


module.exports = mongoose.model('User', User);