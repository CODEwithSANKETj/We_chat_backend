const express = require('express');
const { Protectmessage } = require('../Middlewares/Protectmessage');
const { send_friend_request_controller, accept_friend_request_controller } = require('../controllers/send_friend_request_controller');
const Add_friend_route = express.Router()

Add_friend_route.post('/addfriend/:id',Protectmessage,send_friend_request_controller
)
Add_friend_route.post('/acceptfriend/:id',Protectmessage,accept_friend_request_controller)

module.exports={

    Add_friend_route
}