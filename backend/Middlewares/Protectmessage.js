const jwt = require('jsonwebtoken')
const { user_model } = require('../models/user_models')
require('dotenv').config()
const Protectmessage=async(req,res,next)=>{
    const token = req.cookies?.jwt
try {
    if(!token){
        return res.status(400).send({msg:'User not Authenticate no token detected'})
    }
    const result = jwt.verify(token,process.env.tokenkey)
    if(!result||result==false){
        return res.status(400).send({msg:'User not Authenticate invalid token passed'})
    }
    //find the user from where the message is cooming
    const finduser = await user_model.findById(result.userid).select('-password')
    if(!finduser){
        return res.status(400).send({msg:'User not found'})
    }
    req.user = finduser
    next()


} catch (err) {
    return res.status(400).send({msg:err})
}


}

module.exports={
    Protectmessage
}