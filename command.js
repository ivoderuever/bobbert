const config = require("./config.json");
const { Constants } = require('discord.js');

module.exports = {
    command: (client) => {
        // console.log(client)
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

        commands?.create({
            name: 'mark',
            description: 'Add coordinate',
            options: [
                {
                    name: 'type',
                    description: 'home, overworld, nether, end',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true
                },
                {
                    name: 'name',
                    description: 'the name or description of the location',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true
                },
                {
                    name: 'x',
                    description: 'x cordinate',
                    type: Constants.ApplicationCommandOptionTypes.NUMBER,
                    required: true
                },
                {
                    name: 'y',
                    description: 'y coordinate. enter * when not specified',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true
                },
                {
                    name: 'z',
                    description: 'z coordinate',
                    type: Constants.ApplicationCommandOptionTypes.NUMBER,
                    required: true
                },
            ]
        })

        commands?.create({
            name: 'unmark',
            description: 'Remove coordinate',
            options: [
                {
                    name: 'type',
                    description: 'home, overworld, nether, end',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true
                },
                {
                    name: 'name',
                    description: 'the name or description of the location',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        })
    }
}