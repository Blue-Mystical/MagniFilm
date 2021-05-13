var express = require('express'),
    router = express.Router({mergeParams: true}),
    helper = require('../helper'),
    Movie = require('../models/movie');

router.get('/', function(req,res) {
    Movie.find({}, function(err,Movall) {
        if (err){
            console.log(err);
        } else {
            res.render('home.ejs', {movielist : Movall, helper : helper})
        }
    });
});

module.exports = router;