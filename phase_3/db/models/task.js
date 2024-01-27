const mongoose = require('mongoose');
const { Schema } = mongoose;

const task = new Schema({
  name:{type:String, required:true,trim:true, maxlength:20},
  completed:{type:Boolean,default:false},
});

// const Task = mongoose.model('Task', task);
module.exports = mongoose.model('Task', task);