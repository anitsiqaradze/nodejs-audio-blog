var express = require('express');
var router = express.Router();

const UserService = require('../services/user.service')
const ApiSecurity = require('../middleware/apiSecurity')

// GET /user/:id/
router.get('/:id', (req, res, next) => {
     /* swagger.tags = ['user'] 
        swagger.summary = 'Get user by Id'

     */
    UserService.getById(req, res, next);
});

// DELETE /user/:id/
router.delete('/:id', ApiSecurity.requireLogin, (req, res, next) => {
      /* #swagger.tags = ['user'] */
     UserService.delete(req, res, next)

});

// PUT /user/:id/
router.put('/:id', ApiSecurity.requireLogin, (req, res, next)  => {
     /* #swagger.tags = ['user'] */
    UserService.update(req, res, next);
});


// GET /user/:id/followers
router.get('/:id/followers',  ApiSecurity.requireLogin, (req, res, next) => {
    /* swagger.tags = ['user']
       swagger.summary = 'Get user followers'
       swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
    */
    UserService.getFollowers(req, res, next);
});

// GET /user/:id/following
router.get('/:id/following', ApiSecurity.requireLogin, (req, res, next) => {
    /* #swagger.tags = ['user']
       #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
    */
    UserService.getFollowing(req, res, next);
});

router.post('/:id/follow', ApiSecurity.requireLogin, (req, res, next)=>{
     // #swagger.tags = ['user']
    UserService.follow;
});

router.post('/:id/unfollow', ApiSecurity.requireLogin, (req, res, next)=>{
     // #swagger.tags = ['user']
    UserService.unfollow;
});

module.exports = router;