var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');

var promoSchema = new mongoose.Schema({
    title: String,
    caption: String,
    image: String,
    content: String,
    type: String, // promo or news
    featured: Boolean
});

promoSchema.plugin(mongoosepaginate);
module.exports = mongoose.model('Promotion', promoSchema);