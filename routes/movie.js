const { request } = require('http');

var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    plugin = require('../plugin'),
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

// Movie List
router.get('/', function(req,res) {
    var currentDate = new Date();
    currentDate = Date.parse(currentDate);
    var unairDate = currentDate - 1000 * 60 * 60 * 24 * 30; // assuming 30 days is how much a movie stopped airing
    var dateRange;

    if (req.query.type == 'cs') {
        dateRange = {
            $gt: currentDate,
        };
    } else {
        dateRange = {
            $gte: unairDate,
            $lte: currentDate
        };
    }
    Movie.find({ 
        airdate: dateRange
        }, function(err,Movall) {
        if (err){
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('movief/movies.ejs', {title : 'Movies', movielist : Movall, helper : helper})
        }
    });
});

// Moved up due to conflict
router.get('/add', middleware.checkManager, function(req,res) {
    var currentDate = new Date();
    currentDate = Date.parse(currentDate);
    res.render('movief/addmovie.ejs', {title : 'Adding Movie', helper : helper, currentDate : currentDate});
});

// Movie Page
router.get('/:id', function(req,res) {
    if (req.params.id != 'add') { // suppress error when accessing the add page
        Movie.findById(req.params.id, function(err, foundMovie) {
            if(err){
                plugin.displayGenericError(req, err);
                res.redirect('back');
            } else {
                if (foundMovie) {
                    // Add to history of user or change date
                    if( req.isAuthenticated() ){ 
                        var currentDate = new Date();
                        var foundflag = false;
                        req.user.movieHistory.forEach(function(movieelement) {                
                            if ( movieelement.id.equals(foundMovie._id) ) {
                                movieelement.date = currentDate;
                                foundflag = true;
                            }     
                        });  
                        if (foundflag === false) {
                            var newElement = {id: foundMovie._id, date: currentDate};
                            req.user.movieHistory.push(newElement);
                        }
                        req.user.save();
                    }

                    res.render("movief/movieinfo.ejs", {title : foundMovie.moviename, movie: foundMovie, helper : helper});
                } else {
                    res.render("notfound.ejs");
                }
            }
        });
    }
});

// Trailer Page
router.get('/:id/trailer', function(req,res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundMovie) {
                res.render('movief/trailer.ejs', {title : foundMovie.moviename + ' Trailer', movie: foundMovie, helper : helper});
            } else {
                res.render("notfound.ejs");
            }
        }
    });
});

// Add movie
router.post('/', middleware.checkManager, upload.single('image'), function(req,res) {
    if (req.file) {
        req.body.movie.image = '/uploads/' + req.file.filename;
    } else {
        req.body.movie.image = '/assets/blankmovie.png';
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
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            plugin.displaySuccessMessage(req, 'A movie ' + req.body.movie.moviename + ' has successfully been created.');
            res.redirect('/movies');
        }
    });
});

// Edit movie
router.get('/:id/edit', middleware.checkManager, function(req, res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundMovie) {
                res.render('movief/editmovie.ejs', {title : 'Editing ' + foundMovie.moviename, movie: foundMovie, helper : helper});
            } else {
                plugin.displayDeletedMovieError(req, err);
                res.redirect('back');
            }
        }
    });
});

router.put('/:id', middleware.checkManager, upload.single('image'), function(req, res) {
    if (req.file) {
        req.body.movie.image = '/uploads/' + req.file.filename;
    }
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedMovie) {
        if(err){
            plugin.displayGenericError(req, err);
            res.redirect('/movies');
        } else {
            if (updatedMovie) {
                plugin.displaySuccessMessage(req, 'Edited ' + req.body.movie.moviename + ' page.');
                res.redirect('/movies/' + req.params.id);
            } else {
                plugin.displayDeletedMovieError(req, err);
                res.redirect('back');
            }
        }
    });
});

// Delete movie
router.delete('/:id', middleware.checkManager, function(req, res) {
    Movie.findByIdAndDelete(req.params.id, function(err) {
        if(err){
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            plugin.displaySuccessMessage(req, 'Removed a movie.');
            res.redirect('/movies');
        }
    });
});

// Like or unlike movie
router.post('/:id', middleware.isLoggedIn, function(req,res) {
    if (req.body.action === 'like') {
        User.findById(req.user._id, function(err, foundUser) {
            if (err) {
                plugin.displayGenericError(req, err);
                res.redirect('/movies');
            } else {

                var refMovie = req.params.id;
                foundUser.likedMovie.push(refMovie);
                foundUser.save();
                Movie.findById(req.params.id, function(err, foundMovie) {
                    if (err) {
                        plugin.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        if (foundMovie) {
                            var newcount = foundMovie.likecount + 1;
                            Movie.findByIdAndUpdate(req.params.id, {likecount : newcount}, function(err, foundmovie2) {
                                if (err) {
                                    plugin.displayGenericError(req, err);
                                    res.redirect('back');
                                } else {
                                    res.redirect('/movies/' + req.params.id);    
                                }
                            });
                        } else {
                            plugin.displayDeletedMovieError(req, err);
                            res.redirect('back');
                        }
                    }
                });
            }
        });
    }

    if (req.body.action === 'unlike') {
        User.findById(req.user._id, function(err, foundUser) {
            if (err) {
                plugin.displayGenericError(req, err);
                res.redirect('back');
            } else {
                Movie.findById(req.params.id, function(err, foundMovie) {
                    if (err) {
                        plugin.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        if (foundMovie) {
                            var refMovie = req.params.id;
                            foundUser.likedMovie.pull(refMovie);
                            foundUser.save();
                            var newcount = foundMovie.likecount - 1;
                            Movie.findByIdAndUpdate(req.params.id, {likecount : newcount}, function(err, foundmovie2) {
                                if (err) {
                                    plugin.displayGenericError(req, err);
                                    res.redirect('back');
                                } else {
                                    res.redirect('/movies/' + req.params.id);    
                                }
                            });
                        } else {
                            plugin.displayDeletedMovieError(req, err);
                            res.redirect('back');
                        }
                    }
                });
            }
        });
    }
});

module.exports = router;