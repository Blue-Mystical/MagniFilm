var mongoose = require('mongoose');
var helper = require('./helper');
var Movie = require('./models/movie');
var Review = require('./models/review');
var Promotion = require('./models/promotion');
var User = require('./models/user');

var catsscore = 10 / 3;

var movielist = [
    {
        moviename: 'Iron man',
        airdate: '31 April 2021',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/00/Iron_Man_poster.jpg',
        trailer: 'https://www.youtube.com/embed/8hYlB38asDY',
        desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
        length: 126,
        genre: ['action'],
        avgrating: 8,
        reviewcount: 1,
        sumrating: 8,
        movierating: 'pg',
        likecount: 1
    },
    {
        moviename: 'Mortal Kombat',
        airdate: '3 May 2021', 
        image: 'https://www.brighttv.co.th/wp-content/uploads/2021/04/mortal-kombat-movie-scorpion-poster-1257057.jpeg',
        desc: 'Fatality',
        length: 110,
        genre: ['action', 'adventure', 'fantasy'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'pg13',
        likecount: 2   
    },
    {
        moviename: 'Godzilla vs King Kong',
        airdate: '26 March 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/2746/thumb_2746.jpg?280420210500',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' ,
        length: 113,
        genre: ['action', 'thriller', 'scifi'],
        avgrating: 8.25,
        reviewcount: 4,
        sumrating: 33,
        movierating: 'pg13',
        likecount: 12345
    },
    {
        moviename: 'CATS (2019)',
        airdate: '14 July 2019', 
        image: 'https://upload.wikimedia.org/wikipedia/en/c/cf/Cats_2019_poster.jpg',
        desc: 'A bad movie that should not be recommended',
        length: 110,
        genre: ['animation', 'comedy', 'drama', 'musical'],
        avgrating: catsscore,
        reviewcount: 3,
        sumrating: 10,
        movierating: 'g',
        likecount: 0
    }
];

var promolist = [
    {
        title: 'Doge hahaha',
        caption: 'Can\'t find better bg',
        image: 'https://wallpaper.dog/large/20475179.jpg',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        type: 'promo', // promo or news
        featured: true
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
    //

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
                        console.log('New movie added');
                    }
                });
            });
        }
    });

    Promotion.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('remove promo/news list completed');
            promolist.forEach(function(seed) {
                Promotion.create(seed, function(err,promo) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('New promo added');
                    }
                });
            });
        }
    });
    
}

module.exports = seedDB;
