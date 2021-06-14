var Review = require('../models/review');
var Movie = require('../models/movie');

var plugins = {};

plugins.returnGenericError = function(req, res, err) {
    console.log(err);
    req.flash('popup', 'Error');
    req.flash('popupmessage', 'An error occured');
    res.redirect('back');
}

plugins.displayDeletedMovieError = function(req, err) {
    console.log(err);
    req.flash('popup', 'Error');
    req.flash('popupmessage', 'Cannot perform the action. The movie may have been deleted.');
}

plugins.displayDeletedTheatreError = function(req, err) {
    console.log(err);
    req.flash('popup', 'Error');
    req.flash('popupmessage', 'Cannot perform the action. The theatre may have been deleted.');
}

plugins.displayDeletedNewsError = function(req, err) {
    console.log(err);
    req.flash('popup', 'Error');
    req.flash('popupmessage', 'Cannot perform the action. The news may have been deleted.');
}

plugins.displayAccessDenied = function(req, message) {
    req.flash('popup', 'Access denied');
    req.flash('popupmessage', message);
}

plugins.displaySuccessRegister = function(req) {
    req.flash('popup', 'Success');
    req.flash('popupmessage', 'Successfully registered a new account. Welcome ' + req.user.username);
}

plugins.loginRequired = function(req, res) {
    req.flash('loginrequired', 'A login required to do that action.');
    res.redirect('/login');
}

plugins.displaySuccessLogin = function(req, username) {
    req.flash('popup', 'Success');
    req.flash('popupmessage', 'Successfully logged in as ' + username + '.');
}

plugins.displaySuccessMessage = function(req, message) {
    req.flash('popup', 'Success');
    req.flash('popupmessage', message);
}

plugins.displaySuccessLogout = function(req) {
    req.flash('popup', 'Success');
    req.flash('popupmessage', 'Successfully logged out! Have a save trip.');
}

plugins.buildQuery = function(queryObject) {
    var extraQueries = '';
    Object.entries(queryObject).forEach(entry => {
        const [key, value] = entry;
        if (key !== 'page') {
            var querytoadd = '&' + key + '=' + value;
            extraQueries = extraQueries.concat(querytoadd);
        }
    });
    return extraQueries;
}

module.exports = plugins; 