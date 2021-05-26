var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    plugin = require('../plugin'),
    User = require('../models/user'),
    Review = require('../models/review'),
    Movie = require('../models/movie'),
    helper = require('../helper'),
    passport = require('passport');

// User pages
router.get('/user', middleware.isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, foundUser) {
        if (err) {
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundUser) {
                res.render('userf/user.ejs', {user: foundUser, helper : helper});
            } else {
                res.render("notfound.ejs");
            }
        }
    });
});

router.get('/user/history', middleware.isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, foundUser) {
        if (err) {
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundUser) {

                var pagenumber = 1;
                if (req.query.page && !isNaN(req.query.page)) {
                    pagenumber = req.query.page;
                }
                const queryOptions = {
                    page: pagenumber,
                    sort: { airdate: -1 },
                    limit: helper.queryLimit(),
                    collation: {
                      locale: 'en',
                    },
                };
                var matchingArray = [];
                foundUser.movieHistory.forEach(movie => {
                    matchingArray.push(movie.id)
                });

                Movie.paginate({ 
                    _id: { "$in": matchingArray } 
                }, queryOptions, function (err, movieDoc) {
                    if (err) {
                        plugin.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        var movielist = movieDoc.docs;
                        movieDoc.docs = [];
                        res.render('userf/userquery.ejs', {user: foundUser, helper : helper, doc : movieDoc, 
                         movielist : movielist, title : 'Your visited movies', noresult : 'No movies found'});
                    }
                });
 
            } else {
                res.render("notfound.ejs");
            }
        }
    });
});

router.get('/user/liked', middleware.isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, foundUser) {
        if (err) {
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundUser) {

                var pagenumber = 1;
                if (req.query.page && !isNaN(req.query.page)) {
                    pagenumber = req.query.page;
                }
                const queryOptions = {
                    page: pagenumber,
                    sort: { airdate: -1 },
                    limit: helper.queryLimit(),
                    collation: {
                      locale: 'en',
                    },
                };
                var matchingArray = [];
                foundUser.likedMovie.forEach(movie => {
                    matchingArray.push(movie)
                });

                Movie.paginate({ 
                    _id: { "$in": matchingArray } 
                }, queryOptions, function (err, movieDoc) {
                    if (err) {
                        plugin.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        var movielist = movieDoc.docs;
                        movieDoc.docs = [];
                        res.render('userf/userquery.ejs', {user: foundUser, helper : helper, doc : movieDoc, 
                         movielist : movielist, title : 'Your liked movies', noresult : 'No movies found'});
                    }
                });
 
            } else {
                res.render("notfound.ejs");
            }
        }
    });
});

router.get('/user/reviews', middleware.isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, foundUser) {
        if (err) {
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundUser) {

                var pagenumber = 1;
                if (req.query.page && !isNaN(req.query.page)) {
                    pagenumber = req.query.page;
                }
                const queryOptions = {
                    page: pagenumber,
                    sort: { reviewdate: -1 },
                    limit: helper.queryLimit(),
                    collation: {
                      locale: 'en',
                    },
                };
                var matchingArray = [];
                foundUser.reviewHistory.forEach(review => {
                    matchingArray.push(review)
                });

                Review.paginate({ 
                    _id: { "$in": matchingArray } 
                }, queryOptions, function (err, reviewDoc) {
                    if (err) {
                        plugin.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        var reviewlist = reviewDoc.docs;
                        reviewlist.docs = [];
                        reviewlist.forEach(review => {
                            Movie.findById(review.formovie.id, function(err, foundMovie) {
                                if (err) {
                                    plugin.displayGenericError(req, err);
                                    res.redirect('/movies');
                                } else {
                                    if (foundMovie) {
                                        review.formovie.moviename = foundMovie.moviename;
                                        review.save();
                                    } else {
                                        review.formovie.moviename = '[DELETED MOVIE]';
                                        review.save();
                                    }
                                }
                            });
                        });
                        res.render('userf/userreview.ejs', {user: foundUser, helper : helper, doc : reviewDoc, reviewlist : reviewlist,
                        title : 'Your reviews', noresult : 'No reviews found'});
                    }
                });
 
            } else {
                res.render("notfound.ejs");
            }
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
            plugin.displaySuccessRegister(req);
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
    failureFlash: true,
}), function(req, res) {
    console.log('run');
}); 

router.get('/logout', function(req, res){
    req.logout();
    plugin.displaySuccessLogout(req);
    res.redirect('/movies');
});

module.exports = router;