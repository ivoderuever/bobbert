const axios = require('axios');
const config = require("./config.json");
const { documentGet, documentStore } = require('./document');   // Document handler


module.exports = {
    ping: (interaction, createdAt) => {
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
    mark: (interaction, options) => {
        let currentDoc = documentGet();
        const type = options.getString('type').toLowerCase();
        const name = options.getString('name').toLowerCase().replace(" ", '');
        const x = options.getNumber('x');
        const z = options.getNumber('z');
        let y = options.getString('y')

        let fullCords = `${x}/${y}/${z}`;

        let chordObj = {
            name: name,
            coordinates: fullCords,
        }

        function store() {
            currentDoc[type].push(chordObj);
            documentStore(currentDoc);
            interaction.reply({
                content: `Coordinates for ${name} in ${type}: ${fullCords} are stored`,
            });
            return;
        }

        try {
            if (currentDoc[type].length != 0) {
                function isUsed(n) {
                    return n.name === name;
                }
                if (currentDoc[type].find(isUsed) == undefined) {
                    store();
                } else {
                    interaction.reply({
                        content: `${name} already exists!`,
                        ephemeral: true
                    });
                }
            } else {
                store();
            }
        } catch (error) {
            console.log(error);
            interaction.reply({
                content: `${type} does not exist! Try home, overworld, nether or end.`,
                ephemeral: true
            });
        }
    },
    unmark: (interaction, options) => {
        let currentDoc = documentGet();
        const type = options.getString('type').toLowerCase();
        const name = options.getString('name').toLowerCase().replace(" ", '');


        function store() {
            currentDoc[type].splice(itemToRemoveIndex, 1);
            documentStore(currentDoc);
            interaction.reply({
                content: `${name} is removed from the ${type} list`,
            });
            return;
        }

        const itemToRemoveIndex = currentDoc[type].findIndex(function (item) {
            return item.name === name;
        });

        try {
            if (itemToRemoveIndex !== -1) {
                store();
            } else {
                interaction.reply({
                    content: `${name} does not exist!`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.log(error);
            interaction.reply({
                content: `${type} does not exist! Try home, overworld, nether or end.`,
                ephemeral: true
            });
        }
    },
}