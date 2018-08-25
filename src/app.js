const request = require('request');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const StartHandler = require('./handlers/start-handler');
const SecretHandler = require('./handlers/secret-handler');

const LocationService = require('./services/location-service');
const CategoryService = require('./services/category-service');

const BotUtils = require('./utils/bot-utils');
const ConfigBuilder = require('./utils/config-builder');
const text = require('./utils/bot-text');
const config = ConfigBuilder.build('production');

const token = config.telegramToken;
mongoose.connect(config.connectionString, { useMongoClient: true });

LocationService.getAll(function (err, locations) {
  if (err) {
    console.log(err.message)
  }

  console.log(locations);
});

LocationService.getByCategories("pet", function (err, locations) {
  if (err) {
    console.log(err.message)
  }

  console.log(locations);
});


var categoryArrNetwork = [];
CategoryService.getAll(function (err, categories) {
  if (err) {
    console.log(err.message)
  }
  
  categories.forEach(element => {
    categoryArrNetwork.push(element._doc);
  });
});

const bot = new TelegramBot(token, {polling: true});

//request('https://recyclemap.org/api/categories', { json: true }, (err, res, body) => {
//  if (err) { return console.log(err); }
//  categoryArrNetwork = body;
//});

var fullInfoNetwork;
request('https://recyclemap.org/api/places', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  fullInfoNetwork = body;
});

var users = [];

bot.on('location', (msg) => {
    const chatId = msg.from.id;

    var categoryId;
    for(let i = 0; i<users.length; i++){
      if(users[i].chatId == chatId){
        categoryId = users[i].categoryId;
      }
    }

    var categoryType;
    for(let i = 0; i < categoryArrNetwork.length; i++) {
      if(categoryArrNetwork[i]._id == categoryId) {
        categoryType = categoryArrNetwork[i].type;
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
      if(fullInfoNetwork[i].categories.includes(categoryType) && currentDisntance < minDistance){
          minDistance = currentDisntance;
          nearestPoint = points[i];
          minIndex = i;
      }
    }

    //TODO : extract to Method
    var categoriesInLocation = [];
    for(let i = 0; i < fullInfoNetwork[minIndex].categories.length; i++) {
      for(let j = 0; j < categoryArrNetwork.length; j++) {
        if(categoryArrNetwork[j].type == fullInfoNetwork[minIndex].categories[i]) {
          categoriesInLocation.push(categoryArrNetwork[j].name)
        }
      }
    }

    var strMessage = fullInfoNetwork[minIndex].name + '\n' + 
                    fullInfoNetwork[minIndex].address + '\n' + 
                    fullInfoNetwork[minIndex].workingHours + '\n\n*';
    
    categoriesInLocation.forEach(categoryName => {
      strMessage += categoryName + '\n'
    })
    strMessage += '*' + '\n' + Math.round(minDistance) + text.messages.meters;

    bot.sendMessage(chatId, strMessage, {parse_mode: 'Markdown'});
    bot.sendLocation(chatId, nearestPoint.latitude, nearestPoint.longitude);
});


StartHandler.register(bot);
SecretHandler.register(bot);

bot.onText(/\/find/, (msg) => { chooseCategory(msg.from.id); });

bot.on('callback_query', function (msg) {
  if(msg.data === '1') { chooseCategory(msg.from.id); } 
  if(msg.data === '2') { chooseCategory(msg.from.id); }
  if(msg.data === '3') { 
    bot.sendMessage(msg.from.id, text.info.addAddresInfo);  
  } 
  if(msg.data === '4') { 
    bot.sendMessage(msg.from.id, text.info.contacts);
  } else {
    for(let i = 0; i < categoryArrNetwork.length; i++) {
      if(msg.data == categoryArrNetwork[i]._id){
        let added = false;
        if(typeof users !== 'undefined' && users.length > 0){
          for(let j = 0; j<users.length; j++) {
            if(users[j].chatId == msg.from.id){
              users[j].categoryId = categoryArrNetwork[i]._id;
              added = true;
            }
          }
        }

        if(!added) {
          users.push(new User(msg.from.id, msg.data))
          added = true;
        }

        bot.sendMessage(msg.from.id, categoryArrNetwork[i].description);
        bot.sendMessage(msg.from.id, text.messages.geolocationRequest)
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
  const chatId = msg.from.id;
  bot.sendMessage(chatId, text.messages.thanksForPhoto);
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

  var options = BotUtils.buildMessageOptions(result);
  bot.sendMessage(chatId, text.messages.wasteType, options);
}
