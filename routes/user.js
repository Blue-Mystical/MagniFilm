var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    plugin = require('../plugin'),
    User = require('../models/user'),
    Review = require('../models/review'),
    Movie = require('../models/movie'),
    helper = require('../helper'),
    // The entire uploading system
    multer = require('multer'),
    path = require('path'),
    storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './public/avatars');
        },
        filename: function(req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    imageFilter = function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return callback(new Error('Only JPG, JPEG, PNG and GIF image files are allowed.'), false);
        }
        callback(null, true);
    },
    upload = multer({storage: storage, fileFilter: imageFilter}),
    // END
    passport = require('passport');

// User pages
router.get('/user', middleware.isLoggedIn, function(req,res) {
    helper.navactive = 0;
    User.findById(req.user._id, function(err, foundUser) {
        if (err) return plugin.returnGenericError(req, res, err);
        if (foundUser) {
            res.render('userf/user.ejs', {title : 'Your Profile', helper : helper, user: foundUser});
        } else {
            res.render("notfound.ejs", {helper : helper});
        }
    });
});

router.get('/user/history', middleware.isLoggedIn, function(req,res) {
    helper.navactive = 0;
    User.findById(req.user._id, function(err, foundUser) {
        if (err) return plugin.returnGenericError(req, res, err);
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
            foundUser.movieHistory.forEach(function(movie) {
                matchingArray.push(movie.id)
            });
            Movie.paginate({ 
                _id: { "$in": matchingArray } 
            }, queryOptions, function (err, movieDoc) {
                if (err) return plugin.returnGenericError(req, res, err);
                var movielist = movieDoc.docs;
                movieDoc.docs = [];
                res.render('userf/userquery.ejs', {title : 'Your Visited Movies', helper : helper, user: foundUser, doc : movieDoc, 
                 movielist : movielist, noresult : 'No movies found'});
            });

        } else {
            res.render("notfound.ejs", {helper : helper});
        }
    });
});

router.get('/user/liked', middleware.isLoggedIn, function(req,res) {
    helper.navactive = 0;
    User.findById(req.user._id, function(err, foundUser) {
        if (err) return plugin.returnGenericError(req, res, err);
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
            foundUser.likedMovie.forEach(function(movie) {
                matchingArray.push(movie)
            });
            Movie.paginate({ 
                _id: { "$in": matchingArray } 
            }, queryOptions, function (err, movieDoc) {
                if (err) return plugin.returnGenericError(req, res, err);
                var movielist = movieDoc.docs;
                movieDoc.docs = [];
                res.render('userf/userquery.ejs', {title : 'Your Liked Movies', helper : helper, user: foundUser, doc : movieDoc, 
                 movielist : movielist, noresult : 'No movies found'});
            });

        } else {
            res.render("notfound.ejs", {helper : helper});
        }
    });
});

router.get('/user/reviews', middleware.isLoggedIn, function(req,res) {
    helper.navactive = 0;
    User.findById(req.user._id, function(err, foundUser) {
        if (err) return plugin.returnGenericError(req, res, err);
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
            foundUser.reviewHistory.forEach(function(review) {
                matchingArray.push(review)
            });
            Review.paginate({ 
                _id: { "$in": matchingArray } 
            }, queryOptions, function (err, reviewDoc) {
                if (err) return plugin.returnGenericError(req, res, err);
                var reviewlist = reviewDoc.docs;
                reviewlist.docs = [];
                reviewlist.forEach(function(review) {
                    Movie.findById(review.formovie.id, function(err, foundMovie) {
                        if (err) return plugin.returnGenericError(req, res, err);
                        if (foundMovie) {
                            review.formovie.moviename = foundMovie.moviename; // Update movie name
                            review.save();
                        } else {
                            review.formovie.moviename = '[DELETED MOVIE]';
                            review.save();
                        }
                    });
                });
                res.render('userf/userreview.ejs', {title : 'Your Reviews', helper : helper, user: foundUser, doc : reviewDoc, reviewlist : reviewlist,
                 noresult : 'No reviews found'});
            });

        } else {
            res.render("notfound.ejs", {helper : helper});
        }
    });
});

