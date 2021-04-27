var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    moviename: String,
    image: String,
    airdate: Date,
    desc: String,
    trailer: String,
    avgrating: Number,
    likecount: Number,
    genre: [String],
    review: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'review'
    }]
});

module.exports = mongoose.model('Movie', movieSchema);