const { ping, status, add } = require('./commandFunc');   // Command function handler

module.exports = {
    interAct: async (interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        const { commandName, options, createdAt } = interaction;

        if (commandName === "ping") {
            ping(interaction, createdAt);
        }

        if (commandName === "status") {
            status(interaction);
        }

        if (commandName === "add") {
            add(interaction, options)
        }
    }
}