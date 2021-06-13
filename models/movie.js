var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');

var movieSchema = new mongoose.Schema({
    moviename: String,
    image: String,
    airdate: Date,
    addeddate: { type: Date, default: Date.now },
    desc: String,
    trailer: String,
    length: Number,
    reviewcount: Number, // sum / count = avg
    sumrating: Number,
    avgrating: Number,
    likecount: Number,
    movierating: String, // G, R, PG etc. 

    likedby: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    
    addedby: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        username: String
    },
    genre: [String],
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }]
});

movieSchema.pre('findOneAndDelete', function(next) { // Cascade delete review, and history for both review and movie on users
    console.log('a remove');

    // pull all reviews of the movie (including review history)


    next();
});

movieSchema.plugin(mongoosepaginate);
module.exports = mongoose.model('Movie', movieSchema);