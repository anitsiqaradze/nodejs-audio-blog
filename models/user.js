const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: [true, 'User Name is required'], 
        unique: true,
        trim: true,
        minLength: 2,
        maxLength: 50, 
    },

    password: { 
        type: String, 
        required: [true, 'User Password is required'], 
        minLength: 6,
    },
  
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, {
    collection: 'users',
    timestamps: true,
    read: 'nearest',
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    }
    
});


userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const userId = this._id;

        const AudioModel = mongoose.model('Audio');
        const CommentModel = mongoose.model('Comment');

        console.log(`🧼 Cascading delete started for user: ${userId}`);

        await Promise.all([
            AudioModel.deleteMany({ uploadedBy: userId }), 
            CommentModel.deleteMany({ user: userId })     
        ]);

    
        next();
    } catch (error) {
        next(error);
    }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;