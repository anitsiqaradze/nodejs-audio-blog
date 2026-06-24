// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: { 
//         type: String,
//         required: [true, 'User Name is required'], 
//         unique: true,
//         trim: true,
//         minLength: 2,
//         maxLength: 50, 
//     },
//     // email: {
//     //     type: String,
//     //     required: [true, 'User Email is required'],
//     //     unique: true,
//     //     trim: true,
//     //     lowercase: true,
//     //     match: [/\S+@\S+\.\S+/, 'Please full a valid email address']
//     // },
//     password: { type: String, required: [true, 'User Password is required'], minLength:6 }
//    // permits: [{ type: String }]
// }, {
//     collection: 'users',
//     timestamps: true,
//     read: 'nearest',
//     writeConcern: {
//         w: 'majority',
//         j: true,
//         wtimeoutMS: 30000
//     }
// });

// const UserModel = mongoose.model('User', userSchema);
// module.exports = UserModel;

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
    // permits: {
    //     type: [String],
    //     default: ['listener'],
    //     enum: ['listener', 'creator', 'admin', 'moderator'] 
    // },
    
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;