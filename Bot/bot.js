const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = '!';

let emptyArray = new Array();
var PlayerArray = new Array();
var PlayerQueueString = "";
let matchSize = 10;
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
  if(command == 'leave'){
    removePlayerFromQueue(msg);
  }
  if(command == 'print'){
    printQueue(msg);
  }
  if(command == 'clear'){
    clearPlayerQueue(msg);
  }

});

client.login(auth.token);

// Autonimous game functions.

function popQueue(messageDebug){
  var stringConcat = "";
  PlayerArray.forEach(player => {
    stringConcat = stringConcat + "" + player + "";
  })

  messageDebug.channel.send(stringConcat);
}

// Command functions

function addPlayerToQueue(commandArg, messageDebug){

  messageDebug.reply('Added to queue!');
  PlayerArray.push(messageDebug.author);
  printQueue(messageDebug);

  if(PlayerArray.length == matchSize){
    popQueue(messageDebug);
  }
}

function removePlayerFromQueue(messageDebug){
  var deleteIndex = 999;

  for(var i = 0; i < PlayerArray.length; i++){
    if(PlayerArray[i] == messageDebug.author){              // If we find the player then record the index and stop the loop.
      deleteIndex = i;
      break;
    }
  }

  if(deleteIndex != 999){
    delete PlayerArray[deleteIndex];                      // If we have found the player then delete them from the array.
  }
  printQueue(messageDebug);
}

function clearPlayerQueue(messageDebug){
  messageDebug.reply('Cleared the queue!');
  PlayerArray.length = emptyArray;
  PlayerQueueString = "";
  printQueue(messageDebug);
}

function printQueue(message){
  rebuildPlayerListString();                                          // make sure we have the most updated player list to be showing.
  message.channel.send('```[Queue]\n' + PlayerQueueString + '```');
}

// Helper Functions

function rebuildPlayerListString(){
  PlayerQueueString = "";
  PlayerArray.forEach(player => {
    var messageUsername = player.username + "\n";
    if(PlayerQueueString == ""){
      PlayerQueueString = messageUsername;
    }else{
      PlayerQueueString = PlayerQueueString + messageUsername;
    }
  });
}

function printDebug(args, command, messageDebug){
  if(command == 'args'){
    messageDebug.channel.send('Arguments Provided: ' + args + ' ' + messageDebug.author + '!');
  }

  if(command == 'ping'){
    messageDebug.reply('pong');
  }
}
