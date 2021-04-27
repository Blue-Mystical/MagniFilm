var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),

    Movie = require('./models/movie'),
    Theatre = require('./models/theatre'),
    User = require('./models/user'),
    Review = require('./models/review');

mongoose.connect('mongodb://localhost/MagniFilm');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ,'Jul', 'Aug' ,'Sep', 'Oct', 'Nov', 'Dec'];
const monthFull = ['January', 'February', 'Machr', 'April', 'May', 'June' ,
                    'July', 'August' ,'September', 'October', 'November', 'December'];
/* 
Movie.create(
    {moviename:'Iron man',
    airdate: '2021-04-25',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/00/Iron_Man_poster.jpg',
    desc: 'Your favorite action here Tony Stark'},
    function(err, mov) {
        if (err){
            console.log(err);
        } else {
            console.log('New data added.');
            console.log(mov);
        }
    }
) 
*/

app.get('/', function(req,res) {
    res.render('home.ejs');
});

app.get('/movies', function(req,res) {
    Movie.find({}, function(err,Movall) {
        if (err){
            console.log(err);
        } else {
            res.render('movies.ejs', {movielist : Movall, monthShort : monthShort})
        }
    });
});

app.get('/movies/add', function(req,res) {
    res.render('addmovie.ejs');
});

app.get('/movies/:id', function(req,res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if (err) {
            console.log(err);
        } else {
            res.render('movieinfo.ejs', {movie: foundMovie});
        }
    });
});

app.post('/movies', function(req,res) {
    var moviename = req.body.name;
    var airdate = req.body.airdate;
    var image = req.body.image;
    var desc = req.body.desc;
    var newMovie = {moviename:moviename, airdate:airdate, image:image, desc:desc};
    //movielist.push(newMovie);
    Movie.create(newMovie, function(err, newmov) {
        if(err){
            console.log(err);
        } else {
            res.redirect('movies');
        }
    });
});

app.listen(3000, function() {
    console.log('MagniFilm server has been opened.');
});