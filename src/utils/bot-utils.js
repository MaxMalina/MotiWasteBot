var BotUtils = {
    getClientInfo: function (message) {
        return {
            username: message.from.username,
            firstName: message.from.first_name,
            lastName: message.from.last_name,
            telegramId:  message.hasOwnProperty('chat') ? message.chat.id : message.from.id
        };
    }
}

module.exports = BotUtils;