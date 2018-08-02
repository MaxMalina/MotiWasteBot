var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    website : String,
    address : String,
    phone : String,
    name : String,
    coordinates : Array,
    description : String,
    _id : String,
    categories : Array,
    workingHours : String,
    email : String
});

var Location = mongoose.model('location', LocationSchema);

module.exports = Location;