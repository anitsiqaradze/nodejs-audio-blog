const express = require('express');
const router = express.Router({ mergeParams: true });
const CommentService = require('../services/comment.service');
const { requireLogin } = require('../middleware/apiSecurity');

// GET /:audioId/
router.get('/:audioId/', (req, res, next) => {
    /* #swagger.tags = ['comment'] 
       #swagger.description = 'Fetch a paginated list of comments for a specific post.' */
    CommentService.getAllForAudio(req, res, next);
});

// POST /:audioId/
router.post('/:audioId/', requireLogin, (req, res, next) => {
  /* #swagger.tags = ['comment']
        #swagger.description = 'Add a new comment to a specific post.'
        
     
    */
    CommentService.add(req, res, next);
});

// PUT /posts/:postId/comments/:commentId
router.put('/:commentId', requireLogin, (req, res, next) => {
    /* #swagger.tags = ['comment'] 
       #swagger.description = 'Update a comment text string. Restorations restricted to account comment owners.' */
    CommentService.update(req, res);
});

// DELETE /posts/:postId/comments/:commentId
router.delete('/:commentId', requireLogin, (req, res) => {
    /* #swagger.tags = ['comment'] 
       #swagger.description = 'Wipe out a comment record. Restorations restricted to account comment owners.' */
    CommentService.deleteOne(req, res, next);
});

module.exports = router;