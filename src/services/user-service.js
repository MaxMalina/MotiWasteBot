var UserModel = require('../models/user-model');

var UserService = {
    getAll: function (callback) {
        UserModel.find({}, function (err, users) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, users);
            }
        })
    },

    getById: function (telegramId, callback) {
        UserModel.findOne({_id: telegramId}, function (err, user) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, user);
            }
        })
    },

    updateLastActivity: function (telegramId, callback) {
        UserModel.findOne({_id: telegramId}, function (err, user) {
            if (err) {
                callback(err, null);
            } else {
                user.lastActivity = new Date();
                user.save();
                //callback(null, true);
            }
        });
    },

    isNew: function (telegramId, callback) {
        UserModel.findOne({_id: telegramId}, function (err, existingUser) {
            if (err) {
                callback(err, null);
                return;
            }
            if (existingUser) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        });
    },

    saveUser: function (userInfo, callback) {
        this.isNew(userInfo.telegramId, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result) {
                var newUserDto = new UserModel({
                    _id: userInfo.telegramId,
                    username: userInfo.username,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    lastActivity: new Date()
                });

                newUserDto.save(function (err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, true);
                    }
                });
            }else{
                UserService.updateLastActivity(userInfo.telegramId, {});
                callback(null, false);
            }
        })
    }
};

module.exports = UserService;