const UserModel = require('../models/user');
const mongoose = require('mongoose');



module.exports = {


    getAll: async (req, res) => {
        try {
            const result = await UserModel.find({}).select('-password').lean();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
 
  
    getOne: async (req, res) => {
        try {
            const userId = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ 
                    message: `Invalid ID format. Expected a 24-character hex ObjectId, received: "${userId}"` 
                });
            }

            const item = await UserModel.findById(userId)
                .select('-password')
                .lean(); 

            if (!item) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteOne: async (req, res) => {
        try {
            await UserModel.deleteOne({ _id: req.params.id });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

 
    update: async (req, res) => {
        try {
            const updateData = { ...req.body };
 
            
            if (updateData.password) {
                updateData.password = bcrypt.hashSync(updateData.password, 10);
            }
 
            const item = await UserModel.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true, }
            ).select('-password');
 
            if (!item) return res.status(404).json({ message: 'User not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    follow: async (req, res) => {
        try {
            const targetUserId = req.params.id; 
            const actorUserId = req.user._id;    
            if (targetUserId === actorUserId.toString()) {
                return res.status(400).json({ message: "You cannot follow yourself" });
            }

        
            const targetUser = await UserModel.findByIdAndUpdate(targetUserId, 
                { $addToSet: { followers: actorUserId } }
            );
            
            if (!targetUser) return res.status(404).json({ message: "User not found" });

            await UserModel.findByIdAndUpdate(actorUserId, 
                { $addToSet: { following: targetUserId } }
            );

            res.json({ message: "Successfully followed user" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    unfollow: async (req, res) => {
        try {
            const targetUserId = req.params.id;
            const actorUserId = req.user._id;

            await UserModel.findByIdAndUpdate(targetUserId, { $pull: { followers: actorUserId } });
            await UserModel.findByIdAndUpdate(actorUserId, { $pull: { following: targetUserId } });

            res.json({ message: "Successfully unfollowed user" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    getFollowers: async (req, res) => {
        try {
            const targetUserId = req.params.id;

            const userProfile = await UserModel.findById(targetUserId)
                .select('followers') 
                .populate('followers', 'username avatarUrl bio') 
                .lean();

            if (!userProfile) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                data: userProfile.followers,
                count: userProfile.followers.length
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    
    getFollowing: async (req, res) => {
        try {
            const targetUserId = req.params.id;

            const userProfile = await UserModel.findById(targetUserId)
                .select('following')
                .populate('following', 'username avatarUrl bio')
                .lean();

            if (!userProfile) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                data: userProfile.following,
                count: userProfile.following.length
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}