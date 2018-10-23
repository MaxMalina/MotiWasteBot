var BotUtils = require('../utils/bot-utils');
const text = require('../utils/bot-text');

var HowToHandler = {
    register: function (bot, categoryArr) {
        var clientMessage = new RegExp('\/howto');

        bot.onText(clientMessage, function (message, match) {
            HowToHandler.sendCategoriesHowTo(bot, message, categoryArr);   
        });
    },

    sendCategoriesHowTo: function(bot, message, categoryArr){
        let result = [];
        for (let i = 0; i < categoryArr.length; i++) {
            result.push([{ text: categoryArr[i].name, callback_data: '999' + categoryArr[i]._id }]);
        }

        var options = BotUtils.buildMessageOptions(result);
        bot.sendMessage(message.from.id, text.messages.wasteType, options);
    }
};

module.exports = HowToHandler;