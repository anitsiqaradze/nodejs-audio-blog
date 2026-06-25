const CommentModel = require('../models/comment.js');
const AudioModel = require('../models/audio.js');

const isOwner = (comment, userId) => comment.commenter.toString() === userId.toString();

module.exports = {


    // GET /audio/:audioId/comments?page=&size=
    getAllForAudio: async (req, res) => {
        try {
            const { audioId } = req.params;
            const { page = 1, size = 20 } = req.query;

            const filter = { audioTrack: audioId };

            const comments = await CommentModel.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * size)
                .limit(Number(size))
                .populate('commenter', 'username')
                .lean();

            const total = await CommentModel.countDocuments(filter);

            res.json({
                data: comments,
                page: Number(page),
                size: Number(size),
                total,
                totalPages: Math.ceil(total / size),
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /audio/:audioId/comments
    add: async (req, res) => {
        try {
            const { audioId } = req.params;
            console.log(audioId);
            const { text } = req.body;

            if (!text || !text.trim()) {
                return res.status(400).json({ message: 'Comment text is required' });
            }

            const audio = await AudioModel.findOne({ _id: audioId, deletedAt: null });
            if (!audio) {
                return res.status(404).json({ message: 'Audio not found' });
            }

            const comment = await new CommentModel({
                text,
                audioTrack: audioId,
                commenter: req.user._id, 
            }).save();

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /posts/:postId/comments/:commentId
    update: async (req, res) => {
        try {
            const { commentId } = req.params;
            const { text } = req.body;

            if (!text || !text.trim()) {
                return res.status(400).json({ message: 'Comment text is required' });
            }

            const comment = await CommentModel.findById(commentId);
            if (!comment) return res.status(404).json({ message: 'Comment not found' });

            if (!isOwner(comment, req.user._id)) {
                return res.status(403).json({ message: 'You can only edit your own comments' });
            }

            comment.text = text;
            await comment.save();

            res.json(comment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /posts/:postId/comments/:commentId
    deleteOne: async (req, res) => {
        try {
            const { commentId } = req.params;

            const comment = await CommentModel.findById(commentId);
            if (!comment) return res.status(404).json({ message: 'Comment not found' });

            if (!isOwner(comment, req.user._id)) {
                return res.status(403).json({ message: 'You can only delete your own comments' });
            }

            await CommentModel.deleteOne({ _id: commentId });

            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};