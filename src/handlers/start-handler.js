var BotUtils = require('../utils/bot-utils');
var UserService = require('../services/user-service');

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

            const chatId = message.from.id;
            var options = {
              reply_markup: JSON.stringify({
                inline_keyboard: [
                  [{ text: 'Найближчий пункт прийому вторсировини', callback_data: '1' }],
                  [{ text: 'Як підготувати сміття до утилізації', callback_data: '2' }],
                  [{ text: 'Додати пункт прийому вторсировини', callback_data: '3' }],
                  [{ text: 'Допомогти проекту', callback_data: '4' }]
                ]
              })
            };
            bot.sendMessage(chatId, 'Привiт! Я бот, котрий допоможе тобi долучитися до вирiшення проблем переробки смiття!', options);          
        });
    }
};

module.exports = StartHandler;