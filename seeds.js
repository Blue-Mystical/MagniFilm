var mongoose = require('mongoose');
var helper = require('./helper');
var samples = require('./seedsamples');
var Movie = require('./models/movie');
var Review = require('./models/review');
var Theatre = require('./models/theatre');
var News = require('./models/news');
var User = require('./models/user');

function seedDB() {
    Review.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove reviews completed');
        }
    });

    Theatre.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove theatres completed');
        }
    });

    // Clean data before seeding here
    User.find({}, function(err, userarray) {
        if (err) {
            console.log(err);
        } else {
            userarray.forEach(user => {
                console.log('------------------------ \ntrying to clear a user history \n------------------------');
                if (user.likedMovie) {
                    helper.clearArray(user.likedMovie);
                    console.log('remove liked movie list');
                }
                if (user.reviewHistory) {
                    helper.clearArray(user.reviewHistory);
                    console.log('remove review history');
                }
                if (user.movieHistory) {
                    helper.clearArray(user.movieHistory);
                    console.log('remove movie history');
                }
                user.save();
            });
        }
    });

    Movie.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove movie list completed');
            samples.movielist.forEach(function(seed) {
                Movie.create(seed, function(err,movie) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('New movie added');
                    }
                });
            });
        }
    });

    News.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove news list completed');
            samples.newslist.forEach(function(seed) {
                News.create(seed, function(err,news) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('News added');
                    }
                });
            });
        }
    }); 
}

module.exports = seedDB;
