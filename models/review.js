var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');

var reviewSchema = new mongoose.Schema({
    text: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        username: String
    },
    formovie: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movie'
        },
        moviename: String
    },
    rating: Number,
    reviewdate: Date
});

reviewSchema.pre('findOneAndDelete', function(next) { // Cascade delete review history
    
});


reviewSchema.plugin(mongoosepaginate);
module.exports = mongoose.model('review', reviewSchema);