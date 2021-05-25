var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    helper = require('../helper'),
    // The entire uploading system
    multer = require('multer'),
    path = require('path'),
    storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './public/logos');
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
    Movie = require('../models/movie'),
    Logo = require('../models/logo'),
    Theatre = require('../models/theatre');

// Theatre list
router.get('/', function(req,res) {
    Theatre.find({}, function(err,Theatreall) {
        if (err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('theatref/theatres.ejs', {theatrelist : Theatreall, helper : helper})
        }
    });
});


router.get('/:id', function(req,res) {
    if (req.params.id != 'add') { // suppress error when accessing the add page
        Theatre.findById(req.params.id, function(err, foundTheatre) {
            if (err) {
                middleware.displayGenericError(req, err);
                res.redirect('back');
            } else {
                if (foundTheatre) {
                    res.render('theatref/theatreinfo.ejs', {theatre: foundTheatre, helper : helper});
                } else {
                    res.render("notfound.ejs");
                }
            }
        });
    }
});

router.get('/add', middleware.checkManager, function(req,res) {
    Logo.find({}, function(err,logos) {
        if (err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('theatref/addtheatre.ejs', {logos : logos});
        }
    });
});

router.post('/', middleware.checkManager, function(req,res) {
    req.body.theatre.addedby = {
        id: req.user._id,
        username: req.user.username
    };
    
    Logo.findById(req.body.iconid, function(err, foundLogo) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            req.body.theatre.icon = {
                id: req.body.iconid,
                image: foundLogo.image
            };
            // blank priority = high number
            if (!req.body.theatre.priority) {
                req.body.theatre.priority = 9999;
            }
            Theatre.create(req.body.theatre, function(err, newTheatre) {
                if(err){
                    middleware.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    console.log(newTheatre);
                    res.redirect('/theatres');
                }
            });
        }
    });
});

router.get('/logo/add', middleware.checkManager, function(req,res) {
    res.render('theatref/addlogo.ejs');
});

router.post('/logo', middleware.checkManager, upload.single('image'), function(req,res) {
    if (req.file) {
        req.body.logo.image = '/logos/' + req.file.filename;
    }
    if (!req.body.logo.priority) {
        req.body.logo.priority = 9999;
    }
    Logo.create(req.body.logo, function(err, newLogo) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.redirect('/theatres');
        }
    });
});

router.get('/:id/edit', middleware.checkManager, function(req, res) {
    Theatre.findById(req.params.id, function(err, foundTheatre) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundTheatre) {
                Logo.find({}, function(err,logos) {
                    if (err){
                        middleware.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        res.render('theatref/edittheatre.ejs', {theatre: foundTheatre, helper : helper, logos : logos});
                    }
                });
            } else {
                middleware.displayDeletedTheatreError(req, err);
                res.redirect('back');
            }
        }
    });
});

router.put('/:id', middleware.checkManager, function(req,res) {
    req.body.theatre.addedby = {
        id: req.user._id,
        username: req.user.username
    };
    
    Logo.findById(req.body.iconid, function(err, foundLogo) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            req.body.theatre.icon = {
                id: req.body.iconid,
                image: foundLogo.image
            };
            // blank priority = high number
            if (!req.body.theatre.priority) {
                req.body.theatre.priority = 9999;
            }
            Theatre.findByIdAndUpdate(req.params.id, req.body.theatre, function(err, updatedTheatre) {
                if(err){
                    middleware.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    if (updatedTheatre) {
                        middleware.displaySuccessMovie(req, 'Edited ' + req.body.theatre.theatrename + ' page.');
                        res.redirect('/theatres/' + req.params.id);
                    } else {
                        middleware.displayDeletedMovieError(req, err);
                        res.redirect('back');
                    }
                }
            });
        }
    });
});

router.delete('/:id', middleware.checkManager, function(req, res) {
    Theatre.findByIdAndDelete(req.params.id, function(err) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('/theatres');
        } else {
            middleware.displaySuccessMovie(req, 'Removed a theatre.');
            res.redirect('/theatres');
        }
    });
});

router.get('/:id/addmovie', middleware.checkManager, function(req,res) {
    var pagenumber = 1;
    if (req.query.page && !isNaN(req.query.page)) {
        pagenumber = req.query.page;
    } // querys: page, mode, sort, value, genre

    const queryOptions = {
        page: pagenumber,
        sort: {airdate : -1},
        limit: helper.queryLimit(),
        collation: {
          locale: 'en',
        },
    };
    var searchQuery;
    if (req.query.value)  {
        searchQuery = {
            moviename: {$regex : req.query.value, $options: "i"}, // case-insensitive search
        };
    } else {
        searchQuery = {};
    }

    Movie.paginate(searchQuery, queryOptions, function (err, movieDoc) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            Theatre.findById(req.params.id, function(err, foundTheatre) {
                if (err) {
                    middleware.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    if (foundTheatre) {
                        var movielist = movieDoc.docs;
                        movieDoc.docs = [];
                        res.render('theatref/addmovie.ejs', {helper : helper, doc : movieDoc, 
                        movielist : movielist, search : req.query, theatre : foundTheatre});
                    } else {
                        res.render("notfound.ejs");
                    }
                }
            });
        }
    });
});

router.post('/:id/addmovie', function(req,res) {
    Theatre.findById(req.params.id, function(err, foundTheatre) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundTheatre) {

                Movie.findById(req.body.movieid, function(err, foundMovie) {
                    if (err) {
                        middleware.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        var movie = {
                            id : foundMovie._id,
                            image : foundMovie.image
                        };

                        middleware.displaySuccessMovie(req, 'Added a movie for a theater!');
                        foundTheatre.movielist.push(movie);
                        foundTheatre.save();
                        res.redirect('/theatres/' + foundTheatre._id + '/addmovie');
                    }
                });
            } else {
                res.render("notfound.ejs");
            }
        }
    });
});

router.delete('/:id/addmovie', function(req,res) {
    Theatre.findById(req.params.id, function(err, foundTheatre) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            if (foundTheatre) {

                Movie.findById(req.body.movieid, function(err, foundMovie) {
                    if (err) {
                        middleware.displayGenericError(req, err);
                        res.redirect('back');
                    } else {
                        middleware.displaySuccessMovie(req, 'Removed movie times!');

                        foundTheatre.movielist.forEach(function(movietime) {
                            console.log(movietime);
                            console.log(movietime.id);
                            console.log(foundMovie._id);
                            if (movietime.id.equals(foundMovie._id)) {
                                foundTheatre.movielist.pull(movietime);
                            }
                        });

                        foundTheatre.save();
                        res.redirect('/theatres/' + foundTheatre._id + '/addmovie');
                    }
                });
            } else {
                res.render("notfound.ejs");
            }
        }
    });
});

module.exports = router;