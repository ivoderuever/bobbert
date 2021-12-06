const { Client, Intents, Constants, MessageEmbed } = require('discord.js');
const config = require("./config.json");
const axios = require('axios');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const guildeId = config.GUILD_ID;
    const guild = client.guilds.cache.get(guildeId);
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'ping',
        description: 'Replies with Pong!',
    })

    commands?.create({
        name: 'status',
        description: 'Replies with the server status',
    })

    commands?.create({
        name: 'add',
        description: 'adds two numbers',
        options: [
            {
                name: 'num1',
                description: 'first number',
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                required: true
            },
            {
                name: 'num2',
                description: 'Second number',
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                required: true
            }
        ]
    })
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const { commandName, options, createdAt } = interaction;

    switch (commandName) {
        case 'ping':
            const timeTaken = Date.now() - createdAt;
            interaction.reply({
                content: `Pong! This message had a latency of ${timeTaken}ms.`,
                ephemeral: true
            });
            break;
        case 'status':
            axios.get(`https://api.mcsrvstat.us/2/${config.SERVER_IP}`, {})
                .then(function (response) {
                    if (response.data.online === true) {
                        const fancyEmbed = {
                            color: 0x53E74F,
                            title: 'Server Status',
                            description: `The server is **Online** (${response.data.players.online}/${response.data.players.max})`,
                            fields: [],
                            timestamp: new Date(),
                        };

                        if (response.data.players.online !== 0) {
                            response.data.players.list.forEach(player => {
                                fancyEmbed.fields.push({ name: player, value: "------", inline: true, })
                            });
                        }

                        interaction.reply({
                            embeds: [fancyEmbed],
                        });
                    } else {
                        const fancyEmbed = {
                            color: 0xE74F4F,
                            title: 'Server Status',
                            description: `The server is **Offline**`,
                            timestamp: new Date(),
                        };

                        interaction.reply({
                            embeds: [fancyEmbed],
                        });
                    }

                })
                .catch(function (error) {
                    console.log(error);
                    interaction.reply({
                        content: 'Sorry something went wrong catching the data!',
                        ephemeral: true
                    });
                })
                .then(function () {
                    console.log('Request completed!');
                });
            break;
        case 'add':
            const num1 = options.getNumber('num1');
            const num2 = options.getNumber('num2');
            const result = num1 + num2;
            interaction.reply({
                content: `${num1} + ${num2} = ${result}`,
                ephemeral: true
            });
            break;
    }
});

client.login(config.BOT_TOKEN);