const Discord = require("discord.js");
const config = require("./config.json");
const axios = require('axios');

const client = new Discord.Client();
const prefix = "/";

client.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }

    if (command === "server") {
        if (args[0] === "status") {
            axios.get(`https://api.mcsrvstat.us/2/${config.SERVER_IP}`, {})
                .then(function (response) {
                    if (response.data.online === true) {
                        const fancyEmbed = {
                            color: 0x53E74F,
                            title: 'Server Status',
                            description: `The server is **Online** 
                            **${response.data.players.online}**/${response.data.players.max}`,
                            fields:[],
                            timestamp: new Date(),
                        };  

                        if( response.data.players.online !== '0' ) {                            
                            response.data.players.list.forEach(player => {
                                fancyEmbed.fields.push({ name: player, value: "------", inline: true,})
                            });
                        }
                        
                        message.reply({embed: fancyEmbed});
                    } else {
                        const fancyEmbed = {
                            color: 0xE74F4F,
                            title: 'Server Status',
                            description: `The server is **Offline**`,
                            timestamp: new Date(),
                        };  

                        message.reply({embed: fancyEmbed});
                    }

                })
                .catch(function (error) {
                    console.log(error);
                    message.reply(`Sorry something went wrong catching the data!`);
                })
                .then(function () {
                    // always executed
                });
        }
    }
});


client.login(config.BOT_TOKEN);