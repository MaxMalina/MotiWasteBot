const text = require('../utils/bot-text');

var HelpHandler = {
    register: function (bot) {
        var clientMessage = new RegExp('\/help');

        bot.onText(clientMessage, function (message, match) {
            HelpHandler.sendHelpInfo(bot,message);
        });
    },

    sendHelpInfo: function(bot, message){
        bot.sendMessage(message.from.id, text.info.contacts);
    }
};

module.exports = HelpHandler;