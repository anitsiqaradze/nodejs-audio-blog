var express = require('express');
var router = express.Router({ mergeParams: true }); // needed to access :postId from the parent router

const CommentService = require('../services/comment.service');
const ApiSecurity = require('../middleware/apiSecurity');

router.get('/', ApiSecurity.requireLogin, CommentService.getAllForPost);
router.post('/', ApiSecurity.requireLogin, CommentService.add);
router.put('/:commentId', ApiSecurity.requireLogin, CommentService.update);
router.delete('/:commentId', ApiSecurity.requireLogin, CommentService.delete);

module.exports = router;