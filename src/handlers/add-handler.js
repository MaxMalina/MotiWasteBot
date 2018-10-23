const text = require('../utils/bot-text');

var AddHandler = {
    register: function (bot) {
        var clientMessage = new RegExp('\/add');

        bot.onText(clientMessage, function (message, match) {
            AddHandler.sendAddInfo(bot,message);
        });
    },

    sendAddInfo: function(bot, message){
        bot.sendMessage(message.from.id, text.info.addAddresInfo);
    }
};

module.exports = AddHandler;