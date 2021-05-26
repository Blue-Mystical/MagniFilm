var Review = require('../models/review');
var Movie = require('../models/movie');

var plugins = {};

plugins.displayGenericError = function(req, err) {
    console.log(err);
    req.flash('popup', 'Error');
    req.flash('popupmessage', 'An error occured');
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

plugins.displayAccessDenied = function(req, message) {
    req.flash('popup', 'Access denied');
    req.flash('popupmessage', message);
}

plugins.displaySuccessRegister = function(req) {
    req.flash('popup', 'Success');
    req.flash('popupmessage', 'Successfully registered a new account. Welcome ' + req.user.username);
}

plugins.displaySuccessLogin = function(req) {
    req.flash('popup', 'Success');
    req.flash('popupmessage', 'Successfully logged in!');
}

plugins.displaySuccessMovie = function(req, message) {
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