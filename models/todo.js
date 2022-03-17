const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TodoSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    text:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})

module.exports = todo = mongoose.model('todos',TodoSchema);
