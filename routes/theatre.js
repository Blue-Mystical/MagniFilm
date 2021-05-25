var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    helper = require('../helper'),
    // The entire uploading system
    multer = require('multer'),
    path = require('path'),
    storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './public/logos');
        },
        filename: function(req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    imageFilter = function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return callback(new Error('Only JPG, JPEG, PNG and GIF image files are allowed.'), false);
        }
        callback(null, true);
    },
    upload = multer({storage: storage, fileFilter: imageFilter}),
    // END
    Logo = require('../models/logo'),
    Theatre = require('../models/theatre');

// Theatre list
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

router.get('/add', middleware.checkManager, function(req,res) {
    Logo.find({}, function(err,logos) {
        if (err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            console.log(logos);
            res.render('theatref/addtheatre.ejs', {logos : logos});
        }
    });
});

router.post('/', middleware.checkManager, function(req,res) {
    req.body.theatre.addedby = {
        id: req.user._id,
        username: req.user.username
    };
    
    Logo.findById(req.body.iconid, function(err, foundLogo) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            req.body.theatre.icon = {
                id: req.body.iconid,
                image: foundLogo.image
            };
            // blank priority = high number
            if (!req.body.theatre.priority) {
                req.body.theatre.priority = 9999;
            }
            Theatre.create(req.body.theatre, function(err, newTheatre) {
                if(err){
                    middleware.displayGenericError(req, err);
                    res.redirect('back');
                } else {
                    console.log(newTheatre);
                    res.redirect('/theatres');
                }
            });
        }
    });
});

router.get('/logo/add', middleware.checkManager, function(req,res) {
    res.render('theatref/addlogo.ejs');
});

router.post('/logo', middleware.checkManager, upload.single('image'), function(req,res) {
    if (req.file) {
        req.body.logo.image = '/logos/' + req.file.filename;
    }
    if (!req.body.logo.priority) {
        req.body.logo.priority = 9999;
    }
    Logo.create(req.body.logo, function(err, newLogo) {
        if(err){
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            res.redirect('/theatres');
        }
    });
});

router.get('/:id', function(req,res) {
    if (req.params.id != 'add') { // suppress error when accessing the add page
        Theatre.findById(req.params.id, function(err, foundTheatre) {
            if (err) {
                middleware.displayGenericError(req, err);
                res.redirect('back');
            } else {
                if (foundTheatre) {
                    res.render('theatref/theatreinfo.ejs', {theatre: foundTheatre, helper : helper});
                } else {
                    res.render("notfound.ejs");
                }
            }
        });
    }
});

module.exports = router;