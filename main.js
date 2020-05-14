require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.client();

client.on('ready', () => {
    console.log('Logged in as ${client.user.tag}!');
});

client.login(process.env.DISCORD_TOKEN);