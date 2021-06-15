var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    plugin = require('../plugin'),
    Movie = require('../models/movie'),
    helper = require('../helper');

router.get('/', function(req,res) {
    helper.navactive = 0;
    var pagenumber = 1;
    if (req.query.page && !isNaN(req.query.page)) {
        pagenumber = req.query.page;
    } // querys: page, mode, sort, value, genre
    var sortOptions;
    var sortMode = -1;
    if (req.query.mode == 1)
        sortMode = 1;

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
    var searchQuery = {};
    if (req.query.value) {
        searchQuery.moviename = {$regex : req.query.value, $options: "i"}; // case-insensitive search
    }
    if (req.query.genre && req.query.genre !== 'none') {
        searchQuery.genre = req.query.genre;
    }

    var extraQueries = plugin.buildQuery(req.query);
    
    Movie.paginate(searchQuery, queryOptions, function (err, movieDoc) {
        if (err) return plugin.returnGenericError(req, res, err);
        var movielist = movieDoc.docs;
        movieDoc.docs = [];
        res.render('searchf/searchmovie.ejs', {title : 'Search', helper : helper, doc : movieDoc, 
         movielist : movielist, search : req.query, extraqueries: extraQueries});
    });
});

module.exports = router;