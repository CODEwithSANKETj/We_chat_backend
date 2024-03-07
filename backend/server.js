const express = require('express');
const cookie_parser = require('cookie-parser')
const { Auth_Route } = require('./Routes/Auth_route');
const { connection } = require('./db/Connection');
require('dotenv').config();

const cors = require('cors');
const { Message_Route } = require('./Routes/Message_route');
const { UserRoutes } = require('./Routes/User_routes');
const { Add_friend_route } = require('./Routes/Add_Friend_route');
const { app, server } = require('./socket/socketio');
const PORT = process.env.PORT||5000
app.use(express.json())
app.use(cookie_parser())
app.use(cors({
   origin:'http://localhost:5173',
    credentials: true // Allow credentials (cookies) to be included in cross-origin requests
  }));
app.get('/',(req,res)=>{
    res.send('hello this is wechat backed')
})

app.use('/api/auth',Auth_Route)
app.use('/api/message',Message_Route)
app.use('/api/user',UserRoutes)
app.use('/api/managefriend',Add_friend_route)
server.listen(PORT,()=>{
    console.log('server is running',PORT);
})

module.exports = {
    express
}
