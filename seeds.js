var mongoose = require('mongoose');
var Movie = require('./models/movie');
var Comment = require('./models/review');

var movielist = [
    {
        moviename: 'Iron man',
        airdate: '31 Apr 2021',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/00/Iron_Man_poster.jpg',
        desc: 'Tony Stark'
    },
    {
        moviename: 'Mortal Kombat',
        airdate: '28 Apr 2021', 
        image: 'https://www.brighttv.co.th/wp-content/uploads/2021/04/mortal-kombat-movie-scorpion-poster-1257057.jpeg',
        desc: 'Fatality'    
    }
];

function seedDB() {
    Movie.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove DB completed');
            movielist.forEach(function(seed) {
                Movie.create(seed, function(err,collection) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('New data added');
                        Comment.create(
                            {
                                author: 'Rody',
                                text: 'this is awesome 5/5'
                            }, function(err, comment){
                                if(err) {
                                    console.log(err);
                                } else {
                                    collection.comments.push(comment);
                                    collection.save();
                                }
                            });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;