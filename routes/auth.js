var express = require('express');
var router = express.Router();
const AuthService = require('../services/auth.service');

// POST /auth/register
router.post('/register', (req, res, next) => {
    // #swagger.tags = ['auth']
    // #swagger.summary = 'Register a new user
    AuthService.register(req, res, next);
});

// POST /auth/login
router.post('/login', (req, res, next) => {
    // #swagger.tags = ['auth']
    // #swagger.summary = 'Log in a user'
    AuthService.login(req, res, next);
});

module.exports = router;