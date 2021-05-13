var express = require('express'),
    router = express.Router({mergeParams: true}),
    Movie = require('../models/movie'),
    helper = require('../helper'),
    User = require('../models/user'),
    Review = require('../models/review');

router.get('/new', isLoggedIn, function(req,res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            console.log(err);
        } else {
            res.render('reviewf/newreview.ejs', {movie: foundMovie, helper : helper});
        }
    });
});

router.get('/list', function(req,res) {
    Movie.findById(req.params.id).populate('review').exec(function(err, foundMovie) {
        if(err){
            console.log(err);
        } else {
            res.render("reviewf/reviews.ejs", {movie: foundMovie, helper : helper});
        }
    });
});

router.post('/', isLoggedIn, function(req, res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            console.log(err);
            res.redirect('/movies' + foundMovie._id + '/reviews/add');
        } else {
            var user = req.body.user;
            var text = req.body.review;
            var rating = req.body.rating;
            var reviewdate = new Date();
            var newReview = {user:user, text:text, rating:rating, reviewdate:reviewdate};
            Review.create(newReview, function(err, newreview) {
                if (err) {
                    console.log(err);
                } else {
                    newreview.user.id = req.user._id;
                    newreview.user.username = req.user.username;
                    newreview.save();
                    foundMovie.review.push(newreview);
                    foundMovie.save();
                    // Modify rating on the movie and add review count
                    var newsumrating = foundMovie.sumrating + parseInt(rating, 10);
                    var newreviewcount = foundMovie.reviewcount + 1;
                    var newaverage = newsumrating / newreviewcount;
                    foundMovie.update({ $set: { avgrating: newaverage, reviewcount: newreviewcount, sumrating : newsumrating }}).exec();
                    // Add review history for the user
                    User.findById(req.user._id, function(err, foundUser) {
                        if (err) {
                            console.log(err);
                        } else {
                            var refReview = newreview._id;
                            foundUser.reviewHistory.push(refReview);
                            foundUser.save();
                        res.redirect('/movies/' + foundMovie._id);
                        }
                    });

                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('loginrequired', 'A login required to do that action.')
        res.redirect('/login');
    }
}

module.exports = router;