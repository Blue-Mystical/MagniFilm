var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');

var logoSchema = new mongoose.Schema({
    name: String,
    priority: Number,
    image: String
});

logoSchema.plugin(mongoosepaginate);
module.exports = mongoose.model('Logo', logoSchema);