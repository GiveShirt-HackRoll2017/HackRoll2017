const TeleBot = require('telebot');
const bot = new TeleBot('262060499:AAHX2loPHB-kv40OedIwVOrGUrhmQTVc-jI');

// Use ask module
// bot.use(require('../HackNRoll2017/node_modules/telebot/modules/ask.js'));
bot.use(require('../HackRoll2017/node_modules/telebot/modules/ask.js'));

// Command keyboard
const markup = bot.keyboard([
  ['/food', '/exam', '/about']
], { resize: true, once: false });

// Log every text message
bot.on('text', function(msg) {
  console.log(`[text] ${ msg.chat.id } ${ msg.text }`);
});

// On command "start" or "help"
bot.on(['/start', '/help'], function(msg) {

  return bot.sendMessage(msg.chat.id,
    'Use commands: /food, /exam', { markup }
  );

});

On command "about"
bot.on('/about', function(msg) {

  let text = 'This bot is created for NUS HackNRoll2017. Developed by Leonard and Brandon Yeo';

  return bot.sendMessage(msg.chat.id, text);

});

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


bot.on(['/food'], function(msg) {

  let promise;
  let id = msg.chat.id;
  let cmd = msg.text.split(' ')[0];

  //read yelp json
  var fs = require('fs');
  var obj;
  fs.readFile('yelp_sample_data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);

    var num = randomIntInc(0, obj.businesses.length-1)
    
    promise = bot.sendPhoto(id, obj.businesses[num].image_url, { fileName: 'food.jpg' });


    // Send "uploading photo" action
    bot.sendAction(id, 'upload_photo');

    bot.sendMessage(msg.chat.id, obj.businesses[num].name + "\n" + obj.businesses[num].location.display_address[0] + " " + obj.businesses[num].location.display_address[1]);
  
    return promise.catch(error => {
      console.log('[error]', error);
      // Send an error
      bot.sendMessage(id, `😿 An error ${ error } occurred, try again.`);
    });

  });

});

bot.on(['/exam'], function(msg) {

  let id = msg.chat.id;
  return bot.sendMessage(id, 'What is your module code?', { ask: 'modCode' });

});

// Ask modcode event
bot.on('ask.modCode', msg => {

  const id = msg.from.id
  const modCode = msg.text;

  //read moduleDetails json
  var fs = require('fs');
  var object;
  fs.readFile('moduleDetails.json', 'utf8', function (err, data) {
    if (err) throw err;
    object = JSON.parse(data);

    for(var i=0; i<object.length; i++) {

      if (object[i].ModuleCode == modCode) {

        bot.sendMessage(msg.chat.id, object[i].ModuleDesc.ExamDate + "\n" + object[i].ModuleDesc.ExamDuration + "\n" + object[i].ModuleDesc.ExamVenue);

      }

    }

  });

});

// Start getting updates
bot.connect();