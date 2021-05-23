var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    User = require('../models/user'),
    helper = require('../helper'),
    passport = require('passport');

// User pages
router.get('/user', middleware.isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, foundUser) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('userf/user.ejs', {user: foundUser, helper : helper});
        }
    });
});

router.get('/user/history', middleware.isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, foundUser) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('userf/history.ejs', {user: foundUser, helper : helper});
        }
    });
});

// Register
router.get('/register', function(req,res) {
    res.render('register.ejs');
});

router.post('/register', function(req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email, 
        role: 'member'
    });
    var pw = req.body.password;
    var cfpw = req.body.confirmpassword;
    if (pw != cfpw) {
        req.flash('error', 'Password and confirm password do not match.')
        return res.render('register');
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', 'Cannot register. Username maybe already exists')
            return res.render('register');
        } 
        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
});

// Login
router.get('/login', function(req,res) {
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res) {
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/movies');
});

module.exports = router;