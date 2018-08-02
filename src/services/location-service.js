var LocationModel = require('../models/location-model');

var LocationService = {
    getByCategories : function (title, callback) {
        LocationModel.find({categories : title}, function (err, locations) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, locations);
            }
        });
    },

    getAll : function (callback) {
        LocationModel.find({}, function (err, locations) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, locations);
            }
        });
    }
};

module.exports = LocationService;