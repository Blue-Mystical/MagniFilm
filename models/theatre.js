var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');

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

theatreSchema.plugin(mongoosepaginate);
module.exports = mongoose.model('Theatre', theatreSchema);