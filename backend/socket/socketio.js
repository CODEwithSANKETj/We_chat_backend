const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const getReciverSocketid =(reciverid)=>{
    return userSocketmap[reciverid]
}
const userSocketmap={} // {userid : socketid}to chk if user online or not

io.on('connection',(socket)=>{
    console.log('User connected',socket.id);
    const userid = socket.handshake.query.userid
    if(userid!='undefined') userSocketmap[userid]=socket.id
    //emit a message to all user that this user is online
    io.emit('notifyallusers',Object.keys(userSocketmap))

    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id);
        delete userSocketmap[userid]
        io.emit('notifyallusers',Object.keys(userSocketmap))
    })
})
module.exports = { app, server, io,getReciverSocketid };
