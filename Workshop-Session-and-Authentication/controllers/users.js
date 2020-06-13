const User = require('../models/user');
const privateData = require('../private');
const bscrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function addUser(req, res) {
    const { username, password } = req.body;
    
    const salt = bscrypt.genSaltSync(10);
    const hashPassword = bscrypt.hashSync(password, salt);
    
    const user = new User({ username, password: hashPassword });
    const userData = await user.save();
    
    const privateKey = privateData.privateKey;
    const token = jwt.sign({
        iserID: userData._id,
        username: userData.username
    }, privateKey);
    res.cookie('token', token);

    res.redirect('/');
}

module.exports = {
    addUser
}