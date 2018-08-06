var BotUtils = require('../utils/bot-utils');
var UserService = require('../services/user-service');

const LENGTH_OF_SECRET_COMMAND_WITH_SPACE = 6;

var SecretHandler = {
    register: function (bot) {
        var clientMessage = new RegExp('\/0451');

        bot.onText(clientMessage, function (message, match) {
            UserService.getAll(function (err, users) {
                if (err) {
                    bot.sendMessage(clientInfo.telegramId, 'Some error! Sorry');
                    return;
                } else {
                    var text = BotUtils.getLastMessageText(message);
                    users.forEach(user => {
                        bot.sendMessage(user._id, text.substring(LENGTH_OF_SECRET_COMMAND_WITH_SPACE));  
                    });
                }
            });
        });
    }
};

module.exports = SecretHandler;