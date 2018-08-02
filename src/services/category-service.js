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
        CategoryModel.find({_id : id}, function (err, categories) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, categories);
            }
        });
    },

    getByType : function (type, callback) {
        CategoryModel.find({type : type}, function (err, categories) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, categories);
            }
        });
    },

    getByName : function (name, callback) {
        CategoryModel.find({name : name}, function (err, categories) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, categories);
            }
        });
    }
}

module.exports = CategoryService;