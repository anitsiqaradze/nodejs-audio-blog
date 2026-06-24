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

  requireAudioOwnership: async (req, res, next) => {
        try {
            const trackId = req.params.fileId;
            const loggedInUserId = req.user?._id;

            // 1. Fetch the target audio document
            const track = await Audio.findById(trackId);
            if (!track) {
                return res.status(404).json({ message: 'Audio track not found' });
            }

            // 2. Evaluate access privileges
            const isOwner = track.uploadedBy.toString() === loggedInUserId.toString();
            const isAdmin = req.user?.permits?.includes('admin');

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ 
                    message: 'invalid_access: You do not have permission to modify this track.' 
                });
            }

            // 3. Share the fetched document down the request pipeline!
            // This saves your controllers from having to run Audio.findById() again.
            req.track = track;
            
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
      }
  // requirePermits: function () {

  //   const permits = [];
  //   for (let i = 0, l = arguments.length; i < l; i++) {
  //     if (typeof arguments[i] == 'string') {
  //       permits.push(arguments[i]);                                                                                                               
  //     }
  //   }

  //   return (req, res, next) => {
  //     jwt.verify(req.headers.authorization, config.SECRET_KEY, (err, decoded) => {
  //       if (err) {
  //         return res.status(401).json({ message: 'invalid_session' })
  //       }
  //       req.user = decoded;

  //       for (const permit of permits) {
  //         if ((req.user.permits || []).indexOf(permit) > -1) {
  //           return next();
  //         }
  //       }
  //       return res.status(403).json({ message: 'invalid_access' })
  //     });

  //   }
  // }


}