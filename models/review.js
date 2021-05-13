var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    text: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        username: String
    },
    rating: Number,
    reviewdate: Date
});

module.exports = mongoose.model('review', reviewSchema);