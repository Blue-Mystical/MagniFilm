var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    likedMovie: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'movie'
    }],
    reviewHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
    movieHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie'
    }]
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);