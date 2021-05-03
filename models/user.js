var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    type: String,
    likedMovie: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'movie'
    }],
    movieHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie'
     }]
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);