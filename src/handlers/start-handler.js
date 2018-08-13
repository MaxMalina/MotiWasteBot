var BotUtils = require('../utils/bot-utils');
var UserService = require('../services/user-service');
const text = require('../utils/bot-text');

var StartHandler = {
    register: function (bot) {
        var clientMessage = new RegExp('\/start');

        bot.onText(clientMessage, function (message, match) {
            var clientInfo = BotUtils.getClientInfo(message);

            console.dir(message);

            UserService.saveUser(clientInfo, function (saveErr, result) {
                if (saveErr) {
                    bot.sendMessage(clientInfo.telegramId, 'Some error! Sorry');
                    return;
                }
            });

            var buttons = [
                [{ text: text.buttons.mainMenu.nearestAddress, callback_data: '1' }],
                [{ text: text.buttons.mainMenu.howToPrepareWaste, callback_data: '2' }],
                [{ text: text.buttons.mainMenu.addAddress, callback_data: '3' }],
                [{ text: text.buttons.mainMenu.helpProject, callback_data: '4' }]
            ];

            var options = BotUtils.buildMessageOptions(buttons);
            bot.sendMessage(clientInfo.telegramId, text.info.mainMenu, options);          
        });
    }
};

module.exports = StartHandler;