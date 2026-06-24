const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    fileName: { type: String },   
    mimetype: { type: String},    
    size: { type: Number},   
    path:{type:String, required:true},      
    uploadedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              index: true,
    }, 
   
    likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [] 
} 


  
}, {
    collection: 'audios',
    timestamps: true,
    read: 'nearest',
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    },

    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


audioSchema.virtual('likesCount').get(function() {
    return this.likes ? this.likes.length : 0;
});



const AudioModel = mongoose.model('Audio', audioSchema);
module.exports = AudioModel;