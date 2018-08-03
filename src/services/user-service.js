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
                    number: userInfo.number,
                    fistName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    lastActivity: new Date()
                });

                Logger.notify('Trying to save new user ');
                newUserDto.save(function (err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, true);
                    }
                });
            }else{
                callback(null, false);
            }
        })
    }
};

module.exports = UserService;