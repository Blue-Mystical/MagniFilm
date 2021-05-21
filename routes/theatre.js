var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    helper = require('../helper'),
    Theatre = require('../models/theatre');

router.get('/', function(req,res) {
    Theatre.find({}, function(err,Theatreall) {
        if (err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('theatref/theatres.ejs', {theatrelist : Theatreall, helper : helper})
        }
    });
});

router.get('/add', function(req,res) {
    res.render('theatref/addtheatre.ejs');
});

router.get('/:id', function(req,res) {
    Theatre.findById(req.params.id, function(err, foundTheatre) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.render('theatref/theatreinfo.ejs', {theatre: foundTheatre, helper : helper});
        }
    });
});

router.post('/', function(req,res) {
    var theatrename = req.body.name;
    var desc = req.body.desc;
    var location = req.body.location;
    var icon = req.body.icon;
    var newTheatre = {theatrename:theatrename, desc:desc, location:location, icon:icon};
    Theatre.create(newTheatre, function(err, newtheatre) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.redirect('theatres.ejs');
        }
    });
});

module.exports = router;