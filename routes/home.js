var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    plugin = require('../plugin'),
    helper = require('../helper'),
    Movie = require('../models/movie'),
    News = require('../models/news');

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
            News.find({}, function(err,newslist) {
                if (err){
                    plugin.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    res.render('home.ejs', {title : 'Home', movielist : Movall, helper : helper, newslist : newslist})
                }
            });
        }
    });
});

module.exports = router;