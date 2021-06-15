var Review = require('../models/review');
var plugin = require('../plugin');

var midwareFunctions = {};

midwareFunctions.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        plugin.loginRequired(req, res);
    }
};

midwareFunctions.checkReviewOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Review.findById(req.params.reviewid, function(err, foundReview){
            if(err){
                return plugin.returnGenericError(req, res, err);
            } else {
                if(foundReview.user.id.equals(req.user._id)) {
                    next();
                } else {
                    plugin.displayAccessDenied(req, 'You cannot edit the other user\'s review.');
                    res.redirect('back');
                }
            }
        });
    } else {
        plugin.loginRequired(req, res);
    }
}

midwareFunctions.checkExistingReview = function(req, res, next){ // Used to prevent adding more than 1 review per user per movie
    if(req.isAuthenticated()){
        Review.findOne({'user.id' : req.user._id, 'formovie.id' : req.params.id}, function(err, foundReview){
            if(err){
                return plugin.returnGenericError(req, res, err);
            } else {
                if (foundReview) {
                    plugin.displayAccessDenied(req, 'You cannot have more than one review for each movie.');
                    res.redirect('back');
                } else {
                    next();
                }
            }
        });
    } else {
        plugin.loginRequired(req, res);
    }
}

midwareFunctions.checkManager = function(req, res, next){
    if(req.isAuthenticated()){
        if (req.user.role === 'admin' || req.user.role === 'manager') {
            next();
        } else {
            plugin.displayAccessDenied(req, 'You do not have permission to do that.');
            res.redirect('back');
        }
    } else {
        plugin.loginRequired(req, res);
    }
}

midwareFunctions.checkAdmin = function(req, res, next){
    if(req.isAuthenticated()){
        if (req.user.role === 'admin') {
            next();
        } else {
            plugin.displayAccessDenied(req, 'You do not have permission to do that. You are not an admin.');
            res.redirect('back');
        }
    } else {
        plugin.loginRequired(req, res);
    }
}

module.exports = midwareFunctions; 