const mongoose = require('mongoose');   




const ProductModel = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please enter a name'],
        minlength: 3,
        maxlength: [100, 'name cant be more that 100 chars ']
    },
    price:{
        type: String,
        required: [true, 'please enter a price'],
        minlength: 3,
        maxlength: 100
    },
    description:{
        type: String,
        maxlength: 1000
    },
    image: {
        type: String,
        default: '/upload/example.jpeg'
    },
    category: {
        type: String,
        required: [true, 'please enter a category'],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
        type: String,
        required: [true, 'please enter a category'],
        enum: {values: ['ikea', 'liddy', 'marcos'], message: '{VALUE} is not supported'},
    },
    colors:{
        type: [String],
        required: [true, 'please enter a colors'],
    },
    featured: {
        type: Boolean,
        default: false
    }, 
    free_shipping: {
        type: Boolean,
        default: false
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    avg_rate: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps:true});


module.exports = mongoose.model('Product', ProductModel);