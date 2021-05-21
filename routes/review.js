var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    Movie = require('../models/movie'),
    helper = require('../helper'),
    User = require('../models/user'),
    Review = require('../models/review');

// Review list
router.get('/list', function(req,res) {
    Movie.findById(req.params.id).populate('review').exec(function(err, foundMovie) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render("reviewf/reviews.ejs", {movie: foundMovie, helper : helper});
        }
    });
});

// Edit review
router.get('/:reviewid/edit', middleware.checkReviewOwner, function(req,res) {
    Review.findById(req.params.reviewid, function(err, foundReview) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render("reviewf/editreview.ejs", {review: foundReview, movie_id: req.params.id, helper : helper});
        }
    });
});

router.put('/:reviewid', middleware.checkReviewOwner, function(req,res) {
    req.body.review.reviewdate = new Date(); // Update date too
    Review.findByIdAndUpdate(req.params.reviewid, req.body.review, function(err, updatedReview) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            Movie.findById(req.params.id, function(err, foundMovie) {
                if (err) {
                    middleware.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    // Modify rating on the movie and add review count
                    var newsumrating = foundMovie.sumrating - updatedReview.rating + parseInt(req.body.review.rating, 10);
                    var newaverage = newsumrating / foundMovie.reviewcount;
                    foundMovie.update({ $set: { avgrating: newaverage, sumrating : newsumrating }}).exec();

                    res.redirect('/movies/' + foundMovie._id + '/reviews/list');
                }
            });
        }
    });
});

// Delete review
router.delete('/:reviewid', middleware.checkReviewOwner, function(req,res) {
    // get review point to deduct first
    Review.findById(req.params.reviewid, function(err, foundReview) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            var oldrating = foundReview.rating;
            Review.findByIdAndRemove(req.params.reviewid, function(err) {
                if(err){
                    middleware.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    Movie.findById(req.params.id, function(err, foundMovie) {
                        if (err) {
                            middleware.displayGenericError(req, err);
                            res.redirect('back');
                        } else {
                            // Modify rating on the movie and reduce review count
                            var newsumrating = foundMovie.sumrating - oldrating;
                            var newreviewcount = foundMovie.reviewcount - 1;
                            if (foundMovie.reviewcount == 1) {
                                var newaverage = -1;
                            } else {
                                var newaverage = newsumrating / newreviewcount;
                            }
                            foundMovie.update({ $set: { avgrating: newaverage, reviewcount: newreviewcount, sumrating : newsumrating }}).exec();
        
                            res.redirect('/movies/' + foundMovie._id + '/reviews/list');
                        }
                    });
                }
            });
        }
    });
});

// New review
router.get('/new', middleware.checkExistingReview, function(req,res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('reviewf/newreview.ejs', {movie: foundMovie, helper : helper});
        }
    });
});

router.post('/', middleware.checkExistingReview, function(req, res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('/movies' + foundMovie._id + '/reviews/add');
        } else {
            req.body.review.user = req.body.user;
            req.body.review.reviewdate = new Date();
            Review.create(req.body.review, function(err, newreview) {
                if (err) {
                    middleware.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    // Add review for both review and movie schemas
                    newreview.user.id = req.user._id;
                    newreview.user.username = req.user.username;
                    newreview.formovie.id = foundMovie._id;
                    newreview.formovie.moviename = foundMovie.moviename;
                    newreview.save();
                    foundMovie.review.push(newreview);
                    foundMovie.save();

                    // Modify rating on the movie and add review count
                    var newsumrating = foundMovie.sumrating + parseInt(newreview.rating, 10);
                    var newreviewcount = foundMovie.reviewcount + 1;
                    var newaverage = newsumrating / newreviewcount;
                    foundMovie.update({ $set: { avgrating: newaverage, reviewcount: newreviewcount, sumrating : newsumrating }}).exec();

                    // Add review history for the user (todo) and redirect
                    User.findById(req.user._id, function(err, foundUser) {
                        if (err) {
                            middleware.displayGenericError(req, err);
                            res.redirect('back');
                        } else {
                            var refReview = newreview._id;
                            foundUser.reviewHistory.push(refReview);
                            foundUser.save();
                        res.redirect('/movies/' + foundMovie._id + '/reviews/list');
                        }
                    });

                }
            });
        }
    });
});

module.exports = router;