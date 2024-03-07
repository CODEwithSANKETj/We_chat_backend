const { user_model } = require("../models/user_models")

const Getuser_controller=async(req,res)=>{
    const loggedInUserId = req.user._id;
    
    try {
        // Find the user document based on the logged-in user's ID
        const user = await user_model.findById(loggedInUserId);
        if (!user) {
            return res.status(404).send({ msg: 'User not found' });
        }
        
        // Populate the friends array with more information of each friend from the User model
        await user.populate({
            path: 'friends.friendId',
            select: {
                password:0,
                pendingRequests:0,
                friends:0,
            } // Exclude the 'password' field from the populated documents
        });

        // Retrieve the populated friends array
        const friends = user.friends;
        
        res.status(200).send({ friends: friends });

    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
}

const Getall_controller_all = async(req,res)=>{
    const loggedInUserId = req.user._id;
    const searchText = req.query.search;
    
    try {
        const results = await user_model.aggregate([
            {
                $match: {
                    fullname: { $regex: searchText, $options: "i" } // Search users based on the provided search term
                }
            },
            {
                $match: {
                    _id: { $ne: loggedInUserId } // Exclude documents where the _id field is equal to the logged-in user's ID
                }
            },
            {
                $project:{
                    password:0,
                    pendingRequests:0,
                    friends:0
                }
            }
        ]);
        res.status(200).send({ msg: results });
    } catch (error) {
        res.status(401).send({ msg: error });
    }
}
const Getall_pending_req=async(req,res)=>{
    const loggedInUserId = req.user._id;

    try {
        
        const user = await user_model.findById(loggedInUserId)
        if(!user){
           return res.status(401).send({msg:"No user found"})
        }
        await user.populate({
            path:'pendingRequests',
            select: {
                pendingRequests:0,
                password:0,
                friends:0,
            }
        })
        const total_pending = user.pendingRequests
        res.status(200).send({msg:total_pending})


    } catch (error) {
        res.status(401).send({msg:error})
    }
}


module.exports = {

    Getuser_controller,
    Getall_controller_all,
    Getall_pending_req
}