const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PersonSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:6
    }
})

module.exports = Person = mongoose.model("people",PersonSchema);