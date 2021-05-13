var express = require('express'),
    router = express.Router({mergeParams: true}),
    User = require('../models/user'),
    helper = require('../helper'),
    Movie = require('../models/movie');

router.get('/', function(req,res) {
    Movie.find({}, function(err,Movall) {
        if (err){
            console.log(err);
        } else {
            res.render('movief/movies.ejs', {movielist : Movall, helper : helper})
        }
    });
});

router.get('/add', isLoggedIn, function(req,res) {
    res.render('movief/addmovie.ejs');
});

router.get('/:id', function(req,res) {
    Movie.findById(req.params.id).populate('review').exec(function(err, foundMovie) {
        if(err){
            console.log(err);
        } else {
            res.render("movief/movieinfo.ejs", {movie: foundMovie, helper : helper});
        }
    });
});

router.get('/:id/trailer', function(req,res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            console.log(err);
        } else {
            res.render('movief/trailer.ejs', {movie: foundMovie, helper : helper});
        }
    });
});

router.post('/', isLoggedIn, function(req,res) {
    if (req.body.action === 'addmovie') {
        var moviename = req.body.name;
        var airdate = req.body.airdate;
        var image = req.body.image;
        var desc = req.body.desc;
        var trailer = req.body.trailer;
        var length = req.body.length;
        var genre = req.body.genre;
        var movierating = req.body.movierating;
        var addedby = {
            id: req.user._id,
            username: req.user.username
        };
        var newMovie = {moviename:moviename,
            airdate:airdate,
            image:image,
            desc:desc,
            trailer:trailer,
            length:length,
            genre:genre,
            addedby:addedby,
            reviewcount: 0,
            sumrating: 0,
            avgrating: -1,
            likecount: 0,
            movierating: movierating, // G, R, PG etc.
        };
        Movie.create(newMovie, function(err, newmov) {
            if(err){
                console.log(err);
            } else {
                res.redirect('/movies');
            }
        });
    }
});

router.post('/:id', isLoggedIn, function(req,res) {
    if (req.body.action === 'like') {
        User.findById(req.user._id, function(err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                var refMovie = req.params.id;
                foundUser.likedMovie.push(refMovie);
                foundUser.save();
                Movie.findById(req.params.id, function(err, foundMovie) {
                    if (err) {
                        console.log(err);
                    } else {
                        var newcount = foundMovie.likecount + 1;
                        Movie.findByIdAndUpdate(req.params.id, {likecount : newcount}, function(err, foundmovie2) {
                            if (err) {
                                console.log(err);
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
                console.log(err);
            } else {
                foundUser.pull
                Movie.findById(req.params.id, function(err, foundMovie) {
                    if (err) {
                        console.log(err);
                    } else {
                        var refMovie = req.params.id;
                        foundUser.likedMovie.pull(refMovie); // DELETE
                        foundUser.save();
                        var newcount = foundMovie.likecount - 1;
                        Movie.findByIdAndUpdate(req.params.id, {likecount : newcount}, function(err, foundmovie2) {
                            if (err) {
                                console.log(err);
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('loginrequired', 'A login required to do that action.')
        res.redirect('/login');
    }
}

function addMovieHistory(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
}

module.exports = router;