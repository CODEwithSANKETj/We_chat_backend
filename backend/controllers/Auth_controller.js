const { user_model } = require("../models/user_models")
const bcrypt = require('bcrypt');
const { generatetoken } = require("../utils/tokengenerator");
const { escape } = require("querystring");
const signup=async (req,res)=>{
    let {fullname,username,password,gender,profilePic} = req.body
    console.log(fullname,username,password,gender,profilePic);
    try {
        const already_user = await user_model.findOne({username})
        if(already_user){
            return res.status(400).send({msg:'User already exists'})
        }
        

        //put avatar profile ic if this feild is empty
        if(!profilePic){
            profilePic = `https://avatar.iran.liara.run/public/${gender=='male'?'boy':'girl'}?username=${username}`
        }
        //hashpassword 
        const hashpass = await  bcrypt.hash(password,5)
        const newuser = new  user_model({fullname,username,password:hashpass,gender,profilePic})
        await newuser.save()
        res.status(200).send({msg:'User Created Successfully'})
    } catch (error) {
       res.status(400).send({msg:error}) 
    }
}
const login=async(req,res)=>{
    let {username,password} = req.body
    try {
        const user_exists = await user_model.findOne({username})
        if(!user_exists){
            return res.status(400).send({msg:'User does not exists'})
        }
        bcrypt.compare(password, user_exists.password, function(err, result) {
            if(err){
                return res.status(400).send({msg:err})
            }
            if(!result){
                return res.status(400).send({msg:'Incorrect passowrd'})
            }
            generatetoken(user_exists._id,res)
            const modifiedUser = { ...user_exists._doc }
            delete modifiedUser.password
            delete modifiedUser.friends
            delete modifiedUser.pendingRequests
            res.status(200).send({msg:'User Loggedin',user:modifiedUser})

        });
    } catch (err) {
        res.status(400).send({msg:error}) 
    }
}
const logout=(req,res)=>{
    try {
        res.cookie('jwt','',{maxAge:0})
        res.status(200).send({msg:'Logout Successfull'})
        
    } catch (error) {
        res.status(400).send({msg:error}) 
    }
}

module.exports = {
    login,
    signup,logout
}