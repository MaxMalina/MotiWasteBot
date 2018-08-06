var BotUtils = {
    getClientInfo: function (message) {
        return {
            username: message.from.username,
            firstName: message.from.first_name,
            lastName: message.from.last_name,
            telegramId:  message.hasOwnProperty('chat') ? message.chat.id : message.from.id
        };
    },

    getLastMessageText: function (message) {
        return message.text;
    },

    buildMessageOptions: function (buttons) {
        return {
            parse_mode: "HTML",
            disable_web_page_preview: false,
            reply_markup : JSON.stringify({
                inline_keyboard: buttons
            })
        }
    }
}

module.exports = BotUtils;