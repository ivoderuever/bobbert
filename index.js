const { Client, Intents } = require('discord.js');
const { interAct } = require('./interaction');   // Interaction handler
const { command } = require('./command');   // Command handler
const config = require("./config.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => { command(client) });

client.on('interactionCreate', (interaction) => { interAct(interaction) });

client.login(config.BOT_TOKEN);