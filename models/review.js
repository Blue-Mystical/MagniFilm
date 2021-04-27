var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    user: String,
    text: String,
    rating: Number
});

module.exports = mongoose.model('review', reviewSchema);