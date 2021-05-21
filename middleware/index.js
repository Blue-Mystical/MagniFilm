var Review = require('../models/review');
var Movie = require('../models/movie');

var requireLoginMessage = 'A login required to do that action.';

var midwareFunctions = {};

midwareFunctions.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('loginrequired', requireLoginMessage);
        res.redirect('/login');
    }
};

midwareFunctions.addMovieHistory = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
}

midwareFunctions.checkReviewOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Review.findById(req.params.reviewid, function(err, foundReview){
            if(err){
                midwareFunctions.displayGenericError(req);
                res.redirect('back');
            } else {
                if(foundReview.user.id.equals(req.user._id)) {
                    next();
                } else {
                    midwareFunctions.displayAccessDenied(req, 'You cannot edit the other user\'s review.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('loginrequired', requireLoginMessage);
        res.redirect('/login');
    }
}

midwareFunctions.checkExistingReview = function(req, res, next){ // Used to prevent adding more than 1 review per user per movie
    if(req.isAuthenticated()){
        Review.findOne({'user.id' : req.user._id, 'formovie.id' : req.params.id}, function(err, foundReview){
            if(err){
                midwareFunctions.displayGenericError(req);
                res.redirect('back');
            } else {
                if (foundReview) {
                    midwareFunctions.displayAccessDenied(req, 'You cannot have more than one review for each movie.');
                    res.redirect('back');
                } else {
                    next();
                }
            }
        });
    } else {
        req.flash('loginrequired', requireLoginMessage);
        res.redirect('/login');
    }
}

midwareFunctions.checkManager = function(req, res, next){
    if(req.isAuthenticated()){
        if (req.user.role === 'admin') {
            next();
        } else {
            midwareFunctions.displayAccessDenied(req, 'You do not have permission to do that.');
            res.redirect('back');
        }
    } else {
        req.flash('loginrequired', requireLoginMessage);
        res.redirect('/login');
    }
}

midwareFunctions.displayGenericError = function(req, err) {
    console.log(err);
    req.flash('popup', 'Error');
    req.flash('popupmessage', 'An error occured');
}

midwareFunctions.displayAccessDenied = function(req, message) {
    req.flash('popup', 'Access denied');
    req.flash('popupmessage', message);
}

module.exports = midwareFunctions; 