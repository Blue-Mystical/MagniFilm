var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    location: String,
    likedMovie: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'movie'
    }],
    movieHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie'
     }]
});

module.exports = mongoose.model('User', userSchema);