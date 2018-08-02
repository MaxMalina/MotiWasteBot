var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    _id : String,
    type : String,
    name : String
});

var Category = mongoose.model('category', CategorySchema);

module.exports = Category;