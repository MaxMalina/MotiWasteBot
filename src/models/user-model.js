var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id : Number,
    username : String,
    number : String,
    firstName : String,
    lastName : String
});

var User = mongoose.model('user', UserSchema);

module.exports = User;