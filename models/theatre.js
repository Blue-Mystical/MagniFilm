var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');

var theatreSchema = new mongoose.Schema({
    theatrename: String,
    icon: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'logo'
        },
        image: String
    },
    desc: String,
    location: String,
    priority: Number,
    addedby: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        username: String
    },
    movielist: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movie'
        },
        image: String
    }]
});

theatreSchema.plugin(mongoosepaginate);
module.exports = mongoose.model('Theatre', theatreSchema);