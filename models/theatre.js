var mongoose = require('mongoose');

var theatreSchema = new mongoose.Schema({
    theatrename: String,
    icon: String,
    desc: String,
    location: String,
    addedby: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        username: String
    },
});

module.exports = mongoose.model('Theatre', theatreSchema);