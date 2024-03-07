const { timeStamp } = require('console')
const mongoose = require('mongoose')
const friends_schema = new mongoose.Schema({
    friendId:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    }
})
const user_schema = new mongoose.Schema({
    fullname:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,minlength:6,required:true},
    gender:{type:String,required:true,enum:['male','female']},
    profilePic:{
        type:String,
        default:''
    },
    friends:[friends_schema],
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array to store pending friend request
    
},{timestamps:true})



const user_model = mongoose.model('User',user_schema)
module.exports = {
    user_model
}

