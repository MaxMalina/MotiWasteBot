const fs = require('fs');

const TelegramBot = require('node-telegram-bot-api');
const token = '580175305:AAFpPnRk_jw7l043BFJEaNsCt7pA4-9N5yw';
const bot = new TelegramBot(token, {polling: true});

const categoryArr = JSON.parse(fs.readFileSync('categories.json', 'utf8'));
const fullInfo = JSON.parse(fs.readFileSync('full_info.json', 'utf8'));

bot.on('location', (msg) => {
    const chatId = msg.chat.id;

    var location = new Location(msg.location.latitude, msg.location.longitude);
    var points = []
    for(let i = 0; i < fullInfo.length; i++){
      var jsonContent = fullInfo[i];
      points.push(new Location(jsonContent.loc.coordinates[1], jsonContent.loc.coordinates[0]))
    }

    let minIndex = 0;
    let nearestPoint = points[0];
    let minDistance = points[0].distanceToMe(location);
    for(let i = 0; i < points.length; i++) {
      let currentDisntance = points[i].distanceToMe(location);
      if(currentDisntance < minDistance){
          minDistance = currentDisntance;
          nearestPoint = points[i];
          minIndex = i;
      }
    }

    bot.sendMessage(chatId, fullInfo[minIndex].name + '\n' + fullInfo[minIndex].address + '\n' + fullInfo[minIndex].workingHours);
    bot.sendLocation(chatId, nearestPoint.latitude, nearestPoint.longitude);
    bot.sendMessage(chatId, Math.round(minDistance) + ' метрiв');
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  var options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Знайти найближчий пункт переробки', callback_data: '1' }],
        [{ text: 'Вiдсканувати QR-код', callback_data: '2' }]
      ]
    })
  };
  bot.sendMessage(msg.chat.id, 'Привiт! Я бот, який допоможе тобi долучитися до вирiшення проблем переробки смiття', options);
});

bot.on('callback_query', function (msg) {
  if(msg.data === '1') {
    let result = []

    for(let i = 0; i < categoryArr.length; i++) {
      result.push([{ text : categoryArr[i].name, callback_data : categoryArr[i]._id}])
    }
    var options = {
      reply_markup: JSON.stringify({
        inline_keyboard : result 
      })
    };
  bot.sendMessage(msg.message.chat.id, 'Який тип смiття хочеш здати?', options);
  } if(msg.data === '2') {
    bot.sendMessage(msg.message.chat.id, "Вiдправ менi, фотографiю QR-coda iз точки переробки")  
  } else {
    for(let i = 0; i < categoryArr.length; i++) {
      if(msg.data == categoryArr[i]._id){
        bot.sendMessage(msg.message.chat.id, categoryArr[i].description);
        bot.sendMessage(msg.message.chat.id, "Вiдправ менi, будь-ласка, свою геолокацiю")
      }
    }
  }
});

bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Дякую за твiй QR-code');
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  //bot.sendMessage(chatId, 'Received your message');
});


var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.latitude - p1.latitude);
    var dLong = rad(p2.longitude - p1.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

class Location {
    constructor(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
    }

    distanceToMe(p2) {
      return getDistance(this, p2)
    }
}