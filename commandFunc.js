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
        const name = options.getString('name').toLowerCase().replace(" ", '-');
        const x = options.getNumber('x');
        const z = options.getNumber('z');
        const y = options.getString('y');

        let fullCords = `${x}/${y}/${z}`;

        if (Number.isInteger(y) || y === '*') {
            try {
                function isUsed(n) {
                    return n.name === name;
                }
                if (currentDoc[type].find(isUsed) != undefined) {
                    let newTempName;
                    function nameExists(na) {
                        let newName;
                        // Check if the name already exists
                        function isUsed2(n) {
                            return n.name === na;
                        }
                        if (currentDoc[type].find(isUsed2) != undefined) {
                            let nameArray = na.split('(');
                            let nameArray2;
    
                            //if there is a ( in the name
                            if (nameArray.length > 1) {
                                nameArray2 = nameArray[1].split(')');
                                newName = nameArray[0] + '(' + (parseInt(nameArray2[0]) + 1) + ')';
                                nameExists(newName);
                            } else {
                                newName = na + '(1)';
                                nameExists(newName);
                            }
                        } else {
                            newTempName = na;
                        }
                    }
                    nameExists(name);
                    store(newTempName);
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
        } else {
            interaction.reply({
                content: `${y} is not a valid y coordinate. Use * or a number!`,
                ephemeral: true
            });
        }

        function store(newName) {
            let chordObj = {
                coordinates: fullCords,
            }
            if (newName !== undefined) {
                chordObj.name = newName;
                currentDoc[type].push(chordObj);
                documentStore(currentDoc);
                interaction.reply({
                    content: `Coordinates for ${newName} in ${type}: ${fullCords} are stored`,
                });
            } else {
                chordObj.name = name;
                currentDoc[type].push(chordObj);
                documentStore(currentDoc);
                interaction.reply({
                    content: `Coordinates for ${name} in ${type}: ${fullCords} are stored`,
                });
            }
            return;
        }
    },
    unmark: (interaction, options) => {
        let currentDoc = documentGet();
        const type = options.getString('type').toLowerCase();
        const name = options.getString('name').toLowerCase().replace(" ", '-');


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
    list: (interaction) => {
        let currentDoc = documentGet();

        const fancyEmbed = {
            color: 0x3b31cc,
            title: 'List of coordinates',
            fields: [],
            timestamp: new Date(),
        };

        let typeArr = ['Home', 'Overworld', 'Nether', 'End'];

        typeArr.forEach(type => {
            currentDoc[type.toLowerCase()].sort((a, b) => a.name.localeCompare(b.name))
            if (currentDoc[type.toLowerCase()].length != 0) {
                let coordinates = "";
                currentDoc[type.toLowerCase()].forEach(item => {
                    coordinates = coordinates + `${item.name}: ${item.coordinates}\r\n`
                });
                
                fancyEmbed.fields.push({ name: type, value: coordinates.replaceAll('*', '\\*') })
            }
        });

        interaction.reply({
            embeds: [fancyEmbed],
        });
    }
}