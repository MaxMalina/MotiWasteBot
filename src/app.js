const request = require('request');
const TelegramBot = require('node-telegram-bot-api');

var ConfigBuilder = require('./utils/config-builder');
var config = ConfigBuilder.build('development');

const token = config.telegramToken;

const bot = new TelegramBot(token, {polling: true});

var categoryArrNetwork;

request('https://recyclemap.org/api/categories', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  categoryArrNetwork = body;
});

var fullInfoNetwork;

request('https://recyclemap.org/api/places', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  fullInfoNetwork = body;
});

var users = [];

bot.on('location', (msg) => {
    const chatId = msg.chat.id;

    var categoryId;
    for(let i = 0; i<users.length; i++){
      if(users[i].chatId == chatId){
        categoryId = users[i].categoryId;
      }
    }

    var category;
    for(let i = 0; i < categoryArrNetwork.length; i++) {
      if(categoryArrNetwork[i]._id == categoryId) {
        category = categoryArrNetwork[i].type;
      }
    }

    var location = new Location(msg.location.latitude, msg.location.longitude);
    var points = []
    for(let i = 0; i < fullInfoNetwork.length; i++){
      var jsonContent = fullInfoNetwork[i];
      points.push(new Location(jsonContent.loc.coordinates[1], jsonContent.loc.coordinates[0]))
    }

    let minIndex = 0;
    let nearestPoint = points[0];
    let minDistance = points[0].distanceToMe(location);
    for(let i = 0; i < points.length; i++) {
      let currentDisntance = points[i].distanceToMe(location);
      if(fullInfoNetwork[i].categories.includes(category) && currentDisntance < minDistance){
          minDistance = currentDisntance;
          nearestPoint = points[i];
          minIndex = i;
      }
    }

    bot.sendMessage(chatId, fullInfoNetwork[minIndex].name + '\n' + fullInfoNetwork[minIndex].address + '\n' + fullInfoNetwork[minIndex].workingHours + '\n*' + fullInfoNetwork[minIndex].categories + '*', {parse_mode: 'Markdown'});
    bot.sendLocation(chatId, nearestPoint.latitude, nearestPoint.longitude);
    bot.sendMessage(chatId, Math.round(minDistance) + ' метрiв');
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
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
  bot.sendMessage(msg.chat.id, 'Привiт! Я бот, котрий допоможе тобi долучитися до вирiшення проблем переробки смiття!', options);
});

bot.onText(/\/find/, (msg) => { chooseCategory(msg.chat.id); });

bot.on('callback_query', function (msg) {
  if(msg.data === '1') { chooseCategory(msg.message.chat.id); } 
  if(msg.data === '2') { chooseCategory(msg.message.chat.id); }
  if(msg.data === '3') { 
    bot.sendMessage(msg.message.chat.id, 'Щоб додати пункт прийому вторинної сировини, заповни цю форму: bit.ly/2NPuvpT');  
  } 
  if(msg.data === '4') { 
    bot.sendMessage(msg.message.chat.id, 'Ти можеш на написати нам пошту team.motiwaste@gmail.com або у телеграмі @yehorkuzmin');
  } else {
    for(let i = 0; i < categoryArrNetwork.length; i++) {
      if(msg.data == categoryArrNetwork[i]._id){
        let added = false;
        if(typeof users !== 'undefined' && users.length > 0){
          for(let j = 0; j<users.length; j++) {
            if(users[j].chatId == msg.message.chat.id){
              users[j].categoryId = categoryArrNetwork[i]._id;
              added = true;
            }
          }
        }

        if(!added) {
          users.push(new User(msg.message.chat.id, msg.data))
          added = true;
        }

        bot.sendMessage(msg.message.chat.id, categoryArrNetwork[i].description);
        bot.sendMessage(msg.message.chat.id, "Вiдправ менi, будь-ласка, свою геолокацiю")
      }
    }
  }
});

class User {
  constructor(chatId, categoryId) {
    this.chatId = chatId;
    this.categoryId = categoryId;
  }
}

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

function chooseCategory(chatId) {
  let result = [];
  for (let i = 0; i < categoryArrNetwork.length; i++) {
    result.push([{ text: categoryArrNetwork[i].name, callback_data: categoryArrNetwork[i]._id }]);
  }
  var options = {
    reply_markup: JSON.stringify({
      inline_keyboard: result
    })
  };
  bot.sendMessage(chatId, 'Який тип смiття хочеш здати?', options);
}