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
    reviewcount: { type: Number, default: 0 }, // sum / count = avg
    sumrating: { type: Number, default: 0 },
    avgrating: { type: Number, default: -1 },
    likecount: { type: Number, default: 0 },
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

movieSchema.plugin(mongoosepaginate);
module.exports = mongoose.model('Movie', movieSchema);