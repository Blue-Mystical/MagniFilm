var express = require('express'),
    router = express.Router({mergeParams: true}),
    Movie = require('../models/movie'),
    Review = require('../models/review');

router.get('/new', isLoggedIn, function(req,res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            console.log(err);
        } else {
            res.render('reviewf/newreview.ejs', {movie: foundMovie});
        }
    });
});

router.post('/', isLoggedIn, function(req, res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            console.log(err);
            res.redirect('/movies');
        } else {
            var user = req.body.user;
            var text = req.body.review;
            var rating = req.body.rating;
            var newReview = {user:user, text:text, rating:rating};
            Review.create(newReview, function(err, newreview) {
                if (err) {
                    console.log(err);
                } else {
                    foundMovie.review.push(newreview);
                    foundMovie.save();
                    res.redirect('/movies/' + foundMovie._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;