const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
   audioTrack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Audio', 
        required: true,
        index: true 
    }
}, {
    collection: 'comments',
    timestamps: true, 
    read: 'nearest',
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000,
    },
});

module.exports = mongoose.model('Comment', commentSchema);