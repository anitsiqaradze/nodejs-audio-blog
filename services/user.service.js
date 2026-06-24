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
 
    
    // getOne: async (req, res) => {
    //     try {
    //         const item = await UserModel.findById(req.params.id).select('-password');
    //         if (!item) return res.status(404).json({ message: 'User not found' });
    //         res.json(item);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
    getById: async (req, res) => {
        try {
            const userId = req.params.id;

            // 1. FAST GUARD RAIL: Instantly validate the parameter format
            // if (!mongoose.Types.ObjectId.isValid(userId)) {
            //     return res.status(400).json({ 
            //         message: `Invalid ID format. Expected a 24-character hex ObjectId, received: "${userId}"` 
            //     });
            // }

            // 2. Execute database lookup using .lean() for maximum read performance
            const item = await UserModel.findById(userId)
               // .select('-password')
               // .lean(); // 🚀 High performance optimization: returns a plain JS object, bypassing heavy Mongoose tracking mechanisms

            if (!item) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
 

    delete: async (req, res) => {
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

        
            const targetUser = await User.findByIdAndUpdate(targetUserId, 
                { $addToSet: { followers: actorUserId } }
            );
            
            if (!targetUser) return res.status(404).json({ message: "User not found" });

            await User.findByIdAndUpdate(actorUserId, 
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

            await User.findByIdAndUpdate(targetUserId, { $pull: { followers: actorUserId } });
            await User.findByIdAndUpdate(actorUserId, { $pull: { following: targetUserId } });

            res.json({ message: "Successfully unfollowed user" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    getFollowers: async (req, res) => {
        try {
            const targetUserId = req.params.id;

            // Find the user, select only the followers array, and populate it
            const userProfile = await User.findById(targetUserId)
                .select('followers') 
                .populate('followers', 'username avatarUrl bio') 
                .lean();

            if (!userProfile) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Return just the populated array to keep the payload clean
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

            // Find the user, select only the following array, and populate it
            const userProfile = await User.findById(targetUserId)
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