var mongoose = require('mongoose');

var theatreSchema = new mongoose.Schema({
    theatrename: String,
    icon: String,
    desc: String,
    location: String,
    availableMovie: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'movie'
    }]
});

module.exports = mongoose.model('Theatre', theatreSchema);