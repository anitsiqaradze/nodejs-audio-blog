const fs = require('fs');
const dotenv = require('dotenv');
const configData = fs.readFileSync('.env');
const buf = Buffer.from(configData);
const config = dotenv.parse(buf);

const jwt = require('jsonwebtoken');
const AudioModel = require('../models/audio')

module.exports = {

  requireLogin: (req, res, next) => {
    jwt.verify(req.headers.authorization, config.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'invalid_session' })
      }
      req.user = decoded;
      next();
    });
  },

      isOwner: (req, res, next) => {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
        }

        const loggedInUserId = req.user._id.toString();
        const targetUserId = req.params.id;

        if (loggedInUserId !== targetUserId) {
            return res.status(403).json({ 
                message: 'Forbidden. You do not have permission to modify this profile.' 
            });
        }
        next();
    }



}