router.get('/user/manage', middleware.checkManager, function(req,res) {
    helper.navactive = 0;
    var pagenumber = 1;
    if (req.query.page && !isNaN(req.query.page)) {
        pagenumber = req.query.page;
    } // querys: page, mode, sort, value, genre
    var sortOptions;
    var sortMode = 1;

    sortOptions = { name: sortMode }

    const queryOptions = {
        page: pagenumber,
        sort: sortOptions,
        limit: helper.queryLimit(),
        collation: {
          locale: 'en',
        },
    };
    var searchQuery = {};
    if (req.query.value) {
        searchQuery.username = {$regex : req.query.value, $options: "i"}; // case-insensitive search
    }
    if (req.query.role && req.query.role !== 'none') {
        searchQuery.role = req.query.role;
    }

    var extraQueries = plugin.buildQuery(req.query);
    
    User.paginate(searchQuery, queryOptions, function (err, userDoc) {
        if (err) return plugin.returnGenericError(req, res, err);
        var userlist = userDoc.docs;
        userDoc.docs = [];
        res.render('userf/managelist.ejs', {title : 'Manage Users', helper : helper, doc : userDoc, 
         userlist : userlist, search : req.query, extraqueries: extraQueries});
    });
});

// Edit user
router.get('/user/manage/:userid', middleware.checkAdmin, function(req, res) {
    helper.navactive = 0;
    User.findById(req.params.userid, function(err, foundUser) {
        if (err) return plugin.returnGenericError(req, res, err);
        if (foundUser) {
            res.render('userf/manageuser.ejs', {title : 'Manage ' + foundUser.username, helper : helper, user: foundUser});
        } else {
            return plugin.returnGenericError(req, res, err);
        }
    });
});
router.put('/user/manage/:userid', middleware.checkAdmin, function(req, res) {
    if (req.user._id.equals(req.params.userid)) {
        plugin.displayAccessDenied(req, 'You cannot change your own role.');
        return res.redirect('back');
    }
    User.findByIdAndUpdate(req.params.userid, req.body.user, function(err, updatedUser) {
        if (err) return plugin.returnGenericError(req, res, err);
        if (updatedUser) {
            plugin.displaySuccessMessage(req, 'Edited ' + updatedUser.username + '\'s role.');
            res.redirect('/user/manage/');
        } else {
            return plugin.returnGenericError(req, res, err);
        }
    });
});
router.delete('/user/manage/:userid', middleware.checkManager, function(req, res) {
    if (req.user._id.equals(req.params.userid)) {
        plugin.displayAccessDenied(req, 'You cannot delete your own account.');
        return res.redirect('back');
    }
    if (req.params.userid === 'admin') {
        plugin.displayAccessDenied(req, 'You cannot delete an another admin until changed to an other role.');
        return res.redirect('back');
    }
    User.findByIdAndDelete(req.params.userid, function(err) {
        if (err) return plugin.returnGenericError(req, res, err);
        plugin.displaySuccessMessage(req, 'Successfully removed an account. F.');
        res.redirect('/user/manage/');
    });
});

router.put('/user/avatar', upload.single('image'), function(req, res) {
    req.body.user = {
        avatar : undefined
    };
    if (req.file) {
        req.body.user.avatar = '/avatars/' + req.file.filename;
    } else {
        req.body.user.avatar = '/assets/unknownavatar.png';
    }

    User.findByIdAndUpdate(req.user._id, req.body.user, function(err, updatedUser) {
        if (err) plugin.returnGenericError(req, res, err);
        if (updatedUser) {
            plugin.displaySuccessMessage(req, 'Changed avatar.');
            res.redirect('/user/');
        } else {
            plugin.returnGenericError(req, res, err);
        }
    });
});

// Register
router.get('/register', function(req,res) {
    helper.navactive = 5;
    res.render('register.ejs', {title : 'Register to MagniFilm', helper : helper});
});

router.post('/register', function(req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email, 
    });
    var pw = req.body.password;
    var cfpw = req.body.confirmpassword;
    if (pw != cfpw) {
        req.flash('error', 'Password and confirm password do not match.')
        return res.render('register', {title : 'Register to MagniFilm', helper : helper});
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', 'Cannot register. Username maybe already exists')
            return res.render('register', {title : 'Register to MagniFilm', helper : helper});
        } 
        passport.authenticate('local')(req, res, function() {
            plugin.displaySuccessRegister(req);
            res.redirect('/');
        });
    });
});

// Login
router.get('/login', function(req,res) {
    helper.navactive = 4;
    res.render('login.ejs', {title : 'Login to MagniFilm', helper : helper});
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) return plugin.returnGenericError(req, res, err);
        if (!user) { 
            req.flash('error', 'Invalid username or password');
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) return plugin.returnGenericError(req, res, err);
            plugin.displaySuccessLogin(req, user.username);
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', function(req, res){
    helper.navactive = 0;
    req.logout();
    plugin.displaySuccessLogout(req);
    res.redirect('/movies');
});

module.exports = router;