const { emit } = require("process")
const { Conversation_model } = require("../models/convertation_model")
const { message_model } = require("../models/message_model")
const { user_model } = require("../models/user_models")
const { getReciverSocketid, io } = require("../socket/socketio")

const sendmessage=async(req,res)=>{
    const {message}=req.body
    const reciverid = req.params.id
    const senderid = req.user._id
   
    try {
        const reciverfound = await user_model.findById(reciverid)
        if(!reciverfound){
            return res.status(400).send({msg:'No reviver found '})
        }
        let Conversation = await Conversation_model.findOne({
            participants:{$all:[senderid,reciverid]}
        })

        if(!Conversation){

            Conversation = new Conversation_model({
                participants:[senderid,reciverid],
                messages:[]
            })
        //    await Conversation.save()
        }
        const newmessage = new message_model({
            senderid:senderid,
            reciverid:reciverid,
            message:message
        })
        
        Conversation.messages.push(newmessage._id)

        //using promice all the asych will be execute in parallel it dont have to wait
        await Promise.all([Conversation.save(),newmessage.save()])

        const reciversocketid = getReciverSocketid(reciverid)
        //if user online then emit msg to inform then 
        if(reciversocketid){
            io.to(reciversocketid).emit('newmessage',newmessage)
        }


        res.send({msg:newmessage,from_to:`${senderid} to ${reciverid}`})
        
        

    } catch (error) {
        res.status(400).send({msg:error})
    }

}
const getmessage = async(req,res)=>{
    const reciverid = req.params.id
    const senderid = req.user._id
    console.log(senderid,reciverid);
    try {

        const Conversation = await Conversation_model.findOne({
            participants:{$all:[senderid,reciverid]}
        }).populate('messages')
        if(!Conversation){
            return res.status(200).send({msg:[]})
        }
       return res.status(200).send({msg:Conversation.messages})
    } catch (error) {
        res.status(400).send({msg:error})
    }
}

module.exports = {
    sendmessage,
    getmessage
}