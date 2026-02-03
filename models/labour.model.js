let mongoose = require('mongoose');
let labourschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone_number:{
        type:Number,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    exhibition:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Exhibition'
    }]
});
module.exports = mongoose.model('Labour', labourschema);