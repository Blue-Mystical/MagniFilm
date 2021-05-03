var express = require('express'),
    router = express.Router({mergeParams: true}),
    Movie = require('../models/movie');

const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ,'Jul', 'Aug' ,'Sep', 'Oct', 'Nov', 'Dec'];
const monthFull = ['January', 'February', 'Machr', 'April', 'May', 'June' ,
                    'July', 'August' ,'September', 'October', 'November', 'December'];

router.get('/', function(req,res) {
    Movie.find({}, function(err,Movall) {
        if (err){
            console.log(err);
        } else {
            res.render('movief/movies.ejs', {movielist : Movall, monthShort : monthShort})
        }
    });
});

router.get('/add', function(req,res) {
    res.render('movief/addmovie.ejs');
});

router.get('/:id', function(req,res) {
   /* Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            console.log(err);
        } else {
            res.render('movief/movieinfo.ejs', {movie: foundMovie});
        }
    });*/
    Movie.findById(req.params.id).populate('review').exec(function(err, foundMovie) {
        if(err){
            console.log(err);
        } else {
            res.render("movief/movieinfo.ejs", {movie: foundMovie});
        }
    });
});

router.post('/', function(req,res) {
    var moviename = req.body.name;
    var airdate = req.body.airdate;
    var image = req.body.image;
    var desc = req.body.desc;
    var trailer = req.body.trailer;
    var genre = req.body.genre;
    var newMovie = {moviename:moviename, airdate:airdate, image:image, desc:desc, trailer:trailer, genre:genre};
    Movie.create(newMovie, function(err, newmov) {
        if(err){
            console.log(err);
        } else {
            res.redirect('/movies');
        }
    });
});

module.exports = router;