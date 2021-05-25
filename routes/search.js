var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    Movie = require('../models/movie'),
    helper = require('../helper');

router.get('/', function(req,res) {
    var pagenumber = 1;
    if (req.query.page && !isNaN(req.query.page)) {
        pagenumber = req.query.page;
    } // querys: page, mode, sort, value, genre
    var sortOptions;
    var sortMode = -1;
    if (req.query.mode && !isNaN(req.query.mode)) {
        if (req.query.mode = 2) sortMode = 1;
    }
    if (req.query.sort == 'like') {
        sortOptions = { likecount: sortMode }
    } else if (req.query.sort == 'rating') {
        sortOptions = { avgrating: sortMode }
    } else if (req.query.sort == 'name') {
        sortOptions = { moviename: sortMode }
    } else if (req.query.sort == 'length') {
        sortOptions = { length: sortMode }
    } else {
        sortOptions = { airdate: sortMode }
    }

    const queryOptions = {
        page: pagenumber,
        sort: sortOptions,
        limit: helper.queryLimit(),
        collation: {
          locale: 'en',
        },
    };
    var searchQuery;
    if (req.query.value && req.query.genre && !(req.query.genre == 'none')) {
        searchQuery = {
            moviename: {$regex : req.query.value, $options: "i"}, // case-insensitive search
            genre: req.query.genre
        };
    } else if (req.query.value) {
        searchQuery = {
            moviename: {$regex : req.query.value, $options: "i"}
        };
    } else if (req.query.genre && !req.query.genre == 'none')  {
        searchQuery = {
            genre: req.query.genre
        };
    } else {
        searchQuery = {};
    }

    Movie.paginate(searchQuery, queryOptions, function (err, movieDoc) {
        if (err) {
            middleware.displayGenericError(req, err);
            res.redirect('back');
        } else {
            var movielist = movieDoc.docs;
            movieDoc.docs = [];
            res.render('searchf/searchmovie.ejs', {helper : helper, doc : movieDoc, 
             movielist : movielist, search : req.query});
        }
    });
});

module.exports = router;