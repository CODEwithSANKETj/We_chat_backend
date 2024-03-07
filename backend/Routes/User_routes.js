const express = require('express')
const { Protectmessage } = require('../Middlewares/Protectmessage')
const { Getuser_controller, Getall_controller_all, Getall_pending_req } = require('../controllers/Getuser_controller')
const UserRoutes = express.Router()

UserRoutes.get('/get',Protectmessage,Getuser_controller)
UserRoutes.get('/getall',Protectmessage,Getall_controller_all)
UserRoutes.get('/get_all_pending_req',Protectmessage,Getall_pending_req)

module.exports = {
    UserRoutes
}