const axios = require('axios');
const config = require("./config.json");

module.exports = {
    ping: (interaction) => {
        const timeTaken = Date.now() - createdAt;
        interaction.reply({
            content: `Pong! This message had a latency of ${timeTaken}ms.`,
            ephemeral: true
        });
    },
    status: (interaction) => {
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
    },
    add: (interaction, options) => {
        const num1 = options.getNumber('num1');
        const num2 = options.getNumber('num2');
        const result = num1 + num2;
        interaction.reply({
            content: `${num1} + ${num2} = ${result}`,
            ephemeral: true
        });
    },
}