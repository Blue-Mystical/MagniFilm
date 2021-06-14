var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'member' }, // available: member, admin, manager
    avatar: { type: String, default: '/assets/unknownavatar.png' },
    joineddate: { type: Date, default: Date.now },
    likedMovie: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'movie'
    }],
    likedNews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'news'
    }],
    reviewHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
    movieHistory: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movie'
        },
        date: Date
    }]

});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(mongoosepaginate);

module.exports = mongoose.model('User', userSchema);