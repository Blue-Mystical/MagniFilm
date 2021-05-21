var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    helper = require('../helper'),
    Movie = require('../models/movie'),
    Promotion = require('../models/promotion');

router.get('/', function(req,res) {
    Movie.find({}).sort({avgrating: -1}).exec(function(err,Movall) {
        if (err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            Promotion.find({}, function(err,promolist) {
                if (err){
                    middleware.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    res.render('home.ejs', {movielist : Movall, helper : helper, promolist : promolist})
                }
            });
        }
    });
});

module.exports = router;