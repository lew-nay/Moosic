const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

module.exports = { 
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with pong'),
    /**
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction) => {
        await interaction.reply('pong from correct file');
    }
};
