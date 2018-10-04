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
            parse_mode: "Markdown",
            disable_web_page_preview: false,
            reply_markup : JSON.stringify({
                inline_keyboard: buttons
            })
        }
    },

    //maybe it should not be there
    buildCategoryInfo : function(category) {
        var strDescription = '';
        if(typeof category.description !== 'undefined') {
          strDescription = category.description + '\n\n';
        }
      
        var strDo = '';
        if(typeof category.do !== 'undefined')  {
            for(let j = 0; j<category.do.length; j++) {
                strDo += '✅ ' +  category.do[j] + '\n';
            }
            strDo += '\n\n';
        }
      
        var strDont = '';
        if(typeof category.dont !== 'undefined')  {
            for(let j = 0; j<category.dont.length; j++) {
                strDont += '❌ ' +  category.dont[j] + '\n';
            }
            strDont += '\n\n';
        }
      
        var strSteps = '';
        if(typeof category.steps !== 'undefined')  {
            for(let j = 0; j<category.steps.length; j++) {
                strSteps += 'ℹ ' +  category.steps[j] + '\n';
            }
        }
      
        return strDescription + strDo + strDont + strSteps;
    }
}

module.exports = BotUtils;