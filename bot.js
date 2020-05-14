const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const prefix = "!";

let emptyArray = new Array();
var PlayerArray = new Array();
var popFlashURL = "https://i.imgflip.com/2e1lxv.jpg"; // Links to image if people dont set it.
let matchSize = 1;

const exampleEmbed = {
  color: 0xff0000,
  title: "",
  description: "",

  timestamp: new Date(),
  footer: {
    text: ""
  }
};

const popEmbed = {
  color: 0xff0000,
  title: "LINK",
  url: popFlashURL,
  author: {
    name: "QUEUE POPPED!"
  },
  thumbnail: {
    url: "https://pbs.twimg.com/profile_images/925581445455863808/m9XWlq_5_400x400.jpg"
  }
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus("online");
  PlayerArray.length = 0;
});

client.on("message", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return; // Ignore all commands that arent commands.

  const args = msg.content.slice(prefix.length).split(" "); // Split the commands and args.
  const command = args.shift().toLowerCase();

  printDebug(args, command, msg); // Used to debug can be disabled later.

  // Admin Commands
  if (command == "setpf") {
    setPopFlashLink(args, msg);
  }

  if (command == "setmatchsize") {
    setMatchSize(args, msg);
  }

  if (command == "queue") {
    addPlayerToQueue(command, msg);
  }
  if (command == "leave") {
    removePlayerFromQueue(msg);
  }
  if (command == "print") {
    printQueue(msg);
  }
  if (command == "clear") {
    clearPlayerQueue(msg);
  }
});

client.login(auth.token);

// Autonimous game functions.

function popQueue(messageDebug) {
  var stringConcat = "";

  if (popFlashURL == "https://i.imgflip.com/2e1lxv.jpg") {
    messageDebug.channel.send();
    exampleEmbed.title =
      "[ERROR] POP FLASH LINK NOT SET IT WILL NOT LINK ANYWHERE DUMB DUMB!";
    exampleEmbed.color = 0xff00b7;
    exampleEmbed.footer.text = "set it with !setPF";
    messageDebug.channel.send({ embed: exampleEmbed });
    exampleEmbed.color = 0xff0000;
  }

  messageDebug.channel.send({ embed: popEmbed });

  PlayerArray.forEach(player => {
    if (player != "") {
      stringConcat = stringConcat + "<@" + player + ">";
    }
  });

  messageDebug.channel.send(stringConcat);
}

// Command functions

/// Queue Related

function addPlayerToQueue(commandArg, messageDebug) {
  if (PlayerArray.indexOf(messageDebug.author) != -1) {
    exampleEmbed.title =
      "**" + messageDebug.author.username + "**" + " is already in the queue!";
  } else {
    PlayerArray.push(messageDebug.author);
    exampleEmbed.title =
      "**" +
      messageDebug.author.username +
      "**" +
      " has been added to the queue" +
      " (" +
      PlayerArray.length +
      "/" +
      matchSize +
      ") ";
  }

  exampleEmbed.description = "";
  exampleEmbed.footer.text = "";

  messageDebug.channel.send({ embed: exampleEmbed });
  //printQueue(messageDebug);

  if (PlayerArray.length == matchSize) {
    popQueue(messageDebug);
  }
}

function removePlayerFromQueue(messageDebug) {
  var deleteIndex = 999;

  for (var i = 0; i < PlayerArray.length; i++) {
    if (PlayerArray[i] == messageDebug.author) {
      // If we find the player then record the index and stop the loop.
      deleteIndex = i;
      messageDebug.reply('hi');
      break;
    }
  }

  if (deleteIndex != 999) {
    delete PlayerArray[deleteIndex]; // If we have found the player then delete them from the array.
    PlayerArray.length -= 1;
  }
  messageDebug.reply('was removed from the queue');
}

function clearPlayerQueue(messageDebug) {
  messageDebug.reply("Cleared the queue!");
  PlayerArray.length = emptyArray;
}

function printQueue(messageDebug) {
  exampleEmbed.title =
    "Queue" + " (" + PlayerArray.length + "/" + matchSize + ")";

  var stringConcat = "";
  PlayerArray.forEach(player => {
    stringConcat = stringConcat + "<@" + player + ">" + "\n";
  });

  exampleEmbed.description = stringConcat;

  messageDebug.channel.send({ embed: exampleEmbed });
}

/// Setting Related

function setPopFlashLink(Arguments, messageDebug) {
  if (Arguments.length == 0) {
    messageDebug.reply("No Arguments recieved!");
    return;
  }
  popFlashURL = Arguments.toString();
  popEmbed.url = popFlashURL;
  messageDebug.reply("PopFlash link updated!");
}

function setMatchSize(Arguments, messageDebug) {
  messageDebug.reply("Match size set to: " + Arguments);
  matchSize = parseInt(Arguments.toString());
}

// Helper Functions

function printDebug(args, command, messageDebug) {
  if (command == "args") {
    messageDebug.channel.send(
      "Arguments Provided: " + args + " " + messageDebug.author + "!"
    );
  }

  if (command == "ping") {
    messageDebug.reply("pong");
  }
}
