var express = require('express'),
    router = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    plugin = require('../plugin'),
    User = require('../models/user'),
    News = require('../models/news'),
    Movie = require('../models/movie'),
    // The entire uploading system
    multer = require('multer'),
    path = require('path'),
    storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './public/uploads');
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
    helper = require('../helper');

router.get('/', function(req,res) {
    var pagenumber = 1;
    if (req.query.page && !isNaN(req.query.page)) {
        pagenumber = req.query.page;
    } // querys: page, mode, sort, value, genre
    var sortOptions;
    sortMode = -1;
    sortOptions = { newsdate: sortMode }

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
        searchQuery.title = {$regex : req.query.value, $options: "i"}; // case-insensitive search
    }

    var extraQueries = plugin.buildQuery(req.query);
    
    News.paginate(searchQuery, queryOptions, function (err, newsDoc) {
        if (err) return plugin.returnGenericError(req, res, err);
        var newslist = newsDoc.docs;
        newsDoc.docs = [];
        res.render('newsf/news.ejs', {title : 'News', helper : helper, doc : newsDoc, 
        newslist : newslist, search : req.query, extraqueries: extraQueries});
    });
});

// Moved up due to conflict
router.get('/add', middleware.checkManager, function(req,res) {
    res.render('newsf/addnews.ejs', {title : 'Adding News'});
});

router.get('/:id', function(req,res) {
    if (req.params.id != 'add') { // suppress error when accessing the add page
        News.findById(req.params.id, function(err, foundNews) {
            if (err) return plugin.returnGenericError(req, res, err);
            if (foundNews) {
                var newcount = foundNews.viewcount + 1;
                News.findByIdAndUpdate(req.params.id, {viewcount : newcount}, function(err, foundNews2) {
                    if (err) return plugin.returnGenericError(req, res, err);
                });
                res.render("newsf/newspage.ejs", {title : foundNews.title, news: foundNews, helper : helper});
            } else {
                res.render("notfound.ejs");
            }
        });
    }
});

// Add news
router.post('/', middleware.checkManager, upload.single('image'), function(req,res) {
    if (req.file) {
        req.body.news.image = '/uploads/' + req.file.filename;
    } else {
        req.body.news.image = '/assets/blankmovie.png';
    }
    req.body.news.featured = (req.body.news.featured === 'true');
    req.body.news.viewcount = 0;
    req.body.news.likecount = 0;
    req.body.news.contents = [];

    var newContent = {};
    var index = 1;
    req.body.invcontent.forEach(function(contentElem){
        newContent = {
            ctype: 'text',
            content: contentElem,
            order: index
        };
        req.body.news.contents.push(newContent);
        index++;
    });
    
    News.create(req.body.news, function(err, newNews) {
        if(err) return plugin.returnGenericError(req, res, err);
        plugin.displaySuccessMessage(req, req.body.news.title + ' has successfully been created.');
        res.redirect('/news');
    });
});

// Edit news
router.get('/:id/edit', middleware.checkManager, function(req, res) {
    News.findById(req.params.id, function(err, foundNews) {
        if (err) return plugin.returnGenericError(req, res, err);
        if (foundNews) {
            res.render('newsf/editnews.ejs', {title : 'Editing ' + foundNews.title, news: foundNews, helper : helper});
        } else {
            plugin.displayDeletedNewsError(req, err);
            res.redirect('back');
        }
    });
});

router.put('/:id', middleware.checkManager, upload.single('image'), function(req, res) {
    if (req.file) {
        req.body.news.image = '/uploads/' + req.file.filename;
    }
    News.findByIdAndUpdate(req.params.id, req.body.news, function(err, updatedNews) {
        if (err) return plugin.returnGenericError(req, res, err);
        if (updatedNews) {
            plugin.displaySuccessMessage(req, 'Edited ' + req.body.news.title + ' page.');
            res.redirect('/news/' + req.params.id);
        } else {
            plugin.displayDeletedNewsError(req, err);
            res.redirect('back');
        }
    });
});

router.delete('/:id', middleware.checkManager, function(req, res) {
    News.findByIdAndDelete(req.params.id, function(err) {
        if (err) return plugin.returnGenericError(req, res, err);
        plugin.displaySuccessMessage(req, 'Removed a news.');
        res.redirect('/news');
    });
});

// Like or unlike news
router.post('/:id', middleware.isLoggedIn, function(req,res) {
    if (req.body.action === 'like') {
        User.findById(req.user._id, function(err, foundUser) {
            if (err) return plugin.returnGenericError(req, res, err);
            var refNews = req.params.id;
            foundUser.likedNews.push(refNews);
            foundUser.save();
            News.findById(req.params.id, function(err, foundNews) {
                if (err) return plugin.returnGenericError(req, res, err);
                if (foundNews) {
                    var newcount = foundNews.likecount + 1;
                    News.findByIdAndUpdate(req.params.id, {likecount : newcount}, function(err, foundNews2) {
                        if (err) return plugin.returnGenericError(req, res, err);
                        res.redirect('/news/' + req.params.id);    
                    });
                } else {
                    plugin.displayDeletedNewsError(req, err);
                    res.redirect('back');
                }
            });
        });
    }

    if (req.body.action === 'unlike') {
        User.findById(req.user._id, function(err, foundUser) {
            if (err) return plugin.returnGenericError(req, res, err);
            News.findById(req.params.id, function(err, foundNews) {
                if (err) return plugin.returnGenericError(req, res, err);
                if (foundNews) {
                    var refNews = req.params.id;
                    foundUser.likedNews.pull(refNews);
                    foundUser.save();
                    var newcount = foundNews.likecount - 1;
                    News.findByIdAndUpdate(req.params.id, {likecount : newcount}, function(err, foundNews2) {
                        if (err) return plugin.returnGenericError(req, res, err);
                        res.redirect('/news/' + req.params.id);    
                    });
                } else {
                    plugin.displayDeletedNewsError(req, err);
                    res.redirect('back');
                }
            });
        });
    }
});

module.exports = router;