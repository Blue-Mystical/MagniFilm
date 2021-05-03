var mongoose = require('mongoose');
var Movie = require('./models/movie');
var Review = require('./models/review');


// TODO LIST
// IMPROVE DESIGN
// THEATRE
// USER PAGE
// FIX GENRE IN DB
// Fix Navbar


var movielist = [
    {
        moviename: 'Iron man',
        airdate: '31 Apr 2021',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/00/Iron_Man_poster.jpg',
        desc: 'Tony Stark',
        ratingcount: 5,
        reviewcount: 1,
        likecount: 1
    },
    {
        moviename: 'Mortal Kombat',
        airdate: '28 Apr 2021', 
        image: 'https://www.brighttv.co.th/wp-content/uploads/2021/04/mortal-kombat-movie-scorpion-poster-1257057.jpeg',
        desc: 'Fatality' ,
        ratingcount: 4,
        reviewcount: 1,
        likecount: 2   
    }
];

function seedDB() {
    Review.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove reviews completed');
        }
    });
    Movie.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove movie list completed');
            movielist.forEach(function(seed) {
                Movie.create(seed, function(err,movie) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('New data added');
                        Review.create(
                            {
                                user: 'Rody',
                                text: 'this is awesome 5/5',
                                rating: 5
                            }, function(err, review){
                                if(err) {
                                    console.log(err);
                                } else {
                                    movie.review.push(review);
                                    movie.save();
                                }
                            }); 
                    }
                });
            });
        }
    });
}

module.exports = seedDB;