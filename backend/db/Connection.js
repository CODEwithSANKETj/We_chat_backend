const mongoose = require('mongoose')
require('dotenv').config()
const connection = mongoose.connect(process.env.mongoid)
if(connection){
    console.log('connected to db');
}
else{
    console.log('Unable to connect to db');
}

module.exports = {
    connection
}