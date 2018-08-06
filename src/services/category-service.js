var CategoryModel = require('../models/category-model');

var CategoryService = {
    getAll : function (callback) {
        CategoryModel.find({}, function (err, categories) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, categories);
            }
        });
    },

    getById : function (id, callback) {
        CategoryModel.findOne({_id : id}, function (err, category) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, category);
            }
        });
    },

    getByType : function (type, callback) {
        CategoryModel.findOne({type : type}, function (err, categories) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, categories);
            }
        });
    },

    getByName : function (name, callback) {
        CategoryModel.findOne({name : name}, function (err, categories) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, categories);
            }
        });
    }
}

module.exports = CategoryService;