const express = require('express')
const { login, logout, signup } = require('../controllers/Auth_controller')
const Auth_Route = express.Router()
Auth_Route.post('/signup',signup)
Auth_Route.post('/login',login)
Auth_Route.get('/logout',logout)



module.exports = {
    Auth_Route
}