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
    },

    buildCategoryInfo : function(category) {
        var strDescription = '';
        if(typeof category.description !== 'undefined') {
          strDescription = category.description;
        }
      
        var strDo = '';
        for(let j = 0; j<category.do.length; j++){
          strDo += '✅ ' +  category.do[j] + '\n';
        }
      
        var strDont = '';
        for(let j = 0; j<category.dont.length; j++){
          strDont += '❌ ' +  category.dont[j] + '\n';
        }
      
        var strSteps = '';
        for(let j = 0; j<category.steps.length; j++){
          strSteps += 'ℹ ' +  category.steps[j] + '\n';
        }
      
        return strDescription + '\n\n' + strDo + '\n\n' + strDont + '\n\n' + strSteps;
    }
}

module.exports = BotUtils;