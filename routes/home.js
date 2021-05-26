var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    plugin = require('../plugin'),
    helper = require('../helper'),
    Movie = require('../models/movie'),
    Promotion = require('../models/promotion');

router.get('/', function(req,res) {

    var currentDate = new Date();
    currentDate = Date.parse(currentDate);
    var unairDate = currentDate - 1000 * 60 * 60 * 24 * 30; // 30 days
    var upperDate = currentDate + 1000 * 60 * 60 * 24 * 30;
    var dateRange = {
        $gte: unairDate,
        $lte: upperDate
    };
    Movie.find({ 
        airdate: dateRange
        }).sort({avgrating: -1}).exec(function(err,Movall) {
        if (err){
            plugin.displayGenericError(req, err);
            res.redirect('back');
        } else {
            Promotion.find({}, function(err,promolist) {
                if (err){
                    plugin.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    res.render('home.ejs', {movielist : Movall, helper : helper, promolist : promolist})
                }
            });
        }
    });
});

module.exports = router;