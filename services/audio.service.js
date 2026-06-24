const AudioModel = require('../models/audio');
const UserModel = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const ALLOWED_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads'); 

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

module.exports = {
   
    upload: async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
            if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
                return res.status(400).json({ message: 'Only audio files are allowed' });
            }

            const { title, description} = req.body;
            if (!title) return res.status(400).json({ message: 'Title is required' });

            const id = new mongoose.Types.ObjectId();
            const extension = path.extname(req.file.originalname) || '.mp3';
            const finalPath = path.join(UPLOAD_DIR, `${id}${extension}`);

            fs.writeFileSync(finalPath, req.file.buffer);
            console.log("audio upload req "+ req);

            const audio = new AudioModel({
                _id: id,
                title,
                description: description || '',
                fileName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: finalPath,
                uploadedBy: req.user._id,
                likesCount: 0
            });

            const savedAudio = await audio.save();
            res.status(201).json(savedAudio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

   
    getById: async (req, res) => {
        try {
            const file = await AudioModel.findById(req.params.fileId).populate('uploadedBy', 'username');
            if (!file) return res.status(404).json({ message: 'Audio track not found' });
            
            res.json(file);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    download: async (req, res) => {
        try {
            const file = await AudioModel.findById(req.params.fileId);
            if (!file || !fs.existsSync(file.path)) {
                return res.status(404).json({ message: 'File not found on server' });
            }

            res.set({
                'Content-Type': file.mimetype,
                'Content-Disposition': 'attachment; filename=' + encodeURIComponent(file.fileName),
            });
            fs.createReadStream(file.path).pipe(res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

   
    // search: async (req, res) => {

    //    try {
    //     const { title, page = 1, size = 10 } = req.query;
    //     const filter = {};
    //     if (title) filter.title = { $regex: title, $options: 'i' };

    //     const audios = await AudioModel.find(filter)
    //         .select('-path -__v') 
    //         .populate('uploadedBy', 'username') 
    //         .sort({ createdAt: -1 })
    //         .skip((page - 1) * size)
    //         .limit(Number(size))
    //         .lean();

    //     const total = await AudioModel.countDocuments(filter);

    //     res.json({
    //         data: audios,
    //         page: Number(page),
    //         size: Number(size),
    //         total,
    //         totalPages: Math.ceil(total / size),
    //     });
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },

    ///////// es gavasworo
    search: async (req, res) => {
    // try {
    //         const { title, uploadedBy, page = 1, size = 10 } = req.query;
    //         const filter = {};

    //         if (title) {
    //             filter.title = { $regex: title, $options: 'i' };
    //         }

    //         if (uploadedBy) {
    //             // 1. Check if the value provided is a valid 24-char hex ObjectId
    //             const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(uploadedBy);

    //             if (isValidObjectId) {
    //                 filter.uploadedBy = uploadedBy;
    //             } else {
    //                 // 2. If it's a raw username (like "ani"), find that user first
    //                 const user = await UserModel.findOne({ username: uploadedBy });
                    
    //                 if (user) {
    //                     filter.uploadedBy = user._id; // Swap the text name for their real ID!
    //                 } else {
    //                     // If the username doesn't exist, force an empty result safely
    //                     return res.json({ data: [], page: Number(page), size: Number(size), total: 0, totalPages: 0 });
    //                 }
    //             }
    //         }

    //         // 3. Execute the final search query
    //         const audios = await AudioModel.find(filter)
    //             .select('-path -__v') 
    //             .populate('uploadedBy', 'username') 
    //             .sort({ createdAt: -1 })
    //             .skip((page - 1) * size)
    //             .limit(Number(size))
    //             .lean();

    //         const total = await AudioModel.countDocuments(filter);

    //         res.json({
    //             data: audios,
    //             page: Number(page),
    //             size: Number(size),
    //             total,
    //             totalPages: Math.ceil(total / size),
    //         });
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }

    try {
        const { title, uploadedBy, page = 1, size = 10 } = req.query;
        const filter = {};

        // 1. Filter by track title (case-insensitive fuzzy search)
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        // 2. Filter by uploader name (case-insensitive fuzzy search)
        if (uploadedBy) {
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(uploadedBy);

            if (isValidObjectId) {
                // If it's a direct ID, keep using exact matching
                filter.uploadedBy = uploadedBy;
            } else {
                // Find ALL users whose usernames partially match the query string
                const matchingUsers = await UserModel.find({ 
                    username: { $regex: uploadedBy, $options: 'i' } 
                }).select('_id').lean();

                if (matchingUsers.length > 0) {
                    // Map the user objects down to an array of just their raw ObjectIds
                    // Example: [6a3b..., 6a3c...]
                    const userIds = matchingUsers.map(user => user._id);
                    
                    // Tell MongoDB to find tracks uploaded by ANY of these users
                    filter.uploadedBy = { $in: userIds };
                } else {
                    // If no user matches the name search, return an empty pagination envelope safely
                    return res.json({ data: [], page: Number(page), size: Number(size), total: 0, totalPages: 0 });
                }
            }
        }

        // 3. Execute the final aggregated search query
        const audios = await AudioModel.find(filter)
            .select('-path -__v') 
            .populate('uploadedBy', 'username') 
            .sort({ createdAt: -1 })
            .skip((page - 1) * size)
            .limit(Number(size))
            .lean();

        const total = await AudioModel.countDocuments(filter);

        res.json({
            data: audios,
            page: Number(page),
            size: Number(size),
            total,
            totalPages: Math.ceil(total / size),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},


    update: async (req, res) => {
        try {
            const track = req.track; 
            const { title, description } = req.body;

            track.title = title ?? track.title;
            track.description = description ?? track.description;
            
            const updatedAudio = await track.save();
            res.json({ message: 'Track updated successfully', data: updatedAudio });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

  
   delete: async (req, res) => {
        try {
            const track = req.track; 

            if (fs.existsSync(track.path)) {
                fs.unlinkSync(track.path); 
            }
            
            await track.deleteOne(); 

            res.status(204).send(); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


     getMine: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const size = Number(req.query.size) || 10;
            const filter = { uploadedBy: req.user._id };

            const audios = await AudioModel.find(filter)
                .select('-path -__v')             
                .populate('uploadedBy', 'username') 
                .sort({ createdAt: -1 })
                .skip((page - 1) * size)
                .limit(size)
                .lean();

            const total = await AudioModel.countDocuments(filter);

            res.json({
                data: audios,
                page,
                size,
                total,
                totalPages: Math.ceil(total / size),
            });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
    

        like: async (req, res) => {
            try {
                const audio = await AudioModel.findOne({ _id: req.params.id, deletedAt: null });
                if (!audio) return res.status(404).json({ message: 'Audio track not found' });
    
                const alreadyLiked = audio.likes.some((id) => id.toString() === req.user._id.toString());
                if (alreadyLiked) {
                    return res.status(409).json({ message: 'Already liked' });
                }
    
                audio.likes.push(req.user._id);
                await audio.save();
    
                res.json({ success: true, likesCount: audio.likes.length });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
    
  
        unlike: async (req, res) => {
            try {
                const audio = await audioModel.findOne({ _id: req.params.id, deletedAt: null });
                if (!audio) return res.status(404).json({ message: 'Audio track not found' });
    
                audio.likes = audio.likes.filter((id) => id.toString() !== req.user._id.toString());
                await audio.save();
    
                res.json({ success: true, likesCount: audio.likes.length });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
    

        likesCount: async (req, res) => {
            // try {
            //     const audio = await AudioModel.findOne({ _id: req.params.id, deletedAt: null }).select('likes');
            //     if (!audio) return res.status(404).json({ message: 'Audio track not found' });
    
            //     res.json({ likesCount: audio.likes.length });
            // } catch (error) {
            //     res.status(500).json({ error: error.message });
            // }
            try {
                const trackId = req.params.id;

                // 🚀 High-Performance Projection:
                // We look up the track, but tell MongoDB to only return the length of the likes array.
                // This avoids pulling a massive list of User ObjectIds into your Node.js application memory.
                const trackData = await AudioModel.findById(trackId)
                    .select({ 
                        likesCount: { $size: "$likes" } 
                    })
                    .lean();

                if (!trackData) {
                    return res.status(404).json({ message: 'Audio track not found' });
                }

                res.json({
                    audioId: trackId,
                    likesCount: trackData.likesCount || 0
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
};