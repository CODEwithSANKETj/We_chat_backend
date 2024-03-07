const { user_model } = require("../models/user_models");
const { getReciverSocketid, io } = require("../socket/socketio");

const send_friend_request_controller =async(req,res)=>{
    const reciverid = req.params.id
    const senderid = req.user._id
    try {
        // Check if sender is trying to send a friend request to themselves
        if (senderid === reciverid) {
            return res.status(400).send({ msg: 'You cannot send a friend request to yourself' });
        }
        const reciver_exists = await user_model.findById(reciverid)
        
        if(!reciver_exists){
            return res.status(400).send({msg:'No such user exists'})
        }
        // Check if the sender is already friends with the receiver
        const already_friends = await user_model.findOne({ _id: senderid, 'friends.friendId': reciverid });
        if (already_friends) {
            return res.status(400).send({ msg: 'You are already friends with this user' });
        }
         // Check if the sender already sent a friend request to the receiver
         const isAlreadyRequested = await user_model.exists({ _id: reciverid, pendingRequests: senderid });
         if (isAlreadyRequested) {
             return res.status(400).send({ msg: 'You have already sent a friend request to this user' });
         }

          // If not already friends and request not sent, proceed to send the friend request
          await user_model.findByIdAndUpdate(reciverid, { $push: { pendingRequests: senderid } });
          const reciversocketid = getReciverSocketid(reciverid)
          if(reciversocketid){
            io.to(reciversocketid).emit('Request Recived')
          }
          res.status(200).send({ msg: "Request sent successfully" });

    } catch (error) {
        return res.status(400).send({msg:error})
    }
}
const accept_friend_request_controller = async (req, res) => {
    const receiverId = req.user._id; // Current user's ID
    const senderId = req.params.id; // ID of the user who sent the friend request

    try {
        // Check if the sender exists
        const senderExists = await user_model.findById(senderId);
        if (!senderExists) {
            return res.status(400).send({ msg: 'Sender does not exist' });
        }

        // Check if the current user (receiver) has a pending request from the sender
        const hasPendingRequest = await user_model.exists({ _id: receiverId, pendingRequests: senderId });
        if (!hasPendingRequest) {
            return res.status(400).send({ msg: 'No pending friend request from this user' });
        }

        // Remove the sender's ID from the receiver's pendingRequests array
        await user_model.findByIdAndUpdate(receiverId, { $pull: { pendingRequests: senderId } });

        // Add each other to friends list
        await user_model.findByIdAndUpdate(senderId, { $push: { friends: { friendId: receiverId } } });
        await user_model.findByIdAndUpdate(receiverId, { $push: { friends: { friendId: senderId } } });
        //Make a socket emit to tell sender that request is accepted//

        const sendersocketid = getReciverSocketid(senderId)
        if(sendersocketid){
            io.to(sendersocketid).emit('Request Accepted')
        }

        res.status(200).send({ msg: 'Friend request accepted successfully' });

    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

module.exports={
    send_friend_request_controller,
    accept_friend_request_controller
}