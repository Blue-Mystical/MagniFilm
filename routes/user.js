var express = require('express'),
    router = express.Router({mergeParams: true}),
    User = require('../models/user'),
    passport = require('passport');

router.get('/register', function(req,res) {
    res.render('register.ejs');
});

router.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username}, {email: req.body.email}, {type: 'member'});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate('local')(req, res, function() {
            res.redirect('/movies');
        });
    });
});

router.get('/login', function(req,res) {
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/movies',
    failureRedirect: '/login'
}), function(req, res) {

});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/movies');
});

module.exports = router;