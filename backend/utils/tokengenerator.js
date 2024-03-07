const jwt = require('jsonwebtoken');
require('dotenv').config();

const generatetoken = (userid, res) => {
    const token = jwt.sign({ userid: userid }, process.env.tokenkey, { expiresIn: '15d' });
    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,

        //httpOnly: true,
        domain: 'we-chat-backend-fkan.onrender.com', // Set the domain to localhost
        //path: '/', // Set the path to root
        sameSite: 'none',
        secure:true
    });
    //return token
}

module.exports = {
    generatetoken
}
