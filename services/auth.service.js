const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req, res) => {
        try {
            const body = req.body;
 
            if (!body.username || !body.password) {
                return res.status(400).json({
                    message: 'required params are missing'
                });
            }
 
            const exists = await UserModel.findOne({ username: body.username });
            if (exists) {
                return res.status(409).json({
                    message: 'such user already exists'
                });
            }
 
            const hashPassword = bcrypt.hashSync(body.password, 10);
 
            const savedUser = await new UserModel({
                username: body.username,
                password: hashPassword,
            }).save();
 
            const token = jwt.sign({
                _id: savedUser._id,
                username: savedUser.username,
            }, process.env.SECRET_KEY);
 
            res.header('x-session-token', token);
 
       
            const user = savedUser.toObject();
            delete user.password;
 
            res.json({ success: true, user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    login: async (req, res) => {
         try {
            const body = req.body;
 
            if (!body.username || !body.password) {
                return res.status(400).json({
                    message: 'required params are missing'
                });
            }
 
            const user = await UserModel.findOne({
                username: body.username
            });
 
            // same status for "no such user" and "wrong password" so we don't
            // leak which case it is, but 401 is the semantically correct code
            // for both (the request just isn't authorized)
            if (!user || !bcrypt.compareSync(body.password, user.password)) {
                return res.status(401).json({
                    message: 'invalid username or password'
                });
            }
 
            const token = jwt.sign({
                _id: user._id,
                username: user.username,
            }, process.env.SECRET_KEY);
 
            res.header('x-session-token', token);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}