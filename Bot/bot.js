const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = '!';

let emptyArray = new Array();
var PlayerArray = new Array();
var PlayerQueueString = "";
let matchSize = 2;
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus("online");
});

client.on('message', msg => {
  if(!msg.content.startsWith(prefix) || msg.author.bot) return;               // Ignore all commands that arent commands.

  const args = msg.content.slice(prefix.length).split(' ');                   // Split the commands and args.
  const command = args.shift().toLowerCase();

  printDebug(args, command, msg);                                             // Used to debug can be disabled later.

  if(command == 'queue'){
    addPlayerToQueue(command, msg);
  }
  if(command == 'clear'){
    clearPlayerQueue(msg);
  }

});

client.login(auth.token);

function popQueue(messageDebug){
  var stringConcat = "";
  PlayerArray.forEach(player => {
    stringConcat = stringConcat + "" + player + "";
  })

  messageDebug.channel.send(stringConcat);
}

function addPlayerToQueue(commandArg, messageDebug){
  var messageUsername = messageDebug.author.username;

  messageDebug.reply('Added to queue!');
  PlayerArray.push(messageDebug.author);
  messageUsername = messageUsername + "\n";

  if(PlayerQueueString == ""){
    PlayerQueueString = messageUsername;
  }else{
    PlayerQueueString = PlayerQueueString + messageUsername;
  }
  printQueue(messageDebug);

  if(PlayerArray.length == matchSize){
    popQueue(messageDebug);
  }
}

function clearPlayerQueue(messageDebug){
  messageDebug.reply('Cleared the queue!');
  PlayerArray.length = emptyArray;
  PlayerQueueString = "";
  printQueue(messageDebug);
}

function printQueue(message){
  message.channel.send('```[Queue]\n' + PlayerQueueString + '```');
}

function printDebug(args, command, messageDebug){
  if(command == 'args'){
    messageDebug.channel.send('Arguments Provided: ' + args + ' ' + messageDebug.author + '!');
  }

  if(command == 'ping'){
    messageDebug.reply('pong');
  }
}
