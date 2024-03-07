const express = require('express')
const { sendmessage, getmessage } = require('../controllers/Message_controller')
const { Protectmessage } = require('../Middlewares/Protectmessage')
const Message_Route = express.Router()

Message_Route.post('/send/:id',Protectmessage,sendmessage)
Message_Route.get('/get/:id',Protectmessage,getmessage)


module.exports = {
    Message_Route
}