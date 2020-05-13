const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = '!q- ';

var PlayerArray = new Array();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
    clearPlayerQueue();
  }

});

client.login(auth.token);

function addPlayerToQueue(commandArg, messageDebug){
  messageDebug.reply('Added to queue!');
  PlayerArray.push(messageDebug.author);
  messageDebug.channel.send('[Debug] ' + PlayerArray.length);
}

function clearPlayerQueue(){
  PlayerArray = new Array();
}

function printDebug(args, command, messageDebug){
  if(command == 'args'){
    messageDebug.channel.send('Arguments Provided: ' + args + ' ' + messageDebug.author + '!');
  }

  if(command == 'ping'){
    messageDebug.reply('pong');
  }
}
