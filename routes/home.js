var express = require('express'),
    router = express.Router({mergeParams: true});

router.get('/', function(req,res) {
    res.render('home.ejs');
});

module.exports = router;