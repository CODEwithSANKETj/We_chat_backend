const mongoose = require('mongoose')
const Conversation_schema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message',
            default:[],
        }
    ]
},{timestamps:true})


const Conversation_model = mongoose.model('Conversation',Conversation_schema)

module.exports = {

    Conversation_model
}