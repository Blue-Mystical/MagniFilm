var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');

var newsSchema = new mongoose.Schema({
    title: String,
    caption: String,
    image: String,
    newsdate: { type: Date, default: Date.now },
    contents: [{
        _id: false,
        ctype: String, // avaiable types: text, image
        content: String,
        order: Number
    }],
    viewcount: { type: Number, default: 0 },
    likecount: { type: Number, default: 0 },
    newstype: String, // promo or news
    featured: { type: Boolean, default: false },
    haspage: { type: Boolean, default: true }
});

newsSchema.plugin(mongoosepaginate);
module.exports = mongoose.model('News', newsSchema);