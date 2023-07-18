const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the queue'),
    execute: async (interaction) => {
        const queue = useQueue(interaction.guild.id);
        queue.clear();

        await interaction.reply('Queue cleared');
    }
}