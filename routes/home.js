var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    plugin = require('../plugin'),
    helper = require('../helper'),
    Movie = require('../models/movie'),
    News = require('../models/news');

router.get('/', function(req,res) {

    helper.navactive = 0;
    var currentDate = new Date();
    currentDate = Date.parse(currentDate);
    var unairDate = currentDate - 1000 * 60 * 60 * 24 * helper.getUnAirDays(); // 30 days
    var upperDate = currentDate + 1000 * 60 * 60 * 24 * 30;
    var dateRange = {
        $gte: unairDate,
        $lte: upperDate
    };
    Movie.find({ 
        airdate: dateRange
        }).sort({avgrating: -1}).exec(function(err,Movall) {
        if (err) return plugin.returnGenericError(req, res, err);
        News.find({
        featured: true
        }, function(err,newslist) {
            if (err) return plugin.returnGenericError(req, res, err);
            res.render('home.ejs', {title : 'Home', helper : helper, movielist : Movall, newslist : newslist})
        });
    });
});

module.exports = router;