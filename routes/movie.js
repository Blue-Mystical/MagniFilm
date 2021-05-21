const { request } = require('http');

var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    User = require('../models/user'),
    helper = require('../helper'),
    // The entire uploading system
    multer = require('multer'),
    path = require('path'),
    storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './public/uploads');
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

    Movie = require('../models/movie');

router.get('/', function(req,res) {
    Movie.find({}, function(err,Movall) {
        if (err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('movief/movies.ejs', {movielist : Movall, helper : helper})
        }
    });
});

router.get('/add', middleware.checkManager, function(req,res) {
    res.render('movief/addmovie.ejs');
});

// Movie Page
router.get('/:id', function(req,res) {
    if (req.params.id != 'add') { // suppress error when accessing the add page
        Movie.findById(req.params.id).populate('review').exec(function(err, foundMovie) {
            if(err){
                middleware.displayGenericError(req, err);
                res.redirect('back');
            } else {
                res.render("movief/movieinfo.ejs", {movie: foundMovie, helper : helper});
            }
        });
    }
});

// Trailer Page
router.get('/:id/trailer', function(req,res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('movief/trailer.ejs', {movie: foundMovie, helper : helper});
        }
    });
});

// Add Movie
router.post('/', middleware.checkManager, upload.single('image'), function(req,res) {
    if (req.body.action === 'addmovie') {
        if (req.file) {
            req.body.movie.image = '/uploads/' + req.file.filename;
        }

        req.body.movie.addedby = {
            id: req.user._id,
            username: req.user.username
        };

        req.body.movie.reviewcount = 0;
        req.body.movie.sumrating = 0;
        req.body.movie.avgrating = -1; // No one rated yet
        req.body.movie.likecount = 0;
        
        Movie.create(req.body.movie, function(err, newMovie) {
            if(err){
                middleware.displayGenericError(req, err);
                res.redirect('back');
            } else {
                res.redirect('/movies');
            }
        });
    }
});

// Edit movie
router.get('/:id/edit', middleware.checkManager, function(req, res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('movief/editmovie.ejs', {movie: foundMovie, helper : helper});
        }
    });
});

router.put('/:id', middleware.checkManager, upload.single('image'), function(req, res) {
    if (req.file) {
        req.body.movie.image = '/uploads/' + req.file.filename;
    }
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedMovie) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('/movies');
        } else {
            res.redirect('/movies/' + req.params.id);
        }
    });
});

// Delete movie
router.delete('/:id', middleware.checkManager, function(req, res) {
    Movie.findByIdAndDelete(req.params.id, function(err) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('/movies');
        } else {
            res.redirect('/movies');
        }
    });
});

// Like or unlike movie
router.post('/:id', middleware.isLoggedIn, function(req,res) {
    if (req.body.action === 'like') {
        User.findById(req.user._id, function(err, foundUser) {
            if (err) {
                middleware.displayGenericError(req, err);
                res.redirect('/movies');
            } else {
                var refMovie = req.params.id;
                foundUser.likedMovie.push(refMovie);
                foundUser.save();
                Movie.findById(req.params.id, function(err, foundMovie) {
                    if (err) {
                        middleware.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        var newcount = foundMovie.likecount + 1;
                        Movie.findByIdAndUpdate(req.params.id, {likecount : newcount}, function(err, foundmovie2) {
                            if (err) {
                                middleware.displayGenericError(req, err);
                                res.redirect('back');
                            } else {
                                res.redirect('/movies/' + req.params.id);    
                            }
                        });
                    }
                });
            }
        });
    }

    if (req.body.action === 'unlike') {
        User.findById(req.user._id, function(err, foundUser) {
            if (err) {
                middleware.displayGenericError(req, err);
                res.redirect('back');
            } else {
                foundUser.pull
                Movie.findById(req.params.id, function(err, foundMovie) {
                    if (err) {
                        middleware.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        var refMovie = req.params.id;
                        foundUser.likedMovie.pull(refMovie); // DELETE
                        foundUser.save();
                        var newcount = foundMovie.likecount - 1;
                        Movie.findByIdAndUpdate(req.params.id, {likecount : newcount}, function(err, foundmovie2) {
                            if (err) {
                                middleware.displayGenericError(req, err);
                                res.redirect('back');
                            } else {
                            //  console.log("Updated User : ", foundmovie2);
                                res.redirect('/movies/' + req.params.id);    
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;