const mongoose = require('mongoose')
const message_schema = new mongoose.Schema({
    senderid:{type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
    },
    reciverid:{type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    }

},{timestamps:true})
const message_model = mongoose.model('Message',message_schema)

module.exports = {
    message_model
}