const express = require('express');
const passport = require('../../middlewares/passport');
const router = express.Router();
const path = require('path')
const authController = require('../../controllers/auth.controller');


router.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/login.html'));
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/loginError', successRedirect: '/home' }));
router.post('/register', passport.authenticate('signup', { failureRedirect: '/signupError', successRedirect: '/home' }));

router.post('/logout', authController.logout);


router.get('/logout', async (req, res) => {
    res.redirect('/')
});


module.exports = router